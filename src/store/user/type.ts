import type { RouteRecordRaw } from "vue-router";

export interface User {
  name: string;
  permission: {
    routeKeys: string[];
    componentKeys?: string[];
    buttonKeys?: string[];
  };
}
export interface UserStore {
  user: User;
  token: string;
  menuList: RouteRecordRaw[];
}
