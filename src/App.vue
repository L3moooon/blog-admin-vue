<script setup>
import "./styles/index.css";
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <Toaster />
  <router-view></router-view>
</template>
