<template>
  <div class="face-upload-container">
    <h1>添加学生信息</h1>
    <p>请填写学生的基本信息并上传头像</p>

    <!-- 学号输入框 -->
    <el-input
      v-model="student.sno"
      placeholder="请输入学号"
      size="medium"
      class="input-field"
    ></el-input>

    <!-- 姓名输入框 -->
    <el-input
      v-model="student.sname"
      placeholder="请输入学生姓名"
      size="medium"
      class="input-field"
    ></el-input>

    <!-- 性别选择 -->
    <el-select
      v-model="student.ssex"
      placeholder="请选择性别"
      size="medium"
      class="input-field"
    >
      <el-option label="男" value="男"></el-option>
      <el-option label="女" value="女"></el-option>
    </el-select>

    <!-- 学院选择 -->
    <el-select
      v-model="student.sdept"
      placeholder="请选择学院"
      size="medium"
      class="input-field"
      @change="handleDeptChange(student.sdept)"
    >
      <el-option
        v-for="dept in departments"
        :key="dept.deptId"
        :label="dept.deptName"
        :value="dept.deptId"
      />
    </el-select>

    <!-- 班级选择 -->
    <el-select
      v-model="student.clazzId"
      placeholder="请选择班级"
      size="medium"
      class="input-field"
    >
      <el-option
        v-for="clazz in classes"
        :key="clazz.clazzId"
        :label="clazz.clazzName"
        :value="clazz.clazzId"
      />
    </el-select>

    <!-- 手机输入框 -->
    <el-input
      v-model="student.sphone"
      placeholder="请输入手机号码"
      size="medium"
      class="input-field"
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
    <div v-if="previewUrl" class="image-preview">
      <h3>预览：</h3>
      <img :src="previewUrl" alt="Uploaded Face" class="preview-image"/>
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
  name: 'StudentAdd',
  data() {
    return {
      student: {
        sno: '',       // 学号
        sname: '',     // 姓名
        ssex: '',      // 性别
        sdept: '',     // 学院名称
        clazzId: '',   // 班级ID
        sphone: '',    // 手机
        faceimg: '',   // 文件名
      },
      departments: [], // 学院列表
      classes: [],     // 班级列表
      previewUrl: '',  // 图片预览地址
      fileObject: null // 文件对象
    };
  },
  computed: {
    // 表单是否有效
    isFormValid() {
      return (
        this.student.sno &&
        this.student.sname &&
        this.student.ssex &&
        this.student.sdept &&
        this.student.clazzId &&
        this.student.sphone &&
        this.student.faceimg
      );
    },
  },
  methods: {
    // 获取学院列表
    async getDepartments() {
      try {
        const res = await axios.get('http://localhost:18080/dept/listAll');
        if (res.data.code === 10000) {
          this.departments = res.data.data;
        }
      } catch (err) {
        this.$message.error('获取学院信息失败');
      }
    },

    // 学院选择变化
    async handleDeptChange(deptId) {
      this.classes = [];
      this.student.clazzId = '';

      try {
        const res = await axios.get('http://localhost:18080/clazz/listByDeptId', {params: {deptId: deptId}});
        if (res.data.code === 10000) {
          this.classes = res.data.data;
        } else {
          this.$message.error(res.data.msg || '获取班级失败');
        }
      } catch (err) {
        this.$message.error('请求班级信息失败，请检查网络');
      }
    },

    // 文件变化时的处理逻辑
    handleChange(file) {
      const isImage = file.raw.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片格式文件');
        return;
      }

      // 保存文件名和文件对象
      this.student.faceimg = file.name;
      this.fileObject = file.raw;

      // 生成预览地址
      this.previewUrl = URL.createObjectURL(file.raw);
    },
    // 在上传前检查文件格式
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片格式文件');
      }
      return isImage;
    },
    async handleSubmit() {
      if (!this.isFormValid) {
        return this.$message.warning('请填写完整信息');
      }

      const formData = new FormData();
      formData.append('sno', this.student.sno);
      formData.append('sname', this.student.sname);
      formData.append('ssex', this.student.ssex);
      formData.append('sdeptId', this.student.sdept);
      formData.append('clazzId', this.student.clazzId);
      formData.append('sphone', this.student.sphone);
      formData.append('faceimg', this.student.faceimg);

      try {
        const response = await axios.post(
          'http://localhost:18080/student/add',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}}
        );

        if (response.data.code === 10000) {
          this.$message.success('添加成功');
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
        clazzId: '',
        sphone: '',
        faceimg: '',
      };
      this.classes = []; // 重置班级列表
      this.previewUrl = '';
      this.fileObject = null;
      this.$refs.upload.clearFiles();
      URL.revokeObjectURL(this.previewUrl);
    }
  },
  mounted() {
    this.getDepartments();
  },
};
</script>


<style scoped>
/* 样式保持不变 */
.face-upload-container {
  text-align: center;
  margin-top: 50px;
}

.input-field {
  width: 300px;
  margin: 10px auto;
  display: block;
}

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
