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
      v-model="value2"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size='mini'
      :picker-options="pickerOptions">
    </el-date-picker>
    <el-autocomplete
      class="inline-input"
      v-model="state1"
      :fetch-suggestions="querySearch"
      placeholder="请输入发布人"
      size='mini'
      @select="handleSelect"/>
       <el-button type="primary" plain size="mini" @click="findSome()">查询</el-button>
      <el-button type="primary" plain size="mini" class="one" @click="addMessage()">发布</el-button>
      <el-button type="primary" plain size="mini" class="one" @click="dealAll()">批量已读</el-button>
      <!-- <el-button type="primary" plain size="mini" class="one" @click="delAll()">批量删除</el-button> -->
   <div class="表格标题">
   <el-table
      :data="tableData"
      :header-cell-style="{}"
      :row-style="{background:'#0f1a2c'}"
      :height="tblHeight"
      style="width: 100%"
      size="mini"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center"/>
      <el-table-column
        type="expand"
        label="详情"
        width="120"
        align="center">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="发布内容">
              <span>{{ props.row.mess_text }}</span>
            </el-form-item><br>
            <el-button type="primary" plain size="mini" @click="Read(props.row)">已读</el-button>
          </el-form>
        </template>
      </el-table-column>
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
         tableData: [],
        multipleSelection: [],
        idss: [],
        value: '',
        pickerOptions: {
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
        value2: '',
        restaurants: [],
        state1: '',
        state2: ''
      };
    },
    methods: {
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
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
