<script setup>
import { RouterView } from "vue-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import AppSidebar from "@/layout/basic/AppSidebar.vue";
import AppBreadcrumb from "@/layout/basic/AppBreadcrumb.vue";
import AppWidget from "@/layout/basic/AppWidget.vue";
import AppTabSet from "@/layout/basic/AppTabSet.vue";
</script>

<template>
  <div class="flex">
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full">
        <div class="flex items-center !px-5">
          <SidebarTrigger />
          <AppBreadcrumb />
          <AppWidget />
        </div>
        <Separator />
        <AppTabSet />
        <Separator />
        <RouterView />
      </main>
    </SidebarProvider>
  </div>
</template>
