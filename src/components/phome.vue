<template>
  <div>
    <router-view></router-view>
    <!-- <tabbar >
        <tabbar-item link="caigou">
          <img slot="icon" src="../svg/order.svg">
          <img slot="icon-active"  src="../svg/orderactive.svg">
          <span slot="label">领单</span>
        </tabbar-item>
        <tabbar-item link="user">
          <img slot="icon" src="../svg/my.svg">
          <img slot="icon-active" src="../svg/myactive.svg">
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar> -->
</div>
</template>
<style>

.avatar{
  border-radius: 50%;
}
/*.weui-tabbar {
  position: fixed!important;
}*/
</style>
<script>
import { Cell,Group,XHeader,Tabbar, TabbarItem,ViewBox  } from 'vux'
export default {
  components: {
   Cell,Group,XHeader,Tabbar, TabbarItem,ViewBox
 },

 }
</script>
