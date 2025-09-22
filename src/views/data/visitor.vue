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
</script>
<template>
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
