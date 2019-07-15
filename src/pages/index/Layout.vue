<template>
  <div class="index">
        <div class="one">
          <div class="tu" id="main"  style="width:1200px;height:400px;"></div>
          <div class="photo">
               
              <div class="tt" >
                  <div>
                  <img src="@/assets/u89.png"  >
                  </div>
                  <div class="aaa">站内信通知
                      <div class="bbbb">{{monitor.messages.messages}}
                          </div>
                          </div> 
                  
              </div>
              <div class="tt">
                  <img src="@/assets/u84.png" >
                  <div class="aaa">机柜门禁待审批
                       <div class="bbbb">{{monitor.messages.manage_open_approvals}}</div>
                       </div> 
                 
              </div>
              <div class="tt" >
                   <img src="@/assets/u79.png" >
                   <div class="aaa">事件处理待审核
                       <div class="bbbb">{{monitor.messages.manage_other_approvals}}</div></div> 
                  
              </div>
              <div class="tt" >
                  <img src="../../assets/u74.png" >
                  <div class="aaa">报警待处理
                      <div class="bbbb">{{monitor.messages.manage_alarm}}</div></div> 
                  
              </div>
              </div>
          </div>
        
        
        <div class="two">
          <div id="left" style="width:335px;height:340px;"></div>
          <div id="center" style="width:335px;height:340px;"></div>
          <div class="table">
                <el-table
                    :data="this.monitor.manage"
                    style="width: 100%"
                    height="300">
                    <el-table-column
                    fixed
                      align="center"
                    prop="cabinet__cabinet_name"
                    label="机柜"
                    >
                    </el-table-column>
                    <el-table-column
                      align="center"
                    prop="user__last_name"
                    label="操作人"
                   >
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="open_time"
                    label="操作时间"
                   >
                    </el-table-column>
                    <el-table-column
                      align="center"
                    prop="status"
                    label="是否违规"
                    >
                    </el-table-column>
                  
                </el-table>
          </div>
        </div> 
  </div>
</template>

<script>
import $ from 'jquery'
import service from '@/utils/request'
import echarts from 'echarts'


export default {
  data() {
    return {
      monitor:{
         leftname:[],
         total:[],
         alarm:[],
         use:[],
         shenhe:[],
         name:[],
         alarm1:[],
         manage:[],
        messages:{}
      },
      data:[]
    }
  },
  created(){
      this.findAllInfo();
  },

  methods:{
    
      findAllInfo(){
         service.get('/api_room_monitor/get_index_info')
          .then(({data})=>{
            // console.log(data.manage_chart.approvals);
            data.manage_cabinets.map((item)=>{
              // console.log("-------"+item.name)
                  this.monitor.leftname =item.name;
                   this.monitor.total = item.cabinets;
                   this.monitor.alarm = item.alarm;
                   this.monitor.use = item.use;
            })
            this.data =  data.manage_chart.approvals.map((item)=>{
                console.log(item.name,'---');
                return item.name
                 
             })
             console.log(this.data,'===')

            this.monitor.shenhe = data.manage_chart.approvals;
            this.monitor.alarm1 =data.manage_chart.alarm;
            this.monitor.manage = data.manage_open_list;
            console.log(data.manage_messages)
            this.monitor.messages = data.manage_messages;
            this.draw1();
            this.draw2();
            this.draw3();
          })
      },

      draw1(){
          var myChart = echarts.init(document.getElementById('main'));
           var  option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['机柜总数', '机柜报警数','机柜活跃数']
            },
            color:['','',''],
           grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
           },
           xAxis:  {
              type: 'value'
           },
           yAxis: {
              type: 'category',
              data: this.monitor.leftname
           },
           series: [
            {
                  name: '机柜总数',
                  type: 'bar',
                  barGap: '-100%',
             
                  label: {
                      normal: {
                          show: true,
                          position: 'insideRight'
                      }
                  },
                  data: this.monitor.total
              },
              
              {
                  name: '机柜活跃数',
                  type: 'bar',
                  barGap: '-100%',
            
                  label: {
                      normal: {
                          show: true,
                          position: 'insideRight'
                      }
                  },
                  data: this.monitor.use
              },
               {
                  name: '机柜报警数',
                  type: 'bar',
                  barGap: '-100%',
            
                  label: {
                      normal: {
                          show: true,
                          position: 'insideRight'
                      }
                  },
                  data: this.monitor.alarm
              }, 
              
          ]
      };
       myChart.setOption(option);
      },
      draw2(){
          
        //    let name =this.monitor.shenhe.map((item)=>{
        //        return item.name
        //    })

            let data = this.monitor.shenhe.map((item)=>{
               return {
                   name:item.name,
                   value:item.value
               }
           })
        //    console.log(name,data);

          var myChart = echarts.init(document.getElementById('left'));
          let  option = {
            title : {
               top:40,
               subtext: '审批统计',
            //    backgroundColor:'#c6eaff',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                // left: 'left',
                top:'bottom',
                data:name
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
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
        };
       myChart.setOption(option);
      },

      draw3(){
            
            let data = this.monitor.alarm1.map((item)=>{
                return {
                    name: item.name,
                    value: item.value
                }
            })
            console.log(data);
            var myChart = echarts.init(document.getElementById('center'));
            let  option = {
            title : {
                subtext: '报警统计',
                 top:40,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                top:'bottom',
                data: name
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
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
        };
            myChart.setOption(option);
      }
     
}
}
</script>

