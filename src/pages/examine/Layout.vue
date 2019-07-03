<template>
  <div class="examine">
    <!-- 审批状态选择器 -->
    <el-select v-model="status.value" clearable placeholder="请选择审批状态" >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!-- 申请人输入框 -->
    <el-input v-model="status.input" class="input" clearable placeholder="请输入申请人" />
    <!-- 按钮 -->
    <el-button class="btn" @click="dialogAddFormVisible = true" >申请</el-button><hr >
    <!-- 表格数据 -->
    <el-table
      ref="multipleTable"
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
        <template slot-scope="row">
          <!-- <template> -->
          <i class="fa fa-rocket" title="催办" @click="openMessage()"/>
          <i class="fa fa-check-square-o" title="审批" @click="toExamine(row)"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="page">
      <el-pagination
        :page-size="20"
        :total="100"
        layout=" prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>

    <!-- 模态框 -->
    <el-dialog
      :visible.sync="dialogAddFormVisible"
      title="提示"
      width="30%"
      center>
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="申请类型">
          <el-select v-model="form.region" class="type-select" placeholder="请选择申请类型">
            <el-option label="申请开柜" value="申请开柜"/>
            <el-option label="其他申请" value="其他申请"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="申请时间">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="申请原因" >
          <el-input
            :rows="8"
            v-model="textarea"
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

    <el-dialog
      :visible.sync="dialogExamineFormVisible"
      title="提示"
      width="30%"
      center>
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="申请原因" >
          <el-input
            :rows="8"
            v-model="textarea"
            class="reason-input"
            type="textarea"
            placeholder="请输入申请原因"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogExamineFormVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="dialogExamineFormVisible = false">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import $ from 'jquery'
import service from '@/utils/request'

export default {
  data() {
    return {
      options: [{
        value: '选项1',
        label: '已同意'
      }, {
        value: '选项2',
        label: '已拒绝'
      }, {
        value: '选项3',
        label: '待审批'
      }
      ],

      status: [{
        value: '',
        input: '',
        textarea: '',
        value1: ''
      }],

      tableData: [],
      multipleSelection: [],
      dialogAddFormVisible: false,
      dialogExamineFormVisible: false,

      form: {
        region: ''
      },
      formLabelWidth: '100px'
    }
  },
  watch: {

  },
  created() {
    this.tblHeight = $(window).height() - 220
    this.findAllExamine()
  },
  methods: {
    // 数据渲染
    findAllExamine() {
      const url = '/api_approval/get_approval_list/'
      service.get(url).then(({ data }) => {
        this.tableData = data.result
      })
    },
    // 提交申请
    toInsert() {
      // const url = '/api_approval/create_approval/'

      this.dialogFormVisible = false
      this.dialogAddFormVisible()
    },
    // 表格
    handleSelectionChange(val) {
      const vals = { val }
      console.log(vals.val)
      this.multipleSelection = val
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 消息提示
    openMessage(val) {
      this.handleSelectionChange(val)
      this.$notify({
        title: '催办',
        message: '右下角弹出的消息',
        position: 'bottom-right'
      })
    },
    toExamine(row) {
      this.dialogExamineFormVisible = true
    }

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
.tables i:last-child {
  color: #2E5C26;
  margin-left: 15px;
}
.type-select,.reason-input{
  width: 400px;
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
