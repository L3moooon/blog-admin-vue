<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import {
	getAdminList,
	// changeUserStatus,
	// deleteUser,
} from "@/api/control/user/index";
import type { UserItem, PaginationData } from "@/api/control/user/type";
import MyTable from "@/components/MyTable.vue";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "vue-sonner";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
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
import { debounce } from "lodash";

// 响应式数据
const userData = ref<UserItem[]>([]);
const searchKey = ref("");
const showRoleDialog = ref(false);
const currentUser = ref<Partial<UserItem>>({});
// 分页信息
const pagination_info = reactive<PaginationData>({
	pageNo: 1,
	pageSize: 10,
	total: 0,
});

// 表格列配置
const columns = [
	{
		prop: "account_id",
		label: "ID",
		width: 80,
	},
	{
		prop: "account",
		label: "账号",
	},
	{
		prop: "name",
		label: "昵称",
	},
	{
		prop: "avatar",
		label: "头像",
	},
	{
		prop: "ip",
		label: "IP地址",
	},
	{
		prop: "location",
		label: "归属地",
	},
	{
		prop: "create_time",
		label: "创建时间",
		sortable: true,
	},
	{
		prop: "last_login_time",
		label: "最后登录时间",
		sortable: true,
	},
	{
		prop: "role_names",
		label: "角色",
	},
	{
		prop: "actions",
		label: "操作",
		width: 280,
		minWidth: 280,
		fixed: "right",
	},
];

// 获取用户列表
const getList = async () => {
	const params = {
		pageNo: pagination_info.pageNo,
		pageSize: pagination_info.pageSize,
		searchKey: searchKey.value,
	};

	const { code, data, pagination } = await getAdminList(params);
	if (code == 1) {
		userData.value = data;
		Object.assign(pagination_info, pagination);
	}
};

// 改变用户状态（启用/禁用）
const handleChangeStatus = async (row: UserItem) => {
	const newStatus = row.status ? 0 : 1;
	const { status } = await changeUserStatus({
		id: row.id,
		status: newStatus,
	});

	if (status === 1) {
		row.status = newStatus;
		toast.success(`用户已${newStatus ? "启用" : "禁用"}`);
	} else {
		// 失败时恢复状态
		row.status = !newStatus;
		toast.error(`操作失败`);
	}
};

// 角色分配
const handleRoleAssignment = (row: UserItem) => {
	currentUser.value = row;
	showRoleDialog.value = true;
};

// 删除用户
const handleDelete = async (id: number) => {
	const { status } = await deleteUser({ id });
	if (status === 1) {
		toast.success("删除成功");
		getList();
	} else {
		toast.error("删除失败");
	}
};

// 初始化加载
onMounted(() => {
	getList();
});
</script>
<template>
	<div>
		<div class="px-5 py-4 border-b">
			<div class="flex">
				<div class="text-xl font-200">用户管理</div>
				<div class="text-sm text-gray-500 ml-2 mt-1.5">
					本页用于管理后台所有注册账号
				</div>
			</div>
		</div>
		<div class="px-5 py-4">
			<MyTable
				:data="userData"
				:columns="columns"
				align-center>
				<template #cell-location="{ value }">
					<span v-if="value"> {{ value.province }}-{{ value.city }} </span>
					<span v-else>未知</span>
				</template>
				<template #cell-role_names="{ value }">
					<div>
						<div v-for="item in value">{{ item }}</div>
					</div>
				</template>
				<template #cell-create_time="{ value }">
					<span v-time="value"></span>
				</template>
				<template #cell-last_login_time="{ value }">
					<span v-time="value"></span>
				</template>
				<template #cell-actions="{ row }">
					<div class="flex items-center gap-3">
						<div class="flex items-center gap-2">
							<Label :class="row.status ? 'text-green-600' : 'text-red-500'">
								{{ row.status ? "启用" : "禁用" }}
							</Label>
							<Switch
								v-btn="['user_change_status']"
								class="cursor-pointer"
								:model-value="row.status"
								@update:model-value="handleChangeStatus(row)">
							</Switch>
						</div>

						<button
							v-btn="['user_assign_role']"
							class="text-blue-600 hover:text-blue-800 cursor-pointer text-sm"
							@click="handleRoleAssignment(row)">
							角色分配
						</button>

						<AlertDialog>
							<AlertDialogTrigger
								v-btn="['user_delete']"
								class="text-red-500 hover:text-red-700 cursor-pointer text-sm">
								删除
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>删除用户</AlertDialogTitle>
									<AlertDialogDescription>
										删除操作无法撤销，确认删除用户：{{ row.account }}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>取消</AlertDialogCancel>
									<AlertDialogAction @click="handleDelete(row.id)">
										确认
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</template>
			</MyTable>
			<Pagination
				class="mt-2"
				v-slot="{ page }"
				v-model:page="pagination_info.pageNo"
				:items-per-page="pagination_info.pageSize"
				:total="pagination_info.total"
				showEdges
				:default-page="1">
				<PaginationContent v-slot="{ items }">
					<PaginationPrevious />
					<template
						v-for="(item, index) in items"
						:key="index">
						<PaginationItem
							v-if="item.type === 'page'"
							:value="item.value"
							:is-active="item.value === page">
							{{ item.value }}
						</PaginationItem>
						<PaginationEllipsis
							v-else
							:key="item.type"
							:index="index">
							&#8230;
						</PaginationEllipsis>
					</template>
					<PaginationNext />
				</PaginationContent>
			</Pagination>
		</div>
	</div>
</template>
