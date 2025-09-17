<!-- <template>
  <el-card>
    <el-row>
      <el-col :span="16">
        <el-button
          type="primary"
          @click="publishArticle">
          发布文章
        </el-button>
        <el-button
          type="primary"
          @click="tagManagement">
          标签管理
        </el-button>
      </el-col>
      <el-col :span="8">
        <div class="func">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @calendar-change="getArticle"
            :size="size" />
          <el-input
            v-model="searchKey"
            @change="throttledGetArticle"
            :prefix-icon="Search"
            placeholder="请输入搜索关键字"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-table
      :data="articleData"
      show-overflow-tooltip
      style="margin: 10px 0px"
      border
      stripe>
      <el-table-column
        prop="id"
        label="id"
        align="center"
        width="60" />
      <el-table-column
        prop="title"
        label="标题" />
      <el-table-column
        prop="cover_img"
        label="封面">
        <template #default="scope">
          <el-image
            v-if="scope.row.cover_img"
            class="table-img"
            :src="scope.row.cover_img"
            alt="" />
          <div v-else>暂无封面</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="abstract"
        label="简介">
        <template #default="scope">
          <span>{{ scope.row.abstract || "暂无简介" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tag"
        label="标签">
        <template #default="scope">
          <div class="tag-container">
            <el-tag
              v-for="(item, index) in scope.row.tag"
              :key="index"
              :disable-transitions="false">
              {{ item.name }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="publish_date"
        label="发布时间"
        sortable>
        <template #default="scope">
          <span v-time="scope.row.publish_date"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="last_edit_Date"
        label="最后更新时间"
        sortable>
        <template #default="scope">
          <span v-time="scope.row.last_edit_date"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="view"
        label="访问量"
        sortable
        align="center"
        width="100" />
      <el-table-column
        prop="like"
        label="点赞量"
        sortable
        align="center"
        width="100" />
      <el-table-column
        prop="comment_count"
        label="评论量"
        sortable
        align="center"
        width="100" />
      <el-table-column
        fixed="right"
        label="操作"
        width="240"
        min-width="240">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="展示"
            inactive-text="隐藏"
            @change="changeStatus(scope.row)"
            style="margin-right: 10px" />
          <el-switch
            v-model="scope.row.top"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="置顶文章"
            inactive-text="取消置顶"
            @change="changeTop(scope.row)"
            style="margin-right: 10px" />
          <el-button
            link
            type="primary"
            size="small"
            @click="editArticle(scope.row)">
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="delConfirm(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pagination.pageNo"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="pagination.total"
      @current-change="getHasRole"
      @size-change="sizeChange" />
  </el-card>
  <el-dialog
    class="article-dialog"
    fullscreen
    v-model="showArticleDialog"
    @closed="clearData"
    :destroy-on-close="true"
    :show-close="false">
    <template #title>
      <div class="top">
        <el-button
          class="back"
          @click="back">
          <img
            src="/src/assets/icons/back.png"
            alt="" />
          <span>返回</span>
        </el-button>
        <div>{{ EditOrAdd ? "发布文章" : "编辑文章" }}</div>
      </div>
    </template>
    <template #default>
      <EditArticleByPlugin
        :tagList="tagList"
        @Update:showArticleDialog="updateArticleDialog"
        :content="content" />
    </template>
  </el-dialog>
  <el-dialog
    v-model="showTagDialog"
    title="标签管理">
    <div class="tag-container">
      <el-tag
        v-for="item in tagList"
        :key="item.id"
        closable
        :disable-transitions="false"
        @close="handleClose(item.id)">
        {{ item.tag_name }}
      </el-tag>
      <el-input
        v-if="tagInputVisible"
        ref="tagInputRef"
        v-model="tagInput"
        class="w-20"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm" />
      <el-button
        v-else
        class="button-new-tag"
        size="small"
        @click="showInput">
        + 新增标签
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    v-model="showDelDialog"
    title="确认删除"
    width="500"
    :before-close="handleClose">
    <span>删除后无法恢复，确认删除？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showDelDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
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
import EditArticle from "./articleComponent/editArticle.vue";
import EditArticleByPlugin from "./articleComponent/editArticleByPlugin.vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { throttle } from "lodash-es";

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
const delConfirm = (id) => {
  showDelDialog.value = true;
  delAimId.value = id;
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

<style lang="scss" scoped>
.func {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}
:deep(.el-dialog.article-dialog) {
  padding: 0;
  border-radius: 0;
  .el-dialog__header {
    height: 100px;
    padding: 0;
  }
}
.tag-container {
  display: flex;
  gap: 5px;
}
</style> -->

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
import EditArticle from "./articleComponent/editArticle.vue";
import EditArticleByPlugin from "./articleComponent/editArticleByPlugin.vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { throttle } from "lodash-es";

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
const delConfirm = (id) => {
  showDelDialog.value = true;
  delAimId.value = id;
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
const isDark = ref(false);
const change = () => {
  isDark.value = !isDark.value;
  console.log(isDark.value);
};
import { Moon, Sun } from "@iconify-icons/lucide";
</script>

<template>
  <div class="p-5">
    <Button
      variant="secondary"
      class="mr-2"
      @click="publishArticle">
      发布文章
    </Button>
    <Button
      variant="secondary"
      @click="tagManagement">
      标签管理
    </Button>
    <MyDataPicker> </MyDataPicker>
    <MyTable
      :data="articleData"
      :columns="columns"
      align-center>
      <template #cell-cover_img="{ value }">
        <div v-if="value">
          <img
            :src="value"
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
            class="bg-blue-300/50 rounded-sm px-2">
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
        <Switch
          :model-value="isDark"
          @update:model-value="change">
          <template #thumb>
            <Icon
              v-if="isDark"
              icon="lucide:moon"
              class="size-3" />
            <Icon
              v-else
              icon="lucide:sun"
              class="size-3" />
          </template>
        </Switch>
        <div class="flex space-x-2">
          <button
            class="text-blue-600 hover:text-blue-800"
            @click="handleEdit(row)">
            编辑
          </button>
          <button
            class="text-red-600 hover:text-red-800"
            @click="handleDelete(row)">
            删除
          </button>
        </div>
      </template>
    </MyTable>
  </div>
</template>
