import type { RouteRecordRaw } from "vue-router";
import {
  LayoutDashboard,
  ChartLine,
  KeyRound,
  Cctv,
  Handshake,
  IdCard,
  NotebookText,
  Music4,
  Castle,
  Crosshair,
  Rocket,
  MessageSquareQuote,
  Database,
  Settings2,
  Settings,
  LaptopMinimalCheck,
  SquareUserRound,
} from "lucide-vue-next";

export const asyncRoutes: RouteRecordRaw[] = [
  {
    name: "网站数据",
    path: "/data",
    redirect: "/data/visitor",
    component: () => import("@/layout/basic/index.vue"),
    meta: {
      hidden: false,
      icon: Database,
    },
    children: [
      {
        name: "访客列表",
        path: "/data/visitor",
        component: () => import("@/views/visitor.vue"),
        meta: {
          hidden: false,
          icon: IdCard,
        },
      },
      {
        name: "埋点列表",
        path: "/data/buried",
        component: () => import("@/views/buried.vue"),
        meta: {
          hidden: false,
          icon: Crosshair,
        },
      },
      {
        name: "性能分析",
        path: "/data/performance",
        component: () => import("@/views/performance.vue"),
        meta: {
          hidden: false,
          icon: Rocket,
        },
      },
      {
        name: "错误日志",
        path: "/data/log",
        component: () => import("@/views/errorLog.vue"),
        meta: {
          hidden: false,
          icon: Cctv,
        },
      },
    ],
  },
  {
    name: "控制台",
    path: "/workplace",
    component: () => import("@/layout/basic/index.vue"),
    meta: {
      hidden: false,
      icon: Settings2,
    },
    children: [
      {
        name: "用户管理",
        path: "/workplace/user",
        component: () => import("@/views/administrator.vue"),
        meta: {
          hidden: false,
          icon: SquareUserRound,
        },
      },
      {
        name: "角色管理",
        path: "/workplace/role",
        component: () => import("@/views/role.vue"),
        meta: {
          hidden: false,
          icon: KeyRound,
        },
      },
      {
        name: "文章管理",
        path: "/workplace/article",
        component: () => import("@/views/article.vue"),
        meta: {
          hidden: false,
          icon: NotebookText,
        },
      },
      {
        name: "评论管理",
        path: "/workplace/comment",
        component: () => import("@/views/comment.vue"),
        meta: {
          hidden: false,
          icon: MessageSquareQuote,
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
      hidden: false,
      icon: Settings,
    },
    children: [
      {
        name: "主题设置",
        path: "/setting/theme",
        component: () => import("@/views/theme.vue"),
        meta: {
          hidden: false,
          icon: Castle,
        },
      },
      {
        name: "音乐盒设置",
        path: "/setting/music",
        component: () => import("@/views/music.vue"),
        meta: {
          hidden: false,
          icon: Music4,
        },
      },
      {
        name: "友链设置",
        path: "/setting/friendship",
        component: () => import("@/views/friendship.vue"),
        meta: {
          hidden: false,
          icon: Handshake,
        },
      },
    ],
  },
];
export const publicRoutes: RouteRecordRaw[] = [
  {
    name: "概览",
    path: "/",
    redirect: "overview",
    component: () => import("@/layout/basic/index.vue"),
    meta: {
      hidden: false,
      icon: LayoutDashboard,
    },
    children: [
      {
        name: "分析页",
        path: "/overview",
        component: () => import("@/views/overview.vue"),
        meta: {
          hidden: false,
          icon: ChartLine,
        },
      },
      {
        name: "工作台",
        path: "/workplace",
        component: () => import("@/views/overview.vue"),
        meta: {
          hidden: false,
          icon: LaptopMinimalCheck,
        },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/layout/login.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/notfound",
    component: () => import("@/layout/notFound.vue"),
    meta: {
      hidden: true,
    },
  },
];
export const anyRoutes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/notfound",
    meta: {
      hidden: true,
    },
  },
];
