<script setup lang="ts">
import { onMounted, ref, reactive, nextTick } from "vue";
import {
  getArticleList,
  changeArticleStatus,
  changeArticleTop,
  delArticle as del,
  getAllTag,
  addTag,
  delTag,
} from "@/api/control/article";
import type {
  ArticleItem,
  PaginationData,
  TagItem,
  ArticleListResponse,
} from "@/api/control/article/type";
import MyTable from "@/components/table/MyTable.vue";
import MyDataPicker from "@/components/dataPicker/MyDataPicker.vue";
import EditDialog from "./EditDialog.vue";
import EditTag from "./EditTag.vue";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
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
import { BookPlus, Tag } from "lucide-vue-next";
import { Switch } from "@/components/ui/switch";
import { throttle } from "lodash-es";

const articleData = ref();
const showArticleDialog = ref<boolean>(false);
const showTagDialog = ref(false);

const tagList = ref<TagItem[]>([]);
const tagInput = ref("");
const tagInputVisible = ref(false);
const tagInputRef = ref(null);

const dateRange = ref([]);
const searchKey = ref("");

const rowInfo = ref<Partial<ArticleItem>>({
  id: null,
  title: "",
  cover_img: "",
  abstract: "",
  content: "",
  status: 1, // 1公开 2私密
  tag: [],
});
const pagination_info = reactive<PaginationData>({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});
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
    prop: "like",
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
//控制文章显隐
const handleChangeStatus = async (row: ArticleItem) => {
  console.log(row);
  const { status } = await changeArticleStatus({
    id: row.id,
    status: row.status,
  });
  if (status == 1) {
    toast.success("操作成功");
  }
};
//控制文章置顶
const handleChangeTop = async (row: ArticleItem) => {
  console.log(row);
  const { status } = await changeArticleTop({
    id: row.id,
    top: row.top,
  });
  if (status == 1) {
    toast.success("操作成功");
  }
};

//编辑文章
const handleEditArticle = (row: ArticleItem) => {
  showArticleDialog.value = true;
  rowInfo.value = row;
};
//编辑完成后更新文章
const updateArticleDialog = (data) => {
  showArticleDialog.value = data;
  getArticle();
};
//删除文章
const handleDelConfirm = async (id: number) => {
  const { status } = await del({ id });
  if (status == 1) {
    toast.success("删除成功");
    getArticle();
  }
};

const tagManagement = async () => {
  showTagDialog.value = true;
  console.log(data);
};
const showInput = () => {
  tagInputVisible.value = true;
  nextTick(() => {
    tagInputRef.value.input.focus();
  });
};
//新增标签
const handleInputConfirm = async () => {
  if (tagInput.value) {
    // dynamicTags.value.push(tagInput.value);
    const { status } = await addTag({ name: tagInput.value });
    if (status == 1) {
      toast.success("添加成功");
      getTag();
    }
  }
  tagInputVisible.value = false;
  tagInput.value = "";
};
const handleClose = async (id) => {
  const { status } = await delTag({ id: id });
  if (status == 1) {
    toast.success("删除成功");
    getTag();
  }
};
//获取文章列表
const getArticle = async () => {
  const { data, status, pagination } = await getArticleList({
    pageNo: pagination_info.pageNo,
    pageSize: pagination_info.pageSize,
    dateRange: dateRange.value,
    searchKey: searchKey.value,
  });
  if (status == 1) {
    console.log(data);
    articleData.value = data;
    Object.assign(pagination, pagination);
  }
};
const throttledGetArticle = throttle(getArticle, 1000);
const getTag = async () => {
  const { data } = await getAllTag();
  tagList.value = data;
  console.log(tagList.value);
};

onMounted(() => {
  getArticle();
  getTag();
});
</script>

<template>
  <div class="px-5">
    <div class="flex justify-between my-2">
      <div class="flex gap-2">
        <Button
          @click="showArticleDialog = true"
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
            id="search"
            type="text"
            placeholder="搜索..."
            class="pl-10" />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>
        <MyDataPicker @update:article="getArticle" />
      </div>
    </div>

    <MyTable
      :data="articleData"
      :columns="columns"
      align-center>
      <template #cell-cover_img="{ value }">
        <div v-if="value">
          <img
            class="w-20 h-12 object-cover rounded"
            :src="value"
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
            :model-value="!row.status"
            @update:model-value="handleChangeStatus(row)">
          </Switch>
          <Label>展示</Label>
          <Switch
            class="cursor-pointer"
            :model-value="!row.top"
            @update:model-value="handleChangeTop(row)">
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
                  删除操作无法撤销，确认删除文章：{{ row.title }}。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction @click="handleDelConfirm(row.id)">
                  确认
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </template>
    </MyTable>
    <Pagination
      v-slot="{ page }"
      :items-per-page="10"
      :total="30"
      :default-page="2">
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

  <!-- 新增/编辑文章 -->
  <EditDialog
    v-model:showArticleDialog="showArticleDialog"
    v-model:rowInfo="rowInfo"
    :tagList="tagList"
    @update:article="getArticle" />
  <!-- 新增/编辑标签 -->
  <EditTag
    v-model:showTagDialog="showTagDialog"
    @update:tagList="getTagList" />
</template>
