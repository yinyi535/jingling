<template>
  <div class="loginBox">
    <el-form :model="loginInfo" ref="loginForm" :rules="loginRules">
      <el-form-item prop="name">
        <el-input
          v-model="loginInfo.name"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user-solid"
          @input="checkValidate('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          v-model="loginInfo.pwd"
          placeholder="请输入密码"
          show-password
          prefix-icon="el-icon-lock"
          @input="checkValidate('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item class="login-reset">
        <el-button
          type="primary"
          :disabled="isDisabled"
          @click="loginForm('loginForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('loginForm')" :plain="true"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      isDisabled: "",
      loginInfo: {
        name: "admin",
        pwd: "123456",
      },
      loginRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 3,
            max: 6,
            message: "长度在 3 到 6 个字符",
            trigger: "change",
          },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    async login() {
      let { data: res } = await this.axios.post("/login", {
        username: this.loginInfo.name,
        password: this.loginInfo.pwd,
      });
      if (res.meta.status == 200) {
        this.$message({
          showClose: true,
          message: res.meta.msg,
          duration: 1000,
          type: "success",
          onClose: () => {
            sessionStorage.setItem("token", res.data.token);
            this.$router.push({ name: "home" }).catch((erro) => "");
          },
        });
      } else {
        this.$message({
          showClose: true,
          message: res.meta.msg,
          duration: 1000,
          type: "error",
        });
      }
    },
    checkValidate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
        }
      });
    },
    loginForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login();
        } else {
          this.$message({
            showClose: true,
            message: "用户名或密码格式错误",
            duration: 1000,
            type: "error",
          });
          return;
        }
      });
    },
    resetForm(formName) {
      this.$message({
        showClose: true,
        message: "重置成功",
        duration: 1000,
        type: "success",
      });
      this.$refs[formName].resetFields();
    },
  },
  components: {},
  mounted() {
    this.checkValidate("loginForm");
  },
};
</script>

<style lang="less">
.loginBox {
  width: 100%;
  height: 100%;
  background: url(@/assets/bj.be0436d4.jpg);
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-form {
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  .login-reset {
    display: flex;
    justify-content: center;
  }
}
</style>
