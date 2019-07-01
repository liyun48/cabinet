<template>
  <div class="imagesDialog">
    <!-- 上传头像 -->
    <el-dialog
      title="上传头像"
      :visible.sync="imagesDialog.visible"
      width="20%"
      center>
      <span>
        <el-upload
          class="avatar-uploader"
          :data="{user_id:userId}"
          :headers='headers'
          :action="uploadImg"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imagesDialog.visible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="imagesDialog.visible = false" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import service from '@/utils/request'
import { getToken } from '@/utils/auth'

export default {
  data(){
    return{
      imagesDialog:{
        visible:false
      },
      // 当前用户id
      userId:'',
      uploadImg: service.defaults.baseURL + '/api_user/upload_user_avatar/',
      imageUrl:''
    }
  },
  computed:{
    headers(){
      return {
        'Authorization':'Token ' + getToken()
      }
    }
  },
  methods:{
    // 打开模态框
    openDialog(row){
      // console.log(row.id)
      this.userId = row.id
      this.imagesDialog.visible = true
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$message({
        showClose: true,
        message: '上传成功',
        type: 'success'
      });
      this.$parent.findAllUser()
    },
    handleAvatarError() {
      this.$message({
        showClose: true,
        message: '上传失败',
        type: 'error'
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-icon-plus{
    border: 1px dashed  #ccc
  }
  .avatar-uploader{
    text-align: center
  }
</style>
