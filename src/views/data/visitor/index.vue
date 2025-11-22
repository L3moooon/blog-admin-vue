<script setup lang="ts">
import MyTable from "@/components/MyTable.vue";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { onMounted, ref, reactive, watch } from "vue";
import { getVisitorList as getVisitorListApi } from "@/api/data/visitor";
const userData = ref();
const customColumns = [
	{
		prop: "id",
		label: "id",
	},
	{
		prop: "identify",
		label: "浏览器指纹",
	},
	{
		prop: "name",
		label: "昵称",
	},
	{
		prop: "ip",
		label: "ip",
	},
	{
		prop: "location",
		label: "归属地",
	},
	{
		prop: "agent",
		label: "登录设备",
	},
	{
		prop: "create_time",
		label: "创建时间",
	},
	{
		prop: "last_login_time",
		label: "最后登录时间",
	},
	{
		prop: "visited_count",
		label: "访问次数",
	},
];
const pagination_info = reactive({
	pageNo: 1,
	pageSize: 10,
	total: 0,
});
// 监听页码变化，自动请求对应页数据
watch(
	() => pagination_info.pageNo, // 监听 pageNo 的变化
	(newPage) => {
		getVisitorList(); // 页码变了，重新拉取数据
	}
);

const visitedCountColor = (value: number) => {
	if (value < 3) {
		return "bg-green-600/50";
	} else if (value >= 3 && value < 5) {
		return "bg-yellow-600/50";
	} else {
		return "bg-red-600/50";
	}
};
const getVisitorList = async () => {
	console.log(userData.value);
	const { data, code, pagination } = await getVisitorListApi({
		dateRange: [],
		searchKey: "",
		pageNo: pagination_info.pageNo,
		pageSize: pagination_info.pageSize,
	});
	if (code == 1) {
		console.log(data);
		userData.value = data;
		console.log(pagination);
		Object.assign(pagination_info, pagination);
		console.log(pagination_info);
	}
};
onMounted(() => {
	getVisitorList();
});
</script>
<template>
	<div>
		<div class="px-5 py-4 border-b">
			<div class="flex">
				<div class="text-xl font-200">访客列表</div>
				<div class="text-sm text-gray-500 ml-2 mt-1.5">
					本页用于查看前台访客信息
				</div>
			</div>
		</div>
		<div class="!p-5">
			<MyTable
				:data="userData"
				:columns="customColumns"
				align-center
				show-overflow-tooltip>
				<template #cell-location="{ row }">
					<div v-if="row.address">
						<span v-if="row.address.country == '中国'">
							{{ row.address.province }}{{ row.address.city }}
						</span>
						<span v-else>
							{{ row.address.country }}
						</span>
					</div>
				</template>
				<template #cell-create_time="{ value }">
					<span v-time="value"> </span>
				</template>
				<template #cell-last_login_time="{ value }">
					<span v-time="value"> </span>
				</template>
				<template #cell-visited_count="{ value }">
					<div
						:class="[
            visitedCountColor(value as number),
            'w-10',
            'rounded-md',
            'flex',
            'justify-center',
          ]">
						{{ value }}
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
					</template>
					<PaginationEllipsis :index="10" />
					<PaginationNext />
				</PaginationContent>
			</Pagination>
		</div>
	</div>
</template>
