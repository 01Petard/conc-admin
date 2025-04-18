<template>
  <div class="table-container">
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑班级信息"
      :visible.sync="editDialogVisible"
      width="60%"
      :fullscreen="false"
      :close-on-click-modal="false"
    >
      <div class="dialog-container">
        <el-form
          :model="formData"
          label-width="100px"
          class="custom-form"
        >
          <!-- 表单内容分组 -->
          <div class="form-group">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="班级ID">
                  <el-input v-model="formData.clazzId" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="班级名称">
                  <el-input v-model="formData.clazzName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属学院">
                  <el-select v-model="formData.deptId" placeholder="请选择学院">
                    <el-option
                      v-for="dept in deptOptions"
                      :key="dept.deptId"
                      :label="dept.deptName"
                      :value="dept.deptId"
                    />
                  </el-select>
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
        placeholder="请输入班级名称或ID"
        clearable
        class="search-input"
      />
      <el-button type="primary" size="medium" @click="handleSearch">查询班级信息</el-button>
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
      <el-table-column align="center" prop="clazzId" label="班级ID"></el-table-column>
      <el-table-column align="center" prop="clazzName" label="班级名称"></el-table-column>
      <el-table-column align="center" prop="deptId" label="所属学院ID"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>

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
              title="确定删除该班级吗？"
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
  name: "ClazzList",
  data() {
    return {
      editDialogVisible: false,
      formData: {
        clazzId: '',
        clazzName: '',
        deptId: ''
      },
      tableData: [],        // 班级数据
      search: "",           // 搜索字段
      deptOptions: [],      // 学院下拉选项
    };
  },
  computed: {
    filteredData() {
      return this.tableData.filter(
        (data) =>
          !this.search ||
          data.clazzName.toLowerCase().includes(this.search.toLowerCase()) ||
          data.clazzId.toString().includes(this.search)
      );
    },
  },
  methods: {
    // 表格行样式
    showCss({row, rowIndex}) {
      return rowIndex % 2 === 0 ? "warning-row" : "success-row";
    },
    // 编辑操作
    handleEdit(row) {
      this.formData = { ...row };
      this.editDialogVisible = true;
    },
    // 提交编辑
    async submitEdit() {
      try {
        const response = await axios.put('http://localhost:18080/clazz/update', this.formData);
        if (response.data.code === 200) {
          this.$message.success('修改成功');
          await this.fetchClazzs();
          this.editDialogVisible = false;
        }
      } catch (error) {
        this.$message.error('修改失败');
      }
    },
    // 删除确认
    async handleDeleteConfirm(row) {
      try {
        await axios.delete(`http://localhost:18080/clazz/delete/${row.clazzId}`);
        this.$message.success('删除成功');
        await this.fetchClazzs();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },
    // 获取班级列表
    async fetchClazzs() {
      try {
        const response = await axios.get('http://localhost:18080/clazz/list');
        if (response.data.code === 200) {
          this.tableData = response.data.data;
        } else {
          console.error("获取班级数据失败:", response.data.msg);
        }
      } catch (error) {
        console.error("获取班级数据失败", error);
      }
    },
    // 获取学院下拉选项（用于班级的所属学院选择）
    async fetchDeptOptions() {
      try {
        const response = await axios.get('http://localhost:18080/dept/list');
        if (response.data.code === 200) {
          this.deptOptions = response.data.data;
        }
      } catch (error) {
        console.error("获取学院选项失败", error);
      }
    },
  },
  mounted() {
    this.fetchClazzs();
    this.fetchDeptOptions();
  },
};
</script>

<style scoped>
/* 直接复制学生组件的样式即可，确保一致的UI */
</style>
