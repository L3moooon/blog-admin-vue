<script setup>
import {
	getRoleList,
	addOrEditRole,
	deleteRole,
	getPermissionList,
	assignPermission,
} from "@/api/control/role";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const permissionDialogVisible = defineModel({ type: Boolean, default: false });
//新增或编辑角色
const handleConfirmEdit = async () => {
	const { status } = await addOrEditRole({
		id: addForm.id,
		role_name: addForm.roleName,
		role_code: addForm.roleCode,
		description: addForm.roleDesc,
	});
	if (status == 1) {
		toast.success("操作成功");
		getRole();
		roleDialog.value = false;
	}
};
</script>

<template>
	<Dialog v-model:open="permissionDialogVisible">
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>创建角色</DialogTitle>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="name"
						class="text-right">
						角色名称
					</Label>
					<Input
						id="name"
						value="Pedro Duarte"
						class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="username"
						class="text-right">
						角色编码
					</Label>
					<Input
						id="username"
						value="@peduarte"
						class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label
						for="name"
						class="text-right">
						角色描述
					</Label>
					<Input
						id="name"
						value="Pedro Duarte"
						class="col-span-3" />
				</div>
			</div>
			<DialogFooter>
				<Button type="submit"> 创建 </Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
