<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "../store/user";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const userStore = useUserStore();
const user = ref(
  userStore.name || JSON.parse(localStorage.getItem("user"))?.name
);
const handleLogout = () => {
  userStore.logout();
};
</script>
<template>
  <div class="!ml-auto">
    <HoverCard
      :openDelay="100"
      :closeDelay="500">
      <HoverCardTrigger class="flex items-center cursor-pointer">
        <img
          class="size-12 !mr-3 !ml-auto"
          src="/src/assets/personal.png"
          alt="" />
        <span>{{ user }}</span>
      </HoverCardTrigger>
      <HoverCardContent>
        <div class="!w-fit">
          <div>修改个人信息</div>
          <div>修改密码</div>
          <div @click="handleLogout">退出登录</div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
