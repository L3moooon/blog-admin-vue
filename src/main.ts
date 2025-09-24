import App from "./App.vue";
import router from "@/router/index";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import directives from "./directives"; // 导入指令
import { createApp } from "vue";
import { createPinia } from "pinia";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); //pinia持久化

const app = createApp(App);
//注册自定义指令
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});
app.use(router);
app.use(pinia);
app.mount("#app");
