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
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from "@/components/ui/pin-input";
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

const showType = defineModel<"account" | "mail" | "phone" | "forgetPassword">();
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
      <CardDescription>请输入您的邮箱获取验证码</CardDescription>
      <img
        class="w-24 absolute top-0 right-4"
        src="@/assets/images/mailbox.png"
        alt="" />
    </CardHeader>
    <CardContent>
      <Form>
        <FormField
          v-slot="{ componentField }"
          name="account">
          <FormItem class="mt-2">
            <FormLabel>邮箱</FormLabel>
            <FormControl>
              <Input
                placeholder="请输入邮箱..."
                v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
      </Form>
      <div class="grid grid-cols-2 gap-5">
        <PinInput
          id="pin-input"
          v-model="value"
          placeholder="○"
          @complete="handleComplete">
          <PinInputGroup>
            <PinInputSlot
              v-for="(id, index) in 6"
              :key="id"
              :index="index" />
          </PinInputGroup>
        </PinInput>
        <Button variant="outline">获取验证码</Button>
      </div>
    </CardContent>
    <CardFooter class="block px-6">
      <div class="mb-5">
        <Button
          class="w-full bg-blue-500 text-white hover:bg-blue-600"
          @click="showType = 'account'">
          登录
        </Button>
      </div>
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
