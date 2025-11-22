<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import MyTable from "@/components/MyTable.vue";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "vue-sonner";
import {
	getBackupLog,
	getRebootLog,
	getStatusLog as getStatusLogApi,
} from "@/api/data/schedule/index";
import type { StatusLogItem } from "@/api/data/schedule/type";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

// 分页信息
const pagination_info = reactive({
	pageNo: 1,
	pageSize: 10,
	total: 0,
});
// 表格列配置
const columns = [
	{
		prop: "id",
		label: "ID",
		width: 80,
	},
	{
		prop: "cpu_usage",
		label: "CPU使用率",
	},
	{
		prop: "mem_usage",
		label: "内存占用率",
	},
	{
		prop: "disk_usage",
		label: "磁盘使用率",
	},
	{
		prop: "network_status",
		label: "网络使用率",
		sortable: true,
	},
	{
		prop: "time",
		label: "记录时间",
		sortable: true,
	},
	{
		prop: "actions",
		label: "操作",
		width: 280,
		minWidth: 280,
		fixed: "right",
	},
];
// 响应式数据
const statusData = ref<Array<StatusLogItem>>([]);
watch(
	() => pagination_info.pageNo,
	() => {
		getStatusLog();
	}
);
const getProgressColor = (value: number) => {
	if (value < 50) {
		return "#7fd29e"; // 50以下绿色
	} else if (value < 75) {
		return "#e7c37f"; // 50-75黄色
	} else {
		return "#f37f84"; // 75-100红色（注意这里修正了原描述的笔误，应该是75-100）
	}
};
// 获取用户列表
const getStatusLog = async () => {
	const params = {
		pageNo: pagination_info.pageNo,
		pageSize: pagination_info.pageSize,
	};
	const { code, data, pagination } = await getStatusLogApi(params);
	if (code == 1) {
		statusData.value = data;
		Object.assign(pagination_info, pagination);
	}
};
// 初始化加载
onMounted(() => {
	getStatusLog();
});
</script>
<template>
	<div class="py-4">
		<MyTable
			:data="statusData"
			:columns="columns"
			align-center>
			<template #cell-cpu_usage="{ value }">
				<div class="w-40 bg-gray-200 rounded-md h-4 relative overflow-hidden">
					<div
						class="h-full rounded-md transition-all"
						:style="{
							width: `${value}%`, // 宽度等于CPU使用率百分比
							backgroundColor: getProgressColor(value as number),
						}"></div>
					<span
						class="absolute inset-0 flex items-center justify-center text-sm font-medium">
						{{ value }}%
					</span>
				</div>
			</template>
			<template #cell-mem_usage="{ value }">
				<div class="w-40 bg-gray-200 rounded-md h-4 relative">
					<div
						class="h-full rounded-md transition-all"
						:style="{
							width: `${value}%`, // 宽度等于CPU使用率百分比
							backgroundColor: getProgressColor(value as number),
						}"></div>
					<span
						class="absolute inset-0 flex items-center justify-center text-sm font-medium">
						{{ value }}%
					</span>
				</div>
			</template>
			<template #cell-disk_usage="{ value }">
				<div class="w-40 bg-gray-200 rounded-md h-4 relative">
					<div
						class="h-full rounded-md transition-all"
						:style="{
							width: `${value}%`, // 宽度等于CPU使用率百分比
							backgroundColor: getProgressColor(value as number),
						}"></div>
					<span
						class="absolute inset-0 flex items-center justify-center text-sm font-medium">
						{{ value }}%
					</span>
				</div>
			</template>
			<template #cell-network_status="{ value }">
				<div class="w-40 bg-gray-200 rounded-md h-4 relative overflow-hidden">
					<div
						class="h-full rounded-md transition-all"
						:style="{
							width: `${value}%`, // 宽度等于CPU使用率百分比
							backgroundColor: getProgressColor(value as number),
						}"></div>
					<span
						class="absolute inset-0 flex items-center justify-center text-sm font-medium">
						{{ value }}%
					</span>
				</div>
			</template>
			<template #cell-time="{ value }">
				<span v-time="value"></span>
			</template>

			<template #cell-actions="{ row }">
				<div class="flex items-center gap-3"></div>
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
</template>
