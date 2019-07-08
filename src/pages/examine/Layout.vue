<template>
  <div class="examine">
    <!-- 审批状态选择器 -->
    <el-select v-model="params.status_id" clearable placeholder="请选择审批状态" >
      <el-option
        v-for="item in statusData"
        :key="item.status_id"
        :label="item.status_text"
        :value="item.status_id"
      />
    </el-select>
    <!-- 申请人输入框 -->
    <el-input v-model="params.last_name" class="input" clearable placeholder="请输入申请人" />
    <!-- 按钮 -->
    <el-button class="btn" @click="dialogAddFormVisible = true" >申请</el-button><hr >
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      :height="tblHeight"
      class="tables"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column
        align="center"
        prop="approval_user"
        label="申请人"
        width="120"/>
      <el-table-column
        align="center"
        prop="approval_type"
        label="审批类型"
        width="120"/>
      <el-table-column
        align="center"
        prop="approval_text"
        label="审批内容"/>
      <el-table-column
        align="center"
        prop="start_end"
        label="申请时间"/>
      <el-table-column
        align="center"
        prop="approval_history"
        label="审批记录"/>
      <el-table-column
        align="center"
        prop="approval_status"
        width="200"
        label="审批状态"/>
      <el-table-column
        label="操作"
        align="center"
        width="150">
        <template slot-scope="{row}">
          <i class="fa fa-rocket" title="催办" @click="openMessage(row)"/>
          <i v-if="row.approval_status === '未审批'" id="i" class="fa fa-check-square-o" title="审批" @click="toExamine(row)"/>
          <!-- <i  class="fa fa-check-square-o" title="审批" @click="toExamine(row)"/> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="page" >
      <el-pagination
        :page-size="20"
        :total="allPages"
        :current-page.sync="status.page"
        layout=" prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>

    <!-- 提交申请模态框 -->
    <el-dialog
      :visible.sync="dialogAddFormVisible"
      title="提交申请"
      width="30%"
      center>
      <el-form :model="status.form">
        <!-- {{status.form}} -->
        <el-form-item :label-width="formLabelWidth" label="申请类型">
          <el-select v-model="status.form.approval_type" class="type-select" placeholder="请选择申请类型">
            <el-option
              v-for="item in typeData"
              :key="item.type_id"
              :label="item.type_text"
              :value="item.type_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="申请时间">
          <el-date-picker
            v-model="status.form.start_end"
            class="time-select"
            type="datetimerange"
            value-format="yyyy-MM-dd hh:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="申请原因" >
          <el-input
            :rows="8"
            v-model="status.form.approval_text"
            class="reason-input"
            type="textarea"
            placeholder="请输入申请原因"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="toInsert()">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 审批模态框 -->
    <el-dialog
      :visible.sync="dialogExamineFormVisible"
      title="处理申请"
      width="60%"
      center>
      <el-table
        :data="rowData"
        class="tables"
        style="width: 100%;margin-bottom:10px">
        <el-table-column
          align="center"
          prop="approval_user"
          label="申请人"/>
        <el-table-column
          align="center"
          prop="approval_type"
          label="审批类型"/>
        <el-table-column
          align="center"
          prop="approval_text"
          label="审批内容"/>
        <el-table-column
          align="center"
          prop="start_end"
          label="申请时间"/>
      </el-table>
      <el-form :model="status.exForm">
        <!-- {{ status.exForm }} -->
        <el-form-item :label-width="formLabelWidth" label="审批内容" >
          <el-input
            :rows="8"
            v-model="status.exForm.approval_history"
            class="reason-input"
            type="textarea"
            placeholder="请输入审批内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogExamineFormVisible = false">取 消</el-button>
        <el-button @click="toRefuse()">拒 绝</el-button>
        <el-button type="primary" plain @click="subExanine()">同 意</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import $ from 'jquery'
import service from '@/utils/request'

