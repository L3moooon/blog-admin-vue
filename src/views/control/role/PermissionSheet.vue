<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";
import { getPermissionList, assignPermission } from "@/api/control/role";
import type { PermissionTreeItem } from "./type";
import PermissionTree from "./PermissionTree.vue";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Role } from "@/api/control/role/type";
const permissionDialogVisible = defineModel({ type: Boolean, default: false });
const props = withDefaults(
	defineProps<{
		data: Role;
	}>(),
	{}
);
const emits = defineEmits(["update:list"]);
const selectedPermissions = ref<Set<number>>(
	new Set(props.data?.permission_ids)
);
const permissionList = ref<Array<PermissionTreeItem>>([]);

//获取权限列表
const getPermission = async () => {
	const { data, status } = await getPermissionList();
	if (status == 1) {
		permissionList.value = buildTree(data);
		console.log(permissionList.value);
	}
	//将权限列表转换为树形结构
	function buildTree(data, parentId = 0) {
		const tree = [];
		// 筛选出当前父节点下的所有子节点
		data.forEach((item) => {
			if (item.parent_id === parentId) {
				// 递归查找子节点的子节点
				const children = buildTree(data, item.id);
				if (children.length > 0) {
					item.children = children;
				}
				tree.push(item);
			}
		});
		return tree;
	}
};

//确认分配权限
const handlePermissionChange = async () => {
	const checkArr = Array.from(selectedPermissions.value);
	console.log(checkArr);
	const { code } = await assignPermission({
		id: props.data.id,
		permission_ids: checkArr,
	});
	if (code == 1) {
		toast.success("权限分配成功");
		emits("update:list");
		permissionDialogVisible.value = false;
	}
};

onMounted(() => {
	getPermission();
});
</script>

<template>
	<Sheet v-model:open="permissionDialogVisible">
		<SheetContent>
			<SheetHeader>
				<SheetTitle class="!p-4">权限分配</SheetTitle>
				<Separator />
				<SheetDescription>
					<ScrollArea class="h-185 py-5">
						<PermissionTree
							v-model="selectedPermissions"
							:tree="permissionList" />
					</ScrollArea>
				</SheetDescription>
				<Separator />
				<div class="flex justify-end gap-5 mt-3">
					<Button
						variant="outline"
						@click="permissionDialogVisible = false">
						取消
					</Button>
					<Button @click="handlePermissionChange">保存</Button>
				</div>
			</SheetHeader>
		</SheetContent>
	</Sheet>
</template>
