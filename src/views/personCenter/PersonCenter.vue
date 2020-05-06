<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="update">确认修改</el-button>
    </div>
    <el-form ref="personForm" :model="personForm" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="personForm.username" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password1">
        <el-input type="password" v-model="personForm.password1" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="personForm.checkPass" show-password></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="personForm.nickName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="医师执照" prop="physicianLicense">
        <input type="file" id="file" @change="onFileChange()"/>
        <img :src="imageUrl" />
      </el-form-item>
      <span style="float: right;margin-bottom: 13px;">不填默认不修改</span>
    </el-form>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { personInfoApi } from '../../http/apiResource.js'
import { validateNickName, validateNickPassword } from './personCenter.js'
import { Encrypt } from '../../assets/js/Aes.js'

export default {
  name: 'PersonCenter',
  data () {
    const validateNick = (rule, value, callback) => validateNickName(rule, value, callback)
    const validatePass = (rule, value, callback) => validateNickPassword(rule, value, callback)
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.personForm.password1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      imageUrl: '',
      personForm: {
        username: '',
        nickName: '',
        password1: '',
        checkPass: '',
        physicianLicense: ''
      },
      rules: {
        nickName: [{ trigger: 'blur', validator: validateNick }],
        password1: [{ trigger: 'blur', validator: validatePass }],
        checkPass: [{ trigger: 'blur', validator: validatePass2 }]
      }
    }
  },
  computed: {
    ...mapGetters({ userInfo: 'getCurrentUserInfo' })
  },
  mounted () {
    this.personForm.username = this.userInfo.username
  },
  methods: {
    update () {
      const userId = this.userInfo.userId
      this.personForm.userId = userId
      this.$refs.personForm.validate(valid => {
        if (valid) {
          let obj = { }
          obj = JSON.parse(JSON.stringify(this.personForm))
          delete obj.password1
          delete obj.checkPass
          if (this.personForm.password1 && this.personForm.checkPass) {
            obj.password = Encrypt(this.personForm.password1)
          }
          console.log(this.personForm)
          this.$http.post(personInfoApi, obj).then(res => {
            if (res.data.success) {
              this.$message.success('修改成功，请重新登录')
              sessionStorage.clear()
              window.location.href = '/'
            }
          })
        }
      })
    },
    onFileChange () {
      var That = this
      const file = document.getElementById('file')
      const fileData = file.files[0]// 获取到一个FileList对象中的第一个文件(File 对象)。这是我们上传的文件
      const flag = this.beforeAvatarUpload(fileData)
      if (fileData && flag) {
        const reader = new FileReader() // html5读文件
        reader.readAsDataURL(fileData)
        reader.onload = function (e) {
          That.personForm.physicianLicense = e.target.result
          That.imageUrl = That.personForm.physicianLicense
        }
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin: 35px auto auto;
    width: 50%;
  }
</style>
