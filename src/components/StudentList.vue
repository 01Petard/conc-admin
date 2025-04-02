<template>
  <div class="table-container">
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑学生信息"
      :visible.sync="editDialogVisible"
      width="80%"
      :fullscreen="false"
      :close-on-click-modal="false"
    >
      <div class="dialog-container">
        <el-form
          :model="formData"
          label-width="100px"
          class="custom-form"
        >
          <!-- 人脸照片（缩小尺寸并居中） -->
          <el-form-item label="人脸照片">
            <div class="face-container">
              <img
                v-if="formData.faceimg"
                :src="formData.faceimg"
                alt="人脸图片"
                style="width: 80px; height: 80px; object-fit: cover; border: 1px solid #ddd;"
              />
              <span v-else style="color: #999">暂无照片</span>
            </div>
          </el-form-item>

          <!-- 表单内容分组 -->
          <div class="form-group">
            <!-- 基础信息（学号、姓名、性别） -->
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="学号">
                  <el-input v-model="formData.sno" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="姓名">
                  <el-input v-model="formData.sname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别">
                  <el-select v-model="formData.ssex" placeholder="请选择性别">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 学院、班级、手机号（并排布局） -->
          <div class="form-group">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="学院">
                  <el-input v-model="formData.sdept"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="班级">
                  <el-input v-model="formData.clazzName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号">
                  <el-input v-model="formData.sphone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <!-- 按钮区域 -->
        <span slot="footer" class="dialog-footer" style="float: right;">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
       </span>
      </div>
    </el-dialog>
    <!-- 搜索框和查询按钮 -->
    <div class="search-wrapper">
      <el-input
        v-model="search"
        size="medium"
        placeholder="请输入姓名或学号"
        clearable
        class="search-input"
      />

      <el-button type="primary" size="medium" @click="handleSearch">查询学生信息</el-button>

      <!-- 日期范围选择组件 -->
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        class="date-picker"
        style="margin: 0 10px 0 50px;height: 36px"
      />

      <el-button type="primary" size="medium" @click="handleExport">导出学生考勤数据</el-button>
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
      <el-table-column align="center" prop="sno" label="学号"></el-table-column>
      <el-table-column align="center" prop="sname" label="姓名"></el-table-column>

      <!-- 人脸列，使用 slot 渲染图片 -->
      <el-table-column align="center" label="人脸">
        <template slot-scope="scope">
          <img v-if="scope.row.faceimg" :src="scope.row.faceimg" alt="人脸图片" style="width: 50px; height: 50px; object-fit: cover;"/>
          <span v-else>无图片</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="ssex" label="性别"></el-table-column>
      <el-table-column align="center" prop="sdept" label="学院"></el-table-column>
      <el-table-column align="center" prop="clazzName" label="班级"></el-table-column>
      <el-table-column align="center" prop="sphone" label="手机"></el-table-column>

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
              title="确定删除该学生信息吗？"
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
  name: "StudentList",
  data() {
    return {
      editDialogVisible: false,
      formData: {
        sno: '',
        sname: '',
        ssex: '',
        sdept: '',
        clazzName: '',
        sphone: ''
      },
      tableData: [],  // 学生数据
      search: "",     // 搜索字段
      dateRange: [], // 存储日期范围 [开始日期, 结束日期]
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
      console.log('查询条件：', this.search, '日期范围：', this.dateRange[0], this.dateRange[1]);
      this.fetchStudents();  // 搜索后重新获取数据
    },
    // 修改后的编辑方法
    handleEdit(row) {
      this.formData = {
        ...row,
      }
      this.editDialogVisible = true

    },

    // 提交编辑
    async submitEdit() {
      try {
        const response = await axios.put('/api/students', this.formData)
        if (response.data.code === 10000) {
          this.$message.success('修改成功')
          await this.fetchStudents()
          this.editDialogVisible = false
        }
      } catch (error) {
        this.$message.error('修改失败')
      }
    },

    // 修改后的删除方法
    async handleDeleteConfirm(row) {
      try {
        await axios.delete(`/api/students/${row.sno}`)
        this.$message.success('删除成功')
        await this.fetchStudents()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    handleExport() {
      console.log('导出考勤数据，日期范围：', this.dateRange[0], this.dateRange[1]);
    },
    // 获取学生数据
    async fetchStudents() {
      try {
        // 调用后端接口获取学生列表
        const response = await axios.get('http://localhost:18080/student/list');
        console.log(response.data);
        if (response.data.code === 10000) {
          // 更新表格数据
          this.tableData = response.data.data.map(student => ({
            sno: student.sno,
            sname: student.sname,
            ssex: student.ssex,
            sdept: student.sdept,
            clazzId: student.clazzId,
            clazzName: student.clazzName,
            sidnum: student.sidnum,
            sphone: student.sphone,
            faceimg: student.faceimg,
          }));
        } else {
          console.error("获取学生数据失败:", response.data.msg);
        }
      } catch (error) {
        console.error("获取学生数据失败", error);
      }
    },
  },
  mounted() {
    this.fetchStudents();
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

/* 调整图片展示样式 */
.el-form-item__content img {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dialog-container {
  max-height: 80vh; /* 对话框内容最大高度（根据需求调整） */
  overflow-y: auto; /* 超出时显示滚动条 */
  padding: 20px;
}

.custom-form {
  padding: 0 20px;
  margin-bottom: 20px;
}

/* 缩小 el-form-item 的内边距 */
.el-form-item {
  margin-bottom: 15px !important; /* 减少垂直间距 */
}

/* 人脸容器样式 */
.face-container {
  text-align: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

/* 表单分组样式 */
.form-group {
  margin-bottom: 15px;
}

/* 调整 el-row 的布局 */
.el-row {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

/* 确保表单元素宽度自适应 */
.el-col {
  .el-form-item__content {
    width: 100%;
  }
}
</style>
