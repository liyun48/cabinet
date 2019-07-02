import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

// 系统设置
import configRouter from './modules/config'
// import roomRouter from './modules/room'

/* Router Modules */
/*
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
*/

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index1'),
    hidden: true
  },
  // {
  //   path: '/video',
  //   component: () => import('@/pages/video/Layout'),
  //   hidden: true
  // },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    // path: '',
    // component: Layout,
    // redirect: 'dashboard',
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/index'),
    //     name: 'Dashboard',
    //     meta: { title: '环控系统', icon: 'dashboard', noCache: true }
    //   }
    // ]
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/pages/index/Layout'),
        name: 'Index',
        meta: { title: '系统首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
  /*
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'documentation', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  }*/
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/video',
  //   component: () => import('@/pages/video/Layout'),
  //   hidden: true
  // },

  // 机柜监控
  {
    path: '/monitor/allMonitor',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/pages/monitor/allMonitor/Layout'),
        name: 'allMonitor',
        meta: {
          title: '机柜监控',
          icon: 'eye'
        }
      }
    ]
  },
  // 机柜详情
  {
    path: '/monitor/detail',
    component: Layout,
    redirect: 'noredirect',
    // hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/pages/monitor/detail/Layout'),
        name: 'detail',
        meta: {
          title: '机柜详情',
          icon: 'email'
        }
      }
    ]
  },
  // 站内信
  {
    path: '/message',
    component: Layout,
    redirect: 'noredirect',
    // hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/pages/message/Layout'),
        name: 'message',
        meta: {
          title: '站内信息',
          icon: 'email'
        }
      }
    ]
  },
  // 警报管理
  {
    path: '/alarm',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/pages/alarm/Layout'),
        name: 'alarm',
        meta: {
          title: '报警管理',
          icon: 'clipboard'
        }
      }
    ]
  },
  // 审批管理
  {
    path: '/examine',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/pages/examine/Layout'),
        name: 'examine',
        meta: {
          title: '审批管理',
          icon: 'documentation'
        }
      }
    ]
  },
  // 日志管理
  {
    path: '/log',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/pages/log/Layout'),
        name: 'log',
        meta: {
          title: '日志管理',
          icon: 'form'
        }
      }
    ]
  },
  // 系统设置
  configRouter,
  // 关于我们
  {
    path: '/aboutUs',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/pages/aboutUs/Layout'),
        name: 'aboutUs',
        meta: {
          title: '关于我们',
          icon: 'peoples'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
