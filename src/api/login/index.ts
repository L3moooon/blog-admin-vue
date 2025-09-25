import request from "@/utils/request";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  EmailCaptchaRequest,
} from "./type";

enum API {
  LOGIN = "/admin/user/login", //登录
  REGISTER = "/admin/user/register", //注册
  GET_EMAIL_CAPTCHA = "/admin/user/getEmailCaptcha", //获取邮箱验证码
  RESET_PASSWORD = "/admin/user/forgetPassword", //忘记密码
  MODIFY_INFO = "", //修改个人信息
}

export const login = (data: LoginRequest): Promise<LoginResponse> =>
  request.post(API.LOGIN, data);

export const register = (data: RegisterRequest): Promise<RegisterResponse> =>
  request.post(API.REGISTER, data);

export const getEmailCaptcha = (
  data: EmailCaptchaRequest
): Promise<RegisterResponse> => request.post(API.GET_EMAIL_CAPTCHA, data);
