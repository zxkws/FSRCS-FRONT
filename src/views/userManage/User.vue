<template>
  <el-card width="100%">
    <el-table :data="tableData" border style="width: 100%; margin-top:10px;">
      <el-table-column prop="nickName" label="昵称" width="180"></el-table-column>
      <el-table-column prop="username" label="账号" width="180"></el-table-column>
      <el-table-column prop="createDate" label="创建日期" width="180" :formatter="dateFormate"></el-table-column>
      <el-table-column prop="accountStatus" label="用户状态" width="180" :formatter="statusFormate"></el-table-column>
      <el-table-column prop="userFlag" label="用户身份"></el-table-column>
      <el-table-column
        label="封禁"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleStop(scope.row)" type="text" size="small">封停</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="审核"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handlephysicianLicense(scope.row)" type="text" size="small">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="dataForm" :model="formData" label-width="90px" label-position="right">
        <el-form-item label="医师执照" prop="physicianLicense">
          <img :src="formData.physicianLicense"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSave()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { personInfoApi, queryAllUserApi } from '../../http/apiResource'
import { handleCancelParam, handleParam } from './user.js'

export default {
  name: 'User',
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      formData: {}
    }
  },
  computed: {
    ...mapGetters({ userInfo: 'getCurrentUserInfo' })
  },
  mounted () {
    this.query()
  },
  methods: {
    query () {
      this.$http.get(queryAllUserApi).then(res => {
        const result = res.data.data
        const filterArr = []
        result.map(item => {
          if (item.username !== 'admin') { filterArr.push(item) }
        })
        this.tableData = filterArr
      })
    },
    handlephysicianLicense (item) {
      console.log(item)
      this.formData = {
        ...item
      }
      this.dialogVisible = true
    },
    handleSave () {
      const obj = handleParam(this.formData)
      this.$http.post(personInfoApi, obj).then(res => {
        if (res.data.success) {
          this.$message.success('审核成功')
          this.dialogVisible = false
          this.query()
        }
      })
    },
    handleCancel () {
      const obj = handleCancelParam(this.formData)
      this.$http.post(personInfoApi, obj).then(res => {
        if (res.data.success) {
          this.$message.success('取消医师审核成功')
          this.dialogVisible = false
          this.query()
        }
      })
    },
    dateFormate (row) {
      return this.$moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
    },
    statusFormate (row) {
      if (row.accountStatus === '01') {
        return '正常'
      } else if (row.accountStatus === '00') {
        return '已禁用'
      }
    },
    handleStop (row) {
      this.$confirm('此操作将永久封停此用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(personInfoApi, { accountStatus: '00', userId: row.userId }).then(res => {
          this.$message({
            type: 'success',
            message: '封停成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消封停'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
