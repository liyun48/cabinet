<template>
  <div class="message">
    <!--站内信息 -->
    <template>
  <el-select v-model="value" filterable placeholder="请选择" size="mini">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
   <el-date-picker
      v-model="time"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size='mini'
      value-format="yyyy-MM-dd">
    </el-date-picker>
  <el-input
      v-model="params.send_name"
      placeholder="请输入发布人"
      size='mini'
      style="width:180px"/>
      <el-button type="primary" plain size="mini" @click="findSome()">查询</el-button>
      <el-button type="primary" plain size="mini" class="one" @click="addMessage()">发布</el-button>
      <el-button type="primary" plain size="mini" class="one" @click="dealAll()">批量已读</el-button>
      <el-button type="primary" plain size="mini" class="one" @click="delAll()">批量删除</el-button>
   
   <div class="表格标题">
   <el-table
      :data="tableData"
      :header-cell-style="{}"
      :height="tblHeight"
      style="width: 100%"
      size="mini"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center"/>
      <el-table-column
        prop="mess_send"
        label="发布人"
        width="120"
        align="center"/>
      <el-table-column
        prop="mess_time"
        label="发布时间"
        width="200"
        align="center"/>
      <el-table-column
        prop="mess_title"
        label="发布标题"
        align="center"
        width="180"/>
      <el-table-column
        prop="mess_text"
        label="发布内容"
        align="center"/>
        <el-table-column
        type="expand"
        label="详细信息"
        width="120"
        align="center">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="详细信息">
              <span>{{ props.row.mess_text }}</span>
            </el-form-item><br>
            <el-button type="primary" plain size="mini" @click="Read(props.row)">已读</el-button>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="mess_status"
        label="状态"
        align="center"
        width="120"/>
      <el-table-column
        label="操作"
        fixed="right"
        width="120"
        align="center">
        <template slot-scope="{row}">
          <i class="el-icon-delete" title="删除" @click="delMessage(row)" />
          <!-- <i class="fa fa-eye" title="阅读" @click="allRead(row)" /> -->
        </template>
      </el-table-column>
    </el-table>
    </div>
      <!-- 分页 -->
    <div class="page">
      <el-pagination
        :page-size="20"
        :total="100"
        size="mini"
        layout=" prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>

    <div class='addDialog'>
      <!-- 
        添加模态框  
        
        -->


    </div>
</template>
  </div>
</template>



<script>
import $ from 'jquery'
import service from '@/utils/request'


