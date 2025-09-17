<script setup lang="ts">
import { ChevronLeft, BookPlus, Tag } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ref, onMounted, onUnmounted, shallowRef, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
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
onMounted(() => {
  // console.log("editorRef", editor  Ref);
});
onUnmounted(() => {
  if (editorRef.value == null) return;
  editorRef.value.destroy();
  editorRef.value = null;
});
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
    <DialogContent
      class="fixed top-0 left-0 translate-0 w-full h-full max-w-full sm:max-w-full rounded-none block">
      <div class="mx-auto h-fit text-center">
        <Button
          variant="outline"
          class="absolute top-2 left-5 cursor-pointer"
          @click="handleDialogClose">
          <ChevronLeft />
          返回
        </Button>
        <div class="text-xl font-medium">发布文章</div>
      </div>
      <Toolbar
        class="w-full fixed top-16 left-0 z-50 flex justify-center"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default" />
      <Editor
        class="w-1/2 mx-auto !bg-red-200 h-full mt-20 rounded-sm border overflow-hidden bg-red-50"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated" />
    </DialogContent>
  </Dialog>
</template>
