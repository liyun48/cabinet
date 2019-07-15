<template>
  <div class="alarm">
     <!-- 模糊查询 -->
  <div class="top">
    <div class="kuang">
     
    <el-input
     placeholder="请输入所属单位"
     v-model="queryobj.dep_name"
     size="mini">
    </el-input>
   
     
    <el-select   size="mini"  v-model="queryobj.alarm_status" placeholder="请选择报警状态" clearable>
    <el-option
      v-for="item in alarmstatus"
      :key="item.status_id"
      :label="item.status_text"
      :value="item.status_id">
    </el-option>
    </el-select>
    
     <el-date-picker
     size="mini"
      v-model="queryobj.time"
      type="datetimerange"
      
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
     >
    </el-date-picker>
     </div>
  <div class="alarm_btn">
     <el-button class="one" size="mini" @click="batchDelete.visible = true" type="primary" plain>批量处理</el-button>
     <el-button class="one" size="mini" @click="toCheck" type="primary" plain>查看统计</el-button>
     <el-button class="one" size="mini" @click=" exportAlarm" type="primary" plain>导出</el-button>
  </div>
  </div>
  <!-- 加入表格 -->
  <div>
    <el-table
    size="mini"
     :height="tblHeight"
    ref="multipleTable"
    :data="alarm"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="expand"
      >
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="处理记录">
            <span>{{ props.row.deal_history }}</span>
          </el-form-item>
          <el-form-item label="审核记录">
            <span>{{ props.row.audit_history }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
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
    <div class="1">
    <el-pagination
      @current-change="handleCurrentChange"
      :page-size="this.size"     
      :total="this.count">
    </el-pagination>
  </div>

     <!--批量处理  -->
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

     <!-- 去处理 -->
    <el-dialog
      :title="deal.title"
      :visible.sync="deal.visible"
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
        <!-- </tr>
        <tr v-for="(item,index) in  batchDelete.val1" :key="index">
          <td>{{item.alarm_time}}</td>
          <td>{{item.dep_name}}</td>
          <td>{{item.cabinet_name}}</td>
          <td>{{item.dataitem_code}}</td>
          <td>{{item.alarm_text}}</td>
          <td>{{item.status_text}}</td>
        </tr> -->
          <tr>
          <td>{{deal.row.alarm_time}}</td>
          <td>{{deal.row.dep_name}}</td>
          <td>{{deal.row.cabinet_name}}</td>
          <td>{{deal.row.dataitem_code}}</td>
          <td>{{deal.row.alarm_text}}</td>
          <td>{{deal.row.status_text}}</td>
          </tr>
      </table>
      <hr>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入处理记录"
        v-model="textarea">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDelete.visible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="toUpDeal" size="mini">确 定</el-button>
      </span>
    </el-dialog>


     <!-- 去审核 -->
     <el-dialog
      :title="sh.title"
      :visible.sync=" sh.visible"
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
       
        <!-- <tr v-for="(item,index) in  sh.row" :key="index">
          <td>{{sh.row.alarm_time}}</td>
          <td>{{item.dep_name}}</td>
          <td>{{item.cabinet_name}}</td>
          <td>{{item.dataitem_code}}</td>
          <td>{{item.alarm_text}}</td>
          <td>{{item.status_text}}</td>
        </tr> -->
          <tr>
          <td>{{sh.row.alarm_time}}</td>
          <td>{{sh.row.dep_name}}</td>
          <td>{{sh.row.cabinet_name}}</td>
          <td>{{sh.row.dataitem_code}}</td>
          <td>{{sh.row.alarm_text}}</td>
          <td>{{sh.row.status_text}}</td>
        </tr>
      </table>
      <hr>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入处理记录"
        v-model="textarea">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" batchDelete.visible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="toUpCheck" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 统计模态框 -->
      <el-dialog
        title="查看统计"
        :visible.sync="tongji.visible"
         width="50%">
      <el-tabs tab-position="left" style="height:400px;">
      <el-tab-pane label="报警状态统计">
         <div id="status" style="width:100%;height:400px" ></div>
      </el-tab-pane>
      <el-tab-pane label="报警设备统计">
        <div id="type" style="width:700px;height:400px"></div>
      </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
  </div>
</template>



<script>
import $ from 'jquery'
import service from '@/utils/request'
import echarts from 'echarts'

export default {
 
  data(){
    return{
        alarm:[],
        alarmstatus:[],
        value4: '',
       
        queryobj:{
          //  dep_name:'', //input框的双向数据绑定
           //select框的双向数据绑定
          //  alarm_status:'',
           page:1
        }, 
        batchDelete:{
          visible:false,
          val1:[],
          title:'批量处理',
          obj:{
            alarm_ids:[],
            cabinet_ids:[],
            deal_history:''
          }  
        },
       //-------审核
        sh:{
          visible:false,
          title:'审核',
          row:''
        },
        obj1:{
          alarm_id:'',
          audit_history:'',
          audit_status: ''
        },
      //---------------------
      //------------------处理---------------------
       deal:{
          visible:false,
          title:'处理',
          row:'',
          obj:{
          alarm_ids:[],
          cabinet_ids:[],
          deal_history:''}
       },
    //-----------统计----------------
     tongji:{
        visible:false,
        alarmStatus:[],
        alarmDevice:[]

     },
          textarea: '',
          count:0,
          size:20
      
      };
  },
 
 //在页面渲染之前准备数据
  created(){
    this.tblHeight = $(window).height() - 220
    this.findAllAlarm();
    this.findAllAlarmStatus();
    this.findAllStatistics();
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
//     draw(){

//       var myChart = echarts.init(document.getElementById('main'))
//       let option = {
//     xAxis: {
//         type: 'category',
//         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//         type: 'value'
//     },
//     series: [{
//         data: [820, 932, 901, 934, 1290, 1330, 1320],
//         type: 'line'
//     }]
// };
//     myChart.setOption(option)
//     },
     findAllAlarm(){
      service.get('/api_alarm/get_alarm_list/',{params:this.queryobj})
      .then(({data})=>{
        // console.log(data.result)
        this.alarm = data.result
        this.count=data.count;
       
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
     // 导出
    exportAlarm(){
      this.$confirm('将导出搜索的结果,确认要导出么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(()=>{
        delete this.queryobj.page
        let str = $.param(this.queryobj)
        // console.log(str)
        let url = 'http://192.168.50.50:9999/api_alarm/export_alarm_list/?'+str
        // console.log(url)
        window.location.href=url
        this.$message({
          showClose: true,
          message: '正在下载...',
          type: 'success'
        })
      })
      .catch(()=>{
        this.$message({
          showClose: true,
          message: '导出失败',
          type: 'error'
        })
      })
    },
     //获取所有警告的状态
     findAllAlarmStatus(){
       service.get('/api_alarm/get_alarm_status/')
       .then(({data})=>{
         let a =data.result;
         a.map((item)=>{
           console.log(item.name);
         })
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
    
    //去审核------------------------------------------------------------------------------------
    toCheck(row){
      this.sh.visible=true;
      this.sh.row=row;
      // console.log(row);
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
    },
    toUpCheck(){
        service.post('/api_alarm/audit_alarm/',this.obj1)
       .then(({code})=>{
         open();
          this.findAllAlarm();
      })
      .catch(()=>{
      })
      this.sh.visible=false;
    },
  
   //---------------------------去处理---------------------------------------------------------------------
    toDeal(row){
      this.deal.visible=true;
        this.deal.row=row;
        console.log(row);
        this.deal.obj.alarm_ids = [row.alarm_id];
        this.deal.obj.cabinet_ids =[row.cabinet_id];
        this.deal.obj.deal_history =this.textarea; 
    },
    toUpDeal(){
      service.post('/api_alarm/process_alarm/',this.deal.obj)
      .then(({code})=>{
        this.findAllAlarm();
        
      })
      .catch(()=>{
      })
      this.deal.visible=false;
    },
    //谈框
        open() {
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success',
          center: true
        });
      },

   //----------------统计---------------------------------------
    findAllStatistics(){
      service.get('/api_alarm/get_alarm_statistics/')
      .then(({data})=>{
         console.log(data.status);
       
         console.log(data.device);
         this.tongji.alarmStatus = data.status;
         this.tongji.alarmDevice = data.device;
        
      })
    },
   
   toCheck(){
      this.tongji.visible=true;
      // this.drawAlarmStatus()
      setTimeout(()=>{
      this.drawAlarmStatus();
      this.drawAlarmDevice();
    },100)
   },
      
     // 报警状态
    drawAlarmStatus(){
      let name = this.tongji.alarmStatus.map((item)=>{
        return item.name
      })
      let data = this.tongji.alarmStatus.map((item)=>{
        return {
          value: item.count,
          name: item.name
        }
      })
      console.log(name,data)
      let myChart = echarts.init(document.getElementById('status'))
      let option = {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        
        color:['#dd6b66','#759aa0','#e69d87'],
        legend: {
         orient: 'vertical',
         left: 'left',
          data:data
        },
        series : [
          {
            name: '报警统计',
            type: 'pie',
            radius : '55%',
            center: ['50%', '40%'],
            data:data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
      // 报警设备
    drawAlarmDevice(){
      let type= this.tongji.alarmDevice.map((item)=>{
        return item.name
      })
      let data = this.tongji.alarmDevice.map((item)=>{
        return {
          value: item.count,
          name: item.name
        }
      })
      console.log(name,data)
      let myChart = echarts.init(document.getElementById('type'))
      let option = {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        
        color:['#dd6b66','#759aa0','#e69d87'],
        legend: {
         orient: 'vertical',
         left: 'left',
          data:type
        },
        series : [
          {
            name: '报警统计',
            type: 'pie',
            radius : '55%',
            center: ['50%', '40%'],
            data:data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    }
}
}

//----------------------------------------------------------------------------------------------
</script>

<style >
*{
  margin: 0;
  padding: 0;
}
.top{
  display: flex;

}
.alarm_btn {
  flex: 8;
  margin-left: 100px;
 
  display: flex;
}
.kuang{
  display: flex;
  flex: 8;
  }

.kuang > .el-input{
  flex: 2;
  margin-left: 10px;
}
/* .el-input__inner{
  flex: 2;
  margin-left: 10px;
} */
.kuang > .el-select {
  flex: 2;
  margin-left:10px
}
.kuang >.el-date-editor{
  flex:4;
  margin-left: 10px;
}

.el-pagination{
  text-align: right;
}

</style>
