<template>
  <div>
    <h1 class="page-title">容器组件的使用</h1>
    <!-- 创建容器 -->
    <el-container class="container">
      <el-aside class="aside">
        <el-menu default-active="dashboard" class="menu" mode="vertical">
          <!-- 首页：仪表盘 -->
          <el-menu-item index="dashboard">
            <router-link to="/dashboard">仪表盘</router-link>
          </el-menu-item>

          <!-- 学生管理 -->
          <el-submenu index="student-management">
            <template slot="title">学生管理</template>
            <el-menu-item index="student-list">
              <router-link to="/student-list">学生列表</router-link>
            </el-menu-item>
            <el-menu-item index="student-add">
              <router-link to="/student-add">添加学生</router-link>
            </el-menu-item>
          </el-submenu>

          <!-- 班级管理 -->
          <el-submenu index="class-management">
            <template slot="title">班级管理</template>
            <el-menu-item index="class-list">
              <router-link to="/class-list">班级列表</router-link>
            </el-menu-item>
            <el-menu-item index="class-add">
              <router-link to="/class-add">添加班级</router-link>
            </el-menu-item>
          </el-submenu>

          <!-- 人脸库管理 -->
          <el-submenu index="face-library-management">
            <template slot="title">人脸库管理</template>
            <el-menu-item index="face-list">
              <router-link to="/face-list">人脸列表</router-link>
            </el-menu-item>
            <el-menu-item index="face-upload">
              <router-link to="/face-upload">上传人脸</router-link>
            </el-menu-item>
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
  name: "Container"
};
</script>

<style scoped>
/* 页面标题样式 */
.page-title {
  text-align: center;
  font-size: 32px;
  margin: 20px;
  color: #333;
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
  flex: 0 0 300px; /* 固定宽度 */
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
  background-color: #3f51b5;
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
