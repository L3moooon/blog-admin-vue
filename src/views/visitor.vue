<!-- <template>
  <el-card>
    <el-table
      :data="userData"
      stripe
      border
      show-overflow-tooltip>
      <el-table-column
        prop="id"
        label="id"
        align="center"
        width="80"></el-table-column>
      <el-table-column
        prop="identify"
        label="凭证"
        align="center"></el-table-column>
      <el-table-column
        prop="name"
        label="昵称"
        align="center"></el-table-column>
      <el-table-column
        prop="ip"
        label="ip"
        align="center"></el-table-column>
      <el-table-column
        prop="location"
        label="归属地"
        align="center">
        <template #default="scope">
          <div v-if="scope.row.address">
            {{ scope.row.address.province }}-{{ scope.row.address.city }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="agent"
        label="登录设备"
        align="center"
        width="250"></el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        align="center">
        <template #default="scope">
          <span v-time="scope.row.create_time"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="last_login_time"
        label="最后登录时间"
        align="center">
        <template #default="scope">
          <span v-time="scope.row.last_login_time"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="visited_count"
        label="访问次数"
        align="center"
        width="100">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getList } from "/src/api/visitor";
const userData = ref();
const getVisitorList = async () => {
  const { data } = await getList();
  userData.value = data;
  console.log(userData.value);
};
onMounted(() => {
  getVisitorList();
});
</script>

<style lang="scss" scoped></style> -->

<template>
  <MyTable
    :data="users"
    :columns="customColumns">
    <!-- 自定义姓名表头 -->
    <!-- <template #header-name>
      <span class="font-semibold text-primary">111</span>
    </template> -->

    <!-- 自定义年龄单元格 -->
    <!-- <template #cell-age="{ value }">
      <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
        {{ value }}岁
      </span>
    </template> -->

    <!-- 自定义操作列 -->
    <template #cell-actions="{ row }">
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

    <!-- 自定义空状态 -->
    <template #empty>
      <div class="flex flex-col items-center">
        <p class="text-muted-foreground">没有找到用户数据</p>
        <button class="mt-2 text-sm text-primary">添加新用户</button>
      </div>
    </template>
  </MyTable>
</template>

<script setup>
import MyTable from "@/components/table/MyTable.vue";
const users = [
  { id: 1, name: "张三", age: 28, department: "技术部", role: "开发工程师" },
  { id: 2, name: "李四", age: 32, department: "产品部", role: "产品经理" },
  { id: 3, name: "王五", age: 25, department: "设计部", role: "UI设计师" },
];
const customColumns = [
  {
    accessorKey: "name",
    header: "员工姓名",
    meta: {
      headerClass: "text-primary font-bold",
      cellClass: "font-medium",
    },
  },
  {
    accessorKey: "age",
    header: "年龄",
    meta: { cellClass: "text-right" },
  },
  {
    accessorKey: "department",
    header: "部门",
  },
  {
    accessorKey: "role",
    header: "职位",
  },
  {
    accessorKey: "actions",
    header: "操作",
    meta: { cellClass: "text-center" },
  },
];
const handleEdit = (row) => {
  console.log("编辑:", row);
};

const handleDelete = (row) => {
  console.log("删除:", row);
};
</script>
