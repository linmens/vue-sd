import Home from '@/components/phome.vue'
import Login from '@/components/login.vue'
import User from '@/components/user.vue'
import Caigou from '@/components/caigou.vue'
import Person from '@/components/person.vue'
import Order from '@/components/order.vue'
import Admin from '@/components/admin.vue'

let routes = [{
    path: '/',
    component: Home,
    name: '主页',
    meta: {
      // 添加该字段，表示进入这个路由是需要登录的
      requireAuth: true,
    },
    children: [{
      path: '',
      name: '领单中心',
      meta: {
        // 添加该字段，表示进入这个路由是需要登录的
        showback: true,
      },
      component: Caigou
    }, {
      path: '/person',
      component: Person,
      name: '个人信息',
      meta: {
        requireAuth: true,
        showback: true,
      },
    }, {
      path: 'user',
      name: '我',
      meta: {
        // 添加该字段，表示进入这个路由是需要登录的
        showback: true,
      },
      component: User
    }, {
      path: 'caigou',
      name: '领单中心',
      meta: {
        // 添加该字段，表示进入这个路由是需要登录的
        showback: false,
      },
      component: Caigou
    }, {
      path: 'order',
      name: '订单',
      meta: {
        // 添加该字段，表示进入这个路由是需要登录的
        showback: true,
      },
      component: Order
    },{
      path: '/login',
      component: Login,
      name: '登录',
      meta: {
        requireAuth: true,
      },
    }, {
      path: '/admin',
      component: Admin,
      name: 'admin',
      meta: {
        requireAuth: true,
      },
    }]
  },

]
export default routes;
