import request from "@/utils/request";
import { loginParam, registerParam } from "./type";

enum API {
  LOGIN = "/admin/administrator/login",
  REGISTER = "/admin/administrator/register",
}
//用户登录
export const login = (data: loginParam) => {
  return request.post<>({
    url: "/admin/administrator/login",
    method: "post",
    data,
  });
};
// export const login = (data) => {
//   return request({
//     url: "/admin/administrator/login",
//     method: "post",
//     data,
//   });
// };
//用户注册
export const register = (data) => {
  return request({
    url: "/admin/administrator/register",
    method: "post",
    data,
  });
};
//用户忘记密码
export const forgetPassword = (data) => {
  return request({
    url: "/admin/administrator/forgetPassword",
    method: "post",
    data,
  });
};
