<template>
  <div class="changeUserDialog">
    <el-dialog :title="changeUserDialog.title" :visible.sync="changeUserDialog.visible" width="30%">
      {{ changeUserDialog.form }}
      <el-form ref="changeUserDialog.form" :model="changeUserDialog.form" :rules="rules" size="mini" label-position="left">
        <el-form-item :label-width="formLabelWidth" label="用户名" prop="username">
          <el-input v-model="changeUserDialog.form.username" :disabled="true" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="真实姓名" prop="last_name">
          <el-input v-model="changeUserDialog.form.last_name" auto-complete="off"/>
        </el-form-item>
        <!-- <el-form-item :label-width="formLabelWidth" label="性别" prop="gender">
          <el-select v-model="changeUserDialog.form.gender" placeholder="请选择性别">
            <el-option label="男" value="shanghai"/>
            <el-option label="女" value="beijing"/>
          </el-select>
        </el-form-item> -->
        <el-form-item :label-width="formLabelWidth" label="联系方式" prop="user_tel">
          <el-input v-model="changeUserDialog.form.user_tel" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="角色" prop="user_group">
          <el-select v-model="changeUserDialog.form.user_group" placeholder="请选择角色">
            <el-option v-for="item in allQX" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label-width="formLabelWidth" label="部门" prop="user_department">
          <el-select v-model="changeUserDialog.form.user_department" placeholder="请选择部门">
            <el-option v-for="item in allDep" :key="item.id" :label="item.dep_name" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item :label-width="formLabelWidth" label="职位" prop="user_position">
          <el-input v-model="changeUserDialog.form.user_position"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述信息" prop="user_note">
          <el-input v-model="changeUserDialog.form.user_note" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changeUserDialog.visible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('changeUserDialog.form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import service from '@/utils/request'

export default {
  data() {
    return {
      changeUserDialog: {
        title: '',
        visible: false,
        form: {
          username: '',
          last_name: '',
          user_tel: '',
          password: '',
          password1: '',
          user_group: '',
          user_department: '',
          user_position: '',
          user_note: ''
        }
      },
      // 所有的权限
      allQX: [],
      // 所有部门
      allDep: [],
      // 表单标签宽度
      formLabelWidth: '120px',
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        user_position: [
          { required: true, message: '请输入职位', trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        user_tel: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        user_group: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        user_department: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        // user_management:[
        //   { required: true, message: '请输入职位', trigger: 'blur' }
        // ],
        user_note: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.findAllRoles()
    this.findAllDep()
    this.findAllRoles()
  },
  methods: {
    // 获取角色
    findAllRoles() {
      service.get('/api_group/get_groups_list').then((data) => {
        this.changeUserDialog.form = {}
        console.log('获取权限角色', data.data)
        this.allQX = data.data
      }).catch(() => {

      })
    },
    // 获取所有部门
    findAllDep() {
      service.get('/api_department/department_list/').then((data) => {
        // console.log('获取所有部门',data.data.results)
        this.allDep = data.data.results
      }).catch(() => {

      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // const obj = this.changeUserDialog.form
          // console.log(obj)
          const obj = {
            id: this.changeUserDialog.form.id,
            last_name: this.changeUserDialog.form.last_name,
            user_tel: this.changeUserDialog.form.user_tel,
            // user_management: this.changeUserDialog.form.user_management,
            user_note: this.changeUserDialog.form.user_note,
            user_department: this.changeUserDialog.form.user_department,
            user_group: this.changeUserDialog.form.user_group+'',
            user_position:this.changeUserDialog.form.user_position
          }
          console.log(this.changeUserDialog.form)
          console.log(obj)
          service.post('/api_user/update_user/', obj).then(() => {
            this.$message({
              showClose: true,
              message: '修改信息成功',
              type: 'success'
            })
            this.changeUserDialog.visible = false
            this.$parent.findAllUser()
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '修改失败',
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
  .selected{
    color: #409eff
  }
</style>