export default {

  data() {
    return {
       options: [{
          value: '1',
          label: '已读'
        }, {
          value: '2',
          label: '未读'
        }],
         currentPage1: 5,
          // 总条数
          total: 0,
          params: {
            page: 1
          },
        tableData: [],
        multipleSelection: [],
        idss: [],
        value: '',
        restaurants: [],
            params:{
              start_time:'',
              end_time:''
            },
        time:[], 
      }
    },
    //监听器
     watch: {
       time: function(){
         if(this.time !== '' && this.time !== null){
           this.params.start_time = this.time[0];
           this.params.end_time =this.time[1];
         } else {
           this.params.start_time = '1970-01-01'
           this.params.end_time = '3000-12-31'
         }
         this.fingAllMessage(this.params)
       },
       page:function(){},
     },
     //
    created() {
    this.tblHeight = $(window).height() - 225
    this.fingAllMessage()
    },
    methods: {
      //
      // change(val){
      //   console.log(val)
      //   this.params.start_time = val[0]
      //   this.params.end_time = val[1]
      //   console.log(this.params.start_time)
      // },
       // 数据渲染
    fingAllMessage(params) {
      console.log('params',params)
      const url = '/api_message/list_message/'
      service.get(url).then(({ data }) => {
       
        this.total=data.count
        data.result.map((item) => {
          if(item.mess_status ===0){
            return item.mess_status='未读'
          }else{
            return item.mess_status='已读'
          }
        })
        this.tableData = data.result
        this.params={
          page:1
        }
      })
    },
      // 分页
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        },
      // Table
        handleSelectionChange(val){
          const vals = { val }
          console.log(vals.val)
          this.multipleSelection = val
        },
    //添加模态框
    // 查看部门列表
    departmentList() {
      service.get('/api_department/department_list/').then((data) => {
        this.dep1 = data.results
        const department = []
        this.dep1.map((item) => {
          // 一级部门
          const aaa = {
            id: item.id,
            label: item.dep_name,
            children: []
          }
          // console.log(aaa)
          item.subs.map((item) => {
            // 二级部门
            const bbb = {
              id: item.id,
              label: item.dep_name,
              children: []
            }
            item.subs.map((item) => {
              // 三级部门
              const ccc = {
                id: item.id,
                label: item.dep_name
              }
              bbb.children.push(ccc)
            })
            aaa.children.push(bbb)
          })
          department.push(aaa)
        })
        this.data1 = department
        this.addDialog.title = '新增站内信'
        this.addDialog.visible = true
      }).catch(() => {

      })
    },
      //单独处理时间函数
      dealDisabledDate (time) {
      // time.getTime是把选中的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
      // Date.now()是把今天的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数,这样比较好比较
      // return的值,true是不可以操作选择,false可以操作选择,比如下面这个判断就只能选择今天之后的时间
      return time.getTime() < Date.now()

      // 这里减8.64e7的作用是,让今天的日期可以选择,如果不减的话,今天的日期就不可以选择,判断中写<= 也是没用的,一天的毫秒数就是8.64e7
      return time.getTime() < Date.now() - 8.64e7
    },
    // 批量删除
    handleSelectionChange(val) {
      // console.log('+++++',val)
      this.multipleSelection = val
      this.idss = this.multipleSelection.map((item) => {
        return item.mess_id
      })
      // console.log('======',this.idss)
    },
    // 删除站内信
    delMessage(row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('row',row)
        let obj = {
          mess_id:row.mess_id
        }
        service.post('/api_message/delete_message/',obj).then(()=>{
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
          this.$parent.fingAllMessage()
        }).catch(()=>{
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          });
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '已取消删除',
          type: 'success'
        });
      })
    },
    // 已读
    Read(row) {
      this.$confirm('此操作将设置为已阅, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          'mess_ids': [row.mess_id]
        }
        console.log(obj)
        service.post('/api_message/read_message/', obj).then(() => {
          this.$message({
            type: 'success',
            message: '阅读成功!'
          })
          this.$parent.fingAllMessage()
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '设置成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 批量已读
    allRead() {
      // alert(this.idss)
      if (this.idss.length !== 0) {
        const obj = {
          'mess_ids': this.idss
        }
        this.$confirm('此操作将批量设置已阅读, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          service.post('/api_message/read_message/', obj).then(() => {
            this.$message({
              type: 'success',
              message: '批量阅读成功!'
            })
            this.$parent.fingAllMessage()
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '设置失败',
              type: 'success'
            })
          })
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '已取消',
            type: 'success'
          });
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择需要设置的站内信',
          type: 'error'
        })
      }
    },
    // 批量删除
    delAllMessage(){
      // alert(this.idss)
      if (this.idss.length !== 0) {
        const obj = {
          'mess_ids': this.idss
        }
        this.$confirm('此操作将批量设置批量删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          service.post('/api_message/delete_messages/', obj).then(() => {
            this.$message({
              type: 'success',
              message: '批量删除成功!'
            })
            this.$parent.fingAllMessage()
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '批量删除失败',
              type: 'success'
            })
          })
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '已取消',
            type: 'success'
          });
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择需要设置的站内信',
          type: 'error'
        })
      }
    },
      loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
        ];
      },
      handleSelect(item) {
        console.log(item);
      }

    
    },
    mounted() {
      this.restaurants = this.loadAll();
    }
  }
</script>



<style scoped>
  
</style>
