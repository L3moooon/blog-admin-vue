<script setup>
import { RouterView } from "vue-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import AppSidebar from "@/components/AppSidebar.vue";
import AppBreadcrumb from "@/components/AppBreadcrumb.vue";
import AppWidget from "@/components/AppWidget.vue";
import AppTabSet from "@/components/AppTabSet.vue";
</script>

<template>
  <div class="flex">
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full">
        <div class="flex items-center">
          <SidebarTrigger />
          <AppBreadcrumb />
          <AppWidget />
        </div>
        <AppTabSet />
        <RouterView />
      </main>
    </SidebarProvider>
  </div>
</template>
