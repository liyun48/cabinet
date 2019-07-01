// 系统设置的路由配置
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const configRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noredirect',
  name: '系统设置',
  meta: {
    title: '系统设置',
    icon: 'component'
  },
  children: [
    {
      path: 'rackRoom',
      name: 'rackRoom',
      component: () => import('@/pages/system/rackRoom/Layout.vue'),
      meta: { title: '机柜管理' }
    },
    {
      path: 'user',
      component: () => import('@/pages/system/user/Layout.vue'),
      name: 'user',
      meta: { title: '用户管理' }
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/pages/system/role/Layout.vue'),
      meta: { title: '权限管理' }
    }
  ]
}

export default configRouter
