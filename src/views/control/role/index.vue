<script setup lang="ts">
import { onMounted, ref, reactive, nextTick } from "vue";
import {
  getRoleList,
  addOrEditRole,
  deleteRole,
  getPermissionList,
  getRoleDetail,
  assignPermission,
} from "@/api/control/role";
import Permission from "./Permission.vue";
import EditRole from "./EditRole.vue";
import MyTable from "@/components/table/MyTable.vue";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { toast } from "vue-sonner";
import { UserPlus, KeyRound } from "lucide-vue-next";

const roleList = ref([]);
const customColumns = [
  {
    prop: "id",
    label: "id",
  },
  {
    prop: "role_name",
    label: "角色名称",
  },
  {
    prop: "role_code",
    label: "角色编码",
  },
  {
    prop: "description",
    label: "角色描述",
  },
  {
    prop: "create_time",
    label: "创建时间",
  },
  {
    prop: "update_time",
    label: "更新时间",
  },
  {
    prop: "operate",
    label: "操作",
  },
];
const roleDialog = ref(false);

const permissionList = ref([]);
const roleDialogVisible = ref(false);
const permissionDialogVisible = ref(false);

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
  permissionDialogVisible.value = true;
  await getRolePermissions(row.id);
  nextTick(() => {
    console.log(selectedPermissions.value);
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
    toast.success("分配成功");
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
const handleConfirmDelete = async (row) => {
  const { status } = await deleteRole({ id: row.id });
  if (status == 1) {
    toast.success("删除成功");
    getRole();
  }
};
//获取角色列表
const getRole = async () => {
  const { data, status } = await getRoleList();
  if (status == 1) {
    roleList.value = data;
    console.log(roleList.value);
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
    toast.success("操作成功");
    getRole();
    roleDialog.value = false;
  }
};
onMounted(() => {
  getRole();
  getPermission();
});
</script>
<template>
  <div class="px-5">
    <div class="flex gap-2 my-4">
      <Button
        @click="handleEditRole"
        variant="outline"
        class="cursor-pointer"
      >
        <UserPlus />
        创建角色
      </Button>
      <Button
        @click=""
        variant="outline"
        class="cursor-pointer"
      >
        <KeyRound />
        权限管理
      </Button>
    </div>
    <MyTable
      :data="roleList"
      :columns="customColumns"
      align-center
      show-overflow-tooltip
    >
      <template #cell-create_time="{ value }">
        <span v-time="value"></span>
      </template>
      <template #cell-update_time="{ value }">
        <span v-time="value"></span>
      </template>
      <template #cell-operate="{ row }">
        <div class="flex gap-2">
          <Label>启用</Label>
          <Switch
            class="cursor-pointer"
            :model-value="row.status"
            @update:model-value="handleChangeStatus(row)"
          >
          </Switch>
          <div
            class="text-blue-600 hover:text-blue-800 cursor-pointer"
            @click="handleAssignPermission(row)"
          >
            分配权限
          </div>
          <AlertDialog>
            <AlertDialogTrigger
              class="text-red-400 hover:text-red-500 cursor-pointer"
            >
              删除
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>删除角色</AlertDialogTitle>
                <AlertDialogDescription>
                  删除操作无法撤销，确认删除角色：{{ row.role_name }}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel class="cursor-pointer">
                  取消
                </AlertDialogCancel>
                <AlertDialogAction
                  class="cursor-pointer"
                  @click="handleConfirmDelete(row.id)"
                >
                  确认
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </template>
    </MyTable>
    <Permission v-model="permissionDialogVisible"></Permission>
    <EditRole v-model="roleDialogVisible"></EditRole>
  </div>
</template>
