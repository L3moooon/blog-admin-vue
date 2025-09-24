import request from "@/utils/request";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./type";

enum API {
  LOGIN = "/admin/administrator/login", //登录
  REGISTER = "/admin/administrator/register", //注册
  RESET_PASSWORD = "/admin/administrator/forgetPassword", //忘记密码
  MODIFY_INFO = "", //修改个人信息
}

export const login = (data: LoginRequest): Promise<LoginResponse> =>
  request.post(API.LOGIN, data);

export const register = (data: RegisterRequest): Promise<RegisterResponse> =>
  request.post(API.REGISTER, data);
