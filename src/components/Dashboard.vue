<template>

  <div>
    <!-- 搜索框和查询按钮 -->
    <div class="search-wrapper">
      <el-input
        v-model="search"
        size="medium"
        placeholder="请输入姓名或学号"
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
      :height="600"
      border
    >
      <el-table-column align="center" prop="sno" label="学号"></el-table-column>
      <el-table-column align="center" prop="sname" label="姓名"></el-table-column>

      <!-- 人脸列，使用 slot 渲染图片 -->
      <!--  网络请求的方式    -->
      <!--      <el-table-column align="center" label="人脸">-->
      <!--        <template slot-scope="scope">-->
      <!--          <img v-if="scope.row.faceimg" :src="scope.row.faceimg" alt="人脸图片" style="width: 50px; height: 50px; object-fit: cover;" />-->
      <!--          <span v-else>无图片</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!-- 人脸列，使用 slot 渲染图片 -->
      <el-table-column align="center" label="人脸">
        <template slot-scope="scope">
          <img v-if="scope.row.faceimg" :src="scope.row.faceimg" alt="人脸图片" style="width: 50px; height: 50px; object-fit: cover;" />
          <span v-else>无图片</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="ssex" label="性别"></el-table-column>
      <el-table-column align="center" prop="sdept" label="学院"></el-table-column>
      <el-table-column align="center" prop="clazzName" label="班级"></el-table-column>
      <el-table-column align="center" prop="sphone" label="手机"></el-table-column>

      <el-table-column>

        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            class="edit-btn"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            class="delete-btn"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <h1>综合图表展示</h1>

    <!-- 折线图 -->
    <div ref="lineChart" style="width: 400px; height: 400px;"></div>

    <!-- 柱状图 -->
    <div ref="barChart" style="width: 400px; height: 400px;"></div>

    <!-- 饼图 -->
    <div ref="pieChart" style="width: 400px; height: 400px;"></div>

    <!-- 散点图 -->
    <div ref="scatterChart" style="width: 400px; height: 400px;"></div>

    <!-- 雷达图 -->
    <div ref="radarChart" style="width: 400px; height: 400px;"></div>

  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'Dashboard',
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
  mounted() {
    this.initCharts();
    this.fetchStudents();
  },
  methods: {
    initCharts() {
      this.initLineChart();
      this.initBarChart();
      this.initPieChart();
      this.initScatterChart();
      this.initRadarChart();
    },

    // 折线图
    initLineChart() {
      const chartDom = this.$refs.lineChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {text: '折线图示例'},
        tooltip: {trigger: 'axis'},
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {type: 'value'},
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      };
      myChart.setOption(option);
    },

    // 柱状图
    initBarChart() {
      const chartDom = this.$refs.barChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {text: '产品销售量'},
        tooltip: {trigger: 'axis'},
        xAxis: {
          type: 'category',
          data: ['产品A', '产品B', '产品C', '产品D', '产品E']
        },
        yAxis: {type: 'value'},
        series: [{
          name: '销售量',
          type: 'bar',
          data: [30, 50, 70, 90, 110]
        }]
      };
      myChart.setOption(option);
    },

    // 饼图
    initPieChart() {
      const chartDom = this.$refs.pieChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {text: '市场份额分布', left: 'center'},
        tooltip: {trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)'},
        series: [{
          name: '市场份额',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            {value: 235, name: '品牌A'},
            {value: 274, name: '品牌B'},
            {value: 310, name: '品牌C'},
            {value: 174, name: '品牌D'},
            {value: 235, name: '品牌E'}
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
    },


    // 中心散点图
    initScatterChart() {
      const chartDom = this.$refs.scatterChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {text: '散点图示例', left: 'center'},
        tooltip: {trigger: 'item'},
        xAxis: {
          type: 'value',
          name: 'X轴',
          min: -1,
          max: 1,
          axisLine: {
            show: true,
            lineStyle: {color: '#333'}
          },
          axisLabel: {
            formatter: value => value.toFixed(2), // 显示为两位小数
          },
        },
        yAxis: {
          type: 'value',
          name: 'Y轴',
          min: -1,
          max: 1,
          axisLine: {
            show: true,
            lineStyle: {color: '#333'}
          },
          axisLabel: {
            formatter: value => value.toFixed(2), // 显示为两位小数
          },
        },
        series: [{
          symbolSize: 10,
          data: [
            [0.1, 0.2], [-0.3, 0.4], [0.5, -0.6], [-0.7, 0.8], [0.9, -0.9],
            [-0.2, -0.3], [0.4, 0.5], [-0.6, -0.4], [0.7, 0.2], [-0.8, -0.1]
          ],
          type: 'scatter',
          itemStyle: {
            color: '#ff6347', // 设置点的颜色
          },
        }]
      };
      myChart.setOption(option);
    },

    // 雷达图
    initRadarChart() {
      const chartDom = this.$refs.radarChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {text: '产品特性对比', left: 'center'},
        tooltip: {trigger: 'item'},
        radar: {
          indicator: [
            {name: '特性A', max: 100},
            {name: '特性B', max: 100},
            {name: '特性C', max: 100},
            {name: '特性D', max: 100},
            {name: '特性E', max: 100}
          ]
        },
        series: [{
          name: '产品对比',
          type: 'radar',
          data: [
            {value: [50, 60, 70, 80, 90], name: '产品A'},
            {value: [80, 70, 60, 50, 40], name: '产品B'}
          ]
        }]
      };
      myChart.setOption(option);
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


  }
};
</script>



<style scoped>
h1 {
  color: #333;
  margin-bottom: 20px;
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

.el-table-column {
  min-width: 100px;
}

.el-button {
  font-size: 14px;
}
</style>
