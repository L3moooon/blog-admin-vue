//文章列表请求
export interface ArticleListRequest {
  searchKey: string;
  dateRange: Array<string>;
  pagination: {
    pageNo: number;
    pageSize: number;
  };
}
// 文章列表模相应
export interface ArticleListResponse {
  code: number;
  msg: string;
  data: Array<{
    id: number | null;
    title: string;
    cover_img: string;
    abstract: string;
    content: string;
    publish_date?: string;
    last_edit_date?: string;
    author_name: string;
    view: number;
    like: number;
    status: 1 | 0; // 1: 公开, 0: 隐藏
    tag: number[];
    top: 1 | 0; // 1: 置顶, 0: 不置顶
    comment_count?: number;
  }>;
  pagination: {
    pageNo: number;
    pageSize: number;
    total: number;
  };
}
//新增文章请求
export interface AddArticleRequest {
  title: string;
  cover_img: string;
  abstract: string;
  content: string;
  author_name: string;
  status: 1 | 0; // 1: 公开, 0: 隐藏
  tag: number[];
}
//新增文章响应
export interface AddArticleResponse {
  code: number;
  msg: string;
}
//修改文章请求
export interface UpgradeArticleRequest {
  id: number;
  title?: string;
  cover_img?: string;
  abstract?: string;
  content?: string;
  author_name?: string;
  status?: number; // 1: 公开, 0: 隐藏
  tag?: number[];
  top?: number;
}
//修改文章响应
export interface UpgradeArticleResponse {
  code: number;
  msg: string;
}
//删除文章请求
export interface DeleteArticleRequest {
  id: Number;
}
//删除文章响应
export interface DeleteArticleResponse {
  code: number;
  msg: string;
}
// 标签数据模型
export interface TagListRequest {
  id: number;
  tag_name: string;
}
// 标签列表接口
// export interface TagListResponse extends ResponseData {
//   data: TagItem[]; // 标签列表数据
// }
