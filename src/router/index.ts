import { createWebHistory, createRouter } from "vue-router";
import { publicRoutes } from "./routes";
import { toast } from "vue-sonner";
import { useUserStore } from "@/store/user";
import { useTabsStore } from "@/store/tabs";

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes,
  scrollBehavior() {
    return { top: 0 };
  },
});
//全局前置守卫
router.beforeEach(async (to, from, next) => {
  const token = useUserStore().token;
  const menuList = useUserStore().menuList;
  console.log(token);
  if (token) {
    if (menuList.length) {
      next();
    } else {
      try {
        console.log(to);
        await useUserStore().generateRoutes();
        next({ ...to, replace: true });
      } catch (error) {
        useUserStore().logout();
        next({ path: "/login", query: { redirect: to.path } });
      }
    }
  } else {
    if (to.path == "/login") {
      next();
    } else {
      next("/login");
      toast.warning("请先登录");
    }
  }
});
//全局后置守卫
router.afterEach((to, from) => {
  const tabsStore = useTabsStore();
  if (to.meta.showInTabs) {
    tabsStore.addTab({
      path: to.path,
      name: to.name,
      icon: to.meta.icon,
      key: to.path,
    });
  }
});
export default router;
