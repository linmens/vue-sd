import Home from '@/components/phome.vue'
import Login from '@/components/login.vue'
import User from '@/components/user.vue'
import App from '@/App.vue'
import Caigou from '@/components/caigou.vue'
import Person from '@/components/person.vue'
import Order from '@/components/order.vue'
import Admin from '@/components/admin.vue'
import Yue from '@/components/yue.vue'
import Record from '@/components/record.vue'
import Txrecord from '@/components/txrecord.vue'
import Management from '@/components/management.vue'
import ShuadanAdmin from '@/components/shuadan/admin.vue'
import Duizhang from '@/components/duizhang.vue'
import DuizhangAdmin from '@/components/duizhangAdmin.vue'

let routes = [{
  path: '/',
  name: '主页',
  meta: {
    // 添加该字段，表示进入这个路由是需要登录的
    showback: true,
  },
   redirect: { name: '领单中心' }
 },{
  path: '/caigou',
  name: '领单中心',
  meta: {
    // 添加该字段，表示进入这个路由是需要登录的
    showback: true,
    showedit:false,
    hiddentabbar:true
  },
  component: Caigou},
{
  path: '/person',
  component: Person,
  name: '个人信息',
  meta: {
    requireAuth: true,
    showback: true,
    showedit:false,
    hiddentabbar:false
  },
}, {
  path: '/user',
  name: '我',
  meta: {
    // 添加该字段，表示进入这个路由是需要登录的
    showback: true,
    showedit:false,
    hiddentabbar:true
  },
  component: User
}, {
  path: '/duizhang',
  name: '对账',
  meta: {
    // 添加该字段，表示进入这个路由是需要登录的
    showback: true,
    showedit:false,
    hiddentabbar:false
  },
  component: Duizhang
}, {
  path: '/order',
  name: '订单',
  meta: {
    // 添加该字段，表示进入这个路由是需要登录的
    showback: true,
    showedit:true,
    hiddentabbar:false
  },
  component: Order
},{
  path: '/login',
  component: Login,
  name: '登录',
  meta: {
    requireAuth: true,
    showedit:false,
    hiddentabbar:false
  },
}, {
  path: '/admin',
  component: Admin,
  name: 'admin',
  meta: {
    requireAuth: true,
    showedit:false,
    hiddentabbar:true
  }
}, {
  path: '/sdadmin',
  component: ShuadanAdmin,
  name: 'sdadmin',
  meta: {
    requireAuth: true,
    showedit:false,
    hiddentabbar:true
  }
},{
  path: '/management',
  component: Management,
  name: '用户管理',
  meta: {
    requireAuth: true,
    showedit:false,
    showback:true,
    hiddentabbar:false
  }
},{
  path: '/duizhangAdmin',
  component: DuizhangAdmin,
  name: '对账',
  meta: {
    requireAuth: true,
    showedit:false,
    showback:true,
    hiddentabbar:false
  }
},{
  path: '/yue',
  component: Yue,
  name: '余额',
  meta: {
    requireAuth: true,
      showback: true,
    showedit:false,
    hiddentabbar:false
  }
}, {
  path: '/record',
  component: Record,
  name: '交易记录',
  meta: {
    requireAuth: true,
      showback: true,
    showedit:false,
    hiddentabbar:false
  }
},
{
  path: '/txrecord',
  component: Txrecord,
  name: '提现记录',
  meta: {
    requireAuth: true,
      showback: true,
    showedit:false,
    hiddentabbar:false
  }
}
]
export default routes;
