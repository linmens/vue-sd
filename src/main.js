import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import routes from './router/'
import VueResource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/element-eb592f/index.css'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'

//懒加载的默认图片
import def_lazy_img from '../dist/timg.gif'
import error_lazy_img from '../dist/error.png'
//使用懒加载组件
Vue.use(VueLazyLoad,{
  loading: def_lazy_img,
  error:error_lazy_img
})
// or with options
// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   error: 'http://www.a10store.com/error.png',
//   loading: 'http://www.a10store.com/timg.gif',
//   attempt: 1
// })
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.use(VueRouter)

// 多级滚动
var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);
const router = new VueRouter({
    routes
})
const store = new Vuex.Store({}) // 这里你可能已经有其他 module

store.registerModule('a10store', { // 名字自己定义
  state: {
    activepath: '1',
    accountinfo:'',
    loading:false,
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      console.log(payload);
      state.isLoading = payload.isLoading
    },
  }
})
router.beforeEach(({meta, path}, from, next) => {
    let { auth = true } = meta
    store.state.a10store.loading = true
    // console.log(VueResource);
    let isLogin = Boolean(VueCookie.get('username'))
    if(window.location.host=='localhost:8081'){
      next()
    }else {
      if (auth && !isLogin  && path !== '/login') {
          return next({ path: '/login' })
      }
      Vue.http.post('http://www.a10store.com/api/caiwu/get_gufen_zhanbi.php', {
      }).then(res => {
        console.log(res,'main.js');
        store.state.a10store.accountinfo = res.body.list
      }, res => {
      })
      next()
    }

})
router.afterEach(function (to) {
  setTimeout(function(){
    store.state.a10store.loading = false
  	// store.dispatch("onLoading",false);
  	// console.log(store.state.isLoading)
  },1000)
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app-box')
