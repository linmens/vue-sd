<template>
<div id="app" style="height:100%;">
  <view-box ref="viewBox" :bodyPaddingTop="topPading" :bodyPaddingBottom="bottomPading">
    <x-header v-if="$route.name!='个人信息'&&$route.name!='admin'" :title="$route.name" slot="header" :left-options="{showBack: $route.meta.showback}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
    </x-header>
    <router-view></router-view>
  
    <tabbar slot="bottom" v-if="$route.name!='admin'&&$route.name!='登录'">
      <tabbar-item link="caigou" :badge="num">
          <img slot="icon" src="./svg/order.svg">
          <img slot="icon-active" src="./svg/orderactive.svg">
        <span slot="label">领单</span>
      </tabbar-item>
      <tabbar-item link="user">
        <img slot="icon" src="./svg/my.svg">
        <img slot="icon-active" src="./svg/myactive.svg">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </view-box>
  <loading v-model="isLoading"></loading>
</div>
</template>

<script>

import {
  Cell,
  Group,
  XHeader,
  Badge,
  Tabbar,
  TabbarItem,
  ViewBox,Sticky,Scroller,  Tab,
    TabItem,
  Loading
} from 'vux'
import { mapState } from 'vuex'

export default {
  components: {
    Cell,Sticky,Scroller,
    Badge,
    Group,
    XHeader,  Tab,
      TabItem,
    Tabbar,
    TabbarItem,
    ViewBox,
    Loading
  },
  data() {
                       return {
                           num:'2323',
                           topPading:'46px',
                           bottomPading:'53px'
                       }
                   },
  computed: {
    // isLoading(){
    //   return this.$store.state.isLoading
    // }
    ...mapState({
      isLoading: state => state.vux.isLoading
    })
  },
  methods:{

  },
  mounted() {
    // if(this.$route.name=='订单'){
    //   this.topPading = '134px'
    // }
    this.$http.get('http://sd.a10store.com/api/order.caigou.list.num.get.php', {
    }).then(res => {
      console.log(res);
      this.num = res.body.num;
    }, res => {})
  }
}
</script>


<style lang="less">
@import '~vux/src/styles/reset.less';
// #vux_view_box_body{
//   padding-top: 46px;
//   padding-bottom: 55px;
// }
.weui-tabbar__icon>sup{
  top: 0!important
}
body,
html {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
}
body {
    background-color: #fbf9fe;
}
</style>
