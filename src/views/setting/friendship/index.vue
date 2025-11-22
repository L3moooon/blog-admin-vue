<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { getFriendshipList as getFriendshipListApi } from "@/api/setting/friendship";
import type { Friend } from "@/api/setting/friendship/type";
import MyTable from "@/components/MyTable.vue";
import { toast } from "vue-sonner";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

// 1. 响应式数据定义
const friendData = ref<Friend[]>([]); // 评论列表数据
const isLoading = ref(false); // 表格加载状态
const pagination_info = reactive({
	pageNo: 1,
	pageSize: 10,
	total: 0,
});

const columns = [
	{ prop: "id", label: "ID", width: 100, align: "center" },
	{
		prop: "cover",
		label: "网站封面",
		width: 120,
		align: "center",
	},
	{
		prop: "name",
		label: "歌名",
		minWidth: 180,
	},
	{
		prop: "url",
		label: "网站链接",
		width: 100,
		align: "center",
	},
	{
		prop: "introduce",
		label: "网站简介",
		width: 120,
		align: "center",
	},
	{
		prop: "apply_time",
		label: "申请时间",
		width: 120,
		align: "center",
	},
	{
		prop: "pass_time",
		label: "同意时间",
		width: 120,
		align: "center",
	},
	{
		prop: "status",
		label: "申请状态",
		width: 120,
		align: "center",
	},
	{
		prop: "actions",
		label: "操作",
		width: 220,
		minWidth: 220,
		fixed: "right",
		align: "center",
	},
];

//获取音乐列表
const getFriendshipList = async () => {
	try {
		isLoading.value = true;
		// 构造请求参数（分页 + 搜索）
		const params = {
			pageNo: pagination_info.pageNo,
			pageSize: pagination_info.pageSize,
		};

		// 调用接口
		const { data, pagination, code } = await getFriendshipListApi(params);
		if (code) {
			friendData.value = data || [];
			// 更新分页信息
			Object.assign(pagination_info, pagination);
		} else {
			friendData.value = [];
			toast.error("获取友链列表失败");
		}
	} catch (error) {
		friendData.value = [];
		toast.error("网络错误，获取友链列表失败");
		console.error("Get comment list error:", error);
	} finally {
		isLoading.value = false;
	}
};

// 5. 页面初始化
onMounted(() => {
	getFriendshipList();
});
</script>
<template>
	<div>
		<div class="px-5 py-4 border-b">
			<div class="flex">
				<div class="text-xl font-200">友链列表</div>
				<div class="text-sm text-gray-500 ml-2 mt-1.5">
					本页用于查看所有的友情链接列表
				</div>
			</div>
		</div>
		<div class="px-5 py-4">
			<div class="border rounded-lg overflow-hidden bg-white shadow-sm">
				<MyTable
					:data="friendData"
					:columns="columns"
					align-center
					:loading="isLoading">
					<!-- 操作列插槽：状态切换 + 删除 -->
					<template #cell-actions="{ row }">
						<div class="flex items-center gap-4">
							<!-- 显示/隐藏状态切换 -->
							<div
								v-if="!row.status"
								v-btn="['friendship_audit']"
								class="flex items-center gap-2">
								通过审核
							</div>
						</div>
					</template>
				</MyTable>
			</div>

			<!-- 分页组件 -->
			<Pagination
				class="mt-4 flex justify-center"
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
