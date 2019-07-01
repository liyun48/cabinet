<template>
  <div class="changePassword">
    <el-dialog :title="changePwDialog.title" :visible.sync="changePwDialog.visible" width="25%" center="">{{ this.changePwDialog.form }}
      <el-form ref="changePwDialog.form" :model="changePwDialog.form" :rules="rules" size="mini" label-position="left">
        <el-form-item :label-width="formLabelWidth" label="密码" prop="password">
          <el-input v-model="changePwDialog.form.password" auto-complete="off" type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认密码" prop="password1">
          <el-input v-model="changePwDialog.form.password1" auto-complete="off" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="changePwDialog.visible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('changePwDialog.form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import service from '@/utils/request'

export default {
  data() {
    return {
      // 模态框数据
      changePwDialog: {
        title: '',
        visible: false,
        form: {
          password: '',
          password1: ''
        }
      },
      // 表单标签宽度
      formLabelWidth: '100px',
      // 修改密码的当前用户的id
      ids: 0,
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password1: [
          { required: true, message: '请输入确认密码', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 保存信息
    save() {
      // console.log(this.changePwDialog.form.password)
      // console.log(this.changePwDialog.form.password1)
      // if ((this.changePwDialog.form.password !== '') && (this.changePwDialog.form.password1 !== '')) {
      //   alert(1)
      //   if (this.changePwDialog.form.password === this.changePwDialog.form.password1) {
      //     // alert(this.ids)
      //     const obj = {
      //       id: this.ids,
      //       password: this.changePwDialog.form.password
      //     }
      //     console.log(obj)
      //     service.post('/api_user/update_password/', obj).then(() => {
      //       this.$message({
      //         showClose: true,
      //         message: '密码修改成功',
      //         type: 'success'
      //       })
      //     }).catch(() => {
      //       this.$message({
      //         showClose: true,
      //         message: '密码修改失败',
      //         type: 'error'
      //       })
      //     })
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: '两次输入密码不一致',
      //       type: 'error'
      //     })
      //   }
      // } else {
      //   this.$message({
      //     showClose: true,
      //     message: '请输入密码',
      //     type: 'error'
      //   })
      // }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          if (this.changePwDialog.form.password === this.changePwDialog.form.password1) {
            // alert(this.ids)
            const obj = {
              id: this.ids,
              password: this.changePwDialog.form.password
            }
            // console.log(obj)
            service.post('/api_user/update_password/', obj).then(() => {
              this.$message({
                showClose: true,
                message: '密码修改成功',
                type: 'success'
              })
              this.changePwDialog.visible = false
            }).catch(() => {
              this.$message({
                showClose: true,
                message: '密码修改失败',
                type: 'error'
              })
            })
          } else {
            this.$message({
              showClose: true,
              message: '两次输入密码不一致',
              type: 'error'
            })
          }
        } else {
          // console.log('error submit!!');
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>

</style>
