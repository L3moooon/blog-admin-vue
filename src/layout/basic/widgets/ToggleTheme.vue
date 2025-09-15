<script setup lang="ts">
import { Sun, Moon } from "lucide-vue-next";
import { ref, onMounted } from "vue";

const theme = ref(localStorage.getItem("theme") || "light");
const toggleTheme = () => {
  if (theme.value === "light") {
    html.value.classList.toggle("dark");
    theme.value = "dark";
    localStorage.setItem("theme", "dark");
  } else {
    html.value.classList.toggle("dark");
    theme.value = "light";
    localStorage.setItem("theme", "light");
  }
};
const html = ref(document.documentElement);
onMounted(() => {
  console.log(html.value);
});
</script>

<template>
  <div class="flex items-center">
    <div
      class="cursor-pointer"
      @click="toggleTheme">
      <Sun
        v-if="theme === 'dark'"
        class="size-8" />
      <Moon
        v-else
        class="size-8" />
    </div>
  </div>
</template>
