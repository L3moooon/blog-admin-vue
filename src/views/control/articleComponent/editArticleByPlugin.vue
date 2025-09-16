<template>
  <div class="edit-container article-color">
    <QuillEditor
      theme="snow"
      v-model:content="form.content"
      :options="editorOptions"
      @ready="onQuillReady"
      contentType="html" />
    <!-- 第二页 -->
    <div class="divide"></div>
    <div class="content">
      <div class="catalog">
        <h3 class="catalog-title">文章目录</h3>
        <div class="catalog-content">
          <ul v-if="tocItems.length > 0">
            <li
              v-for="(item, index) in tocItems"
              :key="index"
              :class="['toc-item', 'level-' + item.level]"
              @click="scrollToAnchor(item.id)">
              {{ item.text }}
            </li>
          </ul>
          <p
            v-else
            class="empty-toc">
            暂无标题内容
          </p>
        </div>
      </div>
      <div class="pub-setting">
        <el-form
          :model="form"
          label-width="auto">
          <el-form-item label="添加标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="文章标签">
            <el-select
              v-model="form.chooseTag"
              multiple
              placeholder="请选择"
              style="width: 240px">
              <el-option
                v-for="item in props.tagList"
                :key="item.id"
                :label="item.tag_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加封面">
            <div class="upload-container">
              <el-image
                v-if="form.cover_img"
                class="preview-img"
                :src="form.cover_img"
                fit="cover"
                limit="1"
                :preview-src-list="[form.cover_img]"></el-image>
              <el-upload
                class="uploader"
                :http-request="handleUploadCover"
                accept=".jpg,.png"
                :show-file-list="false"
                list-type="picture-card"
                :limit="1"
                :before-upload="beforeAvatarUpload">
                <img
                  class="add"
                  src="/src/assets/icons/add.png"
                  alt="" />
                <div class="tips">限制一张图片，新封面将覆盖旧封面</div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="文章简介">
            <el-input v-model="form.abstract" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                :value="0"
                size="large">
                仅自己可见
              </el-radio>
              <el-radio
                :value="1"
                size="large">
                所有人可见
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button @click="submitArticle">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { addOrEditArticle } from "../../../api/article";
import { upload } from "/src/api/public";
import { ElMessage, ElLoading } from "element-plus";
import { QuillEditor } from "@vueup/vue-quill";

import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const props = defineProps(["tagList", "content"]);
const emits = defineEmits(["Update:showArticleDialog"]);
const quillInstance = ref(null); // 用于存储Quill实例
const form = reactive({
  title: "",
  tag: [], //所有tag
  chooseTag: [], //选中tag
  abstract: "",
  status: 0,
  cover_img: "",
  content: "",
});
const editorOptions = {
  modules: {
    toolbar: [
      // 工具栏配置
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [({ header: 1 }, { header: 2 })], // 语言选择下拉菜单
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: ["#FF0000", "#00FF00", "#0000FF"] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"],
    ],
    syntax: {
      highlight: (text) =>
        hljs.highlightAuto(text, ["javascript", "css", "json", "html"]).value,
    },
  },
  placeholder: "请输入内容...",
  theme: "snow", // 或 'bubble' 简约主题
};
const tocItems = ref([]); // 存储目录项
// 标题计数器，用于生成唯一ID
const headingCounter = ref({
  h1: 0,
  h2: 0,
  h3: 0,
  h4: 0,
  h5: 0,
  h6: 0,
});

