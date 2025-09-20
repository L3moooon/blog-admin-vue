<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    icon: string;
    target: number;
    total: number;
    duration: number;
    decimals: number;
  }>(),
  {
    target: 12345,
    duration: 2000,
    decimals: 0,
  }
);
import { onMounted, ref } from "vue";
const count = ref(0);
const BASE_SCROLL_INTERVAL = 50; //数字跳动时间间隔
const SCROLL_FREQUENCY = Math.ceil(props.duration / BASE_SCROLL_INTERVAL); //数字跳动总次数
onMounted(() => {
  let i = 1;
  const timer = setInterval(() => {
    i++;
    count.value = Math.min(
      props.target,
      count.value + Math.ceil(props.target / (i ** 1.5 + 1))
    );
    if (count.value == props.target) clearInterval(timer);
  }, BASE_SCROLL_INTERVAL);
});
</script>

<template>
  <div class="h-42 rounded-sm border p-5">
    <div class="flex items-center justify-between mb-4">
      <h class="font-semibold text-primary text-lg">{{ title }}</h>
      <slot name="icon"> </slot>
    </div>
    <div class="counter-value">
      <span class="number-scroll-element">{{ count }}</span>
    </div>
    <p class="counter-label">{{ description }}</p>
  </div>
</template>
