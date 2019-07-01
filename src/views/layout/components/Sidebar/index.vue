<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="one">
      <img src="@/assets/logo.jpg" alt="">
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="true"
      mode="vertical"
      background-color="#0f1a2c"
      text-color="#c6eaff"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>
  .one{
    height: 84px;
    background-color: #0f1a2c;
    position: relative;
  }
  img{
    width: 100px;
    height: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -25px;
    margin-left: -50px
  }
  .el-scrollbar__view{
    height: 100%
  }
</style>
