<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;

const chartDom = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const myChart = shallowRef<echarts.ECharts | null>(null);

const option: EChartsOption = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
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
      data: [
        120,
        {
          value: 200,
          itemStyle: {
            color: "#505372",
          },
        },
        150,
        80,
        70,
        110,
        130,
      ],
      type: "bar",
      coordinateSystem: "cartesian2d", // 显式指定坐标系
    },
  ],
};
onMounted(() => {
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
    class="w-full h-105"></div>
</template>
