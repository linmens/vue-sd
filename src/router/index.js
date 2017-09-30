import Login from '@/components/login.vue'
import Index from '@/components/index.vue'
import shangpinadd from '@/components/shangpin/add.vue'
import weihu from '@/components/shangpin/weihu.vue'//商品维护
//档案
import category from '@/components/dangan/categoryset.vue'//产品分类设置
import cangkuset from '@/components/dangan/cangkuset.vue'//仓库维护
//仓库
import ruku_gl from '@/components/cangku/ruku_gl.vue'//采购入库
import kucun from '@/components/cangku/kucun.vue'//库存查询
//淘客
import Taoke from '@/components/taoke.vue'
import taokeAdd from '@/components/taoke/add.vue'
import taokeWeihu from '@/components/taoke/weihu.vue'
//财务
import Caiwu from '@/components/caiwu.vue'
import caiwuAdd from '@/components/caiwu/add.vue'
import caiwuZhanbi from '@/components/caiwu/zhanbi.vue'
import Gufen from '@/components/caiwu/gufen.vue'
import Shouzhi from '@/components/caiwu/shouzhi.vue'

let routes = [
  {
    path: '/store',
    name: '首页',
    meta: {
      hidden: true,
    },
     component: Index,
     children:[
       {
         path: '/shangpin/add',
         component: shangpinadd,
         name: '新增商品',
       },{
         path: '/shangpin/weihu',
         component: weihu,
         name: '商品维护',
         meta: {
         }
       },{
         path: '/dangan/categoryset',
         component: category,
         name: '产品分类设置',
         meta: {
         }
       },{
         path: '/dangan/cangkuset',
         component: cangkuset,
         name: '仓库维护',
         meta: {
         }
       },{
         path: '/cangku/ruku_gl',
         component: ruku_gl,
         name: '采购入库',
         meta: {
         }
       },{
         path: '/cangku/kucun',
         component: kucun,
         name: '库存查询',
         meta: {
         }
       }
     ],
     redirect: { path: '/shangpin/weihu' }
   },
   {
     path: '/taoke',
     component: Taoke,
     name: '淘宝客',
     children:[
       {
         path: '/taoke/add',
         component: taokeAdd,
         name: '新增商品',
         meta: {
         }
       },{
         path: '/taoke/weihu',
         component: taokeWeihu,
         name: '维护商品',
       }
     ],
   },
   {
     path: '/caiwu',
     component: Caiwu,
     name: '财务',
     children:[
       {
         path: '/caiwu/add',
         component: caiwuAdd,
         name: '新增股份',
      },
       {
         path: '/caiwu/zhanbi',
         component: caiwuZhanbi,
         name: '股份占比',
         meta: {
         }
       },
       {
         path: '/caiwu/gufen',
         component: Gufen,
         name: '股份记录',
         meta: {
         }
       },
       {
         path: '/caiwu/shouzhi',
         component: Shouzhi,
         name: '收支记录',
         meta: {
         }
       }
     ],
     meta: {
       hidden: true,
     },
   },
{
  path: '/login',
  component: Login,
  name: '登录',
  meta: {
    hidden: true,
  },

},
]
export default routes;
