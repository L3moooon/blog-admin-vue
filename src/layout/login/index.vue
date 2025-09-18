<template>
  <div class="background">
    <div class="login-container">
      <div class="img">
        <img
          src="/src/assets/微信图片_20250804164132_7.png"
          alt="" />
      </div>
      <div class="title">时雨博客后台</div>
      <el-tabs
        v-model="activeName"
        class="demo-tabs">
        <el-tab-pane
          label="账号登录"
          name="first">
          <!-- 登录 -->
          <el-form
            :model="loginForm"
            :rules="loginRules"
            ref="loginFormRef"
            label-position="left">
            <el-form-item
              label="账号:"
              prop="account">
              <el-input v-model="loginForm.account" />
            </el-form-item>
            <el-form-item
              label="密码:"
              prop="password">
              <el-input
                v-model="loginForm.password"
                show-password />
            </el-form-item>
            <el-button
              class="login"
              @click="login(loginFormRef)"
              type="primary"
              >登录</el-button
            >
          </el-form>
          <div class="func">
            <el-button
              class="forget"
              @click="forgetPwd">
              忘记密码？
            </el-button>
            <el-button
              class="register"
              @click="register">
              注册
            </el-button>
          </div></el-tab-pane
        >
        <el-tab-pane
          label="免密登录"
          name="second">
          <el-form
            :model="loginForm"
            :rules="loginRules"
            ref="loginFormRef"
            label-width="auto"
            label-position="left">
            <el-form-item
              label="邮箱:"
              prop="account">
              <el-input v-model="loginForm.account" />
            </el-form-item>
            <el-form-item
              label="验证码:"
              prop="password">
              <el-input v-model="loginForm.password">
                <template #append>
                  <el-button
                    class="code"
                    @click="login(loginFormRef)"
                    >获取验证码</el-button
                  ></template
                >
              </el-input>
            </el-form-item>

            <el-button
              class="login"
              @click="login(loginFormRef)"
              type="primary"
              >登录</el-button
            >
            <el-form-item label="其他登录方式:">
              <img
                src=""
                class="qq"
                alt="" />
              <img
                src=""
                class="wechat"
                alt="" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="注册"
          name="third">
          <!-- 注册 -->
          <div class="register-container">
            <el-form
              :rules="registerRules"
              ref="registerFormRef"
              :model="registerForm"
              label-position="left">
              <el-form-item
                label="昵称:"
                prop="name">
                <el-input v-model="registerForm.name" />
              </el-form-item>
              <el-form-item
                label="账号:"
                prop="account">
                <el-input v-model="registerForm.account" />
              </el-form-item>
              <el-form-item
                label="密码:"
                prop="password">
                <el-input v-model="registerForm.password" />
              </el-form-item>
              <el-button
                class="register-btn"
                @click="createNewCount(registerFormRef)"
                type="primary"
                >注册账号</el-button
              >
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { login as userLogin, register as userRegister } from "../../api/login";
import { ElMessage } from "element-plus";
import { useUserStore } from "../../store/user";

const router = useRouter();
const userStore = useUserStore();

const activeName = ref("first");

const showRegister = ref(false);
const loginFormRef = ref();
const registerFormRef = ref();
const loginForm = reactive({
  account: "", //邮箱账号
  password: "", //密码
});
const registerForm = reactive({
  name: "",
  account: "", //邮箱账号
  password: "", //密码
});
const loginRules = reactive({
  account: [
    {
      required: true,
      message: "请输入账号",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
});
const registerRules = reactive({
  name: [
    {
      required: true,
      message: "请输入昵称",
      trigger: "blur",
    },
  ],
  account: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
});
//登录
const login = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      userStore.login(loginForm.account, loginForm.password);
    }
  });
};
//注册
const register = () => {
  // showRegister.value = true;
  activeName.value = "third";
};
const createNewCount = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      const data = await userRegister({
        name: registerForm.name,
        email: registerForm.account,
        password: registerForm.password,
      });
      console.log(data);
      if (data.status == 1) {
        ElMessage({
          type: "success",
          message: "注册成功",
        });
        showRegister.value = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style lang="scss" scoped>
.background {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #cebeaf;
  background-repeat: no-repeat;
  background-size: cover;
  .login-container {
    width: 500px;
    height: 320px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    right: 0;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    .img {
      width: 200px;
      height: 200px;
      position: absolute;
      left: 50%;
      top: -61%;
      transform: translateX(-36%);
      z-index: -1;
      img {
        width: 100%;
      }
    }
    .title {
      width: 100%;
      text-align: center;
      font-size: 22px;
      margin: 15px 0 10px 0;
    }
    .code {
      // width: 80px;
    }
    .login {
      width: 100%;
      margin-top: 5px;
      margin-left: 0;
    }
    .func {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      .forget,
      .register {
        width: 49%;
      }
    }
    .register-btn {
      width: 100%;
      margin-top: 5px;
    }
  }
}
:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
:deep(.el-tabs__content) {
  padding: 5px 50px;
}
</style>
