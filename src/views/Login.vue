<template>
  <div class="login-container ub main-center cross-center">
    <!--
  size:用于控制该表单内组件的尺寸大小 有三个值 medium / small / mini
  rules:表单验证规则
  ref：类似于平时的 div 给定的 id
  model: 绑定数据
    -->
    <el-form
      size="medium"
      :rules="rules"
      :model="loginForm"
      ref="loginForm"
      label-width="80px"
      class="login-form"
    >
      <el-form-item label>
        <div class="ub main-center cross-center login-title">系统登录</div>
      </el-form-item>
      <el-form-item prop="username" label>
        <el-input
          type="text"
          v-model="loginForm.username"
          placeholder="输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label>
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" label>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <!-- <img @click="getImage" :src="imgSrc" class="codeImg" /> -->
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <!-- el-row：相当于css3的弹性盒子模型布局，只是一行分为24等份 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-button class="my-button" type="primary" @click="submit()"
              >登录</el-button
            >
          </el-col>
          <el-col :span="12">
            <el-button class="my-button">重置</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        code:""
      },
      rules: {
        username: [
          {
            required: true,
            trigger: "change",
            message: "请输入用户名"
          }
        ],
        password: [
          {
            required: true,
            trigger: "change",
            message: "请输入密码"
          }
        ],
        code: [
          {
            required: true,
            trigger: "change",
            message: "请输入验证码"
          }
        ]
      }
    };
  },
  methods: {
    //登录表单提交
    async submit() {
      let _this = this;
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("username", _this.loginForm.username);
          formData.append("password", _this.loginForm.password);
          let { data: res } = await _this.$http.post(
            "/api/user/login",
            formData
          );
          if (res.code == 200) {
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("userId", res.data.userId);
            //后台登录成功返回的菜单数据
            let menuList = res.data.menuList;
            //路由数据
            let routerList = res.data.routerList;
            let authList = res.data.authList;
            //保存菜单数据
            sessionStorage.setItem("menuList", JSON.stringify(menuList));
            //保存路由数据
            sessionStorage.setItem("routerList", JSON.stringify(routerList));
            //权限
            sessionStorage.setItem("authList", JSON.stringify(authList));
            //动态生成路由和菜单
            this.$store.commit("getMenuList", this.$router);
            //登录成功跳转到home页面
            this.$router.push("home");
          }else{
             _this.$message.error(res.msg)
            return;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-title {
  font-size: 24px;
  font-weight: 600;
}

.login-container {
  height: 100%;
}

.login-form {
  height: 300px;
  width: 350px;
  border-radius: 10px;
  box-shadow: 0 0 25px #cac6c6;
  padding: 20px 35px;
}
/*覆盖elememt-UI 输入框原本的样式
    .login-container /deep/ .el-form-item__content {
        margin-left: 0 !important;
    }*/

.my-button {
  width: 100%;
}
</style>