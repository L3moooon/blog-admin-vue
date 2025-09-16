<template>
  <el-card>
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="前台性能日志"
        name="log">
      </el-tab-pane>
      <el-tab-pane
        label="后端服务日志"
        name="log">
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
const activeTab = ref("log");
</script>

<style lang="scss" scoped></style>
