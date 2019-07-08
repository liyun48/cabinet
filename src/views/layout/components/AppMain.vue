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
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'AppMain',
  data() {
    return {
      conheight: ''
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
</style>