// 解析HTML内容生成目录
const updateTableOfContents = (html) => {
  if (!html) {
    tocItems.value = [];
    return;
  }
  // 重置计数器
  Object.keys(headingCounter.value).forEach((key) => {
    headingCounter.value[key] = 0;
  });
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  // 获取所有标题标签
  const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const newTocItems = [];
  headings.forEach((heading) => {
    console.log(heading);
    const level = parseInt(heading.tagName.toLowerCase().replace("h", ""));
    const text = heading.textContent.trim();
    if (!text) return; // 跳过空标题
    // 更新计数器
    headingCounter.value[`h${level}`]++;
    // 重置下级标题计数器
    for (let i = level + 1; i <= 6; i++) {
      headingCounter.value[`h${i}`] = 0;
    }
    // 生成唯一ID（如h1-1, h2-1-1）
    const idParts = [];
    for (let i = 1; i <= level; i++) {
      if (headingCounter.value[`h${i}`] > 0) {
        idParts.push(headingCounter.value[`h${i}`]);
      }
    }
    const headingId = `heading-${idParts.join("-")}`;
    // 给标题添加ID，用于锚点定位
    heading.id = headingId;
    newTocItems.push({
      id: headingId,
      text,
      level,
    });
  });
  tocItems.value = newTocItems;
};

