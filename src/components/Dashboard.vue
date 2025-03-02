<template>
  <div class="dashboard">
    <!-- 左侧：图表区域，占40%宽度 -->
    <div class="left-panel">
      <div ref="HeadUpRateChart" class="chart-item"></div>
      <div ref="HeadFrontRateChart" class="chart-item"></div>
      <div ref="ConCChart" class="chart-item"></div>
      <div ref="scatterChart" class="chart-item"></div>
    </div>

    <!-- 右侧：视频和控制台区域，占60%宽度 -->
    <div class="right-panel">
      <!-- 上方：视频播放区域，占80%高度 -->
      <div class="video-container">
        <el-card class="video-card">
          <video ref="videoPlayer" :src="videoSrc" controls class="video-player"></video>
        </el-card>
      </div>

      <!-- 控制台区域 -->
      <div class="control-panel">
        <!-- 第一行：播放控制 + 查看按钮 -->
        <el-row class="control-row" type="flex" justify="space-between">
          <el-col :span="6">
            <el-button type="primary" @click="playVideo" block>播放</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="danger" @click="pauseVideo" block>暂停</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="success" @click="submitInput" block>查看数据</el-button>
          </el-col>
        </el-row>

        <!-- 第二行：三个下拉框并列 -->
        <el-row class="control-row" type="flex" justify="space-between" :gutter="20">
          <el-col :span="8">
            <el-select
              v-model="selectedClass"
              placeholder="选择班级"
              class="control-item"
              filterable
              @change="onClassChange"
            >
              <el-option
                v-for="cls in classList"
                :key="cls.clazzId"
                :label="cls.clazzName"
                :value="cls.clazzId"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="8">
            <el-select
              v-model="selectedCourse"
              placeholder="选择课程"
              class="control-item"
              filterable
              @change="onCourseChange"
            >
              <el-option
                v-for="course in courseList"
                :key="course.cno"
                :label="course.cname"
                :value="course.cno"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="8">
            <el-select
              v-model="selectedStudent"
              placeholder="选择学生"
              class="control-item"
              filterable
            >
              <el-option
                v-for="student in studentList"
                :key="student.sno"
                :label="student.sname"
                :value="student.sno"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  data() {
    return {
      // videoSrc: '/video/demo.mp4',
      // videoSrc: 'https://cdn.jsdelivr.net/gh/01Petard/imageURL@main/img/202503022133446.mp4',
      videoSrc: 'https://cdn.jsdelivr.net/gh/01Petard/imageURL@main/img/1_3.mp4',
      selectedClass: '',    // 当前选中班级ID
      selectedCourse: '',   // 当前选中课程ID
      selectedStudent: '',  // 当前选中学生ID
      classList: [],    // 班级列表
      courseList: [],   // 课程列表
      studentList: [],  // 学生列表
      selectedOption: '',
      inputValue: '',
      chartData: {  // 存放图表数据
        headUpRate: [],
        headFrontRate: [],
        concentration: [],
        scatterData: [],
        xAxisData: []
      }
    };
  },
  mounted() {
    // this.fetchChartData();
    this.fetchClasses();
    // this.fetchCourses();
    // this.fetchStudents();
    console.log('视频源路径:', this.videoSrc);
  },
  methods: {
    playVideo() {
      const video = this.$refs.videoPlayer;
      video.play()
        .catch(error => {
          console.error('视频播放出错:', error);
          this.$message.error('视频播放出错，请检查视频文件或格式');
        });
    },
    pauseVideo() {
      this.$refs.videoPlayer.pause();
    },
    submitInput() {
      // this.$message.success(`提交内容: ${this.inputValue}`);
      this.$message.success('获取成功');
      this.fetchChartData();
    },
    // 获取班级
    async fetchClasses() {
      try {
        const res = await axios.get('http://localhost:18080/clazz/list');
        console.log(res.data.data);
        this.classList = res.data.data;
      } catch (error) {
        this.$message.error('班级列表加载失败');
      }
    },
    onClassChange(classId) {
      // this.selectedCourse = null;
      // this.selectedStudent = null;
      // this.fetchCourses(classId);
      this.fetchCourses();
    },
    // 获取课程
    async fetchCourses(classId) {
      try {
        // const res = await axios.get(`http://localhost:18080/clazz/courses?classId=${classId}`);
        const res = await axios.get(`http://localhost:18080/course/list`);
        console.log(res.data.data);
        this.courseList = res.data.data;
      } catch (error) {
        this.$message.error('课程列表加载失败');
      }
    },
    onCourseChange(courseId) {
      // this.selectedStudent = null;
      // this.fetchStudents(this.selectedClass, courseId);
      this.fetchStudents();
    },
    // 获取学生列表方法增强
    async fetchStudents() {
      try {
        const res = await axios.get('http://localhost:18080/student/listName');
        console.log(res.data.data);
        // 添加数据验证
        if (Array.isArray(res.data.data)) {
          this.studentList = res.data.data.map(item => ({
            sno: item.sno || item.id || '',
            sname: item.sname || item.name || '未知'
          }));
        } else {
          throw new Error('响应格式不正确');
        }
      } catch (error) {
        this.$message.error('获取学生列表失败');
        console.error('错误详情:', error);
      }
    },
    onStudentChange(sno, sname) {
      // this.fetchChartData(sno);
    },

    // // 修改后的数据请求方法
    // async fetchChartData(studentId) {
    //   try {
    //     const res = await axios.get(`http://localhost:18080/conc/chart-data?studentId=${studentId}`);
    //     this.chartData = res.data;
    //     this.initCharts();
    //   } catch (error) {
    //     this.$message.error('获取数据失败');
    //   }
    // }

    // 1. 请求后端数据
    async fetchChartData() {
      axios.get('http://localhost:18080/conc/chart-data')  // 替换成你的后端 API 地址
        .then(response => {
          const data = response.data;
          this.chartData.headUpRate = data.headUpRate || [];
          this.chartData.headFrontRate = data.headFrontRate || [];
          this.chartData.concentration = data.concentration || [];
          this.chartData.scatterData = data.scatterData || [];
          this.chartData.xAxisData = data.xaxisData || [];
          this.initCharts();  // 数据更新后初始化图表
        })
        .catch(error => {
          console.error('获取数据失败:', error);
        });
    },

    // 2. 初始化所有图表
    initCharts() {
      this.initHeadUpRateChart();
      this.initHeadFrontRateChart();
      this.initConCChart();
      this.initScatterChart();
    },

    // 3. 抬头率图表
    initHeadUpRateChart() {
      const myChart = echarts.init(this.$refs.HeadUpRateChart);
      myChart.setOption({
        title: { text: '抬头率', left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { left: '2%', right: '2%', top: '15%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: this.chartData.xAxisData },
        yAxis: { type: 'value' },
        series: [{
          data: this.chartData.headUpRate,
          type: 'line',
          lineStyle: { color: '#1ad357', width: 4 },
          itemStyle: { color: '#1db162' }
        }]
      });
    },

    // 4. 正头率图表
    initHeadFrontRateChart() {
      const myChart = echarts.init(this.$refs.HeadFrontRateChart);
      myChart.setOption({
        title: { text: '正头率', left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { left: '2%', right: '2%', top: '15%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: this.chartData.xAxisData },
        yAxis: { type: 'value' },
        series: [{
          data: this.chartData.headFrontRate,
          type: 'line',
          lineStyle: { color: '#ff5733', width: 4 },
          itemStyle: { color: '#c84728' }
        }]
      });
    },

    // 5. 专注度图表
    initConCChart() {
      const myChart = echarts.init(this.$refs.ConCChart);
      myChart.setOption({
        title: { text: '专注度', left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { left: '2%', right: '2%', top: '15%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: this.chartData.xAxisData },
        yAxis: { type: 'value' },
        series: [{
          data: this.chartData.concentration,
          type: 'line',
          lineStyle: { color: '#b860ea', width: 4 },
          itemStyle: { color: '#842adf' }
        }]
      });
    },

    // 6. 散点图（专注朝向）
    initScatterChart() {
      const myChart = echarts.init(this.$refs.scatterChart);
      myChart.setOption({
        title: { text: '专注朝向', left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { left: '2%', right: '2%', top: '15%', bottom: '2%', containLabel: true },
        xAxis: { type: 'value', min: -1, max: 1 },
        yAxis: { type: 'value', min: -1, max: 1 },
        series: [{
          data: this.chartData.scatterData,
          type: 'scatter',
          symbolSize: 5,
          itemStyle: { color: '#25b69c' }
        }]
      });
    }
  }
};
</script>


<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
}

/* 左侧：图表区域 */
.left-panel {
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 20px;
}

.chart-item {
  height: 40%;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

/* 右侧：视频 + 控制台区域 */
.right-panel {
  width: 60%;
  display: flex;
  flex-direction: column;
}

/* 视频区域 */
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1px;
}

.video-card {
  width: 90%;
  background: #333;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.video-player {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

/* 调整视频容器高度 */
.video-container {
  height: 55vh;
}

/* 控制台区域 */
.control-panel {
  justify-content: center;    /* 水平居中 */
  align-items: center;        /* 垂直居中 */
  height: 15vh; /* 增加控制台高度 */
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}


.control-row {
  flex: 1;
}

.control-item {
  width: 100%;
}

</style>
