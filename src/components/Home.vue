<template>
  <el-container class="home-contianer">
    <!-- 头部区域 -->
  <el-header>
    <div>
      <img src="../assets/timg.jpg" alt="">
      <span>后台管理系统</span>
    </div>
    <div>
      <span class="username">欢迎,{{username}}</span>
      <el-button type="info" @click="logout">退出</el-button>
    </div>
    </el-header>
  <!-- 页面主题区域 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <!-- 侧边栏菜单区 -->
      <el-menu background-color="#333744" text-color="#fff" 
      active-text-color="#409BFF" unique-opened :router = true default-active = this.$route.path>
        <!-- 1级菜单 -->
        <el-submenu index="1">
          <!-- 一级菜单的模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-setting"></i>
            <!-- 文本 -->
            <span>系统管理</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item index="user">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>用户管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="role">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>角色管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="perms">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-star-on"></i>
              <!-- 文本 -->
              <span>资源权限管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="1-1">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-star-on"></i>
              <!-- 文本 -->
              <span>访问日志</span>
            </template>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="2">
          <!-- 一级菜单的模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-folder-opened"></i>
            <!-- 文本 -->
            <span>基础数据</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item index="product">
            <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-star-on"></i>
            <!-- 文本 -->
            <span>产品管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="order">
            <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-star-on"></i>
            <!-- 文本 -->
            <span>订单管理</span>
            </template>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="3">
          <!-- 一级菜单的模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-folder-opened"></i>
            <!-- 文本 -->
            <span>菜单管理</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item index="menu">
            <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-star-on"></i>
            <!-- 文本 -->
            <span>菜单列表</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 右侧内容主题 -->
    <el-main>
      <router-view></router-view>
      </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      username: '',
    }
  },
  created() {
    const name = window.sessionStorage.getItem('username')
    this.username = name
  },
  methods: {
    logout() {
      // window.sessionStorage.clear;
      window.sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>

<style lang="less" scoped>
.home-contianer {
  height: 100%
}
.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 16px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.username {
margin-right: 10px;
color: red;
}

img {
  border-radius: 50%;
}
</style>

