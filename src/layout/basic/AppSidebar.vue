<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import type { SidebarProps } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useUserStore } from "../../store/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const handlerJump = (path: string) => {
  router.push(path);
};
</script>

<template>
  <Sidebar>
    <SidebarHeader class="flex-row items-center !p-5 !text-xl">
      <img
        class="!w-12 !h-12 !rounded-full !mr-2"
        src="/src/assets/images/portrait.jpg"
        alt="" />
      <div class="w-fit">时雨博客后台</div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <!-- <SidebarGroupLabel> </SidebarGroupLabel> -->
        <SidebarGroupContent>
          <template v-for="item in userStore.menuList">
            <Collapsible
              v-show="!item.meta.hidden"
              defaultOpen
              class="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    <SidebarMenuButton
                      class="!pl-2 flex items-center h-8 text-18 cursor-pointer"
                      asChild>
                      <template>
                        <component :is="item.meta.icon" />
                        {{ item.name }}
                        <ChevronDown
                          class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </template>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu>
                      <SidebarMenuItem
                        v-for="child in item.children"
                        :key="child.title">
                        <SidebarMenuButton
                          class="!pl-10 flex items-center h-8 cursor-pointer"
                          asChild
                          @click="handlerJump(child.path)">
                          <template>
                            <component :is="child.meta.icon" />
                            <span>{{ child.name }}</span>
                          </template>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarGroupLabel>
              </SidebarGroup>
            </Collapsible>
          </template>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
