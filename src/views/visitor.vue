<template>
  <el-card>
    <!-- <div>本栏用于查看前台所有游客</div> -->
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

<style lang="scss" scoped></style>
