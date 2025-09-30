<script setup lang="ts">
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "vue-sonner";
import { Search, BookPlus, Tag } from "lucide-vue-next";

import { onMounted, ref, reactive } from "vue";
import {
  getArticleList as getArticleListApi,
  updateArticle,
  deleteArticle as deleteArticleApi,
  getTagList as getTagListApi,
} from "@/api/control/article";
import type {
  ArticleItem,
  AddArticleRequest,
  UpgradeArticleRequest,
  TagItem,
  TagListResponse,
  ArticleListResponse,
} from "@/api/control/article/type";
import MyTable from "@/components/table/MyTable.vue";
import MyDataPicker from "@/components/dataPicker/MyDataPicker.vue";
import EditArticle from "./EditArticle.vue";
import EditTag from "./EditTag.vue";
import { debounce } from "lodash";

const columns = [
  {
    prop: "id",
    label: "id",
    width: 60,
  },
  {
    prop: "title",
    label: "标题",
  },
  {
    prop: "cover_img",
    label: "封面",
    width: 120,
  },
  {
    prop: "abstract",
    label: "简介",
  },
  {
    prop: "tag",
    label: "标签",
  },
  {
    prop: "publish_date",
    label: "发布时间",
    sortable: true,
  },
  {
    prop: "last_edit_date",
    label: "最后更新时间",
    sortable: true,
  },
  {
    prop: "view",
    label: "访问量",
    sortable: true,
    width: 100,
  },
  {
    prop: "star",
    label: "点赞量",
    sortable: true,
    width: 100,
  },
  {
    prop: "comment_count",
    label: "评论量",
    sortable: true,
    width: 100,
  },
  {
    prop: "actions",
    label: "操作",
    width: 240,
    minWidth: 240,
    fixed: "right",
  },
];

const dateRange = ref([]);
const searchKey = ref("");
const pagination_info = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});

const articleList = ref<Array<ArticleItem>>([]);
const tagList = ref<Array<TagItem>>([]);
const showArticleDialog = ref<boolean>(false);
const showTagDialog = ref<boolean>(false);

const rowInfo = ref<ArticleItem | null>(null);

const handleUpdateArticle = async (
  row: ArticleItem, // 当前操作的文章行数据
  field: "top" | "status", // 要更新的字段名
  targetValue: boolean
) => {
  const originalValue = row[field];
  try {
    const { code, msg } = await updateArticle({
      id: row.id,
      [field]: targetValue,
    });
    if (code === 1) {
      toast.success(`${field === "top" ? "置顶" : "显示"}状态更新成功`);
      row[field] = targetValue;
    } else {
      toast.error(msg || `${field === "top" ? "置顶" : "显示"}状态更新失败`);
      row[field] = originalValue;
    }
  } catch (error) {
    toast.error("网络异常，请稍后重试");
    row[field] = originalValue;
  }
};
const handleAddArticle = () => {
  showArticleDialog.value = true;
  rowInfo.value = null;
};
//编辑文章
const handleEditArticle = (row: ArticleItem) => {
  console.log(row);
  showArticleDialog.value = true;
  rowInfo.value = row;
};
//删除文章
const handleDelConfirm = async (id: number) => {
  const { code } = await deleteArticleApi(id);
  if (code == 1) {
    toast.success("删除成功");
    getArticleList();
  }
};

//获取文章列表
const getArticleList = async () => {
  const { data, code, pagination } = await getArticleListApi({
    dateRange: dateRange.value,
    searchKey: searchKey.value,
    pagination: {
      pageNo: pagination_info.pageNo,
      pageSize: pagination_info.pageSize,
    },
  });
  if (code == 1) {
    console.log(data);
    articleList.value = data;
    Object.assign(pagination, pagination);
  }
};
const debouncedGetArticle = debounce(getArticleList, 800);
const getTagList = async () => {
  const { data } = await getTagListApi();
  tagList.value = data;
  console.log(tagList.value);
};

onMounted(() => {
  getArticleList();
  getTagList();
});
</script>

<template>
  <div class="px-5">
    <div class="flex justify-between my-2">
      <div class="flex gap-2">
        <Button
          @click="handleAddArticle"
          variant="outline"
          class="cursor-pointer">
          <BookPlus />
          发布文章
        </Button>
        <Button
          @click="showTagDialog = true"
          variant="outline"
          class="cursor-pointer">
          <Tag />
          标签管理
        </Button>
      </div>
      <div class="flex gap-2">
        <div class="relative w-full max-w-sm items-center">
          <Input
            v-model="searchKey"
            @input="debouncedGetArticle"
            id="search"
            type="text"
            placeholder="搜索..."
            class="pl-10" />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>
        <MyDataPicker @update:article="getArticleList" />
      </div>
    </div>
    <MyTable
      :data="articleList"
      :columns="columns"
      align-center>
      <template #cell-cover_img="{ value }">
        <div v-if="value">
          <img
            class="w-20 h-12 object-cover rounded"
            :src="value as string"
            alt="" />
        </div>
        <div v-else>暂无封面</div>
      </template>
      <template #cell-abstract="{ value }">
        <span>{{ value || "暂无简介" }}</span>
      </template>
      <template #cell-tag="{ value }">
        <div class="flex flex-wrap gap-1">
          <div
            v-for="(item, index) in value"
            :key="index"
            class="bg-cyan-300/50 rounded-sm px-2">
            {{ tagList.find((tag) => tag.id === item)?.tag_name || "未知标签" }}
          </div>
        </div>
      </template>
      <template #cell-publish_date="{ value }">
        <span v-time="value"> </span>
      </template>
      <template #cell-last_edit_date="{ value }">
        <span v-time="value"> </span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex space-x-2 items-center">
          <Label>置顶</Label>
          <Switch
            class="cursor-pointer"
            name="top"
            :model-value="row.top"
            @update:model-value="handleUpdateArticle(row, 'top', !row.top)">
          </Switch>
          <Label>展示</Label>
          <Switch
            class="cursor-pointer"
            :model-value="row.status"
            @update:model-value="
              handleUpdateArticle(row, 'status', !row.status)
            ">
          </Switch>
          <button
            class="text-blue-600 hover:text-blue-800 cursor-pointer"
            @click="handleEditArticle(row)">
            编辑
          </button>
          <!-- 删除文章 -->
          <AlertDialog>
            <AlertDialogTrigger
              class="text-red-400 hover:text-red-500 cursor-pointer">
              删除
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>删除文章</AlertDialogTitle>
                <AlertDialogDescription>
                  删除操作无法撤销，确认删除文章：{{ row.title }}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel class="cursor-pointer">
                  取消
                </AlertDialogCancel>
                <AlertDialogAction
                  class="cursor-pointer"
                  @click="handleDelConfirm(row.id)">
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

  <!-- 新增/编辑文章 -->
  <EditArticle
    v-model:showArticleDialog="showArticleDialog"
    :rowInfo="rowInfo"
    :tagList="tagList"
    @update:article="getArticleList" />
  <!-- 新增/编辑标签 -->
  <EditTag
    v-if="tagList.length"
    v-model:showTagDialog="showTagDialog"
    :tagList="tagList"
    @update:tagList="getTagList" />
</template>
