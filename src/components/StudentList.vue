<template>
  <div class="table-container">
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑学生信息"
      :visible.sync="editDialogVisible"
      width="50%"
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
              <el-col :span="6">
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
              <!-- 学院 -->
              <el-col :span="8">
                <el-form-item label="学院">
                  <el-select
                    v-model="formData.sdept"
                    placeholder="请选择学院"
                    @change="formData.clazzId = ''"
                  >
                    <el-option
                      v-for="dept in departments"
                      :key="dept.deptId"
                      :label="dept.deptName"
                      :value="dept.deptId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 班级 -->
              <el-col :span="8">
                <el-form-item label="班级">
                  <el-select
                    v-model="formData.clazzId"
                    placeholder="请选择班级"
                  >
                    <el-option
                      v-for="clazz in classes"
                      :key="clazz.clazzId"
                      :label="clazz.clazzName"
                      :value="clazz.clazzId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 手机号 -->
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
          <el-button @click="editDialogVisible = false">
            取 消
          </el-button>
          <el-button type="primary" @click="submitEdit">
            确 定
          </el-button>
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

<!--      &lt;!&ndash; 日期范围选择组件 &ndash;&gt;-->
<!--      <el-date-picker-->
<!--        v-model="dateRange"-->
<!--        type="daterange"-->
<!--        range-separator="至"-->
<!--        start-placeholder="开始日期"-->
<!--        end-placeholder="结束日期"-->
<!--        value-format="yyyy-MM-dd"-->
<!--        class="date-picker"-->
<!--        style="margin: 0 10px 0 50px;height: 36px"-->
<!--      />-->

<!--      <el-button type="primary" size="medium" @click="handleExport">导出学生考勤数据</el-button>-->
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
      departments: [], // 存储所有学院
      classes: [],     // 存储当前选中学院的班级
      selectedDeptId: null, // 当前选中的学院ID
      editDialogVisible: false,
      editClassFormData: {
        sno: null,
        sname: '',
        ssex: '',
        sdept: '',
        clazzName: '',
        sphone: ''
      },
      formData: {
        sno: '',
        sname: '',
        ssex: '',
        sdept: '',     // 存储学院ID
        deptName: '',   // 显示学院名称
        clazzId: '',    // 存储班级ID
        clazzName: '',  // 显示班级名称
        sphone: ''
      },
      tableData: [],  // 学生数据
      search: "",     // 搜索字段
      dateRange: [],  // 存储日期范围 [开始日期, 结束日期]
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
    // 获取所有学院及班级列表
    async getDepartments() {
      try {
        const res = await axios.get('http://localhost:18080/dept/list');
        if (res.data.code === 10000) {
          this.departments = res.data.data;
        }
      } catch (err) {
        this.$message.error('获取学院信息失败');
      }
    },

    // 根据学院ID获取班级列表
    async getClasses(deptId) {
      try {
        const res = await axios.get(`http://localhost:18080/clazz/list?deptId=${deptId}`);
        if (res.data.code === 10000) {
          this.classes = res.data.data.map(clazz => ({
            id: clazz.id,
            name: clazz.name
          }));

          // 默认选中第一个班级（可选）
          if (this.classes.length > 0) {
            this.formData.clazzName = this.classes[0].name;
          }
        } else {
          this.$message.error('获取班级列表失败');
        }
      } catch (err) {
        this.$message.error('请求失败，请检查网络或接口');
      }
    },

    // 辅助方法：根据学院名称查找ID
    findDeptId(deptName) {
      const dept = this.departments.find(d => d.deptName === deptName);
      return dept ? dept.deptId : '';
    },
    // 辅助方法：根据班级名称查找ID
    findClazzId(clazzName) {
      return this.classes.find(c => c.clazzName === clazzName).clazzId || '';
    },
    // 编辑学生信息
    async handleEdit(row) {
      // 先获取最新学院数据
      await this.getDepartments();

      // 匹配当前学生的学院ID
      const currentDept = this.departments.find(d => d.deptName === row.sdept);

      // 匹配当前学生的班级ID
      const currentClazz = currentDept.clazzList.find(c => c.clazzName === row.clazzName);

      // 初始化表单数据
      this.formData = {
        ...row,
        sdept: currentDept.deptId || '',     // 绑定学院ID
        clazzId: currentClazz.clazzId || ''   // 绑定班级ID
      };

      // 初始化班级列表
      this.classes = currentDept.clazzList || [];

      this.editDialogVisible = true;
    },


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

    // 提交编辑
    async submitEdit() {
      const payload = {
        sno: this.formData.sno,
        sname: this.formData.sname,
        ssex: this.formData.ssex,
        sdept: this.formData.deptName,      // 提交学院ID
        clazzId: this.formData.clazzId,  // 提交班级ID
        sphone: this.formData.sphone
      };

      try {
        await axios.put('http://localhost:18080/student/update', payload);
        this.$message.success('修改成功');
        await this.fetchStudents();
        this.editDialogVisible = false;
      } catch (error) {
        this.$message.error('修改失败');
      }
    },

    // 删除学生信息
    async handleDeleteConfirm(row) {
      try {
        // 使用查询参数发送删除请求
        const res = await axios.delete('http://localhost:18080/student/delete', {
          params: { sno: row.sno } // 将 sno 作为查询参数传递
        });

        if (res.data.code === 10000) {
          this.$message.success('删除成功');
          await this.fetchStudents(); // 刷新表格数据
        } else {
          this.$message.error(res.data.msg || '删除失败');
        }
      } catch (err) {
        this.$message.error('请求失败，请检查网络或接口');
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
  watch: {
    'formData.sdept'(newVal) {
      const selectedDept = this.departments.find(d => d.deptId === newVal);
      this.classes = selectedDept.clazzList || [];
      // 自动匹配原有班级（当学院未改变时保留原选择）
      if(selectedDept.clazzList.some(c => c.clazzId === this.formData.clazzId)) {
        return;
      }
      this.formData.clazzId = '';
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
.dialog-container {
  max-height: 90vh; /* 对话框内容最大高度 */
  overflow-y: auto; /* 超出显示滚动条 */
  padding: 20px;
}

.custom-form {
  width: 100%; /* 确保表单占满容器 */
}

/* 人脸照片容器样式 */
.face-container {
  text-align: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

/* 按钮区域居中 */
.dialog-footer {
  text-align: right; /* 按钮右对齐 */
  padding-top: 20px;
}
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
</style>
