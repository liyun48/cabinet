<template>
  <div class="permissionDialog">
    <!-- 权限信息 -->
    <el-dialog :title="permissionDialog.title" :visible.sync="permissionDialog.visible" width="25%">

      <!-- <el-form :model="permissionDialog.form" size="mini" :rules="rules" ref="ruleForm">
        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-input v-model="permissionDialog.form.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form> -->
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"/>
      <el-checkbox-group v-model="permissionDialog.form.permission" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in permissions11" :label="city" :key="city">{{ city }}</el-checkbox>
      </el-checkbox-group>
      <!-- {{ permissionDialog.form }} -->
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="permissionDialog.visible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// const cityOptions = ['上海', '北京', '广州', '深圳']
import service from '@/utils/request'

export default {
  data() {
    return {
      // 模态框数据
      permissionDialog: {
        title: '',
        visible: false,
        form: {
          permission: []
        }
      },
      checkAll: false,
      checkedCities: [],
      // 存放权限并且保存权限的id
      permissions1: [],
      // 过滤除权限，没有id
      permissions11: [],
      // 选中的值
      permissions2:[],
      // 当前角色id
      group_id:'',
      isIndeterminate: true
    }
  },
  created() {
    this.findAllQX()
  },
  methods: {
    // 获取所有的权限
    findAllQX(){
      service.get('/api_permission/get_permission_list').then((data)=>{
        console.log(data.data)
        this.permissions1 = data.data
        data.data.map((item)=>{
          this.permissions11.push(item.name)
        })
        // console.log('this.permissions1',this.permissions1)
      }).catch(()=>{
        this.$message({
          showClose: true,
          message: '获取权限失败',
          type: 'error'
        });
      })
    },
    handleCheckAllChange(val) {
      console.log('val',val)
      this.permissionDialog.form.permission = val ? this.permissions11 : []
      // console.log('======this.permissionDialog.form.permission',this.permissionDialog.form.permission)
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      console.log('value',value)
      this.permissionDialog.form.permission = value
      const checkedCount = value.length
      this.checkAll = checkedCount === this.permissions11.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissions11.length
    },
    // 保存信息
    save() {
      this.permissions2 = []    
      console.log('this.permissionDialog.form.permission',this.permissionDialog.form.permission)
      console.log(this.permissions1)
      // 过滤出已选择的权限的id
      this.permissionDialog.form.permission.map((item)=>{
        this.permissions1.map((items)=>{
          if(item === items.name){
            this.permissions2.push(items.id)
          }
        })
      })
      console.log('this.permissions2',this.permissions2)
      const obj ={
        group_id:this.group_id ,
        permission_ids: this.permissions2
      }
      service.post('/api_group/set_permission_of_group',obj).then(()=>{
        this.$parent.findAllQX()
        this.permissionDialog.visible = false
      }).catch(()=>{
        this.$message({
          showClose: true,
          message: '修改权限失败',
          type: 'error'
        });
      })
    }
  }
}
</script>
<style scoped>
  .el-checkbox-group label{
    display: block;
    margin-left: 30px
  }
</style>
