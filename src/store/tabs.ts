import { defineStore } from "pinia";

interface Tab {
  tabList: Array<string>;
  activeKey: string;
  fixedTabs: Array<string>;
}
export const useTabsStore = defineStore("tabs", {
  state: (): Tab => {
    return {
      tabList: [], // 标签页列表
      activeKey: "", // 当前激活的标签
      fixedTabs: ["/analysis"], // 固定标签页
    };
  },
  actions: {
    // 添加标签页
    addTab(tab: string) {
      // 避免重复添加
      if (!this.tabList.some((item) => item.path === tab.path)) {
        this.tabList.push(tab);
      }
      this.activeKey = tab.path;
    },
    // 移除标签页
    removeTab(path: string) {
      const index = this.tabList.findIndex((item) => item.path === path);
      this.tabList.splice(index, 1);

      // 如果删除的是当前激活的标签，需要切换到其他标签
      if (path === this.activeKey && this.tabList.length > 0) {
        this.activeKey = this.tabList[index - 1 >= 0 ? index - 1 : 0].path;
        // 跳转到新的激活标签对应的路由
        router.push(this.activeKey);
      }
    },

    changeActiveTab(key: string) {
      this.activeKey = key;
    },
  },
  // 持久化配置
  persist: {
    key: "tabs-state", // 存储的键名，默认是 store 的 id
    storage: localStorage, // 存储方式，可选 localStorage (默认) 或 sessionStorage
    paths: ["tabsList", "activeKey"], // 需要持久化的状态字段，默认全部持久化
  },
});
