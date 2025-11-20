<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import {
	getMusicList as getMusicListApi,
	deleteMusic as deleteMusicApi,
} from "@/api/setting/music/index";
import { upload } from "@/api/public";
import type { CommentItem } from "@/api/control/comment/type";
import MyTable from "@/components/table/MyTable.vue";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-vue-next";
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
const musicData = ref<CommentItem[]>([]); // 评论列表数据
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
		prop: "id",
		label: "ID",
		width: 100,
		align: "center",
	},
	{
		prop: "name",
		label: "歌名",
		minWidth: 180,
	},
	{
		prop: "author",
		label: "作曲",
		width: 100,
		align: "center",
	},
	{
		prop: "duration",
		label: "时长",
		width: 120,
		align: "center",
	},
	{
		prop: "size",
		label: "歌曲文件大小",
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

const handleUpload = async () => {
	try {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "audio/*";
		input.multiple = false;

		input.onchange = async (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (target.files && target.files.length > 0) {
				const file = target.files[0];
				const formData = new FormData();
				formData.append("file", file);

				const { code, data } = await upload(formData);
				if (code === 1) {
					toast.success("音乐上传成功");
					getList(); // 刷新列表
				} else {
					toast.error("音乐上传失败");
				}
			}
		};
		input.click();
	} catch (error) {
		toast.error("网络错误，音乐上传失败");
		console.error("Music upload error:", error);
	}
};
//获取音乐列表
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
		const { data, pagination, code } = await getMusicListApi(params);
		if (code) {
			musicData.value = data || [];
			// 更新分页信息
			Object.assign(pagination_info, pagination);
		} else {
			musicData.value = [];
			toast.error("获取评论列表失败");
		}
	} catch (error) {
		musicData.value = [];
		toast.error("网络错误，获取评论列表失败");
		console.error("Get comment list error:", error);
	} finally {
		isLoading.value = false;
	}
};
const debouncedGetList = debounce(getList, 600);
// 切换评论显示/隐藏状态

//删除评论
const handleDelete = async (id: number) => {
	try {
		isDeleteLoading.value = true;
		const { code } = await deleteMusicApi(id);

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
				<div class="text-xl font-200">音乐盒设置</div>
				<div class="text-sm text-gray-500 ml-2 mt-1.5">
					本页用于查看和设置博客前台的音乐盒播放列表
				</div>
			</div>
		</div>
	</div>
	<div class="px-5 py-4">
		<!-- 顶部操作栏：标题 + 搜索框 -->
		<div class="flex justify-between items-center mb-4">
			<Button
				v-btn="['music_upload']"
				@click="handleUpload"
				variant="outline"
				class="cursor-pointer">
				<Upload />
				上传音乐
			</Button>
			<div class="relative w-full max-w-md">
				<Input
					v-model="searchKey"
					@input="debouncedGetList"
					id="comment-search"
					type="text"
					placeholder="搜索歌名/歌词/作者..."
					class="pl-10 h-10" />
				<span
					class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
					<Search class="size-5 text-muted-foreground" />
				</span>
			</div>
		</div>

		<div class="border rounded-lg overflow-hidden bg-white shadow-sm">
			<MyTable
				:data="musicData"
				:columns="columns"
				align-center
				:loading="isLoading">
				<!-- 操作列插槽：状态切换 + 删除 -->
				<template #cell-actions="{ row }">
					<div class="flex items-center gap-4">
						<!-- 显示/隐藏状态切换 -->
						<div class="flex items-center gap-2">
							<Label :class="row.status ? 'text-green-600' : ''">
								{{ row.status ? "启用" : "禁用" }}
							</Label>
							<Switch
								class="cursor-pointer"
								:model-value="row.status"
								@update:model-value="handleChangeStatus(row)"
								:disabled="isStatusLoading" />
						</div>

						<!-- 删除确认对话框 -->
						<AlertDialog>
							<AlertDialogTrigger
								v-btn="['music_delete']"
								class="text-red-500 hover:text-red-700 cursor-pointer text-sm">
								删除
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>删除音乐</AlertDialogTitle>
									<AlertDialogDescription>
										删除操作无法撤销，确认删除音乐【{{ row.user_name }}】？
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
</template>
