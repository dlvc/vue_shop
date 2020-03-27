<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 表单区域 -->
      <el-form
        :model="loginForm"
        status-icon
        :rules="loginFormRules"
        ref="loginFormRef"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-icon-user"
            v-model="loginForm.username"
            type="text"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- botton组 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button @click="loginReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'login'
})
export default class Login extends Vue {
  // 登录表单的数据绑定对象
  private loginForm = {
    username: 'admin',
    password: '123456'
  }

  // 表单的验证规则对象
  private loginFormRules = {
    //   验证用户名是否合法
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
      },
      {
        min: 4,
        max: 16,
        message: '用户名长度在4-16之间',
        trigger: 'blur'
      }
    ],
    //   验证密码是否合法
    password: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'blur'
      },
      {
        min: 6,
        max: 18,
        message: '密码长度在6-18之间',
        trigger: 'blur'
      }
    ]
  }

  public loginReset() {
    ;(this.$refs.loginFormRef as HTMLFormElement).resetFields()
  }

  public login() {
    ;(this.$refs.loginFormRef as HTMLFormElement).validate(
      async (valid: unknown) => {
        // eslint-disable-next-line no-void
        if (!valid) return void 0
        const { data: res } = await this['$http'].post('login', this.loginForm)
        if (res.meta.status !== 200) return this['$message'].error('登录失败')
        this['$message'].success('登录成功')
        // 设置token到sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        window.setTimeout(() => this['$router'].push('/home'), 500)
      }
    )
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 4px 2px #ccc;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    line-height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 4px 2px #ddd;
    box-sizing: border-box;
    padding: 10px;
    position: absolute;
    left: calc(50% - 65px);
    top: -60px;
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 75%;
  left: 50%;
  transform: translateX(-50%);
  box-sizing: border-box;
  padding: 5px;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
