<template>
    <div class="login-container ub main-center cross-center">
        <el-form size="medium" :model="loginForm" ref="loginForm" label-width="80px" class="login-form">
            <el-form-item label>
                <div class="ub main-center cross-center login-title">系统登录</div>
            </el-form-item>
            <el-form-item label>
                <el-input v-model="loginForm.username" placeholder="输入用户名"></el-input>
            </el-form-item>
            <el-form-item label>
                <el-input v-model="loginForm.password" placeholder="输入密码"></el-input>
            </el-form-item>

            <el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-button class="my-button" type="primary" @click="onSubmit">登录</el-button>
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
                    password: ""
                }
            };
        },
        methods: {
            //登录表单提交 
            Submit() {
                
              this.$refs.loginForm.validate(valid => {
                if(valid) {
                //   let parm = {
                //     username: this.loginForm.username,
                //     password: this.loginForm.password 
                //   }
                //   let { data: res} = this.$http.post("/api/user/login",parm);
                   let formData = new FormData(); 
                   datafor.append("username", this.loginForm.username); 
                   datafor.append("password", this.loginForm.password); 
                   //datafor.append("code", this.loginForm.code); 
                   const { data: res } = this.$http.post("/api/user/login", formData);
                } 

              })

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