<template>
  <div>
    <el-card>
      <el-table
        :data="userData"
        border
        stripe
        show-overflow-tooltip>
        <el-table-column
          prop="id"
          label="id"
          align="center"
          width="80"></el-table-column>
        <el-table-column
          prop="account"
          label="账号"
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
            <div v-if="scope.row.location">
              {{ scope.row.location.province }}-{{ scope.row.location.city }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
        prop="permission"
        label="权限"
        width="80"></el-table-column> -->
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
          fixed="right"
          label="操作"
          align="center"
          min-width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              @change=""
              style="margin-right: 10px" />
            <el-button
              link
              type="primary"
              size="small"
              @click="editArticle(scope.row)">
              角色分配
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="delArticle(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAdminList } from "@/api/control/administrator/index";
const userData = ref();
const getList = async () => {
  const { data } = await getAdminList();
  userData.value = data;
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped></style>
