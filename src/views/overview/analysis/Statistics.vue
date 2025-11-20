<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getNumData as getNumDataApi } from "@/api/overview/analysis";
import { CountUp } from "countup.js";

import pic1 from "@/assets/icons/global.png";
import pic2 from "@/assets/icons/filetext.png";
import pic3 from "@/assets/icons/comment.png";
import pic4 from "@/assets/icons/click.png";

const scrollData = ref([
	{
		label: "visit",
		title: "总访问量",
		total: 0,
		subTitle: "今日访问量",
		today: 0,
		img: pic1,
	},
	{
		label: "article",
		title: "总文章量",
		total: 0,
		subTitle: "今日发布文章",
		today: 0,
		img: pic2,
	},
	{
		label: "comment",
		title: "总评论量",
		subTitle: "今日收获评论",
		today: 0,
		img: pic3,
	},
	{
		label: "like",
		title: "总点赞量",
		subTitle: "今日收获点赞",
		today: 0,
		img: pic4,
	},
]);

// 封装数字滚动动画函数
const startCountUp = (elementId: string, targetVal: number, duration = 2) => {
	const targetElement = document.getElementById(elementId);
	if (!targetElement) return;
	// 初始化CountUp
	const countUp = new CountUp(targetElement, targetVal, {
		duration,
		startVal: 0,
		separator: "", // 如需千分位可改为","
	});

	// 启动动画
	if (!countUp.error) {
		countUp.start();
	} else {
		console.error(`CountUp初始化失败: ${countUp.error}`);
	}
};

// 获取分析页数据
const getNumData = async () => {
	try {
		const { data, code } = await getNumDataApi();
		if (code === 1) {
			scrollData.value.forEach((v) => {
				if (v.label in data) {
					v.total = data[v.label].total;
					v.today = data[v.label].today;
					// 数据更新后，启动当前项的total和today动画
					startCountUp(`${v.label}-main`, v.total); // total动画
					startCountUp(`${v.label}-sub`, v.today, 1.5); // today动画（时长稍短）
				}
			});
		}
	} catch (error) {
		console.error("获取数据失败:", error);
	}
};

onMounted(() => {
	getNumData();
});
</script>

<template>
	<div
		class="h-32 rounded-sm border p-4"
		v-for="item in scrollData"
		:key="item.label">
		<div class="flex items-center justify-between mb-2">
			<h1 class="font-semibold text-primary text-lg">{{ item.title }}</h1>
			<img
				class="size-12"
				:src="item.img"
				alt="" />
		</div>
		<div class="flex justify-between items-center">
			<div
				:id="`${item.label}-main`"
				class="text-2xl font-bold">
				{{ item.total }}
			</div>
			<div class="text-md text-gray-500">
				<span>{{ item.subTitle }}</span>
				<span
					:id="`${item.label}-sub`"
					class="ml-2"
					>{{ item.today }}</span
				>
			</div>
		</div>
	</div>
</template>
