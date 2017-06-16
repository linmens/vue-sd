<template>
<div id="app" style="height:100%;">
  <view-box ref="viewBox" :bodyPaddingTop="topPading" :bodyPaddingBottom="bottomPading">
    <x-header v-if="$route.name!='个人信息'&&$route.name!='admin'" :title="$route.name" slot="header" :left-options="{backText:backText,showBack: $route.meta.showback}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      <span slot="right" @click="giveup"  v-if="tabs==0||tabs==1||tabs==2"><span v-if="!edit&&$route.meta.showedit">放弃订单</span>
      <span v-if="edit&&$route.meta.showedit">取消</span>
      </span>
      <router-link slot="right" to="record"  v-if="$route.name=='余额'">交易记录</router-link>
      <span slot="right" v-if="$route.name=='交易记录'" @click="showStatus=true">筛选</span>
    </x-header>
    <router-view class="router-view"></router-view>

    <tabbar slot="bottom" v-if="$route.meta.hiddentabbar">
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
    <tabbar slot="bottom" v-if="$route.name=='admin'">
      <tabbar-item link="admin" :badge="num">
          <img slot="icon" src="./svg/order.svg">
          <img slot="icon-active" src="./svg/orderactive.svg">
        <span slot="label">后台</span>
      </tabbar-item>
      <tabbar-item link="management">
        <img slot="icon" src="./svg/my.svg">
        <img slot="icon-active" src="./svg/myactive.svg">
        <span slot="label">用户</span>
      </tabbar-item>
    </tabbar>
    <popup v-model="showStatus" position="bottom" class="noMargin">
      <group>
        <div class="pop-header">
          选择交易类型
        </div>
        <flexbox :gutter="0" class="flex-content" wrap="wrap">
     <flexbox-item :span="1/3" v-for="(s,index) in statusforRecord" :key="index">
       <div class="flex-demo" @click="changeTab(index)" :class="{active:actab == index}" >{{s.text}}</div></flexbox-item>
   </flexbox>
      </group>
    </popup>
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
  ViewBox,Sticky,Scroller,  Tab,Flexbox, FlexboxItem,
    TabItem,Popup,
  Loading
} from 'vux'
import { mapState } from 'vuex'

export default {
  components: {
    Cell,Sticky,Scroller,
    Badge,
    Group,
    XHeader,  Tab,Popup,Flexbox, FlexboxItem,
      TabItem,
    Tabbar,
    TabbarItem,
    ViewBox,
    Loading
  },
  computed: {

    topPading(){
      return this.$store.state.vux.topPading
    },
    tabs(){
        return this.$store.state.vux.tabs
    },
    backText(){
      return this.$store.state.vux.backText
    },
    edit() {
      return this.$store.state.vux.edit
    },
    bottomPading(){
        return this.$store.state.vux.bottomPading
    },
    num(){
      return this.$store.state.vux.num
    },
    status(){
      return this.$store.state.vux.status
    },
    isLoading(){
      this.$store.state.vux.isLoading
    }
  },
  data(){
    return {
      showStatus:false,
      actab:0,
      statusforRecord:[{text:'全部',id:0},{text:'退款',id:1},{text:'提现',id:2},{text:'佣金',id:3}]
    }
  },
  methods:{
    changeTab(index){
      this.actab = index
    },
    giveup() {
      this.$store.state.vux.edit = !this.$store.state.vux.edit
      console.log(this.$store.state.vux.edit);
    },

  },
  mounted() {

  }
}
</script>


<style lang="less">
@import '~vux/src/styles/reset.less';
.flex-content{
  background: rgba(238, 241, 246, 0.51)
}
.noMargin .flex-demo{
  margin: 10px;
  height: 50px;
  color: #554d4d;
  text-align: center;
line-height: 50px;
border-radius: 5px;
background: white
}
.noMargin .flex-demo.active{
  background: #20b907;
  color: white
}
.noMargin .flex-demo:hover{
  background: #20b907;
  color: white
}
.pop-header{
  text-align: center;
color: black;
line-height: 44px;
height: 44px;
background: white;
border-bottom: 1px solid rgba(213, 213, 214, 0.29)
}
.bottomEdit{
height: 53px;
line-height: 53px
}
.router-view {
    width: 100%;
    top: 46px;
}
.bottomEdit span{
  position: absolute;
right: 10px;
    color: rgb(255, 144, 91);
}
// .weui-tab__panel{
//   box-sizing: border-box;
// top: 46px;
// bottom: 53px;
// position: absolute;
// padding-bottom: 53px;
//     height: 100%;
// width: 100%;
// overflow: auto;
// -webkit-overflow-scrolling: touch;
// }
.weui-tabbar__icon>sup{
  top: 0!important
}
body,
html {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
body {
    background-color: #fbf9fe;
}
</style>
