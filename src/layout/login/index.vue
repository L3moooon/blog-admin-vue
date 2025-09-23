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
    <div class="aspect-[4/3] w-2/5">
      <transition-Group
        name="fade"
        tag="div">
        <LoginByAccount
          v-if="showType == 'account'"
          v-model="showType"
          key="account" />
        <LoginByMail
          v-if="showType == 'mail'"
          v-model="showType"
          key="mail" />
        <LoginByQRcode
          v-if="showType == 'phone'"
          v-model="showType"
          key="QRcode" />
        <ForgetPassword
          v-if="showType == 'forgetPassword'"
          v-model="showType"
          key="forgetPassword" />
      </transition-Group>
    </div>
  </div>
</template>
