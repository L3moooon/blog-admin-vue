import request from "@/utils/request";
import type {
  ArticleListRequest,
  ArticleListResponse,
  AddArticleRequest,
  AddArticleResponse,
  UpgradeArticleRequest,
  UpgradeArticleResponse,
  DeleteArticleRequest,
  DeleteArticleResponse,
} from "@/api/control/article/type";

enum API {
  GET_ARTICLE = "/admin/article/getArticleList", //获取文章列表
  ADD_ARTICLE = "/admin/article/addArticle", //新增文章
  UPDATE_ARTICLE = "/admin/article/updateArticle", //修改文章
  DELETE_ARTICLE = "/admin/article/deleteArticle", //删除文章

  GET_TAG = "/admin/tag/getAllTags", //获取标签列表
  ADD_TAG = "/admin/tag/addTag", //新增标签
  DELETE_TAG = "/admin/tag/deleteTag", //删除标签
}

export const getArticleList = (
  params: ArticleListRequest
): Promise<ArticleListResponse> => request.get(API.GET_ARTICLE, { params });

export const addArticle = (
  data: AddArticleRequest
): Promise<AddArticleResponse> => request.post(API.ADD_ARTICLE, data);

export const updateArticle = (
  data: UpgradeArticleRequest
): Promise<UpgradeArticleResponse> => request.patch(API.UPDATE_ARTICLE, data);

export const deleteArticle = (
  params: DeleteArticleRequest
): Promise<DeleteArticleResponse> =>
  request.delete(API.DELETE_ARTICLE, { params });

// export const changeArticleStatus = (data) => {
//   return request({
//     url: "/admin/article/changeStatus",
//     method: "post",
//     data,
//   });
// };
// export const changeArticleTop = (data) => {
//   return request({
//     url: "/admin/article/changeTop",
//     method: "post",
//     data,
//   });
// };
// export const delArticle = (data) => {
//   return request({
//     url: "/admin/article/del",
//     method: "post",
//     data,
//   });
// };
export const getAllTag = () => {
  return request({
    url: "/admin/tag/getAllTags",
    method: "post",
  });
};
export const addTag = (data) => {
  return request({
    url: "/admin/tag/addTag",
    method: "post",
    data,
  });
};
export const delTag = (data) => {
  return request({
    url: "/admin/tag/delTag",
    method: "post",
    data,
  });
};
