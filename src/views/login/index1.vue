<template>
  <div :style ="note" class="login">
    <div :style="loginHe" class="loginOne">
      <div class="content">
        <!-- <h1>鸣泽机柜管理系统</h1>
        <el-input v-model="input1" placeholder="请输入用户名" style="width:80%"></el-input>
        <el-input v-model="input2" placeholder="请输入密码" style="width:80%" type="password" @keyup.enter.native="handleLogin"></el-input>
        <br>
        <el-button style="width:80%" @click.native.prevent="handleLogin">登录</el-button> -->
        <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
          <h1>鸣泽机柜管理系统</h1>
          <!-- <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <lang-select class="set-language"/>
      </div> -->

          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              auto-complete="on"
              style="width:80%"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :type="passwordType"
              v-model="loginForm.password"
              placeholder="请输入密码"
              name="password"
              auto-complete="on"
              style="width:80%"
              @keyup.enter.native="handleLogin" />
          </el-form-item>

          <el-button type="primary" style="width:80%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

          <div style="position:relative">
            <!-- <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div> -->

            <!-- <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{ $t('login.thirdparty') }}</el-button> -->
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import md5 from 'md5.js'
import service from '@/utils/request'
import conf from '@/http/config'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    return {
      note: {
        backgroundImage: 'url(' + require('@/assets/u1.png') + ')'
      },
      // input1:'',
      // input2:'',
      loginForm: {
        username: 'hwt',
        password: 'string'
      },
      passwordType: 'password',
      redirect: undefined,
      psd: '',
      loading: false
    }
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     this.redirect = route.query && route.query.redirect
    //   },
    //   immediate: true
    // }
  },
  created() {
    this.loginHe = 'height:' + ($(window).height()) + 'px;overflow-y:auto;'
    console.log(this.loginHe)
  },
  methods: {
    // 密码加密处理
    encryption() {
      this.psd = md5(this.loginForm.password)
    },
    // handleLogin() {
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
    //         this.loading = false
    //         this.$router.push({ path: '/video' })
    //         alert(1)
    //       }).catch(() => {
    //         this.loading = false
    //       })
    //     } else {
    //       console.log('用户名或密码输入错误，请重新输入')
    //       return false
    //     }
    //   })
    // },
    // 创建cookie
    setCookie(cname, cvalue, exdays) {
      document.cookie = 'Token=' + this.token
    },
    handleLogin() {
      const params = {
        'username': this.loginForm.username,
        'password': this.loginForm.password
      }
      service.post('/api_token_auth/', params).then((res) => {
        if (res.status === 200) {
          // alert(1)
          console.log(res.data)
          this.token = res.data.token
          this.setCookie()
          // alert(1)
          service.defaults.headers.common['Authorization'] = conf.getCookie('Token')
          // alert(1)
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/index' })
            // alert(2)
          })
        }
      }).catch((error) => {
        console.log('error submit!!')
        // reject(error);
        this.$message({
          showClose: true,
          message: '用户名或密码错误',
          type: 'error'
        });
      })
    }
  }
}
</script>

<style scoped>
  .login{
    background-repeat: no-repeat;
    background-size: 100% 100%
  }
  .content{
    width: 33%;
    height: 330px;
    border: 1px solid #1f415c;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto auto;
    text-align: center;
    border-radius: 5px
  }
  .content h1{
    margin-top: 3%;
    color: #8cbcda
  }
  .el-input{
    margin-top: 3%
  }
  .el-button{
    margin-top: 3%;
    background: #2d3a4b;
    border: none
  }
</style>
