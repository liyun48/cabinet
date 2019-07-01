<template>
  <div class="roleDialog">
    <!-- 角色信息 -->
    <el-dialog :title="roleDialog.title" :visible.sync="roleDialog.visible" width="25%" center="">
      <el-form ref="roleDialog.form" :model="roleDialog.form" :rules="rules" size="mini" label-position="left">
        <el-form-item :label-width="formLabelWidth" label="角色" prop="name">
          <el-input v-model="roleDialog.form.name" auto-complete="off"/>
        </el-form-item>
        <!-- <el-form-item :label-width="formLabelWidth" label="描述" prop="desc">
          <el-input v-model="roleDialog.form.password1" type="textarea" auto-complete="off"/>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="roleDialog.visible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="save('roleDialog.form')">确 定</el-button>
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
      roleDialog: {
        title: '',
        visible: false,
        form: {
          name:''
        }
      },
      // 表单标签宽度
      formLabelWidth: '60px',
      rules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    
  },
  methods: {
    // 保存信息
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = this.roleDialog.form
          service.post('/api_group/create_group',obj).then(()=>{
            this.$message({
              showClose: true,
              message: '添加角色成功',
              type: 'success'
            });
            this.$parent.findAllQX()
          }).catch(()=>{
            this.$message({
              showClose: true,
              message: '添加角色失败',
              type: 'error'
            });
          })
          this.roleDialog.visible = false
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
