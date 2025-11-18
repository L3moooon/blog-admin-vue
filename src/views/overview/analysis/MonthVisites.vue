<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;

const chartDom = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const myChart = shallowRef<echarts.ECharts | null>(null);

const formatTimeToYearMonth = (timestamp: number): string => {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，补0
	return `${year}-${month}`;
};
const option: EChartsOption = {
	xAxis: [
		{
			type: "time", // 声明为时间轴
			// interval: 3600,
			axisLabel: {
				show: true, // 显示标签
				interval: 0, // 强制显示所有标签（0 表示不自动隐藏）
				formatter: (value: number, index: number) => {
					// value 是时间戳（毫秒），需转换为可读性强的格式
					const date = new Date(value);
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					return `${year}年${month}月`; // 显示 "6:00" "7:00" 等
				},
			},
		},
	],
	yAxis: {
		type: "value",
	},
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow",
			label: {
				backgroundColor: "#6a7985",
			},
			shadowStyle: {
				color: "rgba(0,0,0,0.5)", // 阴影透明度，不遮挡图表
			},
		},
		formatter: function (params, index) {
			return `
      <div>${formatTimeToYearMonth(params[0].axisValue)}</div>
      <div>本月新增用户量：${params[0].value.toString().split(",")[1]}</div>
      `;
		},
	},
	grid: {
		left: "0%",
		right: "3%",
		top: "5%",
		bottom: "0%",
		containLabel: true,
	},
	series: [
		{
			data: undefined,
			type: "bar",
			coordinateSystem: "cartesian2d", // 显式指定坐标系
		},
	],
};
import { getBarData as getBarDataApi } from "@/api/overview/analysis";
const getBarData = async () => {
	const { data, code } = await getBarDataApi();
	console.log(code, data);

	if (code == 1) {
		console.log(data);
		option.series![0].data = data;
		console.log(option.value);
		setChartOption();
	}
};
const setChartOption = () => {
	if (myChart.value) {
		myChart.value.setOption(option);
	}
};
onMounted(() => {
	getBarData();
	chartDom.value = document.getElementById("echarts-month")!;
	myChart.value = echarts.init(chartDom.value);
	myChart.value.setOption(option);
	// 监听容器自身尺寸变化
	resizeObserver.value = new ResizeObserver((entries) => {
		// 容器尺寸变化时触发
		if (myChart.value) {
			myChart.value.resize();
		}
	});
	// 监听图表容器
	resizeObserver.value.observe(chartDom.value);
});
onUnmounted(() => {
	// 清理监听
	if (resizeObserver.value) {
		if (chartDom.value) resizeObserver.value.unobserve(chartDom.value);
	}
	if (myChart.value) {
		myChart.value.dispose();
	}
});
</script>
<template>
	<div
		id="echarts-month"
		class="w-full h-105"
	></div>
</template>
