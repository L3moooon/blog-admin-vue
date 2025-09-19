import request from "@/utils/request";
import type {
  ArticleListResponse,
  TagListResponse,
  Pagination,
} from "@/api/control/article/type";
//获取所有文章列表
enum API {
  ARTICLE = "/public/getAllArticle",
  UPDATE_ARTICLE = "/admin/article/update",
}
// interface ResponseData<T> {
//   status: number;
//   message: string;
//   data: T;
//   pagination?: Pagination;
// }
export const getAllArticle = (data) => {
  return request.post<any, ArticleListResponse>("/public/getAllArticle", data);
};
//新增或修改文章
export const addOrEditArticle = (data) => {
  return request({
    url: "/admin/article/editOrAdd",
    method: "post",
    data,
  });
};
//更改文章显隐状态
export const changeArticleStatus = (data) => {
  return request({
    url: "/admin/article/changeStatus",
    method: "post",
    data,
  });
};
//更改文章置顶状态
export const changeArticleTop = (data) => {
  return request({
    url: "/admin/article/changeTop",
    method: "post",
    data,
  });
};
//删除文章
export const delArticle = (data) => {
  return request({
    url: "/admin/article/del",
    method: "post",
    data,
  });
};
//获取所有标签列表
export const getAllTag = () => {
  return request<TagListResponse>({
    url: "/admin/tag/getAllTags",
    method: "post",
  });
};
//新增标签
export const addTag = (data) => {
  return request({
    url: "/admin/tag/addTag",
    method: "post",
    data,
  });
};
//删除标签
export const delTag = (data) => {
  return request({
    url: "/admin/tag/delTag",
    method: "post",
    data,
  });
};
