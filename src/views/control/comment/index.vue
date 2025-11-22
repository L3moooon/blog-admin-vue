<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import {
	getCommentList as getCommentListApi,
	deleteComment as deleteCommentApi,
	// changeCommentStatus,
} from "@/api/control/comment/index";
import type { CommentItem } from "@/api/control/comment/type"; // 需根据实际接口定义类型
import MyTable from "@/components/MyTable.vue";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
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

// 1. 响应式数据定义
const commentData = ref<CommentItem[]>([]); // 评论列表数据
const searchKey = ref(""); // 搜索关键词
const isLoading = ref(false); // 表格加载状态
const isStatusLoading = ref(false); // 状态切换加载状态
const isDeleteLoading = ref(false); // 删除操作加载状态

const pagination_info = reactive({
	pageNo: 1,
	pageSize: 10,
	total: 0,
});

const columns = [
	{
		prop: "article_id",
		label: "文章ID",
		width: 100,
		align: "center",
	},
	{
		prop: "title",
		label: "评论文章",
		minWidth: 180,
	},
	{
		prop: "user_id",
		label: "用户ID",
		width: 100,
		align: "center",
	},
	{
		prop: "user_name",
		label: "用户名",
		width: 120,
		align: "center",
	},
	{
		prop: "parent_id",
		label: "回复用户ID",
		width: 120,
		align: "center",
	},
	{
		prop: "content",
		label: "评论内容",
		minWidth: 250,
	},
	{
		prop: "comment_date",
		label: "评论时间",
		width: 180,
		align: "center",
		sortable: true, // 支持排序
	},
	{
		prop: "edit_date",
		label: "最后编辑时间",
		width: 180,
		align: "center",
		sortable: true, // 支持排序
	},
	{
		prop: "like_count",
		label: "点赞量",
		width: 100,
		align: "center",
		sortable: true, // 支持排序
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

// 4. 核心方法定义
/**
 * 获取评论列表（支持分页、搜索）
 */
const getList = async () => {
	try {
		isLoading.value = true;
		// 构造请求参数（分页 + 搜索）
		const params = {
			pageNo: pagination_info.pageNo,
			pageSize: pagination_info.pageSize,
			searchKey: searchKey.value.trim(), // 去除空格避免无效搜索
		};

		// 调用接口
		const { data, pagination, code } = await getCommentListApi(params);
		if (code) {
			commentData.value = data || [];
			// 更新分页信息
			Object.assign(pagination_info, pagination);
		} else {
			commentData.value = [];
			toast.error("获取评论列表失败");
		}
	} catch (error) {
		commentData.value = [];
		toast.error("网络错误，获取评论列表失败");
		console.error("Get comment list error:", error);
	} finally {
		isLoading.value = false;
	}
};
const debouncedGetList = debounce(getList, 600);
// 切换评论显示/隐藏状态
const handleChangeStatus = async (row: CommentItem) => {
	try {
		isStatusLoading.value = true;
		const newStatus = row.status ? 0 : 1; // 1-显示，0-隐藏

		// 调用状态切换接口
		const { status } = await changeCommentStatus({
			id: row.id,
			status: newStatus,
		});

		if (status === 1) {
			row.status = newStatus; // 本地更新状态
			toast.success(`评论已${newStatus ? "显示" : "隐藏"}`);
		} else {
			// 接口失败时回滚状态
			row.status = !newStatus;
			toast.error("状态切换失败");
		}
	} catch (error) {
		// 网络错误回滚状态
		row.status = !row.status;
		toast.error("网络错误，状态切换失败");
		console.error("Change comment status error:", error);
	} finally {
		isStatusLoading.value = false;
	}
};

/**
 * 删除评论
 */
const handleDelete = async (id: number) => {
	try {
		isDeleteLoading.value = true;
		const { code } = await deleteCommentApi(id);

		if (code === 1) {
			toast.success("删除评论成功");
			getList(); // 重新获取列表
		} else {
			toast.error("删除评论失败");
		}
	} catch (error) {
		toast.error("网络错误，删除评论失败");
		console.error("Delete comment error:", error);
	} finally {
		isDeleteLoading.value = false;
	}
};

// 5. 页面初始化
onMounted(() => {
	getList();
});
</script>
<template>
	<div>
		<div class="px-5 py-4 border-b">
			<div class="flex">
				<div class="text-xl font-200">评论管理</div>
				<div class="text-sm text-gray-500 ml-2 mt-1.5">
					本页用于管理前台所有文章的评论
				</div>
			</div>
		</div>
		<div class="px-5">
			<!-- 顶部操作栏：标题 + 搜索框 -->
			<div class="flex justify-between items-center my-4">
				<div class="relative w-full max-w-md">
					<Input
						v-model="searchKey"
						@input="debouncedGetList"
						id="comment-search"
						type="text"
						placeholder="搜索文章标题/用户名/评论内容..."
						class="pl-10 h-10" />
					<span
						class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
						<Search class="size-5 text-muted-foreground" />
					</span>
				</div>
			</div>

			<!-- 评论表格 -->
			<div class="border rounded-lg overflow-hidden bg-white shadow-sm">
				<MyTable
					:data="commentData"
					:columns="columns"
					align-center
					:loading="isLoading">
					<!-- 文章标题插槽：超长文本省略 -->
					<template #cell-title="{ value }">
						<div
							class="max-w-[200px] truncate"
							title="文章标题">
							{{ value || "未知文章" }}
						</div>
					</template>

					<!-- 评论内容插槽：超长文本省略 + hover显示完整内容 -->
					<template #cell-content="{ value }">
						<div
							class="max-w-[300px] truncate"
							:title="value || '无评论内容'">
							{{ value || "无评论内容" }}
						</div>
					</template>

					<!-- 回复用户ID插槽：无数据时显示占位 -->
					<template #cell-parent_id="{ value }">
						<span>{{ value || "-" }}</span>
					</template>

					<!-- 评论时间插槽：使用统一时间指令 -->
					<template #cell-comment_date="{ value }">
						<span v-time="value"></span>
					</template>

					<!-- 最后编辑时间插槽：无数据时显示占位 -->
					<template #cell-edit_date="{ value }">
						<span
							v-time="value"
							v-if="value"></span>
						<span v-else>-</span>
					</template>

					<!-- 操作列插槽：状态切换 + 删除 -->
					<template #cell-actions="{ row }">
						<div class="flex items-center gap-4">
							<!-- 显示/隐藏状态切换 -->
							<div class="flex items-center gap-2">
								<Label :class="row.status ? 'text-green-600' : ''">
									{{ row.status ? "显示" : "隐藏" }}
								</Label>
								<Switch
									v-btn="['comment_show']"
									class="cursor-pointer"
									:model-value="row.status"
									@update:model-value="handleChangeStatus(row)"
									:disabled="isStatusLoading" />
							</div>

							<!-- 删除确认对话框 -->
							<AlertDialog>
								<AlertDialogTrigger
									v-btn="['comment_delete']"
									class="text-red-500 hover:text-red-700 cursor-pointer text-sm">
									删除
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>删除评论</AlertDialogTitle>
										<AlertDialogDescription>
											删除操作无法撤销，确认删除用户【{{
												row.user_name
											}}】的评论？
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>取消</AlertDialogCancel>
										<AlertDialogAction
											@click="handleDelete(row.id)"
											:disabled="isDeleteLoading">
											{{ isDeleteLoading ? "删除中..." : "确认" }}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
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
