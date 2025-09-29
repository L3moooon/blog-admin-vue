import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
const target = "http://127.0.0.1:3000";
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  server: {
    open: true,
    port: 5174,
    headers: {
      "Cross-Origin-Opener-Policy": "cross-origin",
    },
    proxy: {
      "/admin": {
        target,
        changeOrigin: true,
      },
      "/public": {
        target,
        changeOrigin: true,
      },
      "/external": {
        target: "https://v1.jinrishici.com", // 外部目标地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/external/, ""), // 重写路径为空
      },
      //本地开发环境显示oss图片
      "/images": {
        target: "https://oss.willisblog.cn",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ["highlight.js"],
  },
});
