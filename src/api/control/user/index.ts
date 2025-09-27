import request from "@/utils/request";
import { CommonListRequest, CommonListResponse } from "@/api/type";

enum API {
  GET_Admin_LIST = "/admin/user/getAdminList", //获取所有用户列表
}

export const getAdminList = (
  params: CommonListRequest
): Promise<CommonListResponse> => request.get(API.GET_Admin_LIST, { params });
