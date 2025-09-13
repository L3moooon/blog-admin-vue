import { createWebHistory, createRouter } from 'vue-router'
import { publicRoutes } from './routes'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  },
})
//全局前置守卫
router.beforeEach(async (to, from, next) => {
  const token = useUserStore().token
  const menuList = useUserStore().menuList
  if (token) {
    if (menuList.length) {
      next()
    } else {
      try {
        await useUserStore().generateRoutes()
        next({ ...to, replace: true })
      } catch (error) {
        useUserStore().logout()
        next({ path: '/login', query: { redirect: to.path } })
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next('/login')
      ElMessage({
        type: "warning",
        message: "请先登录",
      });
    }
  }
})

export default router