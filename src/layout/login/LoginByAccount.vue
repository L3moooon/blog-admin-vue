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
import { useForm } from "vee-validate";
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
    account: z
      .string()
      .min(2, "账号至少需要2个字符")
      .max(50, "账号不能超过50个字符")
      .nonempty("请输入账号"),
    password: z
      .string()
      .min(2, "密码至少需要2个字符")
      .max(50, "密码不能超过50个字符")
      .nonempty("请输入密码"),
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

const onSubmit = form.handleSubmit(async (values) => {
  console.log("Form submitted!", values);
  await userStore.login({
    type: "account",
    account: values.account,
    password: values.password,
  });
});
onMounted(() => {});
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
      <form @submit="onSubmit">
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
      </form>
    </CardContent>
    <CardFooter class="block px-6">
      <div class="mb-5">
        <Button
          @click="onSubmit"
          class="w-full bg-blue-500 text-white hover:bg-blue-600">
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