<style >

.one{
    display: flex;
}
.tu{
    flex: 5;
}
.photo{
    flex: 2;
    /* margin-left: 100px; */
}

.two{
    display: flex;
}
.left{
  flex: 2;
}
.center{
  flex: 2;
}
.table{
    margin-left: 30px;
    margin-top: 40px;
    flex: 5;
    margin-bottom: 1px;
}

.tt{
     background-image: url('../../assets/bk3.png');
     height:80px;
     width: 300px;
     margin-top: 20px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-left: 70px;
      display: flex;

}
img{
    width: 60px;
    height: 40px;
    margin-left: 40px;
    margin-top: 20px;
}

.aaa{
    margin-top: 10px;
    margin-left: 40px;
    font-size: 20px;
    
}

.bbbb{
    margin-top: 15px;
    margin-left: 30px;
}


</style>




// {
//   "manage_cabinets": [{"name": ["江苏省检察院","苏州市检察院","南京市检察院","昆山市检察院","山西省检察院","太原市检察院"],
//                        "cabinets": [6,4,7,5,1,3],
//                        "use": [4, 2,6,5,1,3],
//                        "alarm": [ 0,0,0,0,0,0],
//                        "stop": [2,2,1,0,0,0]}
//                       ],
//     "manage_messages": {
//       "manage_alarm": 0,
//      "manage_open_approvals": 1,
//      "manage_other_approvals": 1,
//      "messages": 4
//   },
//   "manage_chart": {
//     "alarm": [
//       {
//         "name": "未处理",
//         "value": 0
//       },
//       {
//         "name": "已处理",
//         "value": 131
//       },
//       {
//         "name": "已审批",
//         "value": 123
//       }
//     ],
//     "approvals": [
//       {
//         "name": "未审批",
//         "value": 2
//       },
//       {
//         "name": "已拒绝",
//         "value": 26
//       },
//       {
//         "name": "已通过",
//         "value": 34
//       }
//     ]
//   },
//   "manage_open_list": [
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "123",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "kunshan111",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-28 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "suzhou567",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-28 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-28 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-21 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京764",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-28 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "南京999",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原005",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "太原11000",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "昆山001",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏003",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-21 09:18:25",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "江苏004",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-27 09:19:10",
//       "status": "是"
//     },
//     {
//       "cabinet__cabinet_name": "苏州001",
//       "user__last_name": "候文韬",
//       "open_time": "2019-06-21 09:19:10",
//       "status": "是"
//     }
//   ]
// }