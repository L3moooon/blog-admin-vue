import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import directives from "./directives"; // 导入指令

import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});
app.use(pinia);
app.use(router);
app.mount("#app");
