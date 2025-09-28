import { CommonResponse } from "@/api/type";

// 访客地图数据
export interface GeoDataItem {
  name: string;
  value: number;
}
export interface GetGeoDataResponse extends CommonResponse {
  data: Array<GeoDataItem>;
}
