<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;

const option: EChartsOption = {
  color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
  // title: {
  //   text: "Gradient Stacked Area Chart",
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
      name: "时间",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "Line 1",
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
      data: [140, 232, 101, 264, 90, 340, 250],
    },
    {
      name: "Line 2",
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
      data: [120, 282, 111, 234, 220, 340, 310],
    },
  ],
};
onMounted(() => {
  const chartDom = document.getElementById("echarts-trend")!;
  let myChart = echarts.init(chartDom);
  myChart = echarts.init(chartDom);
  myChart.setOption(option);

  // 监听容器自身尺寸变化
  const resizeObserver = new ResizeObserver((entries) => {
    // 容器尺寸变化时触发
    if (myChart) {
      myChart.resize();
    }
  });
  // 监听图表容器
  resizeObserver.observe(chartDom);
  onUnmounted(() => {
    // 清理监听
    if (resizeObserver) {
      const chartDom = document.getElementById("echarts-trend");
      if (chartDom) resizeObserver.unobserve(chartDom);
    }
    if (myChart) {
      myChart.dispose();
      myChart = null;
    }
  });
});
</script>
<template>
  <div
    id="echarts-trend"
    class="w-full h-105"></div>
</template>
