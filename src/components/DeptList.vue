<template>
  <div class="table-container">
    <!-- 新增班级对话框 -->
    <el-dialog
      title="新增班级"
      :visible.sync="addClassDialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form :model="addClassFormData" label-width="120px">
        <el-form-item label="所属学院">
          <el-select
            v-model="addClassFormData.deptId"
            placeholder="请选择学院"
            style="width: 100%"
          >
            <el-option
              v-for="item in deptOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input
            v-model="addClassFormData.className"
            placeholder="请输入班级名称"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addClassDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddClass">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑班级对话框 -->
    <el-dialog
      title="编辑班级信息"
      :visible.sync="editClassDialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form :model="editClassFormData" label-width="120px">
        <el-form-item label="班级名称">
          <el-input
            v-model="editClassFormData.clazzName"
            placeholder="请输入班级名称"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editClassDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditClass">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增学院对话框 -->
    <el-dialog
      title="新增学院"
      :visible.sync="addDialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" label-width="120px">
        <el-form-item label="学院名称">
          <el-input
            v-model="formData.deptName"
            placeholder="请输入学院名称"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd()">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 编辑学院对话框 -->
    <el-dialog
      title="编辑学院信息"
      :visible.sync="editDialogVisible"
      width="50%"
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
                <el-form-item label="学院ID">
                  <el-input v-model="formData.deptId" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学院名称">
                  <el-input v-model="formData.deptName"></el-input>
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

    <!-- 搜索框和按钮区域 -->
    <div class="search-wrapper">
      <el-input
        v-model="search"
        placeholder="请输入学院名称或ID"
        clearable
        class="search-input"
        style="width: 300px"
      />
      <el-button type="primary" @click="handleSearch">查询学院信息</el-button>
      <el-button
        type="success"
        @click="showAddDialog"
        style="margin-left: 10px;"
      >
        新增学院
      </el-button>
      <el-button
        type="warning"
        @click="showAddClassDialog"
        style="margin-left: 10px;"
      >
        新增班级
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="filteredData"
      row-key="deptId"
      :expand-row-keys="expands"
      @expand-change="handleExpandChange"
      border
      style="width: 100%"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.clazzList || []"
            style="width: 100%"
            border
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column prop="clazzName" label="班级名称" min-width="150"/>

            <el-table-column label="操作" min-width="200">
              <template slot-scope="scope">
                <div class="button-container">
                  <el-button type="primary" @click="handleEditClass(scope.row)">
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定删除该班级吗？"
                    @confirm="handleDeleteClass(scope.row)"
                  >
                    <el-button slot="reference" type="danger">
                      删除
                    </el-button>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </template>
      </el-table-column>

      <el-table-column prop="deptName" label="学院名称" min-width="150"/>

      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <div class="button-container">
            <el-button type="primary" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除该学院吗？"
              @confirm="handleDeleteConfirm(scope.row)"
            >
              <el-button slot="reference" type="danger">
                删除
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
  name: "DeptList",
  data() {
    return {


      editClassDialogVisible: false,
      editClassFormData: { clazzId: null, clazzName: '' },

      addClassDialogVisible: false,
      addClassFormData: {
        deptId: null,
        className: ''
      },
      deptOptions: [], // 学院下拉选项列表

      addDialogVisible: false,
      editDialogVisible: false,
      formData: {deptId: '', deptName: ''},
      tableData: [], // 包含学院和班级数据
      search: '',
      expands: []
    };
  },
  computed: {
    filteredData() {
      return this.tableData.filter(data => {
        return (
          !this.search ||
          data.deptName
            .toLowerCase()
            .includes(this.search.toLowerCase()) ||
          data.deptId.toString().includes(this.search)
        );
      });
    }
  },
  methods: {
    // 表格行样式
    showCss({row, rowIndex}) {
      return rowIndex % 2 === 0 ? "warning-row" : "success-row";
    },

    // 班级编辑
    handleEditClass(row) {
      this.selectedClass = row;
      this.editClassFormData = { ...row };
      this.editClassDialogVisible = true;
    },

    // 提交编辑班级
    async submitEditClass() {
      if (!this.editClassFormData.clazzName.trim()) {
        this.$message.warning('请输入班级名称');
        return;
      }

      try {
        const response = await axios.put('http://localhost:18080/clazz/update',
          {
            clazzId: this.editClassFormData.clazzId,
            clazzName: this.editClassFormData.clazzName,
            deptId: this.selectedClass.deptId
          }
        );

        if (response.data.code === 10000) {
          this.$message.success('修改成功');
          await this.fetchDepts();
          this.editClassDialogVisible = false;
        }
      } catch (error) {
        this.$message.error('修改失败');
      }
    },

    // 删除班级
    async handleDeleteClass(row) {
      try {
        const response = await axios.delete(
          `http://localhost:18080/clazz/delete/${row.clazzId}`
        );
        if (response.data.code === 10000) {
          this.$message.success('删除成功');
          await this.fetchDepts();
        }
      } catch (error) {
        this.$message.error('删除失败');
      }
    },


    // 编辑学院操作
    handleEdit(row) {
      this.formData = {...row};
      this.editDialogVisible = true;
    },

    // 新增学院班级
    showAddClassDialog() {
      this.addClassFormData = {deptId: null, className: ''};
      this.getClassOptions(); // 动态获取学院列表
      this.addClassDialogVisible = true;
    },
    async submitAddClass() {
      if (!this.addClassFormData.className.trim()) {
        this.$message.warning('请输入班级名称');
        return;
      }
      if (!this.addClassFormData.deptId) {
        this.$message.warning('请选择所属学院');
        return;
      }
      try {
        const response = await axios.post(
          'http://localhost:18080/clazz/add',
          {
            deptId: this.addClassFormData.deptId,
            clazzName: this.addClassFormData.className
          }
        );
        if (response.data.code === 10000) {
          this.$message.success('新增班级成功');
          // 更新对应学院的班级列表
          const dept = this.tableData.find(
            (d) => d.deptId === this.addClassFormData.deptId
          );
          if (dept) {
            dept.clazzList.push({
              clazzName: this.addClassFormData.className,
              deptId: dept.deptId
            });
          }
          this.addClassDialogVisible = false;
        }
      } catch (error) {
        this.$message.error('新增班级失败');
      }
    },

    // 获取学院下拉选项
    async getClassOptions() {
      try {
        const response = await axios.get('http://localhost:18080/dept/list');
        this.deptOptions = response.data.data.map((item) => ({
          deptId: item.deptId,
          deptName: item.deptName
        }));
      } catch (error) {
        this.$message.error('获取学院列表失败');
      }
    },

    // 学院展开/折叠
    async handleExpandChange(row, expandedRows) {
      if (row && expandedRows.includes(row)) {
        this.expands = [row.deptId];
        // 如果已存在班级数据则不重复加载
        if (!row.clazzList || row.clazzList.length === 0) {
          await this.loadClasses(row.deptId);
        }
      } else {
        this.expands = [];
      }
    },
    async loadClasses(deptId) {
      try {
        const response = await axios.get(
          `http://localhost:18080/class/list/${deptId}`
        );
        const classes = response.data.data || [];
        const dept = this.tableData.find((d) => d.deptId === deptId);
        if (dept) {
          dept.clazzList = classes;
        }
      } catch (error) {
        this.$message.error('加载班级列表失败');
      }
    },


    // 新增学院功能方法
    showAddDialog() {
      this.addFormData = {
        deptName: ''
      };
      this.addDialogVisible = true;
    },

    async submitAdd() {
      // 检查学院名称是否为空
      if (!this.formData.deptName.trim()) {
        this.$message.warning('请输入学院名称');
        return;
      }

      try {
        // 发送请求到后端新增学院
        const response = await axios.post('http://localhost:18080/dept/add', {
          deptName: this.formData.deptName // 将学院名称传递给后端
        });
        // 根据后端返回的结果处理逻辑
        if (response.data.code === 10000) {
          this.$message.success('新增学院成功');
          // 清空表单数据
          this.formData.deptName = '';
          // 关闭对话框
          this.addDialogVisible = false;
          // 刷新学院列表
          await this.fetchDepts();
        } else {
          this.$message.error('新增学院失败');
        }
      } catch (error) {
        console.error(error);
        this.$message.error('新增学院时发生错误');
      }
    },
    // 提交学院编辑
    async submitEdit() {
      const payload = {
        deptId: this.formData.deptId,
        deptName: this.formData.deptName
      };

      try {
        const response = await axios.put('http://localhost:18080/dept/update', payload);
        if (response.data.code === 10000) {
          this.$message.success('修改成功');
          await this.fetchDepts();
          this.editDialogVisible = false;
        }
      } catch (error) {
        this.$message.error('修改失败');
      }
    },
    // 删除确认
    async handleDeleteConfirm(row) {
      try {
        await axios.delete(`http://localhost:18080/dept/delete/${row.deptId}`);
        this.$message.success('删除成功');
        await this.fetchDepts();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },
    // 获取学院列表
    async fetchDepts() {
      try {
        const response = await axios.get('http://localhost:18080/dept/list');
        if (response.data.code === 10000) {
          this.tableData = response.data.data.map((dept) => ({
            ...dept,
            clazzList: dept.clazzList || [] // 初始化班级列表
          }));
        } else {
          console.error("获取学院数据失败:", response.data.msg);
        }
      } catch (error) {
        console.error("获取学院数据失败", error);
      }
    }
  },
  mounted() {
    this.fetchDepts();
  },
};
</script>

<style scoped>
/* 合并所有表格列居中样式 */
.table-container .el-table th,
.table-container .el-table td,
.table-container .el-table .el-table__expanded-cell .el-table th,
.table-container .el-table .el-table__expanded-cell .el-table td {
  text-align: center !important;
}


/* 合并展开行样式 */
.el-table .el-table__expanded-cell {
  padding: 10px 0;
  border: 1px solid #ebeef5;
}

/* 保留必要的基础样式 */
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.search-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container .el-button {
  margin: 0 5px;
}
.cell{
  text-align: center;
}
</style>
