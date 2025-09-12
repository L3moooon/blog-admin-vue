import infoScan from '/src/assets/icons/数据.png'
import webInfo from '/src/assets/icons/data.png'
import visitor from '/src/assets/icons/访客管理.png'
import buried from '/src/assets/icons/数据埋点.png'
import log from '/src/assets/icons/监控.png'
import error from '/src/assets/icons/task-error.png'
import workplace from '/src/assets/icons/控制台.png'
import user from '/src/assets/icons/管理员.png'
import role from '/src/assets/icons/角色3.png'
import article from '/src/assets/icons/文章管理.png'
import comment from '/src/assets/icons/评论.png'
import web from '/src/assets/icons/网站.png'
import theme from '/src/assets/icons/主题.png'
import music from '/src/assets/icons/音乐盒-常态@1x.png'
import friendship from '/src/assets/icons/友情.png'

export const asyncRoutes = [
  {
    name: '网站数据',
    path: '/data',
    redirect: '/data/visitor',
    component: () => import('@/layout/home.vue'),
    meta: {
      hidden: false,
      icon: webInfo
    },
    children: [
      {
        name: '访客列表',
        path: '/data/visitor',
        component: () => import('@/views/visitor.vue'),
        meta: {
          hidden: false,
          icon: visitor
        },
      },
      {
        name: '埋点列表',
        path: '/data/buried',
        component: () => import('@/views/buried.vue'),
        meta: {
          hidden: false,
          icon: buried
        },
      },
      {
        name: '性能分析',
        path: '/data/performance',
        component: () => import('@/views/performance.vue'),
        meta: {
          hidden: false,
          icon: error
        },
      },
      {
        name: '错误日志',
        path: '/data/log',
        component: () => import('@/views/errorLog.vue'),
        meta: {
          hidden: false,
          icon: log
        },
      },
    ]
  },
  {
    name: '控制台',
    path: '/workplace',
    component: () => import('@/layout/home.vue'),
    meta: {
      hidden: false,
      icon: workplace
    },
    children: [
      {
        name: '用户管理',
        path: '/workplace/user',
        component: () => import('@/views/administrator.vue'),
        meta: {
          hidden: false,
          icon: user
        },
      },
      {
        name: '角色管理',
        path: '/workplace/role',
        component: () => import('@/views/role.vue'),
        meta: {
          hidden: false,
          icon: role
        },
      },
      {
        name: '文章管理',
        path: '/workplace/article',
        component: () => import('@/views/article.vue'),
        meta: {
          hidden: false,
          icon: article
        },
      },
      {
        name: '评论管理',
        path: '/workplace/comment',
        component: () => import('@/views/comment.vue'),
        meta: {
          hidden: false,
          icon: comment
        },
      },
    ]
  },
  {
    name: '前台设置',
    path: '/setting',
    redirect: '/setting/theme',
    component: () => import('@/layout/home.vue'),
    meta: {
      hidden: false,
      icon: web
    },
    children: [
      {
        name: '主题设置',
        path: '/setting/theme',
        component: () => import('@/views/theme.vue'),
        meta: {
          hidden: false,
          icon: theme
        },
      },
      {
        name: '音乐盒设置',
        path: '/setting/music',
        component: () => import('@/views/music.vue'),
        meta: {
          hidden: false,
          icon: music
        },
      },
      {
        name: '友链设置',
        path: '/setting/friendship',
        component: () => import('@/views/friendship.vue'),
        meta: {
          hidden: false,
          icon: friendship
        },
      },
    ]
  },
]
export const publicRoutes = [
  {
    path: '/',
    redirect: 'overview',
    component: () => import('@/layout/home.vue'),
    meta: {
      hidden: true,
    },
    children: [
      {
        name: '首页',
        path: '/overview',
        component: () => import('@/views/overview.vue'),
        meta: {
          hidden: false,
          icon: infoScan
        },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layout/login.vue'),
    meta: {
      hidden: true
    },
  },
  {
    path: '/notfound',
    component: () => import('@/layout/notFound.vue'),
    meta: {
      hidden: true
    },
  },
]
export const anyRoutes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/notfound',
    meta: {
      hidden: true
    },
  }
]