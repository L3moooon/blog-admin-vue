<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import {
	getRoleList as getRoleListApi,
	addOrEditRole,
	deleteRole,
} from "@/api/control/role";
import Permission from "./PermissionSheet.vue";
import EditRole from "./EditRoleDialog.vue";
import MyTable from "@/components/MyTable.vue";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Role } from "@/api/control/role/type";
import { toast } from "vue-sonner";
import { UserPlus, KeyRound } from "lucide-vue-next";

const roleList = ref<Array<Role>>([]);
const customColumns = [
	{
		prop: "id",
		label: "id",
	},
	{
		prop: "role_name",
		label: "角色名称",
	},
	{
		prop: "role_code",
		label: "角色编码",
	},
	{
		prop: "description",
		label: "角色描述",
	},
	{
		prop: "create_time",
		label: "创建时间",
	},
	{
		prop: "update_time",
		label: "更新时间",
	},
	{
		prop: "operate",
		label: "操作",
	},
];

const roleDialogVisible = ref(false);
const permissionDialogVisible = ref(false);

const selectRole = ref();

const addForm = reactive({
	id: 0,
	roleName: "",
	roleCode: "",
	roleDesc: "",
});
//分配权限
const handleAssignPermission = async (row: Role) => {
	permissionDialogVisible.value = true;
	selectRole.value = row;
};

//编辑角色
const handleEditRole = (row: Role) => {
	roleDialogVisible.value = true;
	addForm.id = row.id;
	addForm.roleName = row.role_name;
	addForm.roleCode = row.role_code;
	addForm.roleDesc = row.description;
};
//删除角色
const handleConfirmDelete = async (row: Role) => {
	const { status } = await deleteRole({ id: row.id });
	if (status == 1) {
		toast.success("删除成功");
		getRoleList();
	}
};
//获取角色列表
const getRoleList = async () => {
	const { data, code } = await getRoleListApi();
	if (code == 1) {
		roleList.value = data;
		console.log(roleList.value);
	}
};
watch(
	() => permissionDialogVisible.value,
	(val: boolean) => {
		if (!val) {
			selectRole.value = null;
		}
	}
);
onMounted(() => {
	getRoleList();
});
</script>
<template>
	<div>
		<div class="px-5 py-4 border-b">
			<div class="flex">
				<div class="text-xl font-200">角色管理</div>
				<div class="text-sm text-gray-500 ml-2 mt-1.5">
					本页用于管理后台的角色并分配相应权限
				</div>
			</div>
		</div>
		<div class="px-5">
			<div class="flex gap-2 my-4">
				<Button
					v-btn="['role_add']"
					@click="handleEditRole"
					variant="outline"
					class="cursor-pointer">
					<UserPlus />
					创建角色
				</Button>
				<Button
					@click=""
					variant="outline"
					class="cursor-pointer">
					<KeyRound />
					权限表
				</Button>
			</div>
			<MyTable
				:data="roleList"
				:columns="customColumns"
				align-center
				show-overflow-tooltip>
				<template #cell-create_time="{ value }">
					<span v-time="value"></span>
				</template>
				<template #cell-update_time="{ value }">
					<span v-time="value"></span>
				</template>
				<template #cell-operate="{ row }">
					<div class="flex gap-2">
						<Label>启用</Label>
						<Switch
							v-btn="['role_change_status']"
							class="cursor-pointer"
							:model-value="row.status"
							@update:model-value="handleChangeStatus(row)">
						</Switch>
						<div
							v-btn="['role_assign_permission']"
							class="text-blue-600 hover:text-blue-800 cursor-pointer"
							@click="handleAssignPermission(row)">
							分配权限
						</div>
						<AlertDialog>
							<AlertDialogTrigger
								v-btn="['role_delete']"
								class="text-red-400 hover:text-red-500 cursor-pointer">
								删除
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>删除角色</AlertDialogTitle>
									<AlertDialogDescription>
										删除操作无法撤销，确认删除角色：{{ row.role_name }}?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel class="cursor-pointer">
										取消
									</AlertDialogCancel>
									<AlertDialogAction
										class="cursor-pointer"
										@click="handleConfirmDelete(row.id)">
										确认
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</template>
			</MyTable>
			<Permission
				v-if="selectRole"
				v-model="permissionDialogVisible"
				:data="selectRole"
				@update:list="getRoleList" />
			<EditRole
				v-model="roleDialogVisible"
				@update:list="getRoleList" />
		</div>
	</div>
</template>
