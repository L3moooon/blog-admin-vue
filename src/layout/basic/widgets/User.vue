<script setup lang="ts">
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/user";
import { useTabsStore } from "@/store/tabs";

const userStore = useUserStore();
const tabsStore = useTabsStore();
const user = ref(
  userStore.name || JSON.parse(localStorage.getItem("user"))?.name
);
const handleLogout = () => {
  userStore.logout();
  tabsStore.clearInfo();
};
</script>

<template>
  <HoverCard
    :openDelay="100"
    :closeDelay="500">
    <HoverCardTrigger class="flex items-center cursor-pointer">
      <img
        class="size-8 !mr-3 !ml-auto"
        src="/src/assets/images/personal.png"
        alt="" />
      <!-- <span>{{ user }}</span> -->
    </HoverCardTrigger>
    <HoverCardContent>
      <div class="!w-fit">
        <div>修改个人信息</div>
        <div>修改密码</div>
        <div @click="handleLogout">退出登录</div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
