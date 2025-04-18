<template>
  <div class="login_container">
    <!-- 登录块 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avator_box">
        <img src="../assets/logo.png" alt="头像"/>
      </div>
      <!-- 表单组建 -->
      <el-form ref="loginFromRef" :model="loginForm" :rules="loginRules" class="login_from" label-width="0">
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
<!--          <el-button type="primary" @click="login()">登录</el-button>-->
          <el-button type="primary" @click="login2()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {

  data() {
    return {
      //表单数据
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //表单验证规则
      loginRules: {
        //校验用户名
        username: [
          {required: true, message: "用户名为必填项", trigger: "blur"},
          {min: 5, max: 20, message: "用户名长度在 5 到 20 个字符", trigger: "blur",},
        ],
        //校验密码
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur",},
        ],
      },
    };
  },
  methods: {
    //登录
    login() {
      //验证校验规则
      this.$refs.loginFromRef.validate(async (valid) => {
        // 添加响应拦截器
        axios.interceptors.request.use(config => {
            if (config.method === 'POST') {
              config.data = qs.stringify(config.data)
            }
            return config
          }, error => {
            console.log(error)
            Promise.reject(error)
          }
        )
        //1、校验失败则结束
        if (!valid) return;
        const {data: res} = await this.$http.post("login", this.loginForm); //访问后台
        // console.log(res);
        //2.1、是否登录后台（状态验证）
        if (res === "success") {
          //3、登录成功，跳转到首页
          this.$message.success("登录成功！"); //信息提示
          //4、存储user信息
          window.sessionStorage.setItem("user", JSON.stringify(res.user)); //存储user对象
          //5、进入首页
          console.log(res.user);
          await this.$router.push({path: "/dashboard"}); //页面路由跳转
          //6、未登录后台
        } else {
          this.$message.error("登录失败！"); //错误信息
        }
        // //2.2、是否登录后台（用户名+密码验证）
        // if (res.status == "success") {
        //   //3、登录成功，跳转到首页
        //   this.$message.success("登录成功！"); //信息提示
        //   //4、存储user信息
        //   window.sessionStorage.setItem("user", JSON.stringify(res.user)); //存储user对象
        //   //5、进入首页
        //   console.log(res.user);
        //   this.$router.push({ path: "/home" }); //页面路由跳转
        //   //6、未登录后台
        // } else {
        //   this.$message.error("登录失败！"); //错误信息
        // }
      });
    },
    login2(){
      this.$router.push('/main/dashboard');
    },
    //重置表单内容
    resetLoginForm() {
      this.$refs.loginFromRef.resetFields();
    },
  },
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

