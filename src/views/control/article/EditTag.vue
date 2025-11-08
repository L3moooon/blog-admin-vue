<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { X } from "lucide-vue-next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ref, onMounted, watch } from "vue";
import { toast } from "vue-sonner";
import {
	addTag as addTagApi,
	delTag as delTagApi,
} from "@/api/control/article";
import type { TagItem } from "@/api/control/article/type";
const props = withDefaults(
	defineProps<{
		tagList: Array<TagItem>;
	}>(),
	{ tagList: () => [] }
);
const emits = defineEmits(["update:tagList"]);
const tagInput = ref<string>("");
const tagColor = ref<string>("#222222");
const showTagDialog = defineModel<boolean>("showTagDialog");
const addTag = async () => {
	console.log(tagInput.value);
	const tagValue = tagInput.value?.trim();
	// 验证输入
	if (!tagValue) {
		toast.warning("请输入标签名");
		return;
	}
	const { code } = await addTagApi({ name: tagValue });
	if (code == 1) {
		emits("update:tagList");
		tagInput.value = "";
		toast.success("添加成功");
	} else {
		toast.error("添加失败");
	}
};
const delTag = async (id: number) => {
	console.log(id);
	const { code } = await delTagApi(id);
	if (code == 1) {
		toast.success("删除成功");
		emits("update:tagList");
	} else {
		toast.error("删除失败");
	}
};
onMounted(() => {
	console.log(props.tagList);
});
</script>

<template>
	<Dialog v-model:open="showTagDialog">
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>标签管理</DialogTitle>
				<DialogDescription>
					请输入标签名和颜色，按下回车添加
				</DialogDescription>
			</DialogHeader>
			<Input
				type="email"
				v-model="tagInput"
				@keydown.enter="addTag"
				placeholder="添加标签"
			/>
			<div
				class="flex center items-center"
				@click="handlePickColor"
			>
				<div :class="[`bg-[${tagColor}]`, 'w-8', 'h-8']"></div>
				<!-- <input
					type="color"
					v-model="tagColor"
					id="colorPicker"
					class="w-8 h-8 rounded-full cursor-pointer"
					value="#ff0000"
				/> -->
				{{ tagColor }}
			</div>

			<div class="w-full border rounded-sm inline-flex gap-2 flex-wrap p-2">
				<div
					v-for="item in tagList"
					class="h-8 border rounded-sm px-2 flex items-center text-sm"
					:class="`bg-[${item.color}]`"
				>
					{{ item.tag_name }}
					<X
						class="w-4 text-red-500 ml-2 cursor-pointer"
						@click="delTag(item.id)"
					></X>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</template>
