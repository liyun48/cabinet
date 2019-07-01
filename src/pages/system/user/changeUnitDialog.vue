<template>
  <div class="unit">
    <!-- 添加管辖单位 -->
    <el-dialog :title="unitDialog.title" :visible.sync="unitDialog.visible" width="25%" center=""> {{ unitDialog.form.ids }}
      <el-form :model="unitDialog.form">
        <el-form-item :label-width="formLabelWidth" label="单位">
          <el-tree
            ref="tree"
            :data="data1"
            :props="defaultProps"
            show-checkbox
            node-key="id"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog()">取 消</el-button>
        <el-button type="primary" size="mini" @click="changeDep()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import service from '@/utils/request'
export default {
  data() {
    return {
      formLabelWidth: '60px',
      unitDialog: {
        title: '',
        visible: false,
        form: {}
      },
      data1: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 用户id
      id: ''
    }
  },
  created() {
    this.departmentList()
  },
  methods: {
    // 确认添加部门
    changeDep() {
      var allPowersId = this.$refs.tree.getCheckedKeys()
      // console.log(allPowersId)
      const obj = {
        id: this.id,
        departments: allPowersId
      }
      service.post('/api_user/user_management/', obj).then(() => {
        this.$message({
          showClose: true,
          message: '添加管辖单位成功',
          type: 'success'
        })
        this.$parent.findAllUser()
        this.unitDialog.visible = false
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '添加管辖单位失败',
          type: 'error'
        })
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
      }).catch(() => {

      })
    }
  }
}
</script>
