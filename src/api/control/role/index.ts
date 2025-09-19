//角色管理
import request from '@/utils/request'
//获取所有角色
export const getRoleList = () => {
  return request({
    url: '/admin/role/getRoleList',
    method: 'post',
  })
}

//新增或修改角色
export const addOrEditRole = (data) => {
  return request({
    url: '/admin/role/addOrEditRole',
    method: 'post',
    data
  })
}
//删除角色
export const deleteRole = (data) => {
  return request({
    url: '/admin/role/deleteRole',
    method: 'post',
    data
  })
}

//获取权限列表
export const getPermissionList = () => {
  return request({
    url: '/admin/role/getPermissionList',
    method: 'post',
  })
}
//获取角色权限
export const getRoleDetail = (data) => {
  return request({
    url: '/admin/role/getRoleDetail',
    method: 'post',
    data
  })
}
//分配权限
export const assignPermission = (data) => {
  return request({
    url: '/admin/role/assignPermission',
    method: 'post',
    data
  })
}
