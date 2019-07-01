<template>
  <div class="userDialog">
    <el-dialog :title="userDialog.title" :visible.sync="userDialog.visible" width="26%">
      <!-- {{ userDialog.form }} -->
      <el-form ref="userDialog.form" :model="userDialog.form" :rules="rules" size="mini" label-position="left">
        <el-form-item :label-width="formLabelWidth" label="用户名" prop="username">
          <el-input v-model="userDialog.form.username" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="真实姓名" prop="last_name">
          <el-input v-model="userDialog.form.last_name" auto-complete="off"/>
        </el-form-item>
        <!-- <el-form-item :label-width="formLabelWidth" label="性别" prop="gender">
          <el-select v-model="userDialog.form.gender" placeholder="请选择性别">
            <el-option label="男" value="shanghai"/>
            <el-option label="女" value="beijing"/>
          </el-select>
        </el-form-item> -->
        <el-form-item :label-width="formLabelWidth" label="联系方式" prop="user_tel">
          <el-input v-model="userDialog.form.user_tel" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="密码" prop="password">
          <el-input v-model="userDialog.form.password" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认密码" prop="password1">
          <el-input v-model="userDialog.form.password1" auto-complete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="角色" prop="user_group">
          <el-select v-model="userDialog.form.user_group" placeholder="请选择角色" style="width:100%">
            <el-option v-for="item in allQX" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="部门" prop="user_department">
          <el-select v-model="user_department0" placeholder="请选择部门" style="width:31%">
            <el-option v-for="item in data1" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-select v-model="user_department1" placeholder="请选择部门" style="width:31%">
            <el-option v-for="item in data2.children" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
          <el-select v-model="user_department2" placeholder="请选择部门" style="width:31%">
            <el-option v-for="item in data3.children" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label-width="formLabelWidth" label="部门" prop="user_group">
          <el-select v-model="user_department0" placeholder="请选择部门" style="width:100%">
            <el-option v-for="item in data1" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="部门" prop="user_group">
          <el-select v-model="user_department1" placeholder="请选择部门" style="width:100%">
            <el-option v-for="item in data2.children" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="部门" prop="user_group">
          <el-select v-model="user_department2" placeholder="请选择部门" style="width:100%">
            <el-option v-for="item in data3.children" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item :label-width="formLabelWidth" label="职位" prop="user_position">
          <el-input v-model="userDialog.form.user_position"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述信息" prop="user_note">
          <el-input v-model="userDialog.form.user_note" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="userDialog.visible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('userDialog.form')">确 定</el-button>
      </div>
    </el-dialog> 
  </div>
</template>
<script>
import service from '@/utils/request'


