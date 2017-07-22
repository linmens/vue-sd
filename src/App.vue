<template>
<div id="app" style="height:100%;">
  <view-box ref="viewBox" :bodyPaddingTop="topPading" :bodyPaddingBottom="bottomPading">
    <x-header :class="{isyueBlue:$route.name=='余额'}" v-if="$route.name!='个人信息'&&$route.name!='admin'&&$route.name!='订单'&&$route.name!='余额'" :title="$route.name" slot="header" :left-options="{backText:backText,showBack: $route.meta.showback}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      <!-- <span slot="right" @click="giveup"  v-if="tabs==0||tabs==1||tabs==2"><span v-if="!edit&&$route.meta.showedit">放弃订单</span> -->
      <span v-if="edit&&$route.meta.showedit">取消</span>
      </span>
      <!-- <span slot="right" v-if="$route.name=='采购'" @click="torefresh"><icon name="refresh"></icon></span> -->
      <router-link slot="right" to="txrecord"  v-if="$route.name=='对账'">提现记录</router-link>
      <span slot="right" v-if="$route.name=='交易记录'" @click="showStatus=true">筛选</span>
    </x-header>
    <router-view class="router-view "></router-view>

    <tabbar  slot="bottom" v-if="$route.meta.hiddentabbar=='customer'">
      <tabbar-item :selected="$route.name=='采购'"  link="caigou" :badge="num">

        <icon name="list-alt" slot="icon" scale="1.4"></icon>
        <icon name="list-alt" scale="1.4" slot="icon-active" style="color:#fff" ></icon>
          <!-- <img slot="icon" src="./svg/order.svg"> -->
          <!-- <img  src="./svg/orderactive.svg"> -->
        <span slot="label">采购</span>
      </tabbar-item>
      <tabbar-item  link="user" :selected="$route.name=='我'">
        <icon name="user-o" scale="1.4" slot="icon" ></icon>
        <icon name="user-o" scale="1.4" slot="icon-active" style="color:#fff" ></icon>
        <!-- <img slot="icon" src="./svg/my.svg"> -->
        <!-- <img slot="icon-active" src="./svg/myactive.svg"> -->
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
    <tabbar slot="bottom" v-if="$route.meta.hiddentabbar=='admin'">
      <tabbar-item link="adminorder" :badge="num" :selected="$route.name=='工作台'">
        <icon name="user-secret" scale="1.4" slot="icon" ></icon>
        <icon name="user-secret" scale="1.4" slot="icon-active" style="color:#fff" ></icon>
        <span slot="label">工作台</span>
      </tabbar-item>
      <!-- <tabbar-item link="sdadmin" :selected="$route.name=='补单'">
        <img slot="icon" src="./svg/补单.svg">
        <img slot="icon-active" src="./svg/补单active.svg">
        <span slot="label">补单</span>
      </tabbar-item> -->
      <tabbar-item link="management" :selected="$route.name=='用户'">
        <icon name="users" scale="1.4" slot="icon" ></icon>
        <icon name="users" scale="1.4" slot="icon-active" style="color:#fff" ></icon>
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
    torefresh(){
      this.$router.go(0)
    },
    changeTab(index){
      this.actab = index
    },


  },
  mounted() {
  }
}
</script>


<style lang="less">
@import '~vux/src/styles/reset.less';
.mui-scrollspy {
  margin-top: 0;
  position: relative;
}
.white-header{
  box-shadow: 0 4px 5px -3px hsla(0, 4%, 77%, 0.34);
}
.white-header-back{
color: rgb(80, 170, 255)!important;
padding-left: 16px;
}
.white-left-arrow {
   position: absolute;
   width: 30px;
   height: 30px;
   top: -5px;
   left: -5px;
}
.white-left-arrow:before{
  content: "";
position: absolute;
width: 12px;
height: 12px;
border: 1px solid rgb(80, 170, 255);
border-width: 1px 0 0 1px;
-webkit-transform: rotate(315deg);
transform: rotate(315deg);
top: 8px;
left: 7px;
}
.isyueBlue{
    background-color: #3da8f5!important;
}
.flex-content{
  background: rgba(238, 241, 246, 0.51)
}
.hastuikuan{
  color: red
}
.du-header  .vux-flexbox-item{
  padding: 5px;
  margin-bottom: 10px
}
.du-header{
  background: rgb(212, 60, 51);
color: white;
font-weight: 300;
}
.du-header .labesppan{
  color: rgba(255, 255, 255, 0.87);
font-size: 14px;
font-weight: 300;
}
.vux-button-group > a.vux-button-tab-item-first{
  border-top-left-radius: 5px!important;
border-bottom-left-radius: 5px!important;
}
.vux-button-group > a.vux-button-tab-item-last{
  border-top-right-radius: 5px!important;
border-bottom-right-radius: 5px!important;
}
.vux-button-group > a.vux-button-tab-item-last:after{
  border-top-right-radius: 5px!important;
border-bottom-right-radius: 5px!important;
}
.vux-button-group > a.vux-button-tab-item-first:after{
  border-top-left-radius: 5px!important;
border-bottom-left-radius: 5px!important;
}
// .bodyBg{
//   background: rgba(229, 229, 229, 0.14);
// height: 100%;
// }
#vux_view_box_body{
  background: rgba(229, 229, 229, 0.39);
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
    // top: 46px;
        // overflow-x: auto;
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
