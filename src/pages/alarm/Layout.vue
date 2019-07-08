<template>
  <div class="alarm">
     <!-- 模糊查询 -->
  <div class="top">
  
    <el-input
     placeholder="请输入所属单位"
     v-model="queryobj.dep_name"
     size="medium">
    </el-input>
    <el-select v-model="queryobj.alarm_status" placeholder="请选择报警状态">
    <el-option
      v-for="item in alarmstatus"
      :key="item.status_id"
      :label="item.status_text"
      :value="item.status_id">
    </el-option>
    </el-select>

     <div class="block">
     <el-date-picker
      v-model="queryobj.time"
      type="datetimerange"
      :picker-options="pickerOptions2"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right">
    </el-date-picker>
     </div>
  <div class="alarm_btn">
    <el-button class="one" type="warning" @click="batchDelete.visible = true">批量处理</el-button>
    <el-button class="one" type="warning">查看统计</el-button>
    <el-button class="one" type="warning">导出</el-button>
  </div>
  </div>
  <!-- 加入表格 -->
  <div>
    <el-table
    size="small"
     :height="tblHeight"
    ref="multipleTable"
    :data="alarm"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      align="center"
      label="报警时间"
      prop="alarm_time">
    </el-table-column>
    <el-table-column
      align="center"
      prop="dep_name"
      label="报警单位">
    </el-table-column>
    <el-table-column
      align="center"
      prop="cabinet_name"
      label="报警机柜">
    </el-table-column>
    <el-table-column
      align="center"
      prop="dataitem_code"
      label="报警设备">
    </el-table-column>
    <el-table-column
      align="center"
      prop="alarm_time"
      label="报警内容">
    </el-table-column>
    <el-table-column
      align="center"
      prop="alarm_status"
      label="报警状态">
    </el-table-column>
    <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="{row}">
            <!-- slot-scope="{row}获取一行的数据 -->
            <i class="fa fa-legal" @click="toDeal(row)" title="处理"  v-if="row.alarm_status == '未处理'"></i>
            <i class="fa fa-check" @click="toCheck(row)" title="审核" v-if="row.alarm_status == '未处理' || row.alarm_status =='已处理'" ></i>
          </template>
   </el-table-column>
  </el-table>
   <!-- 分页 -->
    <div class="block">
    <el-pagination
      @current-change="handleCurrentChange"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
   <!-- 模态框 -->
      <el-dialog
      :title="batchDelete.title"
      :visible.sync=" batchDelete.visible"
      width="50%"
     >
      <hr>
      <table class="table">
        <tr>
          <td>报警时间</td>
          <td>报警单位</td>
          <td>报警机柜</td>
          <td>报警设备</td>
          <td>报警原因</td>
          <td>报警状态</td>
        </tr>
        <tr v-for="(item,index) in  batchDelete.val1" :key="index">
          <td>{{item.alarm_time}}</td>
          <td>{{item.dep_name}}</td>
          <td>{{item.cabinet_name}}</td>
          <td>{{item.dataitem_code}}</td>
          <td>{{item.alarm_text}}</td>
          <td>{{item.status_text}}</td>
        </tr>
      </table>
      <hr>
      {{obj1}}
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入处理记录"
        v-model="textarea">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" batchDelete.visible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="toBatchDelete" size="mini">确 定</el-button>
      </span>
    </el-dialog>





  </div>
  </div>
</template>



<script>
import $ from 'jquery'
import service from '@/utils/request'
export default {
  data(){
    return{
        alarm:[],
        alarmstatus:[],
        value4: '',
         pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        queryobj:{
          //  dep_name:'', //input框的双向数据绑定
           //select框的双向数据绑定
          //  alarm_status:'',
           page:1
        }, 
        batchDelete:{
          visible:false,
          val1:[],
          title:'',
          obj:{
            alarm_ids:[],
            cabinet_ids:[],
            deal_history:''
          }  
        },
        obj1:{
          alarm_id:'',
          audit_history:'',
          audit_status: ''
        },
          textarea: ''
      
      };
  },
 
 //在页面渲染之前准备数据
  created(){
    this.tblHeight = $(window).height() - 220
    this.findAllAlarm();
    this.findAllAlarmStatus();
  },
  watch:{
      queryobj:{
         handler:function(now,old){
            // console.log('=====',now);
            if(now.time){
              // alert(1)
              this.queryobj.start_time = now.time[0]
              this.queryobj.end_time = now.time[1]
              // delete this.queryobj.time
            }else if(now.time === null){
              delete this.queryobj.start_time
              delete this.queryobj.end_time
            }
            // console.log('=====',this.queryobj);

            this.findAllAlarm();
         },
         deep:true
      }
  },
  methods: {
     findAllAlarm(){
      service.get('/api_alarm/get_alarm_list/',{params:this.queryobj})
      .then(({data})=>{
        // console.log(data.result)
        this.alarm = data.result
        this.alarm.map((item)=>{
           if(item.alarm_status === 0){
             return item.alarm_status ='未处理' ;
           }
           if(item.alarm_status ===1){
             return item.alarm_status='已处理';
           }
           if(item.alarm_status ===2){
             return item.alarm_status='已审核';
           }
        })
      }).catch(()=>{

      })
     },
     //获取所有警告的状态
     findAllAlarmStatus(){
       service.get('/api_alarm/get_alarm_status/')
       .then(({data})=>{
         this.alarmstatus=data.result;
       }).catch(()=>{

       })
     },
    
    handleSelectionChange(val) {
      let val1=[];
      this.batchDelete.val1 = val;
      //val为获取的每一行的所有数据
    },
   //批量处理
   toBatchDelete(){
        this.batchDelete.obj.alarm_ids = this.batchDelete.val1.map((item)=>{
        return item.alarm_id
      })
        this.batchDelete.obj.cabinet_ids = this.batchDelete.val1.map((item)=>{
        return item.cabinet_id
      })
      this.batchDelete.obj.deal_history =this.textarea; 
     service.post('/api_alarm/process_alarm/',this.batchDelete.obj)
    .then(({code})=>{
      if(code === 200){
        this.findAllAlarm();
      }
    })
    this.batchDelete.visible=false;
   },

    handleCurrentChange(val) {
      // console.log(`当前页`,val);
      this.queryobj.page = val
      // this.findAllAlarm()
    },
    
    toCheck(row){
      this.batchDelete.visible=true;
      console.log(row);
      this.obj1.alarm_id=row.alarm_id;
      // this.obj1.audit_status=row.alarm_status;
         if(row.alarm_status === '未处理'){
             return this.obj1.audit_status =0 ;
           }
           if(row.alarm_status ==='已处理'){
             return  this.obj1.audit_status=1;
           }
           if(row.alarm_status ==='已审核'){
             return  this.obj1.audit_status=2;
           }
       this.obj1.audit_history=this.textarea;
       service.post('/api_alarm/audit_alarm/',this.obj1)
       .then(({code})=>{
        if(code ===200){
           row.audit_status=='已审核';
           this.findAllAlarm();
        }
        
      })
      .catch(()=>{
        
      })
    }
    


  }
}
</script>


<style scoped>
.top{
  display: flex;
}
.el-select{
  flex: 1.5;
  margin-left: 20px;
}
.el-input{
  flex: 1.5;
}
.alarm_btn {
  margin-right: 10px; 
  flex: 4;
  margin-left: 150px;
}
.one{
  background-color: #0C1523;
}


.block{
  text-align: right;
  margin-left: 20px;
}


</style>
