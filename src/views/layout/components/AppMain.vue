<template>
  <div class="main">
    <div class="sections">
      <section :style="conheight" class="app-main">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view :key="key"/>
          </keep-alive>
        </transition>
      </section>
    </div>
    <div class="logo">
      版权所有 @2019 昆山鸣泽信息科技有限公司
    </div>
    <!-- 催办 -->
    <div v-show="handleList.length != 0 && showHandle === true" class="handle" >
      <!-- <div class="handle" title="催办" > -->
      <span>催办<i class="el-icon-close" title="关闭" @click="showHandle = false" /></span>
      <ul>
        <li v-for="item in handleList" :key="item.approval_id">
          {{ item.user_name }}将于{{ item.start_end }}申请
          <br >
          <span class="span-reason">{{ item.approval_text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import service from '@/utils/request'
export default {
  name: 'AppMain',
  data() {
    return {
      conheight: '',
      // 催办列表
      handleList: [],
      // 显示于隐藏
      showHandle: true,
      // 定时器
      timer: null
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  created() {
    this.conheight = 'height:' + ($(window).height() - 125) + 'px;overflow-y:auto;'
    this.getHandle()
  },
  mounted() {
    this.timer = setInterval(() => {
      this.showHandle = true
    }, 30000)
  },
  updated() {
    this.getHandle()
  },
  methods: {
    // 获取催办信息
    getHandle() {
      service.get('/api_approval/get_cuiban/').then(({ data }) => {
        this.handleList = data.result
      })
    }
  }
}
</script>

<style scoped>
template{
  height: 100%;
}
.main{
  position: relative;
  height: 100%;
  overflow: hidden;
}
.keep-alive {
  /* overflow: auto; */
}

.sections{
  /* overflow-y: auto */

}
section{
  padding: .8em;
}
section::-webkit-scrollbar {/*滚动条整体样式*/
        width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
section::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #1c3148;
    }
section::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #0f1a2c;
    }
/* .main .logo{
  position: absolute;
  top: 300px;
  width: 100%
} */
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  /* min-height: calc(100% - 102px); */
  width: 100%;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  color: #666666;
}
.logo{
  background-color: #fff;
  width: 100%;
  text-align: center;
  color: #68add8;
  position: fixed;
  bottom: 0;
  line-height: 40px;
  box-sizing: border-box;
  border-top: 1px solid #ededed;
  z-index: 9999;
}
.handle{
  padding: 10px;
  width: 470px;
  height: 30%;
  background-color: #fff;
  border: 1px solid#eee;
  position: fixed;
  bottom: 85px;
  right: 30px;
}

.handle > ul{
  color: #333;
  list-style: none;
  width: 100%;
  height: 90%;
  overflow-y:scroll;
  word-wrap: break-word;
  line-height: 1.5em;
}

.handle > ul > li{
  margin-bottom: 5px;
}

.handle > span{
  font-size: 20px;
}

.el-icon-close{
  position: relative;
  left: 85%;
  font-size: 16px;
}

.el-icon-close:hover{
  cursor: pointer;
}

.span-reason{
  color: black;
  font-weight: bolder;
}
</style>

