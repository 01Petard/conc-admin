<template>
  <div class="table-container">
    <!-- 搜索框和查询按钮 -->
    <div class="search-wrapper">
      <el-input
        v-model="search"
        size="medium"
        placeholder="请输入班级或课程名称"
        clearable
        class="search-input"
      />
      <el-button type="primary" size="medium" @click="handleSearch">查询</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      ref="mytable"
      :data="filteredData"
      empty-text="暂无数据"
      :row-class-name="showCss"
      highlight-current-row
      :show-header="true"
      :fit="true"
      size="medium"
      border
    >
      <el-table-column align="center" prop="vname" label="班级名"></el-table-column>
<!--      <el-table-column align="center" prop="createTime" label="上课时间"></el-table-column>-->
      <el-table-column align="center" prop="cname" label="课程名"></el-table-column>
      <el-table-column align="center" label="课堂视频">
        <template slot-scope="scope">
          <img v-if="scope.row.vimg" :src="scope.row.vimg" alt="人脸图片" style="width: 50px; height: 50px; object-fit: cover;" />
          <span v-else>无图片</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="status" label="处理状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '已处理' : '未处理' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <div class="button-container">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              class="edit-btn"
            >处理</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              class="delete-btn"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "VideoList",
  data() {
    return {
      tableData: [],  // 视频数据
      search: "",     // 搜索字段
    };
  },
  computed: {
    filteredData() {
      return this.tableData.filter(
        (data) =>
          !this.search ||
          data.sname.toLowerCase().includes(this.search.toLowerCase()) ||
          data.sno.toString().includes(this.search)
      );
    },
  },
  methods: {
    // 表格行样式
    showCss({row, rowIndex}) {
      return rowIndex % 2 === 0 ? "warning-row" : "success-row";
    },
    // 选择某一行
    selectRow(selection, row) {
      console.log(selection, row);
    },
    // 清空选择
    clearSelect() {
      this.$refs.mytable.clearSelection();
    },
    // 搜索功能
    handleSearch() {
      console.log("搜索内容：", this.search);
      this.fetchStudents();  // 搜索后重新获取数据
    },
    // 编辑操作
    handleEdit(index, row) {
      console.log("编辑", index, row);
      // 跳转到编辑页面或弹出编辑框
    },
    // 删除操作
    handleDelete(index, row) {
      console.log("删除", index, row);
      // 调用 API 删除
      axios.delete(`/api/students/${row.sno}`).then(() => {
        this.fetchStudents();  // 删除后刷新列表
      });
    },
    // 获取本地图片路径
    getLocalImagePath(facePath) {
      if (facePath) {
        // 将本地路径转换为 file 协议路径
        return `file:///${facePath.replace(/\\/g, '/')}`;
      }
      return ""; // 如果没有图片路径，则返回空字符串
    },
    // 获取视频数据 (异步函数)
    async fetchVideos() {
      try {
        // 调用后端接口获取视频列表
        const response = await axios.get('http://localhost:18080/video/list');
        console.log(response.data);
        if (response.data.code === 10000) {
          // 更新表格数据
          this.tableData = response.data.data.map(video => ({
            vid: video.vid,
            vname: video.vname,
            vimg: video.vimg,
            cname: video.cname,
            status: video.status,
            createTime: new Date(video.createTime).toLocaleString(),
          }));
        } else {
          console.error("获取视频数据失败:", response.data.msg);
        }
      } catch (error) {
        console.error("获取视频数据失败", error);
      }
    },
  },
  mounted() {
    this.fetchVideos();
  },
};
</script>

<style scoped>

/* 让 table-container 适应内容高度 */
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* 确保表格外层的 div 占满高度 */
div {
  overflow: hidden;
}

/* 让页面高度自适应 */
html, body {
  height: auto;
  overflow-x: hidden; /* 禁止横向滚动 */
}

/* 让搜索框和表格占据全部可用空间 */
.search-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.el-table {
  width: 100%;
}

/* 搜索框样式 */
.search-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
  margin-right: 10px;
}

/* 清空选择按钮样式 */
.clear-btn {
  margin-top: 20px;
}

/* 按钮样式 */
.edit-btn {
  margin-right: 5px;
}

.delete-btn {
  margin-left: 5px;
}

/* 表格样式 */
.el-table th,
.el-table td {
  font-size: 14px;
  padding: 10px;
}
.button-container {
  display: flex;
  justify-content: center; /* 居中按钮 */
  align-items: center; /* 垂直居中按钮 */
}

.button-container .el-button {
  margin: 0 5px; /* 给按钮之间添加一些间距 */
}
</style>
