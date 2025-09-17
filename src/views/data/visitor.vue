<script setup lang="ts">
import MyTable from "@/components/table/MyTable.vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { onMounted, ref } from "vue";
import { getList } from "/src/api/visitor";
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
  {
    prop: "actions",
    label: "操作",
  },
];
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
  const { data } = await getList();
  userData.value = data;
  console.log(userData.value);
};
onMounted(() => {
  getVisitorList();
});

// const handleEdit = (row) => {
//   console.log("编辑:", row);
// };

// const handleDelete = (row) => {
//   console.log("删除:", row);
// };
</script>
<template>
  <div class="!p-5">
    <MyTable
      :data="userData"
      :columns="customColumns"
      align-center>
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
        <span v-time="value"> {{ value }}岁 </span>
      </template>
      <template #cell-last_login_time="{ value }">
        <span v-time="value"> </span>
      </template>
      <template #cell-visited_count="{ value }">
        <div
          :class="[
            visitedCountColor(value),
            'w-10',
            'rounded-md',
            'flex',
            'justify-center',
          ]">
          {{ value }}
        </div>
      </template>
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
</template>
