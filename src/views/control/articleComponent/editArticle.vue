<template>
  <div class="edit-container">
    <div class="edit-func">
      <div
        class="func-item"
        v-for="(item, index) in funcItem">
        <div class="item">
          <div class="img-container flex-center">
            <img
              :src="item.unactivated_icon"
              :style="{ width: item.width + 'px' }"
              alt="" />
          </div>
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="divide"></div>
    <div class="content">
      <div class="catalog"></div>
      <div
        class="text"
        id="edit-content"
        v-html="form.content"
        contenteditable="true"></div>
      <div class="pub-setting">
        <el-form
          :model="form"
          label-width="auto">
          <el-form-item label="添加标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="文章标签">
            <el-select
              v-model="form.tag"
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
                :http-request="handleUploadPortrait"
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
import { onMounted, ref, reactive } from "vue";
import { addOrEditArticle } from "../../../api/article";
import { upload } from "/src/api/public";
import { ElMessage } from "element-plus";
const props = defineProps(["tagList", "content"]);
const emits = defineEmits(["Update:showArticleDialog"]);
const form = reactive({
  // title: "",
  // tags: [],
  // abstract: "",
  // status: 0,
  // cover_img: "",
});
const applyStyle = (className) => {
  const selectText = window.getSelection();
  // console.log(selectText);
  // 检查是否有选中内容
  if (!selectText.rangeCount) return;
  // 获取选中范围
  const range = selectText.getRangeAt(0);
  // console.log(range);
  // 创建包裹元素
  const span = document.createElement("span");
  span.className = className;
  try {
    // 将选中内容包裹在span中
    range.surroundContents(span);
  } catch (e) {
    // 处理无法包裹的情况（如跨节点选择）
    console.log("无法应用样式：", e);
    alert("请选择连续的文本内容进行样式设置");
  }
  // 清除选中状态
  selectText.removeAllRanges();
};
const funcItem = ref([
  {
    name: "撤销",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/chexiao-copy.png",
    width: "25",
    function: null,
  },
  {
    name: "重做",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/gl-redo3.png",
    width: "25",
    function: null,
  },
  {
    name: "历史",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/history.png",
    width: "25",
    function: null,
  },
  {
    name: "左对齐",
    active_icon: "",
    unactivated_icon: "",
    width: "25",
    function: null,
  },
  {
    name: "右对齐",
    active_icon: "",
    unactivated_icon: "",
    width: "25",
    function: null,
  },
  {
    name: "居中",
    active_icon: "",
    unactivated_icon: "",
    width: "25",
    function: null,
  },
  {
    name: "标题",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/gl-title.png",
    width: "25",
    function: null,
  },
  {
    name: "加粗",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/gl-bold.png",
    width: "25",
    function: applyStyle("bold"),
  },
  {
    name: "颜色",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/gl-fontColor.png",
    width: "25",
    function: applyStyle("red"),
  },
  {
    name: "背景",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/beijingyanse.png",
    width: "25",
    function: null,
  },
  {
    name: "倾斜",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/qingxie.png",
    width: "25",
    function: null,
  },
  {
    name: "下划线",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/gl-underline.png",
    width: "25",
    function: null,
  },
  {
    name: "删除线",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/shanchuxian.png",
    width: "25",
    function: null,
  },
  {
    name: "图像",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/biaoshilei_tuxiang.png",
    width: "25",
    function: null,
  },
  {
    name: "视频",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/shipin.png",
    width: "25",
    function: null,
  },
  {
    name: "链接",
    active_icon: "",
    unactivated_icon: "/src/assets/icons/lianjie-copy.png",
    width: "25",
    function: null,
  },
]);

const submitArticle = async () => {
  //获取文本编辑区的内容
  const content = document.getElementById("edit-content").innerHTML;
  // console.log(content);
  const _content = sanitizeContent(content);
  const { status } = await addOrEditArticle({
    id: form.id,
    title: form.title,
    cover_img: form.cover_img,
    abstract: form.abstract,
    content: _content,
    status: form.status,
    tag: form.tag,
  });
  if (status == 1) {
    ElMessage.success("提交成功");
    emits("Update:showArticleDialog", false);
  }
};
// 清理编辑区内容（防 XSS）
function sanitizeContent(html) {
  // 简单过滤：只保留安全标签和属性（实际项目建议用 bleach/dompurify 库）
  const allowedTags = ["b", "i", "u", "a", "img", "p", "br"];
  const allowedAttrs = ["href", "src", "style"];
  return html.replace(/<(\/?)(\w+)([^>]*?)>/g, (match, slash, tag, attrs) => {
    if (!allowedTags.includes(tag)) return ""; // 过滤不允许的标签
    // 过滤不允许的属性
    const cleanAttrs = attrs.replace(
      /(\w+)=["'].*?["']/g,
      (attrMatch, attr) => {
        return allowedAttrs.includes(attr) ? attrMatch : "";
      }
    );
    return `<${slash}${tag}${cleanAttrs}>`;
  });
}
const handleUploadPortrait = async (e) => {
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
onMounted(() => {
  Object.assign(form, props.content);
});
</script>

<style lang="scss" scoped>
.edit-container {
  min-height: calc(100vh - 40px);
  background-color: aliceblue;
  .edit-func {
    display: flex;
    justify-content: center;
    gap: 15px;
    .func-item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      .img-container {
        cursor: pointer;
        width: 25px;
        height: 30px;
      }
    }
  }
  .content {
    // display: flex;
    // justify-content: center;
    width: 100%;
    // width: 50%;
    // min-width: 500px;
    // min-height: calc(100vh - 70px);
    // background-color: rgb(69, 73, 73);
    .catalog {
      width: 300px;
      position: fixed;
      background-color: beige;
      top: 80px;
      bottom: 0;
      left: 20px;
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
</style>
