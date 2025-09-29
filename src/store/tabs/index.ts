import { defineStore } from "pinia";
import type { TabItem, TabStore } from "./type";
import router from "@/router/index";

export const useTabsStore = defineStore("tabs", {
  state: (): TabStore => {
    return {
      tabList: [], // 标签页列表
      activeKey: "/analysis", // 当前激活的标签
      fixedTabs: ["/analysis"], // 固定标签页
    };
  },
  actions: {
    //更换标签页
    changeActiveTab(key: string) {
      this.activeKey = key;
      router.push(key);
    },
    // 添加标签页
    addTab(tab: TabItem) {
      if (!this.tabList.some((item) => item.path === tab.path)) {
        this.tabList.push(tab);
      }
      this.activeKey = tab.path;
    },
    // 移除标签页
    removeTab(path: string) {
      const index = this.tabList.findIndex((item) => item.path === path);
      this.tabList.splice(index, 1);
      if (path === this.activeKey) {
        this.activeKey = this.tabList[index - 1].path;
        router.push(this.activeKey);
      }
    },
    //固定/取消固定标签页
    togglePinTab(path: string) {
      const index = this.fixedTabs.findIndex((item) => item === path);
      if (index >= 0) {
        this.fixedTabs.splice(index, 1);
      } else {
        this.fixedTabs.push(path);
      }
    },
    closeLeftTabs(path: string) {},
    closeRightTabs(path: string) {},
    closeOtherTabs(path: string) {},
    closeAllTabs() {},
    clearInfo() {
      this.tabList = []; // 标签页列表
      this.activeKey = "/analysis"; // 当前激活的标签
      this.fixedTabs = ["/analysis"]; // 固定标签页
    },
  },
  // 持久化配置
  persist: {
    // key: "tabs-state", // 存储的键名，默认是 store 的 id
    storage: sessionStorage, // 存储方式，可选 localStorage (默认) 或 sessionStorage
    // pick: ["tabList", "activeKey"], // 需要持久化的状态字段，默认全部持久化
  },
});
