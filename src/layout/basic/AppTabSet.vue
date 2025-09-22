<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useTabsStore } from "@/store/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  X,
  Pin,
  Maximize,
  RotateCw,
  SquareArrowOutUpRight,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowRightLeft,
  FoldHorizontal,
} from "lucide-vue-next";

const tabsStore = useTabsStore();
const router = useRouter();

const changeTab = (path: string) => {
  tabsStore.changeActiveTab(path);
  router.push(path);
};

const handleCloseTab = (path: string) => {
  tabsStore.closeTab(path);
  if (tabsStore.activeKey === path) {
    const lastTab = tabsStore.tabList[tabsStore.tabList.length - 1];
    if (lastTab) {
      changeTab(lastTab.path);
    } else {
      router.push("/");
    }
  }
};
const handlePinTab = (path: string) => {
  tabsStore.togglePinTab(path);
};
const handleMaxTab = (path: string) => {
  window.open(window.location.origin + path, "_blank");
};
const handleReloadTab = (path: string) => {
  const iframe = document.querySelector(
    `iframe[src="${window.location.origin + path}"]`
  ) as HTMLIFrameElement;
  if (iframe) {
    iframe.src = iframe.src;
  } else {
    window.location.reload();
  }
};
const handleNewTab = (path: string) => {
  window.open(window.location.origin + path, "_blank");
};
const handleCloseLeftTabs = (path: string) => {
  tabsStore.closeLeftTabs(path);
  if (tabsStore.activeKey === path) {
    changeTab(path);
  }
};
const handleCloseRightTabs = () => {
  const activePath = tabsStore.activeKey;
  tabsStore.closeRightTabs(activePath);
  changeTab(activePath);
};
const handleCloseOtherTabs = (path: string) => {
  tabsStore.closeOtherTabs(path);
  changeTab(path);
};
const handleCloseAllTabs = () => {
  tabsStore.closeAllTabs();
  router.push("/");
};
</script>
<template>
  <ScrollArea class="w-full">
    <div class="flex">
      <div
        class="h-10 flex"
        v-for="(tab, index) in tabsStore.tabList"
        :key="tab.key">
        <ContextMenu>
          <!-- 触发右键菜单的元素 -->
          <ContextMenuTrigger asChild>
            <div
              :data-state="
                tabsStore.activeKey == tab.path ? 'active' : 'inactive'
              "
              class="w-30 border-r-gray-200 h-full flex border-b-2 border-transparent justify-center items-center cursor-pointer text-sm text-black/50 transition-all data-[state=active]:bg-blue-100 data-[state=active]:border-b-blue-400 data-[state=active]:text-blue-400 select-none hover:bg-gray-100 relative"
              @click="changeTab(tab.path)">
              <component
                :is="tab.icon"
                :color="tabsStore.activeKey == tab.path ? '#51a2ff' : '#737373'"
                class="size-4"></component>
              <div class="mx-2">
                {{ tab.name }}
              </div>
              <Pin
                v-if="tabsStore.fixedTabs.includes(tab.path)"
                class="top-1 size-4 text-black/30" />
              <X
                v-else
                @click.stop="tabsStore.closeTab(tab.path)"
                class="size-4 text-black/30 hover:text-black" />
            </div>
          </ContextMenuTrigger>

          <!-- 右键菜单内容 -->
          <ContextMenuContent
            align="start"
            class="w-48">
            <!-- 关闭 -->
            <ContextMenuItem @click="handleCloseTab(tab.path)">
              <X class="mr-2 size-4" />
              关闭
            </ContextMenuItem>
            <!-- 固定/取消固定标签 -->
            <ContextMenuItem @click="handlePinTab(tab.path)">
              <Pin class="mr-2 size-4" />
              {{ tabsStore.fixedTabs.includes(tab.path) ? "取消固定" : "固定" }}
            </ContextMenuItem>
            <!-- 最大化-->
            <ContextMenuItem @click="handleMaxTab(tab.path)">
              <Maximize class="mr-2 size-4" />
              最大化
            </ContextMenuItem>
            <!-- 重新加载 -->
            <ContextMenuItem @click="handleReloadTab(tab.path)">
              <RotateCw class="mr-2 size-4" />
              重新加载
            </ContextMenuItem>
            <!-- 在新窗口打开 -->
            <ContextMenuItem @click="handleNewTab(tab.path)">
              <SquareArrowOutUpRight class="mr-2 size-4" />
              在新窗口打开
            </ContextMenuItem>
            <ContextMenuSeparator />
            <!-- 关闭左侧标签 -->
            <ContextMenuItem
              @click="handleCloseLeftTabs(tab.path)"
              :disabled="tabsStore.tabList.length <= 1">
              <ArrowLeftToLine class="mr-2 size-4" />
              关闭左侧
            </ContextMenuItem>
            <!-- 关闭右侧标签 -->
            <ContextMenuItem
              @click="handleCloseRightTabs"
              :disabled="tabsStore.tabList.length <= 1">
              <ArrowRightToLine class="mr-2 size-4" />
              关闭右侧
            </ContextMenuItem>
            <ContextMenuSeparator />
            <!-- 关闭其他标签 -->
            <ContextMenuItem
              @click="handleCloseOtherTabs(tab.path)"
              :disabled="tabsStore.tabList.length <= 1">
              <ArrowRightLeft class="mr-2 size-4" />
              关闭其他标签
            </ContextMenuItem>
            <!-- 关闭所有标签 -->
            <ContextMenuItem
              @click="handleCloseAllTabs"
              :disabled="tabsStore.tabList.length <= 1">
              <FoldHorizontal class="mr-2 size-4" />
              关闭所有标签
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <Separator orientation="vertical" />
      </div>
    </div>
  </ScrollArea>
</template>
