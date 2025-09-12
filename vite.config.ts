import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// const target = 'http://182.92.105.35:3000'
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
      "@": path.resolve("./src"), //相对别名配置，使用@代替src
    },
  },
  server: {
    open: false,
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
    },
  },
  optimizeDeps: {
    include: ["highlight.js"],
  },
});
