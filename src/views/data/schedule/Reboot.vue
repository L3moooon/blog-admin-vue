<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import MyTable from "@/components/MyTable.vue";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "vue-sonner";
import { getRebootLog as getRebootLogApi } from "@/api/data/schedule/index";
import type { RebootLogItem } from "@/api/data/schedule/type";
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
		prop: "action",
		label: "动作",
	},
	{
		prop: "status",
		label: "状态",
	},
	{
		prop: "message",
		label: "消息",
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
const rebootData = ref<Array<RebootLogItem>>([]);

const getColor = (value: string) => {
	if (value == "成功") {
		return "#7fd29e"; // 50以下绿色
	} else if (value == "执行中") {
		return "#e7c37f"; // 50-75黄色
	} else {
		return "#f37f84"; // 75-100红色（注意这里修正了原描述的笔误，应该是75-100）
	}
};
watch(
	() => pagination_info.pageNo,
	() => {
		getRebootLog();
	}
);

// 获取用户列表
const getRebootLog = async () => {
	const params = {
		pageNo: pagination_info.pageNo,
		pageSize: pagination_info.pageSize,
	};
	const { code, data, pagination } = await getRebootLogApi(params);
	if (code == 1) {
		rebootData.value = data;
		Object.assign(pagination_info, pagination);
	}
};

// 初始化加载
onMounted(() => {
	getRebootLog();
});
</script>
<template>
	<div class="py-4">
		<MyTable
			:data="rebootData"
			:columns="columns"
			align-center
			show-overflow-tooltip>
			<template #cell-status="{ value }">
				<div
					class="px-2 rounded-md"
					:style="{backgroundColor: getColor(value as string),}">
					{{ value }}
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
