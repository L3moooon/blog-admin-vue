import request from "@/utils/request";
//获取所有评论列表
export const getAllComments = () => {
  return request({
    url: '/admin/comment/getComments',
    method: 'post',
  })
}

//删除评论
export const delComments = (data) => {
  return request({
    url: '/admin/comment/delComment',
    method: 'post',
    data
  })
}