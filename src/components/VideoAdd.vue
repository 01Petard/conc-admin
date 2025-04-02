<template>
  <div class="face-upload-container">
    <h1>上传视频</h1>
    <p>请上传课堂教学视频</p>

    <!-- 课堂输入框 -->
    <el-input
      v-model="video.vname"
      placeholder="请输入视频名称"
      size="medium"
      class="input-field"
    ></el-input>

    <!-- 班级输入框 -->
    <el-input
      v-model="video.cname"
      placeholder="请输入班级名称"
      size="medium"
      class="input-field"
    ></el-input>

    <!-- 视频上传 -->
    <el-upload
      class="upload-demo"
      :show-file-list="false"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      action=""
      :auto-upload="false"
      ref="upload"
    >
      <el-button size="medium" type="primary">点击上传视频</el-button>
    </el-upload>

    <!-- 图片预览 -->
    <div v-if="imageUrl" class="image-preview">
      <h3>预览图：</h3>
      <img :src="imageUrl" alt="Uploaded Face" class="preview-image"/>
    </div>

    <!-- 提交按钮 -->
    <div>
      <el-button
        type="success"
        size="medium"
        @click="handleSubmit"
      >
        提交上传
      </el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VideoAdd',
  data() {
    return {
      video: {
        vname: '',
        cname: '',
        fileName: '',
      },
      imageUrl: '', // 图片预览地址
    };
  },
  methods: {
    // // 文件变化时的处理逻辑
    // handleChange(file) {
    //   const isImage = file.raw.type.startsWith('mp4/');
    //   if (!isImage) {
    //     this.$message.error('只能上传视频格式文件');
    //     return;
    //   }
    //
    //   // 保存文件名和文件对象
    //   this.video.fileName = file.name;
    //
    // },
    // // 在上传前检查文件格式
    // beforeUpload(file) {
    //   const isImage = file.type.startsWith('mp4/');
    //   if (!isImage) {
    //     this.$message.error('只能上传视频格式文件');
    //   }
    //   return isImage;
    // },


    handleChange(file) {
      this.fileName = file.name; // 获取文件名称
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result; // 将图片预览存储在 imageUrl 中
      };
      reader.readAsDataURL(file.raw); // 将文件转为 base64 编码
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片格式文件');
      }
      return isImage;
    },

    async handleSubmit() {
      try {
        // 构造表单数据
        const formData = new FormData();
        formData.append('vname', this.video.vname);
        formData.append('cname', this.video.cname);
        formData.append('fileName', this.video.fileName);

        // 发送 POST 请求
        const response = await axios.post(
          'http://localhost:18080/student/add',
          formData,
          {
            headers: {'Content-Type': 'multipart/form-data'}, // 确保设置正确的 Content-Type
          }
        );

        if (response.data.code === 10000) {
          this.$message.success('课堂视频添加成功');
          this.resetForm();
        } else {
          this.$message.error('添加失败: ' + response.data.msg);
        }
      } catch (error) {
        this.$message.error('添加失败，请重试');
        console.error('添加失败:', error);
      }
    },

    // 清空表单
    resetForm() {
      this.student = {
        sno: '',
        sname: '',
        ssex: '',
        sdept: '',
        clazz_name: '',
        sphone: '',
        faceimg: '',
      };
      this.previewUrl = '';
      this.fileObject = null;
      this.$refs.upload.clearFiles();
      URL.revokeObjectURL(this.previewUrl); // 释放预览URL
    },
  },
};
</script>


<style scoped>
.face-upload-container {
  text-align: center;
  margin-top: 50px;
}

.input-field {
  width: 300px;
  margin: 10px auto;
  display: block;
}

.upload-demo {
  margin: 20px 0;
}

.image-preview {
  margin-top: 20px;
  display: inline-block;
  text-align: center;
}

.preview-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: 10px;
  border: 2px solid #ccc;
  padding: 10px;
}

.el-button {
  margin-top: 20px;
}
</style>
