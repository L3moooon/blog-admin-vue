import request from "@/utils/request";
//获取所有用户列表
export const getAdminList = () => {
  return request({
    url: '/admin/administrator/getAdminList',
    method: 'post',
  })
}
