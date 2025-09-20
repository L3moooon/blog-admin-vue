<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import * as echarts from "echarts";
// 引入中国地图GeoJSON（确保路径正确，若为省市级地图需替换对应JSON）
import chinaGeo from "@/assets/geo/china.json";
type EChartsOption = echarts.EChartsOption;

// 1. 避免强制非空断言，初始值设为null
const chartDom = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const myChart = shallowRef<echarts.ECharts | null>(null);

// 2. 修复：使用中国地图配置，替换为中国省份数据（示例用模拟数据，可替换为真实数据）
const chinaProvinceData = [
  { name: "河北省", value: 2184.3 },
  { name: "湖北省", value: 2487.1 },
  { name: "山东省", value: 12601.2 },
  { name: "四川省", value: 8505.4 },
  { name: "黑龙江省", value: 6577.0 },
  { name: "吉林省", value: 10162.8 },
];

// 3. 修复：删除未定义的projection，使用ECharts默认投影
const option: EChartsOption = {
  tooltip: {
    trigger: "item",
    showDelay: 0,
    transitionDuration: 0.2,
    // formatter: ({ name, value }) => `${name}: ${value}（单位：万人）`, // 自定义提示内容
  },

  visualMap: {
    left: "left",
    min: 100, // 修正数值范围（匹配中国省份数据量级）
    max: 13000,
    inRange: {
      color: ["#eff6fc", "#71afe5", "#004578"], // 调整渐变色（更易区分）
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
      left: "27%",
      top: "0%",
      right: "27%",
      bottom: "0%",
      zoom: 1.5, // 放大到1.2倍（比默认更大）
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
          areaColor: "#dcdde1",
          borderColor: "#576574",
        }, // 高亮时区域色
      },
      data: chinaProvinceData, // 中国省份数据
    },
  ],
};

onMounted(() => {
  // 4. 安全获取容器：避免强制断言，判断存在后再初始化
  chartDom.value = document.getElementById("echarts-month");
  if (!chartDom.value) return;

  // 初始化ECharts实例
  myChart.value = echarts.init(chartDom.value);
  echarts.registerMap("china", chinaGeo);

  console.log(myChart.value);

  // 设置配置项（确保实例存在）
  myChart.value.setOption(option);

  // 5. 监听容器尺寸变化（适配响应式）
  resizeObserver.value = new ResizeObserver((entries) => {
    if (myChart.value) {
      myChart.value.resize(); // 容器尺寸变化时重绘
    }
  });
  resizeObserver.value.observe(chartDom.value);

  // 额外：监听窗口resize（应对浏览器窗口缩放）
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // 6. 资源清理：避免内存泄漏
  if (resizeObserver.value && chartDom.value) {
    resizeObserver.value.unobserve(chartDom.value);
  }
  if (myChart.value) {
    myChart.value.dispose(); // 销毁ECharts实例
  }
  // 移除窗口resize监听
  window.removeEventListener("resize", handleResize);
});

// 辅助函数：处理窗口缩放
const handleResize = () => {
  if (myChart.value) {
    myChart.value.resize();
  }
};
</script>

<template>
  <div
    id="echarts-month"
    class="w-full h-[600px]"></div>
</template>
