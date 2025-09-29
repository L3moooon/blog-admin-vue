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
import { iconComponentMap } from "@/utils/routeIcon";

const tabsStore = useTabsStore();

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
              @click="tabsStore.changeActiveTab(tab.path)">
              <component
                :is="iconComponentMap[tab.icon]"
                :color="tabsStore.activeKey == tab.path ? '#51a2ff' : '#737373'"
                class="size-4"></component>
              <div class="mx-2">
                {{ tab.name }}
              </div>
              <Pin
                v-if="tabsStore.fixedTabs.includes(tab.path)"
                class="top-1 size-4 text-black/30"
                :color="
                  tabsStore.activeKey == tab.path ? '#51a2ff' : '#737373'
                " />
              <X
                v-else-if="index != 0"
                @click.stop="tabsStore.removeTab(tab.path)"
                class="size-4 text-black/30 hover:text-black" />
            </div>
          </ContextMenuTrigger>

          <!-- 右键菜单内容 -->
          <ContextMenuContent
            align="start"
            class="w-48">
            <!-- 关闭 -->
            <ContextMenuItem @click="tabsStore.removeTab(tab.path)">
              <X class="mr-2 size-4" />
              关闭
            </ContextMenuItem>
            <!-- 固定/取消固定标签 -->
            <ContextMenuItem @click="tabsStore.togglePinTab(tab.path)">
              <Pin class="mr-2 size-4" />
              <span v-if="tabsStore.fixedTabs.includes(tab.path)">
                取消固定
              </span>
              <span v-else>固定</span>
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
              @click="tabsStore.closeLeftTabs(tab.path)"
              :disabled="tabsStore.tabList.length <= 1">
              <ArrowLeftToLine class="mr-2 size-4" />
              关闭左侧
            </ContextMenuItem>
            <!-- 关闭右侧标签 -->
            <ContextMenuItem
              @click="tabsStore.closeLeftTabs(tab.path)"
              :disabled="tabsStore.tabList.length <= 1">
              <ArrowRightToLine class="mr-2 size-4" />
              关闭右侧
            </ContextMenuItem>
            <ContextMenuSeparator />
            <!-- 关闭其他标签 -->
            <ContextMenuItem
              @click="tabsStore.closeLeftTabs(tab.path)"
              :disabled="tabsStore.tabList.length <= 1">
              <ArrowRightLeft class="mr-2 size-4" />
              关闭其他标签
            </ContextMenuItem>
            <!-- 关闭所有标签 -->
            <ContextMenuItem
              @click="tabsStore.closeAllTabs()"
              :disabled="tabsStore.tabList.length <= 1">
              <FoldHorizontal class="mr-2 size-4" />
              关闭全部标签
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <Separator orientation="vertical" />
      </div>
    </div>
  </ScrollArea>
</template>
