<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card shadow="never" v-loading="loading">
        <el-button type="primary" icon="el-icon-plus" @click="handleNew">新建</el-button>
        <!-- 数据表格 -->
        <el-table
          :data="items"
          border
          style="width: 100%; margin-top:10px;"
        >
          <el-table-column prop="dynamicTitle" label="标题" width="200" ></el-table-column>
          <el-table-column prop="dynamicContent" label="内容"></el-table-column>
          <el-table-column prop="createDate" label="日期" :formatter="dateFormate" width="160"></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
        <!-- 数据表格 / -->
      </el-card>
    </div>
    <!-- 弹出窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form :rules="rules" ref="dataForm" :model="formData" label-width="90px" label-position="right">
        <el-form-item label="标题" prop="dynamicTitle">
          <el-input v-model="formData.dynamicTitle" autosize placeholder="标题" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="dynamicContent">
          <el-input type="textarea" autosize v-model="formData.dynamicContent"></el-input>
        </el-form-item>
        <el-form-item label="评论" prop="comment">
          <el-table :data="formData.comments">
            <el-table-column prop="comment"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出窗 / -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dynamicApiQuery, dynamicApiUpdate, dynamicApiCreate, dynamicApiDelete } from '../../http/apiResource.js'
import { handleSaveParam } from './dynamic.js'
export default {
  name: 'Dynamic',
  data () {
    return {
      items: [],
      disabled: false,
      pagination: {
        total: 0,
        pageSize: 20,
        pageSizes: [20, 50, 80, 120],
        currentPage: 1
      },
      loading: false,
      multipleSelection: [],
      dialogVisible: false,
      formData: {
        dynamicTitle: '',
        dynamicContent: ''
      },
      rules: {
        dynamicTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 5, max: 45, message: '长度在 5 到 45 个字符', trigger: 'blur' }
        ],
        dynamicContent: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      flag: 'add'
    }
  },
  mounted () {
    this.doQuery()
  },
  methods: {
    // 业务方法
    doQuery (page = 1, limit = 20) {
      this.pagination.currentPage = page
      this.pagination.pageSize = limit
      this.pagination.offset = (page - 1) * limit
      this.loading = true
      this.items = []
      const obj = Object.assign({ userId: this.userInfo.userId }, this.pagination)
      this.$http.post(dynamicApiQuery, obj).then(res => {
        this.items = res.data.data.list
        this.pagination.total = res.data.data.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.doQuery(1, val)
    },
    handleCurrentChange (val) {
      this.doQuery(val, this.pagination.pageSize)
    },
    handleClose () {
      this.$confirm('确认关闭？')
        .then(ret => {
          console.log(ret)
          this.dialogVisible = false
        })
        .catch(ret => {
          console.log(ret)
        })
    },
    handleNew () {
      this.disabled = false
      this.formData = {
        title: '',
        content: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      this.flag = 'add'
    },
    handleEdit (item) {
      this.disabled = true
      this.formData = {
        ...item
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      this.flag = 'edit'
    },
    handleSave () {
      if (this.flag === 'add') {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            let obj = Object.assign({ userId: this.userInfo.userId }, this.formData)
            obj = handleSaveParam(obj)
            this.$http.post(dynamicApiCreate, obj).then(res => {
              if (res.data.success) {
                this.dialogVisible = false
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.doQuery(1, 20)
              } else {
                this.$message.error('新建失败，请重新编辑')
                this.dialogVisible = false
              }
            })
          }
        })
      } else if (this.flag === 'edit') {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const obj = Object.assign({ userId: this.userInfo.userId }, this.formData)
            this.$http.post(dynamicApiUpdate, obj).then(res => {
              if (res.data.success) {
                this.dialogVisible = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.doQuery(1, 20)
              } else {
                this.$message.error('修改失败，请重新编辑')
                this.dialogVisible = false
              }
            })
          }
        })
      }
    },
    handleDelete (item) {
      this.$confirm('确认删除？').then(ret => {
        this.$http.post(dynamicApiDelete, { dynamicId: item.dynamicId }).then(res => {
          if (res.data.result) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
          this.doQuery(1, 20)
        })
      })
        .catch(ret => {
          console.log(ret)
        })
    },
    dateFormate (row) {
      return this.$moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {
    ...mapGetters({ userInfo: 'getCurrentUserInfo' })
  }
}
</script>

<style scoped>
  .pagination {
    margin-top: 10px;
    text-align: right;
  }
</style>
