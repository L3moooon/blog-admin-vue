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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import * as z from "zod";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getEmailCaptcha } from "@/api/auth";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
const showType = defineModel<"account" | "mail" | "phone" | "forgetPassword">();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("请输入正确的邮箱格式").nonempty("邮箱为空"),
    captcha: z
      .array(z.string()) // 定义为“字符串数组”类型
      .nonempty("验证码为空"), // 数组非空校验
  })
);
// 初始化表单
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: "",
    captcha: undefined,
  },
});

// 验证码输入绑定（PinInput需要单独绑定值，同步到表单）
const captchaValue = ref<Array<string>>([]);
// 4. 倒计时控制（防止频繁发送验证码）
const countdown = ref(0);
let countdownTimer: NodeJS.Timeout | null = null;

const handleGetCaptcha = async () => {
  // 先验证邮箱字段是否合法
  const emailValid = await form.validateField("email");
  if (emailValid.errors.length > 0) {
    toast.warning("请先输入正确的邮箱");
    return;
  }

  // 如果正在倒计时，不允许重复发送
  if (countdown.value > 0) return;

  try {
    // 调用发送验证码接口（传入邮箱参数）
    const res = await getEmailCaptcha({ email: form.values.email });
    if (res.code == 1) {
      toast.success(res.msg || "验证码已发送，请注意查收");
      // 启动倒计时（60秒）
      countdown.value = 60;
      countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(countdownTimer!);
          countdownTimer = null;
        }
      }, 1000);
    } else {
      toast.error(res.msg || "发送验证码失败，请稍后重试");
    }
  } catch (error) {
    toast.error("网络错误，发送验证码失败");
    console.error("发送验证码错误:", error);
  }
};
const onSubmit = form.handleSubmit(async (values) => {
  console.log("Form submitted!", values);
  await userStore.login({
    type: "account",
    email: values.email,
    captcha: captchaValue.value.join(""),
  });
  form.handleReset();
});
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<template>
  <Card class="w-full px-[15%] py-[10%] opacity-90 absolute left-0 top-0">
    <CardHeader class="relative">
      <CardTitle class="text-4xl font-bold flex items-center">
        欢迎回来
      </CardTitle>
      <CardDescription>请输入您的邮箱获取验证码登录</CardDescription>
      <img
        class="w-21 absolute top-0 right-4"
        src="@/assets/images/mailbox.png"
        alt="" />
    </CardHeader>
    <CardContent>
      <form @submit="onSubmit">
        <FormField
          v-slot="{ componentField }"
          name="email">
          <FormItem class="mt-2 relative">
            <FormLabel>邮箱</FormLabel>
            <FormMessage class="absolute top-0 right-0" />
            <FormControl>
              <Input
                placeholder="请输入邮箱..."
                v-bind="componentField" />
            </FormControl>
            <FormDescription />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="captcha">
          <FormItem class="mt-2 relative">
            <FormLabel>验证码</FormLabel>
            <FormMessage class="absolute top-0 right-0" />
            <FormControl>
              <div class="grid grid-cols-2 gap-5">
                <PinInput
                  id="pin-input"
                  v-model="captchaValue"
                  placeholder="○">
                  <PinInputGroup>
                    <PinInputSlot
                      v-for="(id, index) in 6"
                      :key="id"
                      :index="index" />
                  </PinInputGroup>
                </PinInput>
                <Button
                  variant="outline"
                  class="cursor-pointer"
                  :disabled="countdown > 0 || !form.values.email"
                  @click="handleGetCaptcha">
                  {{
                    countdown > 0 ? `${countdown}秒后重新获取` : "获取验证码"
                  }}
                </Button>
              </div>
            </FormControl>
            <FormDescription />
          </FormItem>
        </FormField>
      </form>
    </CardContent>
    <CardFooter class="block px-6">
      <div class="mb-5">
        <Button
          class="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          @click="onSubmit">
          登录
        </Button>
      </div>
      <div class="mb-5">
        <Button
          class="w-full cursor-pointer"
          variant="outline"
          @click="showType = 'account'">
          返回
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
