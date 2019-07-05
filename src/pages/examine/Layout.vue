<template>
  <div class="examine">
    <!-- 审批状态选择器 -->
    <el-select v-model="status.status_id" clearable placeholder="请选择审批状态" >
      <el-option
        v-for="item in statusData"
        :key="item.status_id"
        :label="item.status_text"
        :value="item.status_id"
      />
    </el-select>
    <!-- 申请人输入框 -->
    <el-input v-model="status.last_name" class="input" clearable placeholder="请输入申请人" />
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
          <i v-if="row.approval_status === '未审批'" class="fa fa-check-square-o" title="审批" @click="toExamine(row)"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="page" >
      <el-pagination
        :page-size="20"
        :total="100"
        :current-page.sync="status.page"
        layout=" prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>

    <!-- 模态框 -->
    <el-dialog
      :visible.sync="dialogAddFormVisible"
      title="提示"
      width="30%"
      center>
      <el-form :model="status.form">
        <el-form-item :label-width="formLabelWidth" label="申请类型">
          <el-select v-model="status.region" class="type-select" placeholder="请选择申请类型">
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
            v-model="status.value1"
            class="time-select"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="申请原因" >
          <el-input
            :rows="8"
            v-model="status.textarea"
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
      title="提示"
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
        <el-form-item :label-width="formLabelWidth" label="审批内容" >
          <el-input
            :rows="8"
            v-model="status.textarea"
            class="reason-input"
            type="textarea"
            placeholder="请输入审批内容"/>
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
  components: {

  },
  data() {
    return {
      status: {
        last_name: '',
        status_id: '',
        textarea: '',
        value1: '',
        form: '',
        exForm: {},
        region: '',
        page: 1
      },
      tableData: [],
      rowData: [],
      statusData: [],
      typeData: [],
      multipleSelection: [],
      dialogAddFormVisible: false,
      dialogExamineFormVisible: false,

      formLabelWidth: '100px'
    }
  },
  watch: {
    'status.last_name': (newVal, oldVal) => {
      console.log(newVal)
      const url = '/api_approval/get_approval_list/?last_name=' + newVal
      service.get(url).then(({ data }) => {
        console.log(data.result)
        // this.tableData = data.result
      })
      true
    },
    'status.status_id': (newVal, oldVal) => {
      console.log(newVal)
      const url = '/api_approval/get_approval_list/?status_id=' + newVal
      service.get(url).then(({ data }) => {
        console.log(data.result)
        // this.tableData = data.result
      })
      true
    }
  },
  created() {
    this.tblHeight = $(window).height() - 220
    this.findAllExamine()
    this.findStatus()
    this.findType()
  },
  methods: {
    // 数据渲染
    findAllExamine() {
      const url = '/api_approval/get_approval_list/'
      service.get(url).then(({ data }) => {
        this.tableData = data.result
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
      // const url = '/api_approval/create_approval/'

      this.dialogFormVisible = false
      this.dialogAddFormVisible()
    },
    // 表格
    handleSelectionChange(val) {
      this.multipleSelection = val
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
        position: 'bottom-right'
      })
    },
    toExamine(row) {
      // console.log(row.approval_id)
      this.rowData = [row]
      console.log(this.rowData)
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
.tables i:hover{
  cursor: pointer;
}
.tables i:last-child {
  color: #2E5C26;
  margin-left: 15px;
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
