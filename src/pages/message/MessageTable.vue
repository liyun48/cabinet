<template>
  <div class="messageTable">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#0f1a2c',color:'#c6eaff'}"
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
          <i class="fa fa-eye" title="阅读" @click="allRead(row)" />
          <i class="el-icon-delete" title="删除" @click="delMessage(row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>