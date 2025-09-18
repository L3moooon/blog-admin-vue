<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ChevronLeft, BookPlus, Tag, Upload } from "lucide-vue-next";

import { ref, onMounted, onUnmounted, shallowRef, watch, reactive } from "vue";
import { upload } from "/src/api/public";

import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { DomEditor, IEditorConfig } from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

const form = reactive({
  id: null,
  title: "",
  cover_img: "",
  abstract: "",
  content: "",
  status: 1, // 1公开 2私密
  tag: [],
});
const handleDialogClose = () => {
  showDialog.value = false;
};
// 编辑器实例
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref("");

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };
const handleCreated = (editor) => {
  editorRef.value = editor;
};

// 定义表单数据类型
// interface FormValues {
//   name: string;
//   email: string;
//   age: string;
// }

// 初始化表单
// 初始化vee-validate表单

// const toolbar = DomEditor.getToolbar(editor);

const handleTagsChange = (checked: boolean, tagId: number) => {
  if (checked) {
    form.tag.push(tagId);
  } else {
    const index = form.tag.indexOf(tagId);
    if (index > -1) {
      form.tag.splice(index, 1);
    }
  }
  console.log(form.tag);
};
onMounted(() => {
  // getTagList();
  // console.log("editorRef", editor  Ref);
});
onUnmounted(() => {
  if (editorRef.value == null) return;
  editorRef.value.destroy();
  editorRef.value = null;
});
// 处理封面上传
const handleUploadCover = () => {
  const fileInput = document.getElementById("article-cover-upload");
  if (fileInput) {
    fileInput.click();
  }
};
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
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

//提交
// const submitArticle = async () => {
//   const { status } = await addOrEditArticle({
//     id: form.id,
//     title: form.title,
//     cover_img: form.cover_img,
//     abstract: form.abstract,
//     content: form.content,
//     status: form.status,
//     tag: form.chooseTag,
//   });
//   if (status == 1) {
//     ElMessage.success("提交成功");
//     emits("Update:showArticleDialog", false);
//   } else {
//     ElMessage.error("提交失败");
//   }
// };
const showDialog = defineModel<boolean>("showArticleDialog");
const props = withDefaults(
  defineProps<{
    rowInfo: Record<string, any>;
  }>(),
  {
    rowInfo: {},
  }
);
watch(
  () => showDialog.value,
  (val) => {
    console.log(props.rowInfo);
    if (val) {
      // getTagList(); // 打开对话框时获取标签列表
      Object.assign(form, props.rowInfo); // 填充表单数据
    } else {
      resetForm(); // 关闭对话框时重置表单
      console.log(2222222);
    }
  }
);
const resetForm = () => {
  form.id = null;
  form.title = "";
  form.cover_img = "";
  form.abstract = "";
  form.content = "";
  form.status = 1;
  form.tag = [];
};
</script>

<template>
  <Dialog
    v-model:open="showDialog"
    :modal="false">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        class="cursor-pointer">
        <BookPlus />
        发布文章
      </Button>
    </DialogTrigger>
    <!-- 固定为全屏dialog -->
    <DialogContent
      class="w-full h-full max-w-full sm:max-w-full p-0 fixed top-0 left-0 translate-0 rounded-none block">
      <!-- 固定顶部和工具栏 -->
      <DialogHeader
        class="w-full mx-auto pt-4 h-fit fixed top-0 left-0 z-50 bg-white">
        <Button
          variant="outline"
          class="absolute top-2 left-5 cursor-pointer"
          @click="handleDialogClose">
          <ChevronLeft />
          返回
        </Button>
        <div class="text-xl font-medium text-center">
          <span v-if="props.rowInfo?.id"> 编辑文章 </span>
          <span v-else>发布文章</span>
        </div>
        <Separator />
        <Toolbar
          class="w-full flex justify-center"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default" />
        <Separator />
      </DialogHeader>
      <!-- 编辑器内容区域 -->
      <ScrollArea class="h-[calc(100vh-6.9rem)] w-full mt-27 mb-5">
        <div class="w-full bg-gray-100 shadow-gray-100 table">
          <!-- 文章内容 -->
          <div
            class="w-1/2 min-h-[calc(100vh-14.5rem)] mx-auto my-5 px-15 py-10 box-content border bg-white shadow-lg shadow-gray-300">
            <Input
              v-model="form.title"
              type="text"
              class="selection:none border-0 focus:ring-0 focus:outline-none shadow-none focus-visible:ring-0 !text-2xl"
              placeholder="请输入标题..." />
            <Separator class="my-5" />
            <Editor
              v-model="form.content"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleCreated" />
          </div>
          <!-- 文章设置 -->
          <div
            class="w-1/2 mx-auto mt-5 mb-25 px-15 py-10 box-content border bg-white shadow-lg shadow-gray-300 flex flex-col gap-2">
            <Label>简介</Label>
            <Textarea
              v-model="form.abstract"
              placeholder="请输入文章简介..." />
            <Label>标签</Label>
            <div class="flex gap-4">
              <div
                class="flex"
                v-for="item in tagList">
                <Checkbox
                  class="cursor-pointer mr-2"
                  :model-value="form.tag.includes(item.id)"
                  @update:model-value="handleTagsChange" />
                <label
                  for="terms2"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {{ item.tag_name }}
                </label>
              </div>
            </div>
            <Label>封面</Label>
            <!-- 图片上传组件 -->
            <div class="flex gap-2">
              <input
                id="article-cover-upload"
                class="hidden"
                type="file"
                accept="image/*"
                @change="handleImageUpload" />
              <!-- 显示已上传的图片预览 -->
              <div
                v-if="form.cover_img"
                class="size-32 border rounded-sm overflow-hidden">
                <img
                  :src="form.cover_img"
                  fit="cover"
                  class="h-full w-full cursor-pointer"
                  alt="封面预览" />
              </div>
              <div class="size-32 border rounded-sm overflow-hidden">
                <div
                  class="h-full flex flex-col items-center justify-center cursor-pointer text-gray-400 text-sm"
                  @click="handleUploadCover">
                  <Upload />
                  <span v-if="form.cover_img">重新上传封面</span>
                  <span v-else>上传封面</span>
                </div>
              </div>
            </div>

            <Label>公开状态</Label>
            <RadioGroup
              class="flex space-x-2"
              default-value="1"
              :modelValue="form.status">
              <div class="flex items-center space-x-2">
                <RadioGroupItem
                  id="option-one"
                  :value="1" />
                <Label for="option-one">公开</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem
                  id="option-two"
                  :value="0" />
                <Label for="option-two">隐藏</Label>
              </div>
            </RadioGroup>
            <div class="w-full flex justify-end gap-2">
              <Button
                variant="outline"
                class="cursor-pointer">
                保存草稿
              </Button>
              <Button
                class="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                @click="handleDialogClose">
                发布文章
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
