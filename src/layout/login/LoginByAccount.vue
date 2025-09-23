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
      <CardDescription>输入您的账户信息以开始管理您的博客</CardDescription>
      <img
        class="w-24 absolute top-0 right-4"
        src="@/assets/images/welcome-en.png"
        alt="" />
    </CardHeader>
    <CardContent>
      <Form>
        <FormField
          v-slot="{ componentField }"
          name="account">
          <FormItem class="mt-2">
            <FormLabel>账号</FormLabel>
            <FormControl>
              <Input
                placeholder="请输入账号..."
                v-bind="componentField" />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="password">
          <FormItem class="mt-2">
            <FormLabel>密码</FormLabel>
            <FormControl>
              <div class="relative w-full">
                <Input
                  id="search"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码..."
                  v-bind="componentField"
                  class="w-full pr-10" />
                <span
                  class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
                  <Eye
                    v-if="showPassword"
                    @click="showPassword = false"
                    class="size-5 text-muted-foreground cursor-pointer" />
                  <EyeOff
                    v-else
                    @click="showPassword = true"
                    class="size-5 text-muted-foreground cursor-pointer" />
                </span>
              </div>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- 滑块验证 -->
        <FormField
          v-slot="{ componentField }"
          name="password">
          <FormItem class="mt-2">
            <FormControl>
              <SlideCaptcha />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex justify-between">
          <div class="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              for="terms"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              记住账号
            </label>
          </div>
          <div class="text-sm text-blue-500 hover:text-blue-600 cursor-pointer">
            忘记密码?
          </div>
        </div>
      </Form>
    </CardContent>
    <CardFooter class="block px-6">
      <div class="mb-5">
        <Button class="w-full bg-blue-500 text-white hover:bg-blue-600">
          登录
        </Button>
      </div>
      <div class="grid grid-cols-2 gap-5">
        <Button
          variant="outline"
          @click="showType = 'mail'">
          邮箱登录
        </Button>
        <Button
          variant="outline"
          @click="showType = 'phone'">
          手机登录
        </Button>
      </div>
      <div>
        <p class="text-center text-sm text-gray-500 mt-4">
          还没有账号?
          <span
            @click="createAccount"
            class="text-blue-500 hover:text-blue-600 cursor-pointer">
            创建新账号
          </span>
        </p>
      </div>
    </CardFooter>
  </Card>
</template>
