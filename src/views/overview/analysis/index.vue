<script setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ScrollNumber from "./scrollNumber.vue";
import ViewTrend from "./ViewTrend.vue";
import MonthView from "./MonthView.vue";
import ViewMap from "./ViewMap.vue";
</script>

<template>
  <ScrollArea class="h-[calc(100vh-250px)]">
    <div class="p-5">
      <div class="grid grid-cols-4 gap-5 mb-5">
        <ScrollNumber
          title="访问量"
          description="总访问量"
          :target="2000"
          :total="2000">
          <template #icon>
            <img
              class="size-12"
              src="@/assets/icons/global.png"
              alt="" />
          </template>
        </ScrollNumber>
        <ScrollNumber
          title="文章量"
          :target="2000">
          <template #icon>
            <img
              class="size-12"
              src="@/assets/icons/filetext.png"
              alt="" />
          </template>
        </ScrollNumber>
        <ScrollNumber
          title="评论量"
          :target="2000">
          <template #icon>
            <img
              class="size-12"
              src="@/assets/icons/comment.png"
              alt="" />
          </template>
        </ScrollNumber>
        <ScrollNumber
          title="点赞量"
          :target="2000">
          <template #icon>
            <img
              class="size-12"
              src="@/assets/icons/click.png"
              alt="" />
          </template>
        </ScrollNumber>
      </div>
      <Tabs
        default-value="ViewMap"
        class="p-5 border rounded-sm">
        <TabsList class="w-60">
          <TabsTrigger
            class="cursor-pointer"
            value="ViewMap">
            访客地图
          </TabsTrigger>
          <TabsTrigger
            class="cursor-pointer"
            value="ViewTrend">
            流量趋势
          </TabsTrigger>
          <TabsTrigger
            class="cursor-pointer"
            value="MonthView">
            月访问量
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ViewMap">
          <ViewMap />
        </TabsContent>
        <TabsContent value="ViewTrend">
          <ViewTrend />
        </TabsContent>
        <TabsContent value="MonthView">
          <MonthView />
        </TabsContent>
      </Tabs>
    </div>
  </ScrollArea>
</template>
