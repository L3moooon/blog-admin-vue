//基础响应数据模型
export interface ResponseData {
  status: number;
  message: string;
}
// 分页数据模型
export interface Pagination {
  pageNo: number;
  pageSize: number;
  total: number;
}
// 文章数据模型
export interface ArticleItem {
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
}
// 文章列表接口
export interface ArticleListResponse extends ResponseData {
  data: ArticleItem[]; // 文章列表数据
  pagination: Pagination; // 分页信息
}

// 标签数据模型
export interface TagItem {
  id: number;
  tag_name: string;
}

// 标签列表接口
export interface TagListResponse extends ResponseData {
  data: TagItem[]; // 标签列表数据
}
