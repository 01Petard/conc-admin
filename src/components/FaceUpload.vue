<template>
  <div class="face-upload-container">
    <h1>人脸信息绑定</h1>
    <p>请上传您的个人头像（图片格式）并填写您的姓名</p>

    <!-- 姓名输入框 -->
    <el-input
      v-model="name"
      placeholder="请输入姓名"
      size="medium"
      class="name-input"
    ></el-input>

    <!-- 图片上传 -->
    <el-upload
      class="upload-demo"
      :show-file-list="false"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      action=""
      :auto-upload="false"
      ref="upload"
    >
      <el-button size="medium" type="primary">点击上传图片</el-button>
    </el-upload>

    <!-- 图片预览 -->
    <div v-if="imageUrl" class="image-preview">
      <h3>预览：</h3>
      <img :src="imageUrl" alt="Uploaded Face" class="preview-image"/>
    </div>

    <!-- 提交按钮 -->
    <div>
      <el-button
        v-if="imageUrl && name"
        type="success"
        size="medium"
        @click="handleSubmit"
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FaceUpload',
  data() {
    return {
      name: '', // 用户姓名
      fileName: '', // 文件名称
      imageUrl: '', // 图片预览地址
    };
  },
  methods: {
    // 文件变化时的处理逻辑
    handleChange(file) {
      this.fileName = file.name; // 获取文件名称
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result; // 将图片预览存储在 imageUrl 中
      };
      reader.readAsDataURL(file.raw); // 将文件转为 base64 编码
    },
    // 在上传前检查文件格式
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片格式文件');
      }
      return isImage;
    },
    // 提交上传的处理逻辑
    async handleSubmit() {
      if (!this.name) {
        this.$message.error('姓名不能为空');
        return;
      }
      if (!this.fileName) {
        this.$message.error('请上传头像');
        return;
      }

      try {
        // 构造查询参数
        const params = new URLSearchParams({
          name: this.name, // 用户姓名
          fileName: this.fileName, // 文件名称
        });

        // 发送 GET 请求，通过查询参数传递数据
        const response = await axios.get(
          'http://localhost:18080/student/upload',
          {params}
        );

        if (response.data.code === 10000) {
          this.$message.success('上传成功');
          this.resetForm(); // 上传成功后清空表单
        } else {
          this.$message.error('上传失败: ' + response.data.msg);
        }
      } catch (error) {
        this.$message.error('上传失败，请重试');
        console.error('上传失败:', error);
      }
    },
    // 清空表单
    resetForm() {
      this.name = ''; // 清空姓名输入框
      this.fileName = ''; // 清空文件名
      this.imageUrl = ''; // 清空图片预览
      this.$refs.upload.clearFiles(); // 清空上传组件的文件列表
    },
  },
};
</script>

<style scoped>
.face-upload-container {
  text-align: center;
  margin-top: 50px;
}

.name-input {
  width: 250px;
  margin: 10px auto;
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
