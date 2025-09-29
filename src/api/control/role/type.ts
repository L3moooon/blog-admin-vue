import { CommonResponse } from "@/api/type";

export interface UserItem {
  id: number;
  account: string;
  name: string;
  avatar: string;
  ip: string;
  location: string;
  create_time: string;
  last_login_time: string;
  status: boolean;
}
export interface UserListResponse extends CommonResponse {
  data: Array<UserItem>;
}
