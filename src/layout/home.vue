<template>
  <div class="container">
    <!-- 左侧菜单 -->
    <div class="left">
      <div class="logo">
        <img
          src="/src/assets/images/portrait.jpg"
          alt="" />
        <div class="name">时雨博客后台</div>
      </div>
      <!-- <el-menu popper-class="menu">
        <MenuList
          :menuList="userStore.menuList"
          router="true"></MenuList>
      </el-menu> -->
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <RouterView />
        </main>
      </SidebarProvider>
    </div>
    <div class="right">
      <!-- 右上 -->
      <div class="right-top">
        <el-popover
          class="box-item"
          trigger="click"
          placement="bottom">
          <template #reference>
            <div class="user flex-center">
              <img
                src="/src/assets/personal.png"
                alt="" />
              <span>{{ user }}</span>
            </div>
          </template>
          <template #default>
            <div class="func">
              <div>修改个人信息</div>
              <div>修改密码</div>
              <div @click="handleLogout">退出登录</div>
            </div>
          </template>
        </el-popover>
      </div>
      <!-- 右下 -->
      <div class="right-down">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import MenuList from "@/components/menuList.vue";
import { useUserStore } from "../store/user";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Appsidebar.vue";

const userStore = useUserStore();
const user = ref(
  userStore.name || JSON.parse(localStorage.getItem("user")).name
);
const handleLogout = () => {
  userStore.logout();
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  .left {
    width: 15%;
    min-width: 220px;
    .logo {
      height: 90px;
      background-color: #f3f2ef;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #badfc3, #fad86f);
      img {
        height: 80px;
        margin-left: 20px;
        border-radius: 10px;
      }
      .name {
        margin: 55px 0 0 20px;
      }
    }
  }
  .right {
    width: 85%;
    background-color: #ccc;
    .right-top {
      height: 50px;
      background-color: antiquewhite;
      overflow: hidden;
      display: flex;
      align-items: center;
      .user {
        width: 100px;
        cursor: pointer;
        margin-left: auto;
        margin-right: 20px;
        img {
          width: 25px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
