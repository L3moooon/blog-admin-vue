<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SlideCaptcha from "./subComponent/SlideCaptcha.vue";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "vee-validate";
import { EyeOff, Eye } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref, onMounted, onUnmounted, shallowRef, watch } from "vue";

const showType = defineModel<
  "account" | "mail" | "QRcode" | "forgetPassword"
>();
const showPassword = ref<boolean>(false);
const formSchema = toTypedSchema(
  z.object({
    account: z
      .string()
      .min(2, "简介至少需要2个字符")
      .max(50, "简介不能超过50个字符")
      .nonempty("请输入账号"),
    password: z
      .string()
      .min(2, "简介至少需要2个字符")
      .max(50, "简介不能超过50个字符")
      .nonempty("请输入密码"),
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
    account: "",
    password: "",
  },
});

// const toolbar = DomEditor.getToolbar(editor);
onMounted(() => {
  // console.log("editorRef", editor  Ref);
});

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
  <Card class="w-full px-[15%] py-[10%] opacity-90">
    <CardHeader class="relative">
      <CardTitle class="text-4xl font-bold flex items-center">
        欢迎回来
      </CardTitle>
      <CardDescription>请使用手机扫描二维码登录</CardDescription>
      <img
        class="w-24 absolute top-0 right-4"
        src="@/assets/images/phone.png"
        alt="" />
    </CardHeader>
    <CardContent>
      <div class="flex justify-center">
        <img
          class="w-48 h-48"
          src="https://img.icons8.com/ios-filled/100/000000/qr-code.png"
          alt="QR Code" />
      </div>
      <div class="w-full text-center text-gray-500">
        扫码后点击'确认'，即可完成登录
      </div>
    </CardContent>
    <CardFooter class="block px-6">
      <div class="mb-5">
        <Button
          class="w-full"
          variant="outline"
          @click="showType = 'account'">
          返回
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
