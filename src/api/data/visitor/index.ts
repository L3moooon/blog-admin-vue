import request from "@/utils/request";
import { CommonListRequest, CommonListResponse } from "@/api/type";

enum API {
  GET_VISITOR_LIST = "/admin/visitor/getVisitorList", //获取访客列表
}
//获取访客列表
export const getList = (
  params: CommonListRequest
): Promise<CommonListResponse> => request.get(API.GET_VISITOR_LIST, { params });
