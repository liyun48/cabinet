<template>
  <div class="role">
    <!-- 权限管理 -->
    <!-- 按钮 -->
    <div class="role_btns">
      <el-button size="mini" @click="toAddRole">添加角色</el-button>
    </div>
    <!-- 数据渲染 -->
    <div class="role_data">
      <el-table
        :data="roles"
        :height="tblHeight"
        size="mini"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          align="center"/>
        <el-table-column
          prop="group_name"
          label="角色名称"
          align="center"
          width="200"/>
        <el-table-column
          prop="permission_names"
          label="角色权限信息"/>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="100">
          <template slot-scope="{row}">
            <i class="fa fa-pencil" title="修改角色权限" @click="toUpdateRole(row)"/>
            <i class="fa fa-trash-o" title="删除角色" @click="deleteRole(row.id)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="role_page">
        <el-pagination
        :current-page.sync="currentPage1"
        v-model="params1.page"
        :page-size="20"
        :total="count"
        layout="total, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <!-- 添加角色模态框 -->
    <role-dialog ref="roleDialog" />
    <!-- 修改权限信息模态框 -->
    <permission-dialog ref="permissionDialog" />
  </div>
</template>
<script>
import $ from 'jquery'
import service from '@/utils/request'

import roleDialog from './RoleDialog'
import permissionDialog from './PermissionDialog'
export default {
  components: {
    roleDialog,
    permissionDialog
  },
  data() {
    return {
      roles: [],
      count:0,
      params1: {
        page: 1
      },
      currentPage1: 5,
      loading:true
    }
  },
  created() {
    this.tblHeight = $(window).height() - 220
    this.findAllQX(this.params1)
  },
  methods: {
    // 获取所有角色
    findAllQX(params){
      // const obj = {
      //   page:this.params1.page
      // }
      service.get('/api_permission/get_permission_of_group',{params}).then((data)=>{
        console.log('获取所有的权限',data)
        this.count = data.data.count
        this.roles = data.data.data
        this.loading = false
      })
    },
    // 当前页面改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.params1.page = val
      this.findAllQX( this.params1)
    },
    // 删除角色
    deleteRole(id) {

    },
    // 修改权限信息
    toUpdateRole(row) {
      console.log(row)
      this.$refs.permissionDialog.group_id = row.group_id
      this.$refs.permissionDialog.permissionDialog.form.permission =[]
      // console.log('this.$refs.permissionDialog.permissionDialog.form.permission',this.$refs.permissionDialog.permissionDialog.form.permission)
      this.$refs.permissionDialog.permissionDialog.visible=true
    },
    // 去添加角色
    toAddRole() {
      this.$refs.roleDialog.roleDialog.title = '添加角色'
      this.$refs.roleDialog.roleDialog.form = {}
      this.$refs.roleDialog.roleDialog.visible = true
    }
  }
}
</script>
<style scoped>
/* 按钮 */
.role_btns {
  text-align: right;
  margin-bottom: .8em;
}
/* 数据渲染 */
.role_data i {
  cursor: pointer;
  margin-right: .5em;
  color: #8cbcda;
}
.role_data i:last-child {
  margin-right: 0;
}
/* 分页 */
.role_page {
  text-align: right;
  /* position: absolute;
  bottom: 1em;
  right: 2em; */
}
.selected{
  color: #409eff
}
</style>
