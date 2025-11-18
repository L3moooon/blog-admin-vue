<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import { getLineData as getLineDataApi } from "@/api/overview/analysis";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;

const chartDom = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const myChart = shallowRef<echarts.ECharts | null>(null);

const data = [
	["6:00", 0],
	["7:00", 0],
	["8:00", 0],
	["9:00", 0],
	["10:00", 0],
	["11:00", 0],
	["12:00", 0],
	["13:00", 0],
	["14:00", 0],
	["15:00", 0],
	["16:00", 0],
	["17:00", 0],
	["18:00", 0],
	["19:00", 0],
	["20:00", 0],
	["11:00", 0],
	["21:00", 0],
	["22:00", 0],
	["23:00", 0],
];
const option: EChartsOption = {
	color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
	// titles: {
	// 	text: ["1", "2"],
	// },
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "cross",
			label: {
				backgroundColor: "#6a7985",
			},
		},
	},
	// legend: {
	//   data: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"],
	// },
	// toolbox: {
	//   feature: {
	//     saveAsImage: {},
	//   },
	// },
	grid: {
		left: "0%",
		right: "3%",
		top: "5%",
		bottom: "0%",
		containLabel: true,
	},
	xAxis: [
		{
			type: "category",
			boundaryGap: false,
			data: [
				"6:00",
				"7:00",
				"8:00",
				"9:00",
				"10:00",
				"11:00",
				"12:00",
				"13:00",
				"14:00",
				"15:00",
				"16:00",
				"17:00",
				"18:00",
				"19:00",
				"20:00",
				"21:00",
				"22:00",
				"23:00",
			],
		},
	],
	yAxis: [
		{
			type: "value",
			minInterval: 1,
		},
	],
	series: [
		{
			name: "周访问量",
			type: "line",
			// stack: "Total",
			smooth: true,
			lineStyle: {
				width: 0,
			},
			// showSymbol: false,
			areaStyle: {
				opacity: 0.5,
				color: "rgb(77, 119, 255)",
				// color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				//   {
				//     offset: 0,
				//     color: "rgb(0, 221, 255)",
				//   },
				//   {
				//     offset: 1,
				//     color: "rgb(77, 119, 255)",
				//   },
				// ]),
			},
			emphasis: {
				focus: "series",
			},
			data: data,
		},
		{
			name: "日访问量",
			type: "line",
			// stack: "Total",
			smooth: true,
			lineStyle: {
				width: 0,
			},
			// showSymbol: false,
			areaStyle: {
				opacity: 0.5,
				color: "rgb(128, 255, 165)",
				// color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				//   {
				//     offset: 0,
				//     color: "rgb(128, 255, 165)",
				//   },
				//   {
				//     offset: 1,
				//     color: "rgb(1, 191, 236)",
				//   },
				// ]),
			},
			emphasis: {
				focus: "series",
			},
			data: data,
		},
	],
};
const getLineData = async () => {
	const { data, code } = await getLineDataApi();
	console.log(code, data);

	if (code == 1) {
		console.log(data);
		option.series![0].data = data.week;
		option.series![1].data = data.day;
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
	getLineData();
	chartDom.value = document.getElementById("echarts-trend")!;
	myChart.value = echarts.init(chartDom.value);
	myChart.value.setOption(option);
	resizeObserver.value = new ResizeObserver((entries) => {
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
		id="echarts-trend"
		class="w-full h-105"
	></div>
</template>
