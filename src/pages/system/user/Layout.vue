<template>
  <div class="user">
    <!-- 用户管理 -->
    <!-- 模糊查询 -->
    <div class="user_query">
      <!-- <el-select v-model="params1.search" clearable placeholder="请输入所属单位" size="mini">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.dep_name"
          :value="item.id"/>
      </el-select> -->
      <el-input
        v-model="params1.search"
        placeholder="请输入所属单位"
        clearable
        size="mini"
        style="width:200px"/>
      <el-input
        v-model="params1.user__username"
        placeholder="请输入用户名"
        clearable
        size="mini"
        style="width:200px"/>
      <!-- <el-button size="mini" @click="find()">查询</el-button> -->
    </div>
    <!-- 按钮 -->
    <div class="user_btns">
      <el-button size="mini" @click="toAddUser">添加用户</el-button>
    </div>
    <!-- 数据渲染 -->
    <div class="user_data">
      <!-- <hr style="border: 1px solid #5997c3"> -->
      <el-table
        :data="users"
        :height="tblHeight"
        style="width: 100%"
        size="mini"
        v-loading="loading">
        <el-table-column
          type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <!-- <el-form-item label="性别">
                <span>{{ props.row.name }}</span>
              </el-form-item> -->
              <div style="float:left;width:70%">
                <el-form-item label="部门">
                  <span>{{ props.row.user_department }}</span>
                </el-form-item>
                <el-form-item label="职位">
                  <span>{{ props.row.user_position }}</span>
                </el-form-item>
                <el-form-item label="管辖地区">
                  <span>{{ props.row.user_management }}</span>
                </el-form-item>
                <el-form-item label="描述信息">
                  <span>{{ props.row.user_note }}</span>
                </el-form-item>
              </div>
              <div class="images" style="float:right;width:20%;">
                <img :src="props.row.user_portrait" alt="头像未加载出来" style="width:140px;height:140px;padding:10px"> &nbsp;&nbsp;&nbsp;&nbsp;<br>
                <el-button type="primary" plain size="mini" @click="changeImage(props.row)" style="margin-top:10px">更改头像</el-button>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50"/>
        <el-table-column
          prop="username"
          label="用户名"
          align="center"/>
        <el-table-column
          prop="last_name"
          label="真实姓名"
          align="center"/>
        <el-table-column
          prop="user_department"
          label="所属单位"
          align="center"/>
        <el-table-column
          prop="user_tel"
          label="联系方式"
          align="center"/>
        <el-table-column
          prop="user_group"
          label="角色"
          align="center"/>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="150">
          <template slot-scope="{row}">
            <i class="el-icon-circle-plus" title="修改管辖单位" @click="changeUnit(row)"/>
            <i class="fa fa-key" title="修改密码" @click="toChangePw(row)"/>
            <i class="fa fa-pencil" title="修改用户信息" @click="toUpdateUser(row)"/>
            <i class="fa fa-ban" title="冻结" @click="freezeUser(row)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="user_page">
      <el-pagination
        :current-page.sync="currentPage1"
        v-model="params1.page"
        :page-size="20"
        :total="pageTotal"
        layout="total, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <!-- 修改密码模态框 -->
    <change-password ref="changePassword" />
    <!-- 添加/修改用户模态框 -->
    <user-dialog ref="userDialog" />
    <!-- 修改管辖地模态框 -->
    <changeUnit-dialog ref="changeUnitDialog"/>
    <!-- 修改用户模态框 -->
    <changeUser-dialog ref="changeUser"/>
    <!-- 更改头像 -->
    <image-dialog ref="imageDialog"/>
  </div>
