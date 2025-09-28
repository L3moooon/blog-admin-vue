<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import { getGeoData as getGeoDataApi } from "@/api/overview/analysis";
import type { GeoDataItem } from "@/api/overview/analysis/type";
import * as echarts from "echarts";
import chinaGeo from "@/assets/geo/china.json";
type EChartsOption = echarts.EChartsOption;

const containerDom = ref<HTMLElement | null>(null);
const chartDom = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const myChart = shallowRef<echarts.ECharts | null>(null);

const viewGeoData = ref<Array<GeoDataItem>>([]);

const option = ref<EChartsOption>({
  title: {
    text: "访客地图",
    textAlign: "center",
    // textStyle: {
    //   width: "100%",
    // },
  },
  aspectRatio: 1.6,
  tooltip: {
    trigger: "item",
    showDelay: 0,
    transitionDuration: 0.2,
    // formatter: ({ name, value }) => `${name}: ${value}（单位：万人）`, // 自定义提示内容
  },
  visualMap: {
    left: "left",
    // min: 0,
    // max: 100,
    inRange: {
      // color: ["#eff6fc", "#71afe5", "#004578"], // 调整渐变色
      color: ["#e2a2ac", "#dd6b7b", "#c25160", "#b81a35"], // 调整渐变色
    },
    // text: ["高值", "低值"],
    calculable: true,
  },
  series: [
    {
      name: "访客数量",
      type: "map",
      map: "china",
      // roam: true, // 新增：允许缩放/拖拽地图
      left: "20%",
      top: "-12%",
      right: "20%",
      bottom: "0%",
      zoom: 1.2, // 放大
      // 若地图位置因缩放偏移，可配合 center 调整中心坐标
      center: [105, 38], // 以经度105、纬度38为中心（中国大致中心）
      label: {
        show: true,
        // color: "#000", // 文字颜色
        // fontSize: 12, // 文字大小
        // fontWeight: "bold", // 文字加粗
        // formatter: "{b}", // 显示省份名称
      },
      emphasis: {
        label: { show: true, color: "#222" }, // 高亮时文字设为白色
        itemStyle: {
          areaColor: "#bed2bb",
          borderColor: "#e94829 ",
        }, // 高亮时区域色
      },
      data: viewGeoData.value, // 数据
    },
  ],
});
const getGeoData = async () => {
  const { data, code } = await getGeoDataApi();
  if (code) {
    // viewGeoData.value = data;
    console.log(data);
    option.value.series![0].data = data;
    console.log(option.value);
    setChartOption();
  }
};
const setChartOption = () => {
  if (myChart.value) {
    myChart.value.setOption(option.value);
  }
};

onMounted(() => {
  getGeoData();
  containerDom.value = document.getElementById("map-container");
  chartDom.value = document.getElementById("echarts-map");
  if (!chartDom.value) return;
  // 初始化ECharts实例
  myChart.value = echarts.init(chartDom.value);
  echarts.registerMap("china", chinaGeo);
  // 设置配置项（确保实例存在）
  setChartOption();
  // 监听容器尺寸变化（适配响应式）
  resizeObserver.value = new ResizeObserver((entries) => {
    if (myChart.value) {
      myChart.value.resize(); // 容器尺寸变化时重绘
      if (containerDom.value && chartDom.value) {
        containerDom.value.style.height =
          chartDom.value.getBoundingClientRect().height + "px";
      }
    }
  });
  resizeObserver.value.observe(chartDom.value);
});

onUnmounted(() => {
  if (resizeObserver.value && chartDom.value) {
    resizeObserver.value.unobserve(chartDom.value);
  }
  if (myChart.value) {
    myChart.value.dispose(); // 销毁ECharts实例
  }
});
</script>

<template>
  <div
    id="map-container"
    class="w-full overflow-hidden">
    <div class="aspect-[5/3] w-full">
      <div
        id="echarts-map"
        class="w-full h-8/10"></div>
    </div>
  </div>
</template>
