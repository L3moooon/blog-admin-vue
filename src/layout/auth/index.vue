<script setup lang="ts">
import LoginByMail from "./LoginByMail.vue";
import LoginByQRcode from "./LoginByQRcode.vue";
import LoginByAccount from "./LoginByAccount.vue";
import ForgetPassword from "./ForgetPassword.vue";

import { ref, onMounted, onUnmounted, shallowRef, watch } from "vue";
const showType = ref<"account" | "mail" | "phone" | "forgetPassword">(
  "account"
);

onMounted(() => {});
</script>

<template>
  <div
    class="w-screen h-screen bg-[url('@/assets/images/background.png')] bg-cover flex justify-center items-center">
    <div class="aspect-[4/3] w-2/5 relative">
      <transition-group
        name="fade"
        tag="div">
        <!-- 账号登录 -->
        <LoginByAccount
          v-if="showType == 'account'"
          v-model="showType"
          key="account" />
        <!-- 邮箱登录 -->
        <LoginByMail
          v-if="showType == 'mail'"
          v-model="showType"
          key="mail" />
        <!-- 手机/二维码登录 -->
        <LoginByQRcode
          v-if="showType == 'phone'"
          v-model="showType"
          key="QRcode" />
        <!-- 忘记密码 -->
        <ForgetPassword
          v-if="showType == 'forgetPassword'"
          v-model="showType"
          key="forgetPassword" />
      </transition-group>
    </div>
  </div>
</template>
