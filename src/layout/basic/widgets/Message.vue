<script setup lang="ts">
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-vue-next";
</script>

<template>
	<Popover>
		<PopoverTrigger>
			<Bell
				class="size-6 cursor-pointer text-[#737373] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
			/>
		</PopoverTrigger>
		<PopoverContent>Place content for the popover here.</PopoverContent>
	</Popover>
</template>
