<template>
  <el-card>
    <el-row>
      <el-col :span="12">
        <el-button
          @click="roleDialog = true"
          type="primary"
          size="default"
          :icon="Plus"
          >添加角色
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data="roleList"
      show-overflow-tooltip
      stripe
      border
      style="margin: 10px 0px">
      <el-table-column
        label="id"
        align="center"
        prop="id"
        width="80"></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        prop="role_name"></el-table-column>
      <el-table-column
        label="角色编码"
        align="center"
        prop="role_code"></el-table-column>
      <el-table-column
        label="角色描述"
        align="center"
        prop="description"></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="create_time">
        <template #default="scope">
          <span v-time="scope.row.create_time"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="update_time">
        <template #default="scope">
          <span v-time="scope.row.update_time"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="280px"
        align="center">
        <template #="{ row, $index }">
          <el-button
            @click="handleAssignPermission(row)"
            type="primary"
            size="small"
            :icon="User">
            分配权限
          </el-button>
          <el-button
            @click="handleEditRole(row)"
            type="primary"
            size="small"
            :icon="Edit">
            编辑
          </el-button>
          <el-popconfirm
            :title="`确认删除角色:${row.role_name}?`"
            width="260px"
            @confirm="handleConfirmDelete(row, $index)">
            <template #reference>
              <el-button
                type="primary"
                size="small"
                :icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 添加/编辑角色 -->
  <el-dialog
    v-model="roleDialog"
    title="添加角色"
    :width="500">
    <el-form :model="addForm">
      <el-form-item
        label="角色名称"
        prop="roleName">
        <el-input
          v-model="addForm.roleName"
          placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item
        label="角色编码"
        prop="roleCode">
        <el-input
          v-model="addForm.roleCode"
          placeholder="请输入角色编码"></el-input>
      </el-form-item>
      <el-form-item
        label="角色描述"
        prop="roleDesc">
        <el-input
          v-model="addForm.roleDesc"
          placeholder="请输入角色描述"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        size="default"
        @click="roleDialog = false">
        取消
      </el-button>
      <el-button
        @click="handleConfirmEdit"
        type="primary"
        size="default">
        确定
      </el-button>
    </template>
  </el-dialog>
  <!-- 分配权限 -->
  <el-drawer
    v-model="permissionDrawer"
    direction="rtl">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <el-tree
        ref="permissionTreeRef"
        :data="permissionList"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        :default-expand-all="true"
    /></template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="permissionDrawer = false">取消</el-button>
        <el-button
          type="primary"
          @click="handlePermissionChange">
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from "vue";
import {
  getRoleList,
  addOrEditRole,
  deleteRole,
  getPermissionList,
  getRoleDetail,
  assignPermission,
} from "@/api/role";
import { ElMessage } from "element-plus";
import { Plus, User, Delete, Edit } from "@element-plus/icons-vue";

const roleDialog = ref(false);

const roleList = ref([]);
const permissionList = ref([]);

const selectedRoleId = ref(null);
const permissionTreeRef = ref(null);
const selectedPermissions = ref([]);
const defaultProps = {
  children: "children",
  label: "permission_name",
};
const addForm = reactive({
  id: null,
  roleName: "",
  roleCode: "",
  roleDesc: "",
});
const permissionDrawer = ref(false);

//分配权限
const handleAssignPermission = async (row) => {
  permissionDrawer.value = true;
  selectedRoleId.value = row.id;
  await getRolePermissions(row.id);
  nextTick(() => {
    console.log(selectedPermissions.value);
    permissionTreeRef.value.setCheckedKeys(selectedPermissions.value);
  });
};
//确认分配权限
const handlePermissionChange = async () => {
  const checkedKeys = [];
  const checkedNodes = permissionTreeRef.value.getCheckedNodes();
  console.log(checkedNodes);
  checkedNodes.forEach((node) => {
    checkedKeys.push(node.id);
  });
  console.log(checkedKeys);
  const { status } = await assignPermission({
    id: selectedRoleId.value,
    permission_ids: checkedKeys,
  });
  if (status == 1) {
    ElMessage({
      message: "分配成功",
      type: "success",
    });
    permissionDrawer.value = false;
  }
};

//编辑角色
const handleEditRole = (row) => {
  roleDialog.value = true;
  addForm.id = row.id;
  addForm.roleName = row.role_name;
  addForm.roleCode = row.role_code;
  addForm.roleDesc = row.description;
};
//删除角色
const handleConfirmDelete = async (row, index) => {
  const { status } = await deleteRole({ id: row.id });
  if (status == 1) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    roleList.value.splice(index, 1);
  }
};
//获取角色列表
const getRole = async () => {
  const { data, status } = await getRoleList();
  if (status == 1) {
    roleList.value = data;
  }
};
//获取权限列表
const getPermission = async () => {
  const { data, status } = await getPermissionList();
  if (status == 1) {
    console.log(data);
    // console.log(buildTree(data));
    permissionList.value = buildTree(data);
  }
  //将权限列表转换为树形结构
  function buildTree(data, parentId = 0) {
    const tree = [];
    // 筛选出当前父节点下的所有子节点
    data.forEach((item) => {
      if (item.parent_id === parentId) {
        // 递归查找子节点的子节点
        const children = buildTree(data, item.id);
        if (children.length > 0) {
          item.children = children;
        }
        tree.push(item);
      }
    });
    return tree;
  }
};
//获取角色对应权限
const getRolePermissions = async (roleId) => {
  const { data, status } = await getRoleDetail({ id: roleId });
  if (status == 1) {
    selectedPermissions.value = data;
    // console.log(selectedPermissions.value);
  }
};
//新增或编辑角色
const handleConfirmEdit = async () => {
  const { status } = await addOrEditRole({
    id: addForm.id,
    role_name: addForm.roleName,
    role_code: addForm.roleCode,
    description: addForm.roleDesc,
  });
  if (status == 1) {
    ElMessage({
      message: "操作成功",
      type: "success",
    });
    getRole();
    roleDialog.value = false;
  }
};
onMounted(() => {
  getRole();
  getPermission();
});
</script>

<style lang="scss" scoped></style>
