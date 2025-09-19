<script setup>
import "./styles/index.css";
import "element-plus/dist/index.css";

import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
</script>

<template>
  <Toaster />
  <router-view></router-view>
</template>
