<template>
  <div class="login_container">
    <!-- 登录块 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avator_box">
        <img src="../assets/logo.png" alt="头像"/>
      </div>
      <!-- 表单组建 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login_from" label-width="0">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghuming" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" placeholder="请输入密码"
                    type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "admin"
      },
      loginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    // 登录
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          axios.post('http://localhost:18080/user/login', {
            userName: this.loginForm.username,
            password: this.loginForm.password
          })
            .then(response => {
              console.log('登录成功:', response.data);
              this.$router.push('/main/dashboard');
            })
            .catch(error => {
              console.error('登录失败:', error);
              // 显示后端返回的具体错误信息
              if (error.response && error.response.data) {
                this.$message.error(error.response.data.message);
              } else {
                this.$message.error('登录失败，请检查网络');
              }
            });
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },

    // 重置表单内容（确保 ref 名称正确）
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    }
  }
};
</script>

<style scoped>

.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avator_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #0ee;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

