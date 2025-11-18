<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Statistics from "./statistics.vue";
import ViewTrend from "./ViewTrend.vue";
import MonthVisites from "./MonthVisites.vue";
import ViewMap from "./ViewMap.vue";
// import PieChart from "./PieChart.vue";
</script>

<template>
	<ScrollArea class="h-[calc(100vh-100px)]">
		<div class="p-5">
			<div class="grid grid-cols-4 gap-5 mb-5">
				<Statistics />
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
						用户增量
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
