<template>
  <el-card width="100%">
    <el-table :data="tableData" border style="width: 100%; margin-top:10px;">
      <el-table-column prop="role" label="角色" width="180"></el-table-column>
      <el-table-column prop="description" label="角色描述" width="180"></el-table-column>
      <el-table-column prop="permissions" label="权限"></el-table-column>
      <el-table-column
        fixed="right"
        label="处理权限"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handlePermission(scope.row)" type="text" size="small">处理权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改权限"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="dataForm" :model="formData" label-width="90px" label-position="right">
        <el-form-item label="角色" prop="role">
          <el-input v-model="formData.role" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="formData.description" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-checkbox-group v-model="formData.permissions">
            <el-checkbox v-for="permission in permissionsArr" :label="permission" :key="permission.index">{{permission}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryAllRole, updateRole } from '../../http/apiResource'

export default {
  name: 'Role',
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      formData: {},
      permissionsArr: ['偏方管理', ' 动态管理', ' 角色管理', ' 用户管理']
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
      this.$http.get(queryAllRole).then(res => {
        const result = res.data.data
        const filterArr = []
        result.map(item => {
          if (item.role !== 'admin') { filterArr.push(item) }
        })
        this.tableData = filterArr
      })
    },
    handlePermission (item) {
      this.formData = {
        ...item
      }
      const Arr = []
      this.formData.permissions = this.formData.permissions.substring(1, this.formData.permissions.length - 1).split(',')
      this.formData.permissions.map(item => {
        Arr.push(item)
      })
      this.dialogVisible = true
    },
    handleSave () {
      const indexArr = []
      const Arr = this.formData.permissions
      if (Arr.toString().indexOf('偏方管理') !== -1) {
        indexArr.push(1)
      }
      if (Arr.toString().indexOf('动态管理') !== -1) {
        indexArr.push(2)
      }
      if (Arr.toString().indexOf('角色管理') !== -1) {
        indexArr.push(3)
      }
      if (Arr.toString().indexOf('用户管理') !== -1) {
        indexArr.push(4)
      }
      if (indexArr.length === 0) {
        this.$message.warning('请至少保留一项权限')
        return
      }
      const obj = this.handleUpdateRole(indexArr, this.formData)
      this.$http.post(updateRole, obj).then(res => {
        this.$message.success(res.data.message)
        this.dialogVisible = false
        this.query()
      })
    },
    handleUpdateRole (arr, formData) {
      return {
        roleId: formData.roleId,
        permissions: arr.toString()
      }
    }
  }
}
</script>

<style scoped>

</style>
