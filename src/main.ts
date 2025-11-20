import App from "./App.vue";
import router from "@/router/index";
import pinia from "./store";
import directives from "./directives";
import { createApp } from "vue";

const app = createApp(App);
//注册自定义指令
Object.keys(directives).forEach((key) => {
	app.directive(key, directives[key]);
});
app.use(router);
app.use(pinia);
app.mount("#app");
