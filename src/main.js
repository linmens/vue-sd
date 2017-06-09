// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
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

// 多级滚动

const store = new Vuex.Store({}) // 这里你可能已经有其他 module

store.registerModule('vux', { // 名字自己定义
  state: {
    isLoading: false,
    tabs:0,
    status:'待下单'
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      console.log(payload);
      state.isLoading = payload.isLoading
    },
    increment (state) {

     console.log(state);
   }
  }
})
const router = new VueRouter({
    routes
})
router.beforeEach(({meta, path}, from, next) => {
  store.commit('updateLoadingStatus', {isLoading: true})
    let { auth = true } = meta
    let isLogin = Boolean(cookie.get('username'))
    if (auth && !isLogin && path !== '/login') {
        return next({ path: '/login' })
    }
    next()
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
  data: {
    eventHub: new Vue()
  }
}).$mount('#app-box')
