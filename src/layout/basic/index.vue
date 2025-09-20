<script setup>
import { RouterView } from "vue-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import AppSidebar from "@/layout/basic/AppSidebar.vue";
import AppBreadcrumb from "@/layout/basic/AppBreadcrumb.vue";
import AppWidget from "@/layout/basic/widgets/index.vue";
import AppTabSet from "@/layout/basic/AppTabSet.vue";
</script>

<template>
  <div class="flex">
    <SidebarProvider>
      <AppSidebar />
      <main class="flex-auto overflow-hidden">
        <div class="flex items-center !px-5">
          <SidebarTrigger />
          <AppBreadcrumb />
          <AppWidget />
        </div>
        <Separator />
        <AppTabSet />
        <Separator />
        <router-view v-slot="{ Component }">
          <transition name="slide">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </SidebarProvider>
  </div>
</template>
