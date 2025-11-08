import request from "@/utils/request";
import { CommonListRequest, CommonListResponse } from "@/api/commonType";
import type { VisitorListResponse } from "./type";

enum API {
	GET_VISITOR_LIST = "/admin/visitor/getVisitorList", //获取访客列表
}
//获取访客列表
export const getVisitorList = (
	params: CommonListRequest
): Promise<VisitorListResponse> =>
	request.get(API.GET_VISITOR_LIST, { params });
