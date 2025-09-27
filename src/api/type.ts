export interface CommonResponse {
  code: number;
  msg: string;
}

export interface CommonListRequest {
  searchKey: string;
  dateRange: Array<string>;
  pagination: {
    pageNo: number;
    pageSize: number;
  };
}
export interface CommonListResponse extends CommonResponse {
  pagination: {
    pageNo: number;
    pageSize: number;
    total: number;
  };
}
