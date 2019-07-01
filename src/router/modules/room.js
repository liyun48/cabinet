// 系统设置的路由配置
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const roomRouter = {
  path: '/monitor',
  component: Layout,
  redirect: 'noredirect',
  name: '机柜监控',
  meta: {
    title: '机柜监控',
    icon: 'nested'
  },
  children: [
    {
      path: 'manager',
      name: 'manager',
      component: () => import('@/pages/monitor/allMonitor/Layout'),
      meta: { title: '机柜总览' }
    },
    {
      path: 'deviceType',
      name: 'deviceType',
      component: () => import('@/pages/monitor/detail/Layout'),
      meta: { title: '机柜详情' }
    }
  ]
}

export default roomRouter
