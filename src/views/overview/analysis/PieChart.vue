<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;

const chartDom = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const myChart = shallowRef<echarts.ECharts | null>(null);

const option: EChartsOption = {
  legend: {
    top: "bottom",
  },
  // toolbox: {
  //   show: true,
  //   feature: {
  //     mark: { show: true },
  //     dataView: { show: true, readOnly: false },
  //     restore: { show: true },
  //     saveAsImage: { show: true },
  //   },
  // },
  series: [
    {
      name: "Nightingale Chart",
      type: "pie",
      radius: [50, 250],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 8,
      },
      data: [
        { value: 40, name: "rose 1" },
        { value: 38, name: "rose 2" },
        { value: 32, name: "rose 3" },
        { value: 30, name: "rose 4" },
        { value: 28, name: "rose 5" },
        { value: 26, name: "rose 6" },
        { value: 22, name: "rose 7" },
        { value: 18, name: "rose 8" },
      ],
    },
  ],
};
onMounted(() => {
  chartDom.value = document.getElementById("echarts-pie1")!;
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
    id="echarts-pie1"
    class="w-1/3 h-105"></div>
</template>
