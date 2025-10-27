import request from "@/utils/request";
import { CommonListRequest, CommonListResponse } from "@/api/type";

enum API {
  GET_MUSIC_LIST = "/admin/visitor/getMusicList", //获取音乐列表
  DELETE_MUSIC = "/admin/visitor/deleteMusic", //删除音乐
}
//获取访客列表
export const getMusicList = (
  params: CommonListRequest
): Promise<CommonListResponse> => request.get(API.GET_MUSIC_LIST, { params });

export const deleteMusic = (id: number): Promise<CommonListResponse> =>
  request.delete(`${API.DELETE_MUSIC}/${id}`);