// 滚动到指定标题位置
const scrollToAnchor = (id) => {
  console.log(id);
  const element = document.getElementById(id);
  console.log(element);
  if (element) {
    // 计算编辑器位置偏移量
    const editorElement = document.querySelector(".ql-container");
    const editorRect = editorElement.getBoundingClientRect();
    const top =
      element.offsetTop - editorRect.top + editorElement.scrollTop - 20;
    console.log(top);
    // 滚动到标题位置（考虑编辑器偏移）
    window.scrollTo({
      top,
      behavior: "smooth",
    });
    // 高亮显示选中的标题
    element.classList.add("toc-highlight");
    setTimeout(() => {
      element.classList.remove("toc-highlight");
    }, 2000);
  }
};
// 当Quill准备就绪时
const onQuillReady = (quill) => {
  quillInstance.value = quill;
  // 重写图片上传处理
  const toolbar = quill.getModule("toolbar");
  toolbar.addHandler("image", handleImageUpload);
  toolbar.addHandler("video", handleVideoUpload);
};
// 富文本上传视频
const handleVideoUpload = () => {
  ElMessage.info("敬请期待");
};
// 富文本上传图片
const handleImageUpload = () => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.onchange = async function () {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      const loading = ElLoading.service({
        lock: true,
        text: "图片上传中...",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await upload(formData);
        const imageUrl = data.url;
        // 插入图片到编辑器
        const range = quillInstance.value.getSelection();
        if (range) {
          quillInstance.value.insertEmbed(range.index, "image", imageUrl);
          quillInstance.value.setSelection(range.index + 1);
        } else {
          // 如果没有选中位置，默认插入到最后
          const length = quillInstance.value.getLength();
          quillInstance.value.insertEmbed(length, "image", imageUrl);
          quillInstance.value.setSelection(length + 1);
        }
        ElMessage.success("图片上传成功");
      } catch (error) {
        console.error("图片上传失败:", error);
        ElMessage.error("图片上传失败，请重试");
      } finally {
        loading.close();
        input.value = ""; // 重置输入
      }
    }
  };
  input.click();
};
//上传封面
const handleUploadCover = async (e) => {
  const { file } = e;
  // 创建FormData对象
  const formData = new FormData();
  formData.append("file", file);
  // 调用封装好的request
  const { data, status } = await upload(formData);
  if (status == 1) {
    console.log(data);
    form.cover_img = data.url;
  }
};
const beforeAvatarUpload = () => {
  //检查格式
  return true;
};
//提交
const submitArticle = async () => {
  const { status } = await addOrEditArticle({
    id: form.id,
    title: form.title,
    cover_img: form.cover_img,
    abstract: form.abstract,
    content: form.content,
    status: form.status,
    tag: form.chooseTag,
  });
  if (status == 1) {
    ElMessage.success("提交成功");
    emits("Update:showArticleDialog", false);
  } else {
    ElMessage.error("提交失败");
  }
};
onMounted(() => {
  Object.assign(form, props.content);
  form.chooseTag = form.tag.map((v) => v.id);
});
// 监听富文本内容变化，自动更新目录
watch(
  () => form.content,
  (val) => {
    updateTableOfContents(val);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.edit-container {
  width: 100%;
  min-height: calc(100vh - 40px);
  display: table;
  .content {
    width: 100%;
    .catalog {
      width: 18%;
      position: fixed;
      background-color: beige;
      top: 160px;
      bottom: 50px;
      left: 20px;
      border-radius: 5px;
    }
    .text {
      width: 50%;
      margin: 10px auto;
      min-height: calc(100vh - 200px);
      padding: 10px;
      background-color: #fff;
      // background-color: rgb(69, 73, 73);
      caret-color: black;
      &:focus-visible {
        outline: none;
      }
    }
    .pub-setting {
      width: 50%;
      margin: 10px auto;
      padding: 10px;
      background-color: #fff;
      border-radius: 5px;
    }
  }
}
:deep(.bold) {
  font-weight: 500;
}
:deep(.red) {
  color: red;
}
.upload-container {
  display: flex;
  gap: 15px;
}
.preview-img {
  width: 148px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.uploader {
  position: relative;
  .add {
    width: 50px;
    position: absolute;
    top: 30px;
    // padding: 120px;
  }
  .tips {
    position: absolute;
    bottom: 0;
    text-align: center;
  }
}
:deep(.ql-toolbar) {
  display: flex;
  width: 100%;
  height: 50px;
  background-color: #fff;
  justify-content: center;
  border: none;

  position: fixed;
  top: 50px;
  z-index: 1;
}
:deep(.ql-container) {
  width: 50%;
  margin: 10px auto;
  min-height: calc(100vh - 200px);
  padding: 10px;
  background-color: #fff;
  caret-color: black;
  border: none;
  border-radius: 5px;
  box-sizing: content-box;
}
:deep(.ql-editor) {
  padding: 0;
  // height: 100%;
  // background-color: aqua;
  min-height: calc(100vh - 200px);
}
/* 在全局或组件样式中添加 */
:deep(.ql-syntax) {
  caret-color: #abb2bf !important; /* 设置光标颜色为浅灰色 */
  background-color: #282c34 !important; /* atom-one-dark 背景 */
  color: #abb2bf !important; /* 代码文本色 */
  border: none !important;

  /* 覆盖可能的白色背景片段 */
  & pre,
  & code {
    background: transparent !important;
    color: inherit !important;
  }
}
:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
}
/* 如果代码块使用单独的<pre><code>结构 */
:deep(pre code[class*="language-"]) {
  caret-color: #abb2bf !important;
}

.catalog {
  width: 18%;
  position: fixed;
  background-color: beige;
  top: 80px;
  bottom: 0;
  left: 20px;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

  .catalog-title {
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 18px;
    color: #333;
  }

  .catalog-content {
    margin-top: 15px;

    ul {
      list-style: none;
      padding-left: 10px;
      margin: 0;
    }

    .toc-item {
      padding: 6px 5px;
      margin: 3px 0;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        background-color: #e6f7ff;
        color: #1890ff;
      }

      &.level-1 {
        padding-left: 5px;
        font-weight: bold;
      }

      &.level-2 {
        padding-left: 20px;
        font-size: 0.95em;
      }

      &.level-3 {
        padding-left: 35px;
        font-size: 0.9em;
      }

      &.level-4,
      &.level-5,
      &.level-6 {
        padding-left: 50px;
        font-size: 0.85em;
        color: #666;
      }
    }

    .empty-toc {
      color: #999;
      text-align: center;
      padding: 20px 0;
      font-size: 0.9em;
    }
  }
}

// 标题高亮样式
:deep(.toc-highlight) {
  animation: highlight 2s ease;
}

@keyframes highlight {
  0% {
    background-color: rgba(255, 255, 102, 0.3);
  }
  100% {
    background-color: transparent;
  }
}
</style>
