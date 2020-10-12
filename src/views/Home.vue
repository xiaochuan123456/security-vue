<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header class="header ub main-justify cross-center">
      <div class="header-left-text">权限管理系统</div>
      <div class="ub main-center cross-center">
        <el-dropdown placement="bottom-start">
          <img class="user-img" src="../assets/img/logo.png" alt />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="user-role">
          <div class="wollcom">欢迎您，管理员</div>
          <div class="header-time">2020.4.20 12:55:20 星期三</div>
        </div>
      </div>
    </el-header>
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside width="200px" style="background:blue;">Aside</el-aside>
      <!-- 右侧内容显示区 -->
      <el-container style="background:#B15BFF">
        <el-main style="background:#FFF;">Main</el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {}
};
</script>
<style lang="css" scope>
.home {
  height: 100%;
}
.header {
  background-color: #167bd8;
  color: #fff;
}
.header-left-text {
  font-size: 20px;
}
.user-img {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  cursor: pointer;
}
.user-role {
  margin-left: 10px;
}
.wollcom {
  font-size: 15px;
  font-weight: bolder;
}
.header-time {
  font-size: 14px;
}
</style>
