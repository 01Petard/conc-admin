<template>
  <StudentList/>
</template>

<script>
import axios from 'axios';
import StudentList from "./StudentList.vue";

export default {
  name: "VideoList",
  components: {StudentList},
  data() {
    return {
      tableData: [],  // 学生数据
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
    // 获取学生数据 (异步函数)
    async fetchStudents() {
      try {
        // 调用后端接口获取学生列表
        const response = await axios.get('http://localhost:18080/student/list');

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

.el-table-column {
  min-width: 100px;
}

.el-button {
  font-size: 14px;
}

</style>
