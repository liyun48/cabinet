<template>
    <div class="draw">
        <div class="block1">
            <el-select v-model="params.data_item" placeholder="请选择设备" size="mini" >
                <el-option
                    v-for="item in types"
                    :key="item.id"
                    :label="item.item_name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-date-picker
            size="mini"
            v-model="value1"
            type="datetimerange"
            value-format="yyyy-MM-dd hh:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div id="main" class="abc"></div>
    </div>
    
</template>
<script>
import service from '@/utils/request'
import echarts from 'echarts'
export default {
    data() {
        return {
            value1:[],
            // 显示类型
            types:[],
            // 设备号
            cabinet_id:'',
            params:{
                // data_item:1
            },
            // 图标相关
            typeName:'',
            Ytype:'',
            timeData:'',
            hisData:'',
        }
      },
    created(){
       

    },
    mounted(){
        //this.draw();
    },
    watch:{
        cabinet_id:function(now,old){
            //console.log(now+'draw++++++++++++++++++++++++++++++');
            this.cabinet_id = now
            this.findDrawType(now)
            this.findHistoryData()
            // if(now){
            //     this.cabinet_id = now;
            //     this.findTableData(now)
            // }
            //console.log('cab',this.cabinet_id)
        },
        value1:function(now,old){
            //console.log(now)
            // if(now.value1 != null){
            //     //console.log(now.value1)
            //     this.params.start_time = now.value1[0]
            //     console.log(now.this.params.start_time)
            //     this.params.end_time = now.value1[1]
            //     console.log(now.this.params.end_time)
            // }
            if(now){
                console.log(now)
                this.params.start_time =now[0]
                console.log(this.params.start_time)
                this.params.end_time = now[1]
                console.log(this.params.end_time)
            }else{
                delete(this.params.start_time)
                delete(this.params.end_time)
            }
            this.findHistoryData(this.params)
        },
        params: {
        handler: function(now, old) {
            console.log('now',now)
            //console.log(now.data_item)
            // this.params.data_item = now.data_item
            this.findHistoryData(this.params)
            },
            deep: true
        }
    },
    methods:{
        findDrawType(id){
            service.get('/api_room_monitor/get_dataitem/?cabinet_id='+id).then((data) => {
                //console.log(data)
                this.types = data.data.data
                //console.log(this.types)
            })
        },
        findHistoryData(params){
            service.get('/api_room_monitor/get_item_history_data/?cabinet_id='+this.cabinet_id,{params}).then((data) => {
                console.log('数据',data.data)
                this.hisData = data.data.values;
                this.typeName = data.data.data_item;
                this.timeData = data.data.times.map((item)=>{
                    // return item.split(' ')[1]
                    //console.log(item.split(' ')[1])
                    return item
                })
                console.log( this.typeName,'56523123')
                if((this.typeName === '湿度') || (this.typeName === '温度')){
                this.Ytype = 'value'
                } else{
                this.Ytype = 'category'
                }
                //alert(1)
                this.draw();
            })
            
        },
        draw(){
            //alert(2)
           //console.log(this.typeName)
            var myChart = echarts.init(document.getElementById('main'));

            // 指定图表的配置项和数据
            var option = {
                // trigger: 'axis',
                title: {
                    text: this.typeName,
                    left: 'center',
                },
                xAxis: {
                    type: 'category',
                    data: this.timeData,
                },
                yAxis: {
                    type: this.Ytype,
                    //type: 'value',
                    data:['正常','异常'],
                },
                series: [{
                    data: this.hisData,
                    name: this.typeName,
                    type: 'line',
                    label:{
                        normal: {
                        show: true
                        },//显示各点数据
                        emphasis: {
                        show: true
                        },//悬浮显示数据
                    }
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
        
    },
    
}
</script>
<style>
    .draw{
        /* display: flex; */
    }
    .block1{
         margin: 30px 0;
         position: relative;
         right: -40%;
         /* border: 1px solid yellowgreen; */
    }
    .abc{
        /* margin-top: 80px; */
        /* width: 50%; */
        width: 90%;
        height: 300px;
        position: relative;
        left: 10%;
        /* border: 1px solid orange; */
    }
</style>

