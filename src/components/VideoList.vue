<template>
  <div class="table-container">
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑视频信息"
      :visible.sync="editDialogVisible"
      width="30%"
    >
      <el-form :model="formData" label-width="80px">
        <el-form-item label="班级名">
          <el-input v-model="formData.vname"></el-input>
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="formData.cname"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-button
            :type="formData.status === 1 ? 'success' : 'danger'"
          >
            {{ formData.status === 1 ? '已处理' : '未处理' }}
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
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
          <img v-if="scope.row.vimg" :src="scope.row.vimg" alt="人脸图片" style="width: 50px; height: 50px; object-fit: cover;"/>
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
              type="primary"
              @click="handleEdit(scope.row)"
              class="edit-btn"
            >编辑
            </el-button>
            <el-popconfirm
              title="确定删除本条数据吗？"
              @confirm="handleDeleteConfirm(scope.row)"
              placement="top"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                class="delete-btn"
              >删除
              </el-button>
            </el-popconfirm>
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
      editDialogVisible: false,
      formData: {
        vid: '',
        vname: '',
        cname: '',
        status: 0
      },
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
    // 编辑按钮点击
    handleEdit(row) {
      this.formData = {...row} // 复制行数据到表单
      this.editDialogVisible = true
    },

    // 提交编辑
    async submitEdit() {
      try {
        const response = await axios.put('/api/videos', this.formData)
        if (response.data.code === 10000) {
          this.$message.success('修改成功')
          this.fetchVideos()
          this.editDialogVisible = false
        }
      } catch (error) {
        this.$message.error('修改失败')
      }
    },

    // 删除确认
    async handleDeleteConfirm(row) {
      try {
        await axios.delete(`/api/videos/${row.vid}`)
        this.$message.success('删除成功')
        this.fetchVideos()
      } catch (error) {
        this.$message.error('删除失败')
      }
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
