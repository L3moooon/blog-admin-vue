<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<template>
  <LayoutDashboard
    class="mr-2 size-5 hover:text-foreground transition-colors" />
  <Breadcrumb>
    <BreadcrumbList>
      <template
        v-for="(item, index) in route.matched"
        :key="item.name">
        <BreadcrumbItem>
          <BreadcrumbLink
            :href="item.path"
            class="flex items-center">
            <component
              :is="item.meta.icon"
              class="size-5 mr-2" />
            {{ item.name }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="last:hidden" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
