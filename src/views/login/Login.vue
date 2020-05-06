<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">民 间 小 偏 方 </h3>
      </div>
      <el-form-item prop="username">
        <el-input ref="username" v-model="loginForm.username" name="username" placeholder="用户名" autocomplete="on" type="text"></el-input>
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="键盘大写已开启" placement="right" manual>
        <el-form-item prop="password">
          <el-input ref="password" v-model="loginForm.password" name="password" placeholder="请输入密码" autocomplete="on" :type="passwordType"
                    @keyup.native="checkCapsLock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin" show-password></el-input>
        </el-form-item>
      </el-tooltip>
      <el-button :loading="loading" type="primary" @click.native="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { checkUserName, checkPassword } from './login.js'
import { loginApi } from '../../http/apiResource.js'
import { Encrypt } from '../../assets/js/Aes'
export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => checkUserName(rule, value, callback)
    const validatePassword = (rule, value, callback) => checkPassword(rule, value, callback)
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ require: true, trigger: 'blur', validator: validateUsername }],
        password: [{ require: true, trigger: 'blur', validator: validatePassword }]
      },
      capsTooltip: false,
      passwordType: 'password',
      loading: false
    }
  },
  mounted () {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapsLock (e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.password = Encrypt(this.loginForm.password)
          this.$http.post(loginApi, this.loginForm).then(res => {
            this.loading = false
            if (res.data.success) {
              const result = res.data.data
              sessionStorage.setItem('userInfo', JSON.stringify(result))
              sessionStorage.setItem('permission_routes', JSON.stringify(result.data))
              sessionStorage.setItem('role', JSON.stringify(result.userFlag))
              sessionStorage.setItem('token', JSON.stringify(result.token))
              this.$store.dispatch('setCurrentUserInfo', result)
              this.$store.dispatch('setToken', result.token)
              this.$store.dispatch('setRoles', [result.userFlag])
              this.$store.dispatch('setPermisson_routes', result.data)
              this.$router.push('/home')
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    }
  }
}
</script>

<style>
  .login-container .el-input input {
    color: #fff;
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    height: 47px;
    caret-color: #fff;
    box-shadow: 0 0 0px 1000px #283443 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  .login-container .el-input{
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .login-container .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
</style>

<style scoped>
  .login-container{
    min-height: calc(100vh - 1px);
    width: 100%;
    background-color: #2d3a4b;
    overflow: hidden;
  }
  .login-container .login-form{
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .login-container .title-container{
    position: relative;
  }
  .login-container .title-container .title {
    font-size: 26px;
    color: #eee;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
</style>
