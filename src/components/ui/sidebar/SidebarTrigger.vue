<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { PanelLeft } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { useSidebar } from "./utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
}>();

const { toggleSidebar } = useSidebar();
</script>

<template>
	<PanelLeft
		data-sidebar="trigger"
		data-slot="sidebar-trigger"
		variant="ghost"
		:class="
			cn(
				'size-5 mr-5 cursor-pointer text-[#737373] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
				props.class
			)
		"
		@click="toggleSidebar"
	/>
</template>
