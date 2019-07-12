<template>
    <div class="table-div">
        <div class="block">
            <el-date-picker
            size="mini"
            v-model="time"
            type="datetimerange"
            value-format="yyyy-MM-dd hh:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <el-table
            size="mini"
            class="table"
            :data="tableData"
            style="width:100%">
            <el-table-column
                prop="photo"
                label="照片"
                width="120"
                align="center">
                <template slot-scope="scope">
                <el-popover
                    placement="right"
                    title="照片"
                    trigger="hover">
                    <img :src="scope.row.photo"/>
                    <img slot="reference" :src="scope.row.photo" :alt="scope.row.photo" style="max-height: 30px;max-width: 60px">
                </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="user_name"
                label="开柜人"
                width="80%"
                align="center">
            </el-table-column>
            <el-table-column
                prop="desc"
                label="开柜事由"
                align="center">
            </el-table-column>
            <el-table-column
                prop="open_time"
                label="开柜时间"
                width="180"
                align="center">
            </el-table-column>
            <el-table-column
                prop="status"
                label="是否违规"
                align="center">
            </el-table-column>
        </el-table>
    </div>
    
</template>
<script>
import service from '@/utils/request'

export default {
    data() {
        return {
            time:'',
            cabinet_id:null,
            tableData: [],
            params1:{
                // 当前的机柜的id
                cabinet_id:'',
            },
        }
      },
    created(){
        

    },
    watch:{
        time:function(now,old){
            if(now){
                console.log(now)
                this.params1.start_time =this.time[0]
                this.params1.end_time = this.time[1]
            }else{
                delete(this.params1.start_time)
                delete(this.params1.end_time)
            }
            this.findTableData(this.params1)
        },
        params1:{
            handler:function(now,old){
                console.log('now',now)
                this.findTableData(this.params1)
            },
            deep:true
        }  
    },
    methods:{
        findTableData(params){
            // service.get('/api_room_monitor/get_open_history/?cabinet_id='+id).then((data) => {
            service.get('/api_room_monitor/get_open_history/',{params}).then((data) => {
                //console.log(data)
                data.data.result.map((item)=>{
                if(item.status === 1){
                    item.status = '否'
                }else{
                    item.status = '是'
                }
                })
                this.tableData = data.data.result
                console.log(this.tableData)
            })
        }
    }
}
</script>
<style>
    .block{
        margin: 30px 0;
    }
    
    
</style>

