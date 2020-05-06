<template>
  <el-card>
    <div class="advContent">
      <div class="title">
        偏方公告
      </div>
      <div class="contentItem">
         <ul class="noticeList">
          <li v-for="(item,index) in filteredItems" :key="item.index">
              <div class="item">
                <div style="margin-left: 5px">
                  <p><span class="col">{{item.createDate}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span></span> {{item.title}}</p>
                  <span>{{item.content}}</span>
                  <br/>
                  <div v-for="(comment) in item.comments" :key="comment.index">
                    <p><span class="col">{{comment.userId}}:</span>&nbsp;&nbsp;&nbsp;&nbsp;<span></span> {{comment.comment}}</p>
                  </div>
                  <br/>
                  <el-form ref="commentForm" :model="commentForm" :inline="true" :rules="rules">
                    <el-form-item prop="comment">
                      <input style="width: 800px" type="textarea" value="" :id="'comment'+index" name="comment" placeholder="说点什么吧"/>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" size="mini" @click="comment(item, 'comment'+index)">提交评论</el-button>
                    </el-form-item>
                    <el-form-item style="margin-right: 15px">
                      <el-button type="primary" size="mini" @click="reward(item, 'comment'+index)">打赏</el-button>
                    </el-form-item>
                    <el-form-item style="margin-right: 15px" v-if="userInfo.userFlag.indexOf('管理员') !== -1 ">
                      <el-button type="primary" size="mini" @click="deleteRemedy(item, 'comment'+index)">删除</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      title="打赏"
      :visible.sync="centerDialogVisible"
      width="30%"
      :before-close="beforeClose"
      center>
      <el-row style="margin-left: 8%">
        <el-button type="danger" style="margin-right: 15px;width: 100px" @click="amount(2)" v-if="isShowAmount">2元</el-button>
        <el-button type="danger" style="margin-right: 15px;width: 100px" @click="amount(5)" v-if="isShowAmount">5元</el-button>
        <el-button type="danger" style="margin-right: 15px;width: 100px" @click="amount(10)" v-if="isShowAmount">10元</el-button>
      </el-row>
      <el-row style="margin-top: 30px;margin-left: 8%">
        <el-button type="danger" style="margin-right: 15px;width: 100px" @click="amount(50)" v-if="isShowAmount">50元</el-button>
        <el-button type="danger" style="margin-right: 15px;width: 100px" @click="amount(100)" v-if="isShowAmount">100元</el-button>
        <el-button type="danger" style="margin-right: 15px;width: 100px" @click="amount('')" v-if="isShowAmount">任意金额</el-button>
      </el-row>
      <el-row style="margin-top: 30px">
        <el-input placeholder="请输入金额" v-model.number="amountValue" v-if="isShowAmountAny"></el-input>
      </el-row>
      <img src="../../assets/AliPay/ali.jpg" v-if="isShowAliPay" width="330" style="margin-left: 8%">
      <span slot="footer" class="dialog-footer" v-if="isShowAmountAny">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureAny">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { createComment, dynamicApi, dynamicApiQueryAll } from '../../http/apiResource'
import { mapGetters } from 'vuex'

export default {
  name: 'Remedy',
  data () {
    return {
      filteredItems: [],
      commentForm: {
        comment: ''
      },
      centerDialogVisible: false,
      rules: {
        comment: [{ required: true, message: '请输入评论', trigger: 'blur' }]
      },
      amountValue: '',
      isShowAmount: true,
      isShowAmountAny: false,
      isShowAliPay: false
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
      this.$http.post(dynamicApiQueryAll).then(res => {
        if (res.data.success) {
          const result = res.data.data.list
          result.map(item => {
            item.createDate = this.$moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
            item.title = item.dynamicTitle
            item.content = item.dynamicContent
          })
          this.filteredItems = result
        }
      })
    },
    reward (remedy, id) {
      this.centerDialogVisible = true
      this.isShowAmount = true
    },
    amount (num) {
      if (num === '') {
        this.isShowAmountAny = true
      } else {
        this.isShowAmountAny = false
        this.amountValue = num
        this.isShowAmount = false
        this.isShowAliPay = true
      }
    },
    sureAny () {
      this.amount(this.amountValue)
    },
    beforeClose () {
      this.centerDialogVisible = false
      this.isShowAliPay = false
    },
    comment (remedy, id) {
      const comment = document.getElementById(id).value
      if (comment) {
        const obj = {
          remedyId: '',
          userId: '',
          comment: ''
        }
        obj.remedyId = remedy.dynamicId
        obj.userId = this.userInfo.userId
        obj.comment = comment
        this.$http.post(createComment, obj).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message)
            this.query()
          }
        })
      } else {
        this.$message.warning('请先输入评论')
      }
    },
    deleteRemedy (remedy) {
      this.$http.post(dynamicApi, { dynamicId: remedy.dynamicId }).then(res => {
        if (res.data.success) {
          this.$message.success('删除成功')
          this.query()
        }
      })
    }
  }
}
</script>
<style scoped>
  .advContent {
    background: #fff;
    border-radius: 5px 5px 0px 0px;
  }
  .advContent .title {
    font-size: 16px;
    padding: 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
  }
  .advContent .contentItem {
    padding: 0 30px;
    min-height: 350px;
  }
  .advContent .contentItem .item {
    display: flex;
    padding:18px 0 10px;
    border-bottom: solid 1px #ccc;
  }
  .advContent .contentItem .item .col {
    color: #8a97f8;
  }
  .advContent .contentItem .item .img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .advContent .contentItem .item .p {
    padding: 0 0 8px;
  }
  .noticeList {
    margin: 0;
    padding: 0;
  }
</style>
