<template>
  <div>
    <h1>综合图表展示</h1>

    <!-- 图表容器：2x2布局 -->
    <div class="charts-container">
      <!-- 折线图 -->
      <div ref="lineChart" class="chart-item"></div>

      <!-- 柱状图 -->
      <div ref="barChart" class="chart-item"></div>

      <!-- 饼图 -->
      <div ref="pieChart" class="chart-item"></div>

      <!-- 散点图 -->
      <div ref="scatterChart" class="chart-item"></div>
    </div>

    <StudentList/>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';
import StudentList from "./StudentList.vue";

export default {
  name: 'Dashboard',
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
  }
};
</script>

<style scoped>
/* 图表容器：2x2布局 */
.charts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* 将图表容器中的图表居中 */
  max-width: 900px; /* 限制最大宽度 */
}

/* 单个图表的样式 */
.chart-item {
  flex: 0 0 calc(50% - 10px);
  height: 400px;
}
</style>
