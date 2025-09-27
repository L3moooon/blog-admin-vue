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
import { iconComponentMap } from "@/utils/routeIcon";

const route = useRoute();
</script>
<template>
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
              :is="iconComponentMap[item.meta.icon]"
              class="size-5 mr-2" />
            {{ item.name }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="last:hidden" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
