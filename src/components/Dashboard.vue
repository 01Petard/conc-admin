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

      <!-- 下方：控制台区域，占20%高度 -->
      <div class="control-panel">
        <el-row gutter={20} type="flex" justify="center" align="middle">
          <el-col :span="4">
            <el-button type="primary" @click="playVideo" block>播放</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" @click="pauseVideo" block>暂停</el-button>
          </el-col>
          <el-col :span="6" style="margin-right: 20px">
            <el-select v-model="selectedOption" placeholder="选择学生" class="control-item" block>
              <el-option label="模式1" value="mode1"></el-option>
              <el-option label="模式2" value="mode2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6" style="margin-right: 20px">
            <el-input v-model="inputValue" placeholder="输入学生姓名" class="control-item" block></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="submitInput" block>查找</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  data: function () {
    return {
      videoSrc: '/Users/hzx/Desktop/demo.mp4',
      selectedOption: '',
      inputValue: ''
    };
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    playVideo() {
      this.$refs.videoPlayer.play();
    },
    pauseVideo() {
      this.$refs.videoPlayer.pause();
    },
    submitInput() {
      this.$message.success(`提交内容: ${this.inputValue}`);
    },
    initCharts() {
      this.initHeadUpRateChart();
      this.initHeadFrontRateChart();
      this.initConCChart();
      this.initScatterChart();
    },
    initHeadUpRateChart() {
      const myChart = echarts.init(this.$refs.HeadUpRateChart);
      myChart.setOption({
        title: {text: '抬头率', left: 'center'},
        tooltip: {trigger: 'axis'},
        grid: {left: '2%', right: '2%', top: '15%', bottom: '2%', containLabel: true},
        xAxis: {type: 'category', data: ['周一', '周二', '周三', '周四', '周五']},
        yAxis: {type: 'value'},
        series: [{data: [820, 932, 901, 934, 1290], type: 'line', lineStyle: {color: '#1ad357', width: 4}, itemStyle: {color: '#1db162'}}]
      });
    },
    initHeadFrontRateChart() {
      const myChart = echarts.init(this.$refs.HeadFrontRateChart);
      myChart.setOption({
        title: {text: '正头率', left: 'center'},
        tooltip: {trigger: 'axis'},
        grid: {left: '2%', right: '2%', top: '15%', bottom: '2%', containLabel: true},
        xAxis: {type: 'category', data: ['周一', '周二', '周三', '周四', '周五']},
        yAxis: {type: 'value'},
        series: [{data: [820, 932, 901, 934, 1290], type: 'line', lineStyle: {color: '#ff5733', width: 4}, itemStyle: {color: '#c84728'}}]
      });
    },
    initConCChart() {
      const myChart = echarts.init(this.$refs.ConCChart);
      myChart.setOption({
        title: {text: '专注度', left: 'center'},
        tooltip: {trigger: 'axis'},
        grid: {left: '2%', right: '2%', top: '15%', bottom: '2%', containLabel: true},
        xAxis: {type: 'category', data: ['周一', '周二', '周三', '周四', '周五']},
        yAxis: {type: 'value'},
        series: [{data: [820, 932, 901, 934, 1290], type: 'line', lineStyle: {color: '#b860ea', width: 4}, itemStyle: {color: '#842adf'}}]
      });
    },
    initScatterChart() {
      const myChart = echarts.init(this.$refs.scatterChart);
      myChart.setOption({
        title: {text: '专注朝向', left: 'center'},
        tooltip: {trigger: 'axis'},
        grid: {left: '2%', right: '2%', top: '15%', bottom: '2%', containLabel: true},
        xAxis: {type: 'value', min: -1, max: 1},
        yAxis: {type: 'value', min: -1, max: 1},
        series: [{data: [[0.1, 0.2], [-0.3, 0.4]], type: 'scatter', symbolSize: 12, itemStyle: {color: '#25b69c'}}]
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

/* 控制台区域 */
.control-panel {
  height: 20%;
  padding: 10px;
  display: flex;              /* 使用 flex 布局 */
  justify-content: center;    /* 水平居中 */
  align-items: center;        /* 垂直居中 */
  gap: 20px;                  /* 子元素之间的间隔 */
}
.control-item {
  width: 100%;
}

</style>