</template>
<script>
import $ from 'jquery'
import service from '@/utils/request'
// import axios from '@/http/axios'
import changePassword from './ChangePasswordDialog'
import userDialog from './UserDialog'
import changeUnitDialog from './changeUnitDialog'
import changeUserDialog from './changeUser'
import imageDialog from './imageDialog'
export default {
  components: {
    changePassword,
    userDialog,
    changeUnitDialog,
    changeUserDialog,
    imageDialog
  },
  data() {
    return {
      // 用户数据
      users: [],
      // 模糊查询
      params1: {
        page: 1
      },
      options: [],
      input: '',
      pageTotal: 0,
      // 分页
      currentPage1: 5,
      loading: true,
      // 所有的角色
      allRoles:[]
    }
  },
  created() {
    this.tblHeight = $(window).height() - 220
    this.findAllUser()
    this.findRole()
    // this.findAllDw()
  },
  watch:{
    params1:{
      handler:function(now,old){
        this.findAllUser(this.params1)
      },
      deep:true
    }
  },
  methods: {
    // 更换用户头像
    changeImage(row){
      this.$refs.imageDialog.openDialog(row)
    },
    // 模糊搜索按钮
    // find() {
    //   // console.log(this.params1)
    //   this.findAllUser(this.params1)
    // },
    // 获取所属单位
    findAllDw() {
      service.get('/api_cabinet/list_department').then((data) => {
        // console.log(data.data)
        this.options = data.data
      }).catch(() => {

      })
    },
    changeUnit(row) {
      // this.$refs.changeUnitDialog.findAllSpace()
      this.$refs.changeUnitDialog.id = row.id
      this.$refs.changeUnitDialog.unitDialog.title = '修改管辖地'
      this.$refs.changeUnitDialog.unitDialog.visible = true
    },
    // 当前页面改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.params1.page = val
      // this.findAllUser(this.params1)
    },
    // 冻结用户
    freezeUser(row) {
      // console.log(row)
      this.$confirm('此操作将冻结该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(row)
        const params = {
          'id': row.id
        }
        // console.log(params)
        service.post('/api_user/stop_user/', params).then(() => {
          this.$message({
            showClose: true,
            message: '冻结成功',
            type: 'success'
          });
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '冻结失败',
            type: 'error'
          });
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '已取消',
          type: 'success'
        });
      })
    },
    // 修改用户信息
    toUpdateUser(row) {
      console.log('修改用户信息',row)
      this.$refs.changeUser.changeUserDialog.form={}
      // this.$refs.changeUser.findAllDep()
      this.$refs.changeUser.changeUserDialog.title = '修改用户信息'
      // this.$refs.changeUser.changeUserDialog.form = row
      this.$refs.changeUser.changeUserDialog.form.username = row.username
      this.$refs.changeUser.changeUserDialog.form.id = row.id
      this.$refs.changeUser.changeUserDialog.form.last_name = row.last_name
      this.$refs.changeUser.changeUserDialog.form.user_tel = row.user_tel
      this.$refs.changeUser.changeUserDialog.form.user_note = row.user_note
      this.$refs.changeUser.changeUserDialog.form.user_position = row.user_position
      // this.$refs.changeUser.changeUserDialog.form.user_department= row.user_department,
      // this.$refs.changeUser.changeUserDialog.form.user_group= row.user_group,
      // this.$refs.changeUser.changeUserDialog.visible = true



      // const users = _.clone(row)
      // // 过滤出角色信息
      // const roleArr = this.allRoles.filter((item)=>{
      //   return item.name === users.user_group
      // })
      // // console.log('+++++',JSON.stringify(roleArr))
      // if (roleArr.length > 0) {
      //   users.user_group = roleArr[0].name
      // }
      // console.log('users======',users)
      // console.log('users======',users.user_group)
      // this.$refs.changeUser.changeUserDialog.form.user_group = users.user_group
      // delete users.user_group
      // console.log('users',users)
      this.$refs.changeUser.changeUserDialog.visible = true
    },
    // 添加用户
    toAddUser() {
      this.$refs.userDialog.findAllRoles()
    },
    // 修改密码
    toChangePw(row) {
      // console.log(row)
      // this.$refs.userDialog.findAllRoles()
      // this.$refs.userDialog.findAllDep()
      this.$refs.changePassword.changePwDialog.title = '修改密码'
      this.$refs.changePassword.changePwDialog.form = {}
      this.$refs.changePassword.changePwDialog.visible = true
      this.$refs.changePassword.ids = row.id
    },
    // 查询所有的用户
    findAllUser(params) {
      service.get('/api_user/user_list/', { params }).then((data) => {
        // this.$message('成功');
        // console.log('========',data.data)
        this.pageTotal = data.data.count
        this.users = data.data.results
        // console.log('查询所有的用户',this.users)
        this.options1 = data.data.results
        // this.params1 = {
        //   page:1
        // }
        this.loading = false
      }).catch(() => {

      })
    },
    // 获取出所有的角色
    findRole(){
      service.get('/api_group/get_groups_list').then(({data})=>{
        console.log('获取所有的角色',data)
        this.allRoles = data
      }).catch(()=>{

      })
    }
  }
}
</script>
<style scoped>
/* 模糊查询 */
.user_query {
  float: left;
}
/* 按钮 */
.user_btns {
  text-align: right;
  margin-bottom: 0.8em;
}
/* 数据渲染 */
.user_data i {
  cursor: pointer;
  margin-right: .5em;
  color: #8cbcda;
}
.user_data i:last-child {
  margin-right: 0;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand{
  width: 70%
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand[data-v-91edce9c]{
  width: 100%
}
/* 分页 */
.user_page {
  text-align: right;
  /* position: absolute;
  bottom: 1em;
  right: 2em; */
}
.selected{
  color: #409eff
}
</style>

