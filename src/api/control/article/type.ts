export interface CommonResponse {
  code: number;
  msg: string;
}

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
export interface ArticleListResponse extends CommonResponse {
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
    tag: Array<number>;
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
  tag: Array<number>;
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
  tag?: Array<number>;
  top?: number;
}

// 获取标签列表响应
export interface TagListResponse extends CommonResponse {
  data: Array<{
    id: number;
    tag_name: string;
  }>;
}
