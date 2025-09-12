import { defineStore } from "pinia";
import router from "@/router/index";
import { asyncRoutes, publicRoutes, anyRoutes } from "../router/routes";
import { login as userLogin } from "@/api/login";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash-es";

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
  menuList: [
    name: string,
    path: string,
    redirect?: string,
    component?: any,
    meta?: {
      title: string;
      icon?: string;
      hidden?: boolean;
    }
  ];
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
const loadFromLocal = (key: string) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};
const saveToLocal = (key: string, state: string) => {
  localStorage.setItem(key, JSON.stringify(state));
};
const removeFromLocal = (key: string) => {
  localStorage.removeItem(key);
};

export const useUserStore = defineStore("User", {
  state: (): UserStore => {
    return {
      user: loadFromLocal("user") || initialUser,
      token: loadFromLocal("token") || initialToken,
      menuList: [],
    };
  },
  actions: {
    async login(account: string, password: string) {
      try {
        const { status, user, token } = await userLogin({ account, password });
        if (status == 1) {
          this.token = token;
          this.user = user;
          saveToLocal("user", user);
          saveToLocal("token", token);
          this.generateRoutes();
          router.push("/");
          ElMessage.success("登录成功");
        } else {
          ElMessage.error("登录失败，请检查账号密码");
        }
      } catch (error) {
        ElMessage.error("登录请求失败，请稍后重试");
        console.error("登录异常：", error);
      }
    },

    // 退出登录
    logout() {
      this.token = initialToken;
      this.user = initialUser;
      removeFromLocal("token");
      removeFromLocal("user");
      router.push("/login");
      ElMessage.success("已退出登录");
    },
    generateRoutes() {
      return new Promise((resolve) => {
        const routeKeys = this.user.permissions.routeKeys;
        const accessedRoutes: Array<string> = [];
        const routesCopy = cloneDeep(asyncRoutes);
        routesCopy.forEach((route) => {
          if (routeKeys.includes(route.path)) {
            // 处理子路由
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
        console.log(this.menuList);
        [...accessedRoutes, ...anyRoutes].forEach((route) => {
          router.addRoute(route);
        });
        console.log(router.getRoutes());
        resolve();
      });
    },
  },
});
