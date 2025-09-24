import router from "@/router/index";
import { defineStore } from "pinia";
import { asyncRoutes, publicRoutes, anyRoutes } from "../router/routes";
import type { RouteRecordRaw } from "vue-router";
import { login as userLogin } from "@/api/login";
import type { LoginRequest } from "@/api/login/type";
import { toast } from "vue-sonner";
import { cloneDeep } from "lodash";

interface UserStore {
  user: {
    name: string;
    permissions: {
      routeKeys: string[];
      componentKeys?: string[];
      buttonKeys?: string[];
    };
  };
  token: string;
  menuList: RouteRecordRaw[];
}

const initialToken = "";
const initialUser = {
  name: "",
  permissions: {
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
    async login(data: LoginRequest) {
      try {
        const { code, user, token } = await userLogin(data);
        console.log(11111);
        if (code == 1) {
          this.token = token;
          this.user = user;
          await this.generateRoutes();
          router.push("/");
          toast.success("登录成功");
        } else {
          toast.error("登录失败，请检查账号密码");
        }
      } catch (error) {
        toast.error("登录请求失败，请稍后重试");
      }
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
        const routeKeys = this.user.permissions.routeKeys;
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
