import router from "@/router/index";
import { defineStore } from "pinia";
import { asyncRoutes, publicRoutes, anyRoutes } from "@/router/routes";
import { toast } from "vue-sonner";
import { cloneDeep } from "lodash";
import type { RouteRecordRaw } from "vue-router";
import type { User, UserStore } from "./type";

const initialToken = "";
const initialUser = {
  name: "",
  permission: {
    routeKeys: [],
    componentKeys: [],
    buttonKeys: [],
  },
};

export const useUserStore = defineStore("User", {
  state: (): UserStore => {
    return {
      user: initialUser,
      token: initialToken,
      menuList: [],
    };
  },
  actions: {
    async saveUserInfo(user: User, token: string) {
      this.user = user;
      this.token = token;
      await this.generateRoutes();
    },

    // 退出登录
    logout() {
      this.token = initialToken;
      this.user = initialUser;
      this.menuList = [];
      router.push("/login");
      toast.success("已退出登录");
    },
    generateRoutes() {
      return new Promise((resolve) => {
        const routeKeys = this.user.permission.routeKeys;
        const accessedRoutes: Array<RouteRecordRaw> = [];
        const routesCopy = cloneDeep(asyncRoutes);
        routesCopy.forEach((route) => {
          if (routeKeys.includes(route.path)) {
            if (route.children && route.children.length > 0) {
              route.children = route.children.filter((child) =>
                routeKeys.includes(child.path)
              );
            }
            accessedRoutes.push(route);
          }
        });
        this.menuList = [...publicRoutes, ...accessedRoutes]; //将路由合并加入菜单
        // 动态添加路由
        [...accessedRoutes, ...anyRoutes].forEach((route) => {
          router.addRoute(route);
        });
        resolve(this.menuList);
      });
    },
  },
  persist: {
    storage: localStorage, // 存储方式：localStorage（默认）或 sessionStorage
    pick: ["token", "user"], // 只持久化这两个字段，menuList 不持久化
  },
});