export default {
  components: {

  },
  data() {
    return {
      status: {
        // 提交申请表单
        form: {},
        // 审批表单
        exForm: {
          approval_id: 0,
          status_id: 0
        },
        // 分页
        page: 1
      },
      // 全部数据
      tableData: [],
      // 页数
      allPages: 0,
      // 单行数据
      rowData: [],
      // 审批状态
      statusData: [],
      // 审批类型
      typeData: [],
      // 表格  单行数据  没有用到
      multipleSelection: [],
      // 隐藏提交申请模态框
      dialogAddFormVisible: false,
      // 隐藏审批模态框
      dialogExamineFormVisible: false,
      // form表单宽度
      formLabelWidth: '100px',
      // 查询时传给后台数据
      params: {
        page: 1
      }
    }
  },
  watch: {
    // 多用于模糊查询
    params: {
      handler: function(now, old) {
        // console.log('now',now)
        this.params = now
        this.findAllExamine(this.params)
      },
      deep: true
    }
    // 监听审批状态
    // 'status.radio':function(newVal,oldVal){
    //   this.status.radio = newVal
    //   console.log(this.status.radio)
    //   true
    // },
  },
  created() {
    this.tblHeight = $(window).height() - 220
    this.findAllExamine(this.params)
    this.findStatus()
    this.findType()
  },
  methods: {
    // 数据渲染
    findAllExamine(params) {
      service.get('/api_approval/get_approval_list/', { params }).then(({ data }) => {
        this.tableData = data.result
        this.allPages = data.count
      })
    },
    // 获取审批状态
    findStatus() {
      const url = '/api_approval/get_approval_status/'
      service.get(url).then(({ data }) => {
        this.statusData = data.result
      })
    },
    // 获取审批类型
    findType() {
      const url = '/api_approval/get_approval_type/'
      service.get(url).then(({ data }) => {
        this.typeData = data.result
      })
    },
    // 提交申请
    toInsert() {
      service.post('/api_approval/create_approval/', this.status.form).then(() => {
        console.log('成功')
      }).catch(() => {

      })
      this.status.form = {}
      this.dialogAddFormVisible = false
      this.findAllExamine()
    },
    // 表格 复选框对应单行数据
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 分页
    handleCurrentChange(val) {
      console.log(val)
      this.page = val
      const url = '/api_approval/get_approval_list/?page=' + val
      service.get(url).then(({ data }) => {
        this.tableData = data.result
      })
    },
    // 消息提示
    openMessage(row) {
      console.log(row.approval_user)
      this.$notify({
        title: '催办',
        message: row.approval_user + '申请' + row.approval_text,
        position: 'bottom-right',
        offset: 100
      })
    },
    // 去审批
    toExamine(row) {
      this.rowData = [row]
      console.log(this.rowData[0].approval_id)
      this.dialogExamineFormVisible = true
    },
    // 同意审批
    subExanine() {
      this.status.exForm.status_id = 1
      this.status.exForm.approval_id = this.rowData[0].approval_id
      service.post('/api_approval/approval_deal/', this.status.exForm).then(() => {
        console.log('成功')
      }).catch(() => {

      })
      this.status.exForm = {}
      this.findAllExamine()
      this.dialogExamineFormVisible = false
    },
    // 拒绝审批
    toRefuse() {
      this.status.exForm.status_id = -1
      this.status.exForm.approval_id = this.rowData[0].approval_id
      service.post('/api_approval/approval_deal/', this.status.exForm).then(() => {
        console.log('成功')
      }).catch(() => {

      })
      this.status.exForm = {}
      this.findAllExamine()
      this.dialogExamineFormVisible = false
    }
    // 审批拒绝   监听方式
    // toRefuse(){
    //   this.status.exForm.approval_history = this.status.extextarea
    //   this.status.exForm.approval_id = this.rowData[0].approval_id
    //   this.status.exForm.status_id = -1
    //   // console.log('a+++++++++++++++++++++++++++++++++++++')
    //   console.log(this.status.exForm)
    //   service({
    //     method: 'post',
    //     url: '/api_approval/approval_deal/',
    //     data: this.status.exForm
    //   })
    //   this.findAllExamine();
    //   this.dialogExamineFormVisible = false;
    //   this.status.extextarea = '';
    // },

  }
}
</script>

<style scoped>
.input{
  width: 200px;
}
.btn{
  position: absolute;
  right: 70px;
}
.block{
  position: absolute;
  right: 10px;
  bottom: 10px;
}
.tables i{
  font-size: 20px;
}
.tables i:hover{
  cursor: pointer;
}
/* .tables i:last-child {
  color: #2E5C26;
  margin-left: 15px;
} */
#i{
  color: #2E5C26;
  margin-left: 15px;
  font-weight: 700;
  font-size: 20px;
}
.type-select,
.reason-input,
.time-select{
  width: 95%;
}
.dialog-footer,
.extend-form{
  text-align: right;
}
.page{
  position: absolute;
  right: 70px;
}

</style>
