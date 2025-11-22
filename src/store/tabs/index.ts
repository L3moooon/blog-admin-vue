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
		closeLeftTabs(path: string) {
			const targetIndex = this.tabList.findIndex((item) => item.path === path);
			if (targetIndex === -1) return; // 目标标签不存在则直接返回

			// 过滤规则：保留固定标签 + 目标标签及右侧所有标签
			this.tabList = this.tabList.filter((_, index) => {
				const isFixed = this.fixedTabs.includes(_.path);
				return isFixed || index >= targetIndex;
			});

			// 处理激活态：如果原激活标签被关闭，激活目标标签
			const isActiveTabExist = this.tabList.some(
				(item) => item.path === this.activeKey
			);
			if (!isActiveTabExist) {
				this.activeKey = path;
				router.push(path);
			}
		},
		closeRightTabs(path: string) {
			const targetIndex = this.tabList.findIndex((item) => item.path === path);
			if (targetIndex === -1) return; // 目标标签不存在则直接返回

			// 过滤规则：保留固定标签 + 目标标签及左侧所有标签
			this.tabList = this.tabList.filter((_, index) => {
				const isFixed = this.fixedTabs.includes(_.path);
				return isFixed || index <= targetIndex;
			});

			// 处理激活态：如果原激活标签被关闭，激活目标标签
			const isActiveTabExist = this.tabList.some(
				(item) => item.path === this.activeKey
			);
			if (!isActiveTabExist) {
				this.activeKey = path;
				router.push(path);
			}
		},
		closeOtherTabs(path: string) {
			// 过滤规则：保留固定标签 + 目标标签
			this.tabList = this.tabList.filter((item) => {
				const isFixed = this.fixedTabs.includes(item.path);
				return isFixed || item.path === path;
			});

			// 强制激活目标标签（避免激活态指向已关闭的标签）
			this.activeKey = path;
			router.push(path);
		},
		closeAllTabs() {
			// 只保留固定标签
			this.tabList = this.tabList.filter((item) =>
				this.fixedTabs.includes(item.path)
			);
			// 激活第一个固定标签
			this.activeKey = this.fixedTabs[0];
			router.push(this.activeKey);
		},
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