export default {
  data() {
    // 验证手机号
    var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('号码不能为空!!'))
      }
      setTimeout(() => {
        if (!phoneReg.test(value)) {
          callback(new Error('格式有误'))
        } else {
          callback()
        }
      }, 1000)
    }
    // 验证用户名
    // let validcodeName=(rule,value,callback)=>{
    // let reg=/[0-9a-zA-Z]{4,9}/
    // if(!reg.test(value)){callback(new Error('账号必须是由4-9位数字和字母组合'))
    //   }else{
    //       callback()
    //   }
    // };
    var nameReg = /[0-9a-zA-Z]{4,9}/
    var validcodeName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('输入正确的用户名!!'))
      }
      setTimeout(() => {
        if (!nameReg.test(value)) {
          callback(new Error('格式有误'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      userDialog: {
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
        },
      },
      // 所有的权限
      allQX: [],
      // 表单标签宽度
      formLabelWidth: '80px',
      rules: {
        username: [
          { required: true, message: '请输入正确用户名',validator: validcodeName, trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '用户名不超过2到4个汉字', trigger: 'blur' }
        ],
        user_tel: [
          { required: true, message: '请输入正确的联系方式', validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        password1: [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ],
        user_group: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        // user_department: [
        //   { required: true, message: '请选择部门', trigger: 'blur' }
        // ],
        user_management: [
          { required: true, message: '请输入职位', trigger: 'blur' }
        ],
        user_note: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        user_position: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      },
      // 存放所有的部门
      data1: [],
      data2: [],
      data3: [],
      user_department0:'',
      user_department1:'',
      user_department2:'',
      // 用户所属部门的最终id
      currentID:''
    }
  },
  watch:{
    user_department0:function(now,old){
      console.log('++++++++',now,old)
      if(now){
        this.deal1(now)
        this.currentID = now
        this.user_department1 = ''
        this.user_department2 = ''
        console.log('==========',this.user_department1,this.user_department2)
      }
    },
    user_department1:function(now,old){
      // console.log(now,old)
      if(now){
        this.deal2(now)
        this.currentID = now
        this.user_department2 = ''

      }
    },
    user_department2:function(now,old){
      // console.log(now,old)
      if(now){
        this.currentID = now
        // console.log('当前id',this.currentID)
      }
    },
  },
  created() {
    // this.findAllRoles()
    this.departmentList()
  },
  methods: {
    // 当一级部门出来，过滤出该一级部门下的二级部门
    deal1(now){
      // console.log('now',now)
      this.data1.map((item)=>{
        if(item.id === now){
          this.data2 = item
        }
      })
      // console.log('二级部门',this.data2.children)
    },
    // 当二级部门出来，过滤出该二级部门下的三级部门
    deal2(now){
      // console.log('now',now)
      this.data2.children.map((item)=>{
        if(item.id === now){
          this.data3 = item
        }
      })
      // console.log('三级部门',this.data3.children)
    },
    // 关闭模态框
    closeDialog() {
      this.userDialog.visible = false
      this.userDialog.form = {}
    },
    // 获取角色
    findAllRoles() {
      service.get('/api_group/get_groups_list').then((data) => {
        // this.userDialog.form = {}
        console.log('获取权限角色', data.data)
        this.allQX = data.data
        this.userDialog.title = '新增用户'
        this.userDialog.visible = true
      }).catch(() => {

      })
    },
    // 查看部门列表
    departmentList() {
      service.get('/api_department/department_list/').then((data) => {
        // console.log('查看部门列表',data)
        this.dep1 = data.data.results
        // console.log(this.dep1)
        // console.log('测试')
        const department = []
        this.dep1.map((item) => {
          // 一级部门
          const aaa = {
            id: item.id,
            label: item.dep_name,
            children: []
          }
          // console.log(aaa)
          item.subs.map((item) => {
            // 二级部门
            const bbb = {
              id: item.id,
              label: item.dep_name,
              children: []
            }
            item.subs.map((item) => {
              // 三级部门
              const ccc = {
                id: item.id,
                label: item.dep_name
              }
              bbb.children.push(ccc)
              // console.log('三级单位',ccc)
            })
            aaa.children.push(bbb)
          })
          // console.log(aaa)
          department.push(aaa)
        })
        this.data1 = department
        // console.log(this.data1)
      }).catch(() => {

      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj1 = {
            username: this.userDialog.form.username
          }
          const obj = this.userDialog.form
          obj.user_department = this.currentID
          service.post('/api_user/judge_username/', obj1).then((data) => {
            // console.log(data.data.is_usable)
            if (data.data.is_usable === false) {
              if (this.userDialog.form.password === this.userDialog.form.password1) {
                service.post('/api_user/create_user/', obj).then(() => {
                  this.$message({
                    showClose: true,
                    message: '新增成功',
                    type: 'success'
                  })
                  this.closeDialog()
                  this.$parent.findAllUser()
                }).catch(() => {
                  this.$message({
                    showClose: true,
                    message: '新增失败',
                    type: 'error'
                  })
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '两次输入密码不一致，请重输',
                  type: 'warning'
                })
              }
            } else {
              this.$message({
                showClose: true,
                message: '该用户名已存在',
                type: 'warning'
              })
            }
          }).catch(() => {

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

</style>
