<template>
  <div class="cabinetDetail">
    <div class="select">
      <el-select v-model="user_department" clearable placeholder="请选择所属单位" size="mini">
        <el-option
          v-for="item in depData"
          :key="item.id"
          :label="item.dep_name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="mId" clearable placeholder="请选择机柜" size="mini">
        <el-option
          v-for="item in roomData"
          :key="item.id"
          :label="item.cabinet_name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="middle">
      <div class="msg">
        <div class="unit" v-for="item in stopData" :key="item.index" :style="{'color':item.color}">
            <div class="img">
              <img :src="item.image" alt="">
            </div>
            <div class="data">
              <span>{{item.name}}</span><br/>
              <span>{{item.value}}{{item.unit}}</span>
            </div>
        </div>
        <div class="unit" v-for="item in runData" :key="item.index" :style="{'color':item.color}">
            <div class="img">
              <img :src="item.image" alt="">
            </div>
            <div class="data">
              <span>{{item.name}}</span><br/>
              <span>{{item.value}}{{item.unit}}</span>
            </div>
        </div>
      </div>
      <div class="logo">
        <img :src='historyDataFirst.photo' alt="">
        <span>{{historyDataFirst.user_name}}{{historyDataFirst.open_time}}</span>
      </div>
    </div>
    <div class="bottom">
        <div class="table-div">
          <datailTable ref="datailTable"></datailTable>
        </div>
        <div class="draw-div">
          <drawTable ref="drawTable"></drawTable>
        </div>
    </div>
    <!-- <div id="main" style="width: 600px;height:400px;border:1px solid red;"></div> -->
  </div>
</template>
  

<script>
import $ from 'jquery'
import datailTable from './datailTable'
import drawTable from './drawTable'
import service from '@/utils/request'

export default {
  components: {
    datailTable,
    drawTable
  },
  data(){
    return{
      // 单位
      depData:[],
      user_department: null,
      // 所属单位机房
      roomData:[],
      //设备ID
      mId:null,
      // 数据渲染
      runData:[],
      stopData:[],
      //历史数据
      historyData:[],
      historyDataFirst:[]
      

      
    }
  },
  watch:{
    user_department:function(now,old){
      //console.log(now)
      this.mId = null;
      if(now){
        this.findRoomByDep(now)
      }
    },
    mId:function(now,old){
      //console.log(now)
      if(now){
        this.mId = now
        // console.log('mId++++++++++++'+this.mId)
        this.findDetail(this.mId)
        this.findHistory(this.mId)
        this.$refs.datailTable.params1.cabinet_id = this.mId
        this.$refs.drawTable.cabinet_id = this.mId
      }
    }
  },
  created(){
      this.findAllDep();
  },
  mounted(){
    //this.draw1()
  },
  methods:{
    // 渲染列表
    // findAllExamine(params) {
    //   service.get('/api_department/department_list/', { params }).then(({ data }) => {
    //     this.tableData = data.result
    //     this.allPages = data.count
    //   })
    // },

    //所属单位
    findAllDep(){
        service.get('/api_user/get_user_manage_dep/').then(({data}) => {
          //console.log(data.result)
          this.depData = data.result
      })
    } ,
    // 根据所选部门查询所属机柜
    findRoomByDep(id){
      service.get('/api_room_monitor/get_dep_cabinet?dep_id='+id).then(({data}) => {
        //this.roomData = data.dep_has_user
       // console.log(data.data)
        this.roomData = data.data
      })
    },
    // 用机柜的id查询该机柜的详细信息
    findDetail(id){
      service.get('/api_room_monitor/get_cabinet_detail/?cabinet_id='+id).then((data)=>{
        // console.log('用机柜的id查询该机柜的详细信息',data.data.run_device)
        this.runData = data.data.run_device
        this.stopData = data.data.stop_device
        //console.log('findDeatail')
        //console.log(this.runData)
        //console.log(this.stopData)
      })
    },
    findHistory(id){
      service.get('/api_room_monitor/get_open_history/?cabinet_id='+id).then((data) => {
        //console.log(data.data.result)
        this.hostoryData = data.data.result
        this.historyDataFirst = data.data.result[0]
        //console.log(this.historyDataFirst)
      })
    },
    // draw1(){
    //   var myChart = echarts.init(document.getElementById('main'));

    //     // 指定图表的配置项和数据
    //     var option = {
    //         title: {
    //             text: 'ECharts 入门示例'
    //         },
    //         tooltip: {},
    //         legend: {
    //             data:['销量']
    //         },
    //         xAxis: {
    //             data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    //         },
    //         yAxis: {},
    //         series: [{
    //             name: '销量',
    //             type: 'bar',
    //             data: [5, 20, 36, 10, 10, 20]
    //         }]
    //     };

    //     // 使用刚指定的配置项和数据显示图表。
    //     myChart.setOption(option);
    // }
  }
}
</script>
<style scoped>
  .middle{
    display: flex;
  }
  .msg{
    /* flex: 4; */
    width: 75%;
    display: flex;
    /* width: 80%; */
    /* border: 1px solid rebeccapurple; */
    flex-wrap: wrap;
    /* justify-content: space-around; */
    /* background-color:  */
  }
  .logo{
    /* width: 20% */
    flex: 1;
    /* border: 1px solid green; */
  }
  .logo > img {
    width: 100%;
    height: 90%;
  }
  .logo > span {
    font-size: 16px;
    margin-left: 25%;
    
  }
  .unit{
    /* background-image: url('http://127.0.0.1:32767/12.47.04/images/%E6%9C%BA%E6%9F%9C%E8%AF%A6%E6%83%85/u358.png'); */
    background-image: url('../../../assets/bk3.png'); 
    background-repeat: no-repeat;
    background-size: 100% 100%;
    /* background-color: tomato; */
    /* /* border: 1px solid black; * */
    display: flex;
    float: left;
    width: 18%;
    height: 25%;
    padding: 1.5em;
    margin-left: 15px;
    margin-top: 15px;
    font-size: 16px;
  }
  .img{
    flex: 1;
  } 
  .img > img {
    width: 100%;
    height: 90%;
  }
  .data{
    flex: 2;
    margin-top: -15px;
  }
  .data>span{
    margin-left: 20px;
    line-height: 1.5em;
    font-size: 20px;
  }
  .bottom{
    width: 100%;
    /* border: 1px solid skyblue; */
    position: absolute;
    top: 50%;
    /* margin-top: 22%; */
    display: flex;
  }
  .table-div{
    /* border: 1px solid rebeccapurple; */
    /* margin-left: 30px; */
    flex: 2;
  }
  .draw-div{
    flex: 3;
    /* border: 1px solid salmon */
  }
</style>
