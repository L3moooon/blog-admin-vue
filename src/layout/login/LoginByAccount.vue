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
import { Button } from "@/components/ui/button";
import { useForm, useField } from "vee-validate";
import { EyeOff, Eye } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref, onMounted, onUnmounted, shallowRef, watch } from "vue";

import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const showType = defineModel<
  "account" | "mail" | "phone" | "forgetPassword" | "createCount"
>();
const showPassword = ref<boolean>(false);
const formSchema = toTypedSchema(
  z.object({
    account: z.string().nonempty("账号不能为空"),
    password: z.string().nonempty("密码不能为空"),
    captcha: z.boolean().refine((val) => val, "请完成滑块验证"),
  })
);
// 初始化表单
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    account: "",
    password: "",
    captcha: false, // 滑块验证初始值（未通过）
  },
});
const handleRememberAccount = () => {
  console.log("记住账号");
};
const onSubmit = form.handleSubmit(async (values) => {
  console.log("Form submitted!", values);
  await userStore.login({
    type: "account",
    account: values.account,
    password: values.password,
  });
  form.handleReset();
});
</script>

<template>
  <Card class="w-full px-[15%] py-[10%] opacity-90 absolute left-0 top-0">
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
      <form @submit="onSubmit">
        <FormField
          v-slot="{ componentField }"
          name="account">
          <FormItem class="mt-2 relative">
            <FormLabel>账号</FormLabel>
            <FormMessage class="absolute top-0 right-0" />
            <FormControl>
              <Input
                placeholder="请输入账号..."
                v-bind="componentField" />
            </FormControl>
            <FormDescription />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="password">
          <FormItem class="mt-2 relative">
            <FormLabel>密码</FormLabel>
            <FormMessage class="absolute top-0 right-0" />
            <FormControl class="relative w-full">
              <Input
                id="search"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码..."
                v-bind="componentField"
                class="w-full pr-10" />
              <span
                class="absolute right-0 top-7.5 flex items-center justify-center px-2">
                <Eye
                  v-if="showPassword"
                  @click="showPassword = false"
                  class="size-5 text-muted-foreground cursor-pointer" />
                <EyeOff
                  v-else
                  @click="showPassword = true"
                  class="size-5 text-muted-foreground cursor-pointer" />
              </span>
            </FormControl>
            <FormDescription />
          </FormItem>
        </FormField>
        <!-- 滑块验证 -->
        <FormField
          v-slot="{ componentField }"
          name="captcha">
          <FormItem class="mt-2 relative">
            <FormLabel>滑块验证</FormLabel>
            <FormMessage class="absolute top-0 right-0" />
            <FormControl>
              <SlideCaptcha />
            </FormControl>
            <FormDescription />
          </FormItem>
        </FormField>
        <div class="flex justify-between">
          <div
            class="flex items-center space-x-2"
            @click="handleRememberAccount">
            <Checkbox
              class="cursor-pointer"
              id="terms" />
            <label
              for="terms"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
              记住账号
            </label>
          </div>
          <div class="text-sm text-blue-500 hover:text-blue-600 cursor-pointer">
            忘记密码?
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="block px-6">
      <div class="mb-5">
        <Button
          @click="onSubmit"
          class="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
          登录
        </Button>
      </div>
      <div class="grid grid-cols-2 gap-5">
        <Button
          variant="outline"
          class="cursor-pointer"
          @click="showType = 'mail'">
          邮箱登录
        </Button>
        <Button
          variant="outline"
          class="cursor-pointer"
          @click="showType = 'phone'">
          手机登录
        </Button>
      </div>
      <div>
        <div class="text-center text-sm text-gray-500 mt-4">
          还没有账号?
          <span
            @click="showType = 'createCount'"
            class="text-blue-500 hover:text-blue-600 cursor-pointer">
            创建新账号
          </span>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
