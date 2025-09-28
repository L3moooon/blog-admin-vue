<script setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ScrollNumber from "./scrollNumber.vue";
import ViewTrend from "./ViewTrend.vue";
import MonthVisites from "./MonthVisites.vue";
import ViewMap from "./ViewMap.vue";
import PieChart from "./PieChart.vue";
import { onMounted } from "vue";
import { getNumData as getNumDataApi } from "@/api/overview/analysis";

//获取分析页数据
const getNumData = async () => {
  const { data, code } = await getNumDataApi();
  if (code == 1) {
  }
};
onMounted(() => {
  // getNumData();
});
</script>

<template>
  <ScrollArea class="h-[calc(100vh-100px)]">
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
      <div class="p-5 border rounded-sm mb-5">
        <ViewMap />
      </div>
      <Tabs
        default-value="ViewTrend"
        class="p-5 border rounded-sm mb-5">
        <TabsList class="w-60">
          <TabsTrigger
            class="cursor-pointer"
            value="ViewTrend">
            流量趋势
          </TabsTrigger>
          <TabsTrigger
            class="cursor-pointer"
            value="MonthVisites">
            月访问量
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ViewTrend">
          <ViewTrend />
        </TabsContent>
        <TabsContent value="MonthVisites">
          <MonthVisites />
        </TabsContent>
      </Tabs>
      <!-- <div class="p-5 border rounded-sm mb-5 grid grid-rows-3">
        <PieChart />
        <PieChart />
        <PieChart />
      </div> -->
    </div>
  </ScrollArea>
</template>
