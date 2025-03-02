<template>
  <div id="app">
    <!-- 头部导航栏 -->
    <el-header class="header">
      <div class="header-left">
        <i class="el-icon-monitor" style="font-size: 24px;"></i>
<!--        <i class="el-icon-user"></i>-->
<!--        <i class="el-icon-setting"></i>-->
<!--        <i class="el-icon-bell"></i>-->
<!--        <i class="el-icon-search"></i>-->
<!--        <i class="el-icon-edit"></i>-->
<!--        <i class="el-icon-delete"></i>-->
<!--        <i class="el-icon-warning"></i>-->
        <span class="system-name">学生课堂专注度管理系统</span>
      </div>
      <div class="header-right">
        <span class="current-time">{{ currentTime }}</span>
        <el-dropdown>
          <span class="user-info">
            <i class="el-icon-user"  style="font-size: 20px;"></i> {{ username }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 创建容器 -->
    <el-container class="container">
      <!-- 侧边栏 -->
      <el-aside class="aside">
        <el-menu default-active="dashboard" class="menu" mode="vertical">
          <!-- 首页：仪表盘 -->
          <el-menu-item index="dashboard" @click="navigateTo('/dashboard')">专注度分析</el-menu-item>

          <!-- 视频管理 -->
          <el-submenu index="video-management">
            <template slot="title">视频管理</template>
            <el-menu-item index="video-list" @click="navigateTo('/video-list')">视频列表</el-menu-item>
            <el-menu-item index="video-add" @click="navigateTo('/video-add')">添加视频</el-menu-item>
          </el-submenu>

          <!-- 学生管理 -->
          <el-submenu index="student-management">
            <template slot="title">学生管理</template>
            <el-menu-item index="student-list" @click="navigateTo('/student-list')">学生列表</el-menu-item>
            <el-menu-item index="student-add" @click="navigateTo('/student-add')">添加学生</el-menu-item>
          </el-submenu>

          <!--          &lt;!&ndash; 班级管理 &ndash;&gt;-->
          <!--          <el-submenu index="class-management">-->
          <!--            <template slot="title">班级管理</template>-->
          <!--            <el-menu-item index="class-list" @click="navigateTo('/class-list')">班级列表</el-menu-item>-->
          <!--            <el-menu-item index="class-add" @click="navigateTo('/class-add')">添加班级</el-menu-item>-->
          <!--          </el-submenu>-->

          <!-- 人脸库管理 -->
          <el-submenu index="face-library-management">
            <template slot="title">人脸库管理</template>
            <el-menu-item index="face-upload" @click="navigateTo('/face-upload')">上传人脸</el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main class="main">
        <router-view/> <!-- 显示当前页面的内容 -->
      </el-main>
    </el-container>

    <!-- 页脚 -->
    <el-footer class="footer">
      <p>© 2025 学生课堂专注度管理系统 | 由 黄泽校 开发</p>
      <p>备案号：京ICP备20250001号</p>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      username: "Admin",
      currentTime: "",
    };
  },
  methods: {
    // 跳转到指定路由
    navigateTo(path) {
      this.$router.push(path);
    },
    logout() {
      console.log("退出登录");
      // this.$router.push("/login");
    },
    updateTime() {
      this.currentTime = new Date().toLocaleString();
    }
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  }
}
</script>

<style scoped>
/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #81C784;
  color: black;
  padding: 10px 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.system-name {
  font-size: 20px;
  margin-left: 10px;
}

.header-right {
  display: flex;
  align-items: center;
}

.current-time {
  margin-right: 20px;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* 主容器布局 */
.container {
  display: flex;
  min-height: calc(100vh - 120px);
}

/* 侧边栏 */
.aside {
  background: #f4f7fb;
  border-right: 2px solid #ddd;
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 主内容区 */
.main {
  flex: 1;
  padding: 20px;
  background: white;
}

/* 页脚 */
.footer {
  text-align: center;
  background: #81C784;
  color: white;
  padding: 10px;
  font-size: 14px;
}
</style>
