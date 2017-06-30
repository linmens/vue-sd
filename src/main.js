import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import routes from './router/'
import VueResource from 'vue-resource'
import  { ToastPlugin } from 'vux'
import VueClipboard from 'vue-clipboard2'
import  { ConfirmPlugin } from 'vux'
import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(VueClipboard)
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
import Vuex from 'vuex'
Vue.use(Vuex)
import { cookie } from 'vux'
Vue.use(ToastPlugin)
Vue.use(VueResource)
Vue.use(VueRouter)
import { Loadmore,InfiniteScroll  } from 'mint-ui';
Vue.use(InfiniteScroll)
Vue.component(Loadmore.name, Loadmore);
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon)
// 多级滚动
const store = new Vuex.Store({}) // 这里你可能已经有其他 module

store.registerModule('vux', { // 名字自己定义
  state: {
    isLoading: false,
    tabs:0,
    iid:'',
    status:'待下单',
    num:'',
    edit:false,
    backText:'',
    topPading:'46px',
    bottomPading:'53px'
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      console.log(payload);
      state.isLoading = payload.isLoading
    },
    increment (state,item) {
     console.log(item);
     state.tabs = item.index
     state.status = item.name
   },
   isNeedpadding(state,nestate){
     state.bottomPading = '53px'
   },
   isnOpadding(state){
     state.bottomPading = '0px'
   },
   changeBacktext(state,from){
     state.backText = from.name
   }
  }
})
const router = new VueRouter({
    routes
})
router.beforeEach(({meta, path}, from, next) => {
console.log(window.location.host);
  if(meta.hiddentabbar){
    store.commit('isNeedpadding')

  }
  if(!meta.hiddentabbar){
    store.commit('isnOpadding')
    // store.commit('changeBacktext',from)
  }


  store.commit('updateLoadingStatus', {isLoading: true})
    let { auth = true } = meta
    console.log(path);
    let isLogin = Boolean(cookie.get('username'))
    let Access = Boolean(cookie.get('userAccess'))
      console.log(Access);
    if(window.location.host=='localhost:8081'){
      next()
    }else {
      if (auth && !isLogin  && path !== '/login') {
          return next({ path: '/login' })
      }
      next()
    }

})
router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
})
FastClick.attach(document.body)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app-box')
