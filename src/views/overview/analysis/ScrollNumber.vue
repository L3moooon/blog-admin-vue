<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		title: string;
		target: number;
		total?: number;
		subText?: string;
		subNumber?: number;
		duration?: number;
		decimals?: number;
	}>(),
	{
		target: 0,
		duration: 2000,
		decimals: 0,
	}
);
import { onMounted, ref } from "vue";

function countUp(target, element, duration = 1000) {
	const start = 0;
	const increment = target / (duration / 16); // 16ms ≈ 60帧/秒
	let current = start;

	const timer = setInterval(() => {
		current += increment;
		// 接近目标时直接设置为目标值，避免小数误差
		if (current >= target) {
			current = target;
			clearInterval(timer);
		}
		element.textContent = Math.floor(current); // 取整（或保留小数）
	}, 16);
}

// 调用：2秒内从0滚到1000
countUp(1000, document.getElementById("counter"), 2000);

const count = ref(0);
onMounted(() => {});
</script>

<template>
	<div class="h-32 rounded-sm border p-4">
		<div class="flex items-center justify-between mb-2">
			<h1 class="font-semibold text-primary text-lg">{{ title }}</h1>
			<slot name="icon"> </slot>
		</div>
		<div class="flex justify-between items-center">
			<div class="text-2xl text-bold">{{ count }}</div>
			<div class="text-md text-gray-500">
				<span>{{ subText }}</span>
				<span class="ml-2">{{ subNumber }}</span>
			</div>
		</div>
	</div>
</template>
