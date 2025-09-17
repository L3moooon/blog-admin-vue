<script setup lang="ts">
import { onMounted, ref, reactive, nextTick } from "vue";
import {
  getAllArticle,
  changeArticleStatus,
  changeArticleTop,
  delArticle as del,
  getAllTag,
  addTag,
  delTag,
} from "@/api/article";
import MyTable from "@/components/table/MyTable.vue";
import MyDataPicker from "@/components/dataPicker/MyDataPicker.vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import EditDialog from "./articleComponent/EditDialog.vue";
import { ElMessage } from "element-plus";
import { throttle } from "lodash-es";
import { Tag } from "lucide-vue-next";

const articleData = ref();
const showArticleDialog = ref(false);
const showDelDialog = ref(false);
const delAimId = ref(null); //删除文章的id
const EditOrAdd = ref(0);
const content = ref(null);

const showTagDialog = ref(false);
const tagList = ref([]);
const tagInput = ref("");
const tagInputVisible = ref(false);
const tagInputRef = ref(null);

const dateRange = ref([]);
const searchKey = ref("");
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
});
const columns = [
  {
    prop: "id",
    label: "id",
    width: 60,
    align: "center",
  },
  {
    prop: "title",
    label: "标题",
  },
  {
    prop: "cover_img",
    label: "封面",
    width: 120,
    align: "center",
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
    align: "center",
  },
  {
    prop: "like",
    label: "点赞量",
    sortable: true,
    width: 100,
    align: "center",
  },
  {
    prop: "comment_count",
    label: "评论量",
    sortable: true,
    width: 100,
    align: "center",
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
const changeStatus = async (row) => {
  console.log(row);
  const { status } = await changeArticleStatus({
    id: row.id,
    status: row.status,
  });
  if (status == 1) {
    ElMessage.success("操作成功");
  }
};
//控制文章置顶
const changeTop = async (row) => {
  console.log(row);
  const { status } = await changeArticleTop({
    id: row.id,
    top: row.top,
  });
  if (status == 1) {
    ElMessage.success("操作成功");
  }
};
const back = () => {
  //TODO 保留草稿功能
  showArticleDialog.value = false;
};
//编辑文章
const editArticle = (row) => {
  EditOrAdd.value = 0;
  content.value = row;
  showArticleDialog.value = true;
};
//编辑完成后更新文章
const updateArticleDialog = (data) => {
  showArticleDialog.value = data;
  getArticle();
};
//删除确认
const delConfirm = (row) => {
  showDelDialog.value = true;
  delAimId.value = row.id;
  console.log(delAimId.value);
};
//确认删除
const confirm = async () => {
  const { status } = await del({ id: delAimId.value });
  if (status == 1) {
    ElMessage.success("删除成功");
    showDelDialog.value = false;
    getArticle();
  }
};
//发布文章按钮
const publishArticle = () => {
  showArticleDialog.value = true;
  EditOrAdd.value = 1;
};
const clearData = () => {
  console.log("清除数据");
  content.value = null;
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
      ElMessage.success("添加成功");
      getTagList();
    }
  }
  tagInputVisible.value = false;
  tagInput.value = "";
};
const handleClose = async (id) => {
  const { status } = await delTag({ id: id });
  if (status == 1) {
    ElMessage.success("删除成功");
    getTagList();
  }
};
//获取文章列表
const getArticle = async () => {
  const { data, status, pagination_info } = await getAllArticle({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    dateRange: dateRange.value,
    searchKey: searchKey.value,
  });
  if (status == 1) {
    console.log(data);
    articleData.value = data;
    Object.assign(pagination, pagination_info);
  }
};
const throttledGetArticle = throttle(getArticle, 1000);
const getTagList = async () => {
  const { data } = await getAllTag();
  tagList.value = data;
  console.log(tagList.value);
};

onMounted(() => {
  getArticle();
  getTagList();
});
</script>

<template>
  <div class="px-5">
    <div class="my-2 flex gap-2">
      <EditDialog
        :visible.sync="showArticleDialog"
        :EditOrAdd="EditOrAdd"
        :content="content"
        @back="back"
        @updateArticleDialog="updateArticleDialog"
        @clearData="clearData" />
      <Button
        variant="outline"
        class="cursor-pointer"
        @click="tagManagement">
        <Tag />
        标签管理
      </Button>
      <MyDataPicker />
    </div>
    <MyTable
      :data="articleData"
      :columns="columns"
      align-center>
      <template #cell-cover_img="{ value }">
        <div v-if="value">
          <img
            :src="value as string"
            alt=""
            class="w-20 h-12 object-cover rounded" />
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
            {{ item.name }}
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
            @update:model-value="changeStatus(row)">
          </Switch>
          <Label>展示</Label>
          <Switch
            class="cursor-pointer"
            :model-value="!row.top"
            @update:model-value="changeTop(row)">
          </Switch>
          <button
            class="text-blue-600 hover:text-blue-800 cursor-pointer"
            @click="editArticle(row)">
            编辑
          </button>
          <button
            class="text-red-600 hover:text-red-800 cursor-pointer"
            @click="delConfirm(row.id)">
            删除
          </button>
        </div>
      </template>
    </MyTable>
  </div>
</template>
