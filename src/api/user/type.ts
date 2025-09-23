export interface loginParam {
  type: "account" | "email" | "phone";
  account?: string;
  password?: string;
  tel?: string;
  captcha?: string;
}
export interface loginResponse {}
export interface registerParam {
  account: string;
  password: string;
}
