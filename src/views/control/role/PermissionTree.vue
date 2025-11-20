<script setup lang="ts">
import { watchEffect, ref, computed, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { PermissionTreeItem } from "./type";
import PermissionTree from "./PermissionTree.vue";
const selectedPermissions = defineModel({
	type: Set<number>,
	default: new Set(),
});
const props = withDefaults(
	defineProps<{ tree: Array<PermissionTreeItem> }>(),
	{}
);
const togglePermission = (id: number, isChecked: boolean, item: any) => {
	if (isChecked) {
		selectedPermissions.value.add(id);
	} else {
		selectedPermissions.value.delete(id);
	}
	console.log(item);
	// if (item.children?.length) {
	// 	item.children.forEach((child: any) => {
	// 		if (item.permission_type == child.permission_type ) {
	// 			togglePermission(child.id, isChecked, child);
	// 		}
	// 	});
	// }

	// if (item.parent_id !== 0) {
	// 	const parentItem = findParent(item.parent_id);
	// 	if (parentItem) {
	// 		const childIds = parentItem.children.map((c: any) => c.id);
	// 		const checkedChildCount = Array.from(selectedPermissions.value).filter(
	// 			(p) => childIds.includes(p)
	// 		).length;
	// 		if (checkedChildCount === 0) {
	// 			selectedPermissions.value.delete(parentItem.id);
	// 		} else if (checkedChildCount === childIds.length) {
	// 			selectedPermissions.value.add(parentItem.id);
	// 		}
	// 	}
	// }
	console.log(selectedPermissions.value);
};
const findParent = (parentId: number): any => {
	const find = (list: any[]): any => {
		for (const item of list) {
			if (item.id === parentId) return item;
			if (item.children?.length) {
				const res = find(item.children);
				if (res) return res;
			}
		}
		return null;
	};
	return find(props.tree);
};

// const getCheckStatus = (item: any): boolean | "indeterminate" | undefined => {
// 	const isChecked = selectedPermissions.value.has(item.id);
// 	// console.log("检查勾选状态", item, isChecked);
// 	if (!item.children?.length) {
// 		return isChecked;
// 	}
// 	const childIds = item.children.map((c: any) => c.id);
// 	const checkedChildCount = Array.from(selectedPermissions.value).filter((p) =>
// 		childIds.includes(p)
// 	).length;
// 	if (checkedChildCount === childIds.length) return true;
// 	if (checkedChildCount > 0) return "indeterminate";
// 	return false;
// };
// watch(
// 	() => selectedPermissions.value,
// 	(val) => {
// 		console.log(val);
// 	}
// );
const computedTree = computed(() => {
	const _tree = props.tree;
	_tree.forEach((v) => {
		const isChecked = selectedPermissions.value.has(v.id);
		v.checked = isChecked;
	});
	return _tree;
});
</script>
<template>
	<div
		v-for="item in computedTree"
		:key="item.id">
		<div
			class="flex items-center gap-2 mb-2"
			@click="
				togglePermission(item.id, !selectedPermissions.has(item.id), item)
			">
			<Checkbox v-model="item.checked" />
			<Label class="cursor-pointer">
				{{ item.permission_name }}
				—
				<span v-if="item.parent_id == 0"> 菜单权限：</span>
				<span v-else>
					<span v-if="item.permission_type == 1">路由权限</span>
					<span v-else-if="item.permission_type == 2">组件权限</span>
					<span v-else>按钮权限</span>
				</span>
			</Label>
		</div>
		<!-- 渲染子节点 -->
		<div
			class="ml-6 mt-1"
			v-if="item.children">
			<PermissionTree
				v-model="selectedPermissions"
				:tree="item.children" />
		</div>
	</div>
</template>
