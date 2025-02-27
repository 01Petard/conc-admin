<template>
  <div id="app">
    <a href="#/button">点我显示button</a>
    <a href="#/buttondetail">按钮组件的详细使用</a>
    <a href="#/link">文字链接组件</a>
    <a href="#/layout">布局组件的使用</a>
    <a href="#/container">容器布局组件的使用</a>
    <a href="#/containerexam">容器布局组件实例</a>
    <a href="#/radio">radio组件的使用</a>
    <a href="#/checkbox">checkbox组件的使用</a>
    <a href="#/input">input组件的使用</a>
    <a href="#/select">Select组件的使用</a>
    <a href="#/switch">switch组件的使用</a>
    <a href="#/datePickers">DatePicker组件的使用</a>
    <a href="#/upload">Upload组件的使用</a>
    <a href="#/form">Form组件的使用</a>
    <a href="#/msg">Message组件的使用</a>

    <h1 class="page-title">学生课堂专注度管理系统</h1>
    <!-- 创建容器 -->
    <el-container class="container">
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

    <el-footer class="footer">
      <h1>我是页脚</h1>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    // 跳转到指定路由
    navigateTo(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
/* 页面标题样式 */
.page-title {
  text-align: center;
  font-size: 32px;
  margin: 20px;
  color: #333;

  background-color: #81C784;
  line-height: 100px;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
}

/* 容器整体样式 */
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: row; /* 使布局为行排列 */
}

/* 左侧菜单样式 */
.aside {
  background-color: #f4f7fb;
  color: #333;
  border-right: 2px solid #ddd;
  flex: 0 0 200px; /* 固定宽度 */
  display: flex;
  flex-direction: column;
}

/* 主要内容区样式 */
.main {
  flex: 1; /* 主体内容区域占用剩余空间 */
  background-color: #ffffff;
  color: #333;
  padding: 20px; /* 给主区域添加一些间距 */
}

/* footer样式 */
.footer {
  background-color: #81C784;
  color: white;
  text-align: center;
  line-height: 100px;
  font-size: 18px;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
}

/* 栅格布局优化 */
.menu {
  width: 100%; /* 菜单宽度适应父容器 */
  padding-top: 20px;
}

.menu a {
  text-decoration: none;
  color: inherit;
}
</style>
