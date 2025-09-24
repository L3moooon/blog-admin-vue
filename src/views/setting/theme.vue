<template>
  <div class="title">主题设置</div>
  <el-form
    :model="form"
    label-position="left"
    label-width="auto">
    <el-row>
      <el-col :span="4">
        <el-form-item label="用户昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
      </el-col>
      <el-col
        :span="6"
        :offset="1">
        <el-form-item label="格言">
          <el-input v-model="form.motto" />
        </el-form-item>
      </el-col>
      <el-col
        :span="8"
        :offset="1">
        <el-form-item label="展示页欢迎语">
          <el-input v-model="form.welcome" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="用户头像">
          <el-col :span="3">
            <el-image
              class="preview-img"
              :src="form.portrait"
              fit="contain"
              @click.stop
              :preview-src-list="[form.portrait]">
            </el-image
          ></el-col>
          <el-col :span="4">
            <el-upload
              class="uploader"
              :http-request="handleUploadPortrait"
              accept=".jpg,.png"
              :show-file-list="false"
              list-type="picture-card"
              :limit="1"
              on-exceed="handExceedImg"
              :before-upload="beforeAvatarUpload">
              <img
                class="add"
                src="/src/assets/icons/add.png"
                alt="" />
              <div class="tips">限制一张图片，新头像将覆盖旧头像</div>
            </el-upload>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="展示页图片">
          <div class="upload-container">
            <el-image
              class="preview-img"
              v-for="item in form.bg_img"
              :src="item"
              fit="cover"
              limit="5"
              @click.stop
              :preview-src-list="[form.bg_img]"></el-image>
            <el-upload
              class="uploader"
              :http-request="handleUploadBGI"
              accept=".jpg,.png"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload">
              <img
                class="add"
                src="/src/assets/icons/add.png"
                alt="" />
            </el-upload>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-form-item label="个人链接">
        <div class="link-container">
          <div
            class="link"
            v-for="(item, index) in form.url">
            <span>名称：{{ item.name }}</span
            ><span>&emsp;</span>
            <span>地址：{{ item.address }}</span>
            <div
              class="delete"
              @click="delLink(index)"></div>
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-input
              v-model="form.singlePoem"
              placeholder="填写名称"
              @change="addPoem">
            </el-input>
          </el-col>
          <el-col
            :span="12"
            :offset="1">
            <el-input
              v-model="form.singlePoem"
              placeholder="填写地址"
              @change="addPoem">
            </el-input>
          </el-col>
          <el-col
            :span="2"
            :offset="1">
            <el-button>添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-row>

    <el-form-item label="诗句">
      <div class="poem-container">
        <div
          class="poem"
          v-for="(item, index) in form.saying">
          <span>{{ item }}</span>
          <div
            class="delete"
            @click="delSaying(index)"></div>
        </div>
      </div>

      <el-input
        v-model="form.singlePoem"
        placeholder="添加诗句"
        @change="addPoem">
        <template #prefix>
          <img
            class="random"
            src="/src/assets/icons/add.png"
            alt="" />
        </template>
        <template #suffix>
          <img
            class="random"
            src="/src/assets/icons/random.png"
            @click="getPoem"
            alt="" />
        </template>
      </el-input>
    </el-form-item>
    <el-button @click="confirmUpdate">确定修改</el-button>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { upload } from "/src/api/public";
import { getThemeInfo, modiThemeInfo } from "../../api/setting/theme";
import { getRandomPoem } from "../../api/public/external";
import { ElMessage } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
const form = reactive({});

//上传头像
const handleUploadPortrait = async (e) => {
  const { file } = e;
  // 创建FormData对象
  const formData = new FormData();
  formData.append("file", file);
  // 调用封装好的request
  const { data, status } = await upload(formData);
  if (status == 1) {
    console.log(data);
    form.portrait = data.url;
  }
};
const showImgPreview = ref(false);
const handlePictureCardPreview = (file) => {
  console.log(file);
};
const handExceedImg = () => {};
//上传首页背景图片
const handleUploadBGI = async (e) => {
  const { file } = e;
  // 创建FormData对象
  const formData = new FormData();
  formData.append("file", file);
  // 调用封装好的request
  const { data, status } = await upload(formData);
  if (status == 1) {
    console.log(data);
    form.bg_img.push(data.url);
  }
};
const beforeAvatarUpload = () => {
  //检查格式
  return true;
};

const getTheme = async () => {
  const { data, status } = await getThemeInfo();
  if (status == 1) {
    Object.assign(form, data);
    console.log(form);
  }
};
const getPoem = async () => {
  const { data } = await getRandomPoem();
  console.log(data);
};
onMounted(() => {
  getTheme();
});
const addPoem = () => {
  form.saying.push(form.singlePoem);
  form.singlePoem = "";
};
const confirmUpdate = async () => {
  console.log(form);
  const { status } = await modiThemeInfo(form);
  if (status == 1) {
    ElMessage.success("修改成功");
  }
};
const delSaying = (index) => {
  form.saying.splice(index, 1);
};
const delLink = (index) => {
  form.url.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
  display: flex;
  gap: 15px;
}
.preview-img {
  width: 148px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.uploader {
  position: relative;
  .add {
    width: 50px;
    position: absolute;
    top: 30px;
    // padding: 120px;
  }
  .tips {
    position: absolute;
    bottom: 0;
    text-align: center;
  }
}

.poem-container,
.link-container {
  cursor: default;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  .poem,
  .link {
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    background-color: antiquewhite;
    padding: 0 10px;
    position: relative;
    &:hover {
      // background-color: blue;
      .delete {
        background-image: url("/src/assets/icons/delete.png");
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
        width: 20px;
        height: 20px;
        position: absolute;
        right: -10px;
        top: -10px;
      }
    }
  }
}

.random {
  width: 15px;
  cursor: pointer;
}
</style>
