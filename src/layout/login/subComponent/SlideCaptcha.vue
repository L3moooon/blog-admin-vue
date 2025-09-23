<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ChevronsRight, Check } from "lucide-vue-next";

const containerRef = ref<HTMLElement | null>(null);
const btnRef = ref<HTMLElement | null>(null);
const progress = ref(0);
const maxProgress = ref(100);
const isDragging = ref(false);
const isVerified = ref(false);
let startX = 0;
let initialProgress = 0;
const startDrag = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  startX =
    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  initialProgress = progress.value;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
};
const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  const currentX =
    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const deltaX = currentX - startX;
  console.log(btnRef.value?.offsetWidth, containerRef.value?.offsetWidth);
  const newProgress =
    initialProgress + (deltaX / containerRef.value?.offsetWidth) * 100;
  progress.value = Math.min(maxProgress.value, Math.max(0, newProgress));
  if (progress.value >= maxProgress.value - 5) {
    stopDrag();
  }
};
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
  if (progress.value < maxProgress.value - 5) {
    progress.value = 0; // 未完成时重置
  } else {
    isVerified.value = true;
    progress.value = maxProgress.value; // 完成时锁定在最大值
  }
};

const getWidth = () => {
  containerRef.value = document.getElementById("slide-captcha-container");
  btnRef.value = document.getElementById("slide-handle");
  maxProgress.value =
    (((containerRef.value?.offsetWidth || 1) -
      (btnRef.value?.offsetWidth || 1)) /
      (containerRef.value?.offsetWidth || 1)) *
    100;
  if (isVerified.value) {
    progress.value = maxProgress.value;
  }
};
onMounted(() => {
  getWidth();
  window.addEventListener("resize", getWidth);
});
onUnmounted(() => {
  window.removeEventListener("resize", getWidth);
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
});
</script>

<template>
  <div>
    <div
      id="slide-captcha-container"
      class="w-full h-10 bg-gray-200 border rounded-sm relative flex items-center justify-center overflow-hidden">
      <span class="text-sm font-medium text-gray-700 select-none">
        请按住滑块，拖动到最右边
      </span>
      <div
        class="absolute top-0 left-0 h-full bg-green-400 rounded-l-sm flex items-center justify-center"
        :class="{ 'transition-all duration-300': !isDragging && !isVerified }"
        :style="{ width: `${progress}%` }">
        <div
          v-if="isVerified"
          class="text-sm font-medium text-white select-none ml-10">
          验证通过
        </div>
        <!-- 滑块 -->
        <div
          id="slide-handle"
          class="absolute -right-10 h-full w-10 bg-white border rounded-sm cursor-pointer flex items-center justify-center"
          :class="isVerified || isDragging ? 'rounded-r-sm rounded-l-none' : ''"
          @mousedown="startDrag"
          @touchstart="startDrag">
          <ChevronsRight v-if="!isVerified" />
          <Check
            v-else
            class="text-green-500" />
        </div>
      </div>
    </div>
  </div>
</template>
