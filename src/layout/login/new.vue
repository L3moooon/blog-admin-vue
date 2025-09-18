<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { ChevronLeft, BookPlus, Tag } from "lucide-vue-next";

import { ref, onMounted, onUnmounted, shallowRef, watch } from "vue";
import { upload } from "/src/api/public";

import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { DomEditor, IEditorConfig } from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

const showDialog = ref(false);
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

const formSchema = toTypedSchema(
  z.object({
    // title: z
    //   .string()
    //   .min(2, "标题至少需要2个字符")
    //   .max(15, "标题不能超过15个字符"),
    abstract: z
      .string()
      .min(2, "简介至少需要2个字符")
      .max(50, "简介不能超过50个字符")
      .nonempty("请输入简介"),
    // 封面图验证规则 - 必须上传图片
    cover: z
      .string()
      .nonempty("请上传封面图片") // 确保有值，不能为空
      .regex(
        /^(data:image\/(png|jpeg|jpg|gif);base64,)|(https?:\/\/)/,
        "请上传有效的图片文件"
      ), // 验证是否为base64图片或图片URL
    tag: z.array(z.any()).min(1),
    status: z.number().int("状态必须是整数").min(0).max(1),
  })
);

const form = useForm({});

const onSubmit = form.handleSubmit(async (values) => {
  console.log("Form submitted!", values);
});
// 定义表单数据类型
// interface FormValues {
//   name: string;
//   email: string;
//   age: string;
// }

// 初始化表单
// 初始化vee-validate表单
const { values, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    abstract: "",
    cover: "",
    tag: [],
    status: Number(),
  },
});

// const toolbar = DomEditor.getToolbar(editor);
onMounted(() => {
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
  // const target = event.target as HTMLInputElement;
  // const file = target.files ? target.files[0] : null;
  // if (file) {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     values.cover = e.target?.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  // 创建FormData对象
  const formData = new FormData();
  formData.append("file", file);
  // 调用封装好的request
  const { data, status } = await upload(formData);
  if (status == 1) {
    console.log(data);
    // form.cover_img = data.url;
    // values.cover = data.url;
    const reader = new FileReader();
    reader.onload = (e) => {
      values.cover = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
        <div class="text-xl font-medium text-center">发布文章</div>
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
              type="text"
              class="selection:none border-0 focus:ring-0 focus:outline-none shadow-none focus-visible:ring-0 !text-2xl"
              placeholder="请输入标题..." />
            <Separator class="my-5" />
            <Editor
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleCreated" />
          </div>
          <!-- 文章设置 -->
          <div
            class="w-1/2 mx-auto mt-5 mb-25 px-15 py-10 box-content border bg-white shadow-lg shadow-gray-300">
            <Label>简介</Label>
            <Input placeholder="请输入简介" />

            <Label>上传封面</Label>
            <!-- 图片上传组件 -->
            <Button @click="handleUploadCover">上传封面</Button>
            <input
              id="article-cover-upload"
              class="hidden"
              type="file"
              accept="image/*"
              @change="handleImageUpload" />
            <!-- 显示已上传的图片预览 -->
            <img
              v-if="values.cover"
              :src="values.cover"
              class="mt-2 h-32 object-cover"
              alt="封面预览" />

            <Label>公开状态</Label>
            <Input placeholder="请输入简介" />

            <Form
              @submit="onSubmit"
              :validation-schema="formSchema">
              <FormField
                v-slot="{ componentField }"
                name="abstract">
                <FormItem>
                  <FormLabel>简介</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入简介"
                      v-bind="componentField" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ field }"
                name="cover">
                <FormItem>
                  <FormLabel>上传封面</FormLabel>
                  <FormControl>
                    <!-- 图片上传组件 -->
                    <Button @click="handleUploadCover">上传封面</Button>
                    <input
                      v-bind="field"
                      id="article-cover-upload"
                      class="hidden"
                      type="file"
                      accept="image/*"
                      @change="handleImageUpload" />
                    <!-- 显示已上传的图片预览 -->
                    <img
                      v-if="values.cover"
                      :src="values.cover"
                      class="mt-2 h-32 object-cover"
                      alt="封面预览" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="tag">
                <FormItem>
                  <FormLabel>公开状态</FormLabel>
                  <FormControl> </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              </FormField>
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
            </Form>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
