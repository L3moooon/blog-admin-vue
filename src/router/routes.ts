import type { RouteRecordRaw } from "vue-router";

declare module "vue-router" {
	interface RouteMeta {
		showInTabs: boolean;
		icon?: string;
	}
}

export const asyncRoutes: RouteRecordRaw[] = [
	{
		name: "网站数据",
		path: "/data",
		redirect: "/data/visitor",
		component: () => import("@/layout/basic/index.vue"),
		meta: {
			showInTabs: true,
			icon: "Database",
		},
		children: [
			{
				name: "访客列表",
				path: "/data/visitor",
				component: () => import("@/views/data/visitor.vue"),
				meta: {
					showInTabs: true,
					icon: "IdCard",
				},
			},
			{
				name: "埋点列表",
				path: "/data/buried",
				component: () => import("@/views/data/buried.vue"),
				meta: {
					showInTabs: true,
					icon: "Crosshair",
				},
			},
			{
				name: "定时任务",
				path: "/data/schedule",
				component: () => import("@/views/data/schedule/index.vue"),
				meta: {
					showInTabs: true,
					icon: "Rocket",
				},
			},
			{
				name: "错误日志",
				path: "/data/log",
				component: () => import("@/views/data/errorLog.vue"),
				meta: {
					showInTabs: true,
					icon: "Cctv",
				},
			},
		],
	},
	{
		name: "控制台",
		path: "/control",
		component: () => import("@/layout/basic/index.vue"),
		meta: {
			showInTabs: true,
			icon: "Settings2",
		},
		children: [
			{
				name: "用户管理",
				path: "/control/user",
				component: () => import("@/views/control/user/index.vue"),
				meta: {
					showInTabs: true,
					icon: "SquareUserRound",
				},
			},
			{
				name: "角色管理",
				path: "/control/role",
				component: () => import("@/views/control/role/index.vue"),
				meta: {
					showInTabs: true,
					icon: "UserCog",
				},
			},
			{
				name: "文章管理",
				path: "/control/article",
				component: () => import("@/views/control/article/index.vue"),
				meta: {
					showInTabs: true,
					icon: "NotebookText",
				},
			},
			{
				name: "评论管理",
				path: "/control/comment",
				component: () => import("@/views/control/comment/index.vue"),
				meta: {
					showInTabs: true,
					icon: "MessageSquareQuote",
				},
			},
		],
	},
	{
		name: "前台设置",
		path: "/setting",
		redirect: "/setting/theme",
		component: () => import("@/layout/basic/index.vue"),
		meta: {
			showInTabs: true,
			icon: "Settings",
		},
		children: [
			// {
			//   name: "主题设置",
			//   path: "/setting/theme",
			//   component: () => import("@/views/setting/theme.vue"),
			//   meta: {
			//     showInTabs: true,
			//     icon: "Castle",
			//   },
			// },
			{
				name: "音乐盒设置",
				path: "/setting/music",
				component: () => import("@/views/setting/music/index.vue"),
				meta: {
					showInTabs: true,
					icon: "Music4",
				},
			},
			{
				name: "友链设置",
				path: "/setting/friendship",
				component: () => import("@/views/setting/friendship/index.vue"),
				meta: {
					showInTabs: true,
					icon: "Handshake",
				},
			},
		],
	},
];
export const publicRoutes: RouteRecordRaw[] = [
	{
		name: "概览",
		path: "/",
		redirect: "analysis",
		component: () => import("@/layout/basic/index.vue"),
		meta: {
			showInTabs: true,
			icon: "LayoutDashboard",
		},
		children: [
			{
				name: "分析页",
				path: "/analysis",
				component: () => import("@/views/overview/analysis/index.vue"),
				meta: {
					showInTabs: true,
					icon: "ChartLine",
				},
			},
			{
				name: "工作台",
				path: "/workplace",
				component: () => import("@/views/overview/workplace/index.vue"),
				meta: {
					showInTabs: true,
					icon: "LaptopMinimalCheck",
				},
			},
		],
	},
	{
		path: "/login",
		component: () => import("@/layout/auth/index.vue"),
		meta: {
			showInTabs: false,
		},
	},
	{
		path: "/notfound",
		component: () => import("@/layout/notFound/index.vue"),
		meta: {
			showInTabs: false,
		},
	},
];
export const anyRoutes: RouteRecordRaw[] = [
	{
		path: "/:pathMatch(.*)*",
		redirect: "/notfound",
		meta: {
			showInTabs: false,
		},
	},
];
