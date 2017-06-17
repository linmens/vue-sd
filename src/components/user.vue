<template>
<div>
  <group>
    <cell :title="user.user_name" is-link link="person" :inline-desc="'淘宝昵称:'+user.taobao_nick">
      <img slot="icon" class="avatar" @click.stop="show()" width="80" height="80" style="display:block;margin-right:5px;" :src="user.avatar">
    </cell>
  </group>
  <group>
    <cell title="余额" :value="user.money_yue" is-link link="yue">
      <img slot="icon" width="30" style="display:block;margin-right:5px;" src="../svg/余额.svg" />
    </cell>
  </group>

  <group>
    <cell title="订单" is-link @click.native="toorder" >
    </cell>
    <div class="weui-cell">
      <flexbox slot="default" :gutter="0" wrap="wrap">
       <flexbox-item :span="1/4" :key="index" v-for="(item,index) in user.orderNews" @click.native="topage(item)">
         <div class="flex-demo">
         <div class="flex-item">
           <img  width="25" height="25" :src="item.svg"/>
            <sup><span class="vux-badge">{{item.badge}}</span></sup>
         </div>
         <p>
           {{item.name}}
         </p>
       </div>
     </flexbox-item>
      </flexbox>
    </div>

  </group>
  <group>
    <cell title="账号密码" is-link @click.native="setpass = true">
    </cell>
  </group>
  <Group>
    <div class="weui-form-preview__ft"><a @click="logout" class="weui-form-preview__btn weui-form-preview__btn_primary">登出</a></div>
  </Group>
  <x-dialog v-model="showmodal" class="dialog-demo">
    <div class="img-box">
      <img :src="user.avatar" style="max-width:100%;max-height:100%">
    </div>
    <div>
      <span class="vux-close" @click="showmodal = false"></span>
    </div>
  </x-dialog>
  <x-dialog v-model="setpass" class="dialog-demo">

      <group>
        <x-input title="旧密码" type="password" :debounce="500" @on-change="oldchange" novalidate :icon-type="iconType" :show-clear="false" v-model="oldpass"></x-input>
        <x-input title="新密码" type="password" v-model="newpass"></x-input>
        <div class="weui-form-preview__ft">
          <a @click="setpass=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
          <a @click="finish" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
      </group>
  </x-dialog>

  <actionsheet v-model="show1"  show-cancel @on-click-menu-delete="onDelete"  :menus="menus1" @on-click-menu="click"></actionsheet>
</div>
</template>

<style lang="less" scoped>
@import '~vux/src/styles/close';
.logout {

    border-radius: 0;
}
.flex-demo{
  text-align: center;
  position: relative;
}
.flex-item{
  position: relative;
    width: 25px;
    margin: 0 auto;
    height: 25px;
}
.flex-demo p{
  font-size: 14px;color: #1f2d3d;
}
.flex-demo sup{
  position: absolute;
  top: -8px;
      left: 100%;
-webkit-transform: translateX(-50%);
transform: translateX(-50%);
z-index: 101;
}
.dialog-demo {

    .vux-close {
        margin-top: 8px;
        margin-bottom: 8px;
    }
}
</style>
<script>

import {
  Cell,
  Group,
  XHeader,
  XInput,
  XButton,
  cookie,
  Flexbox, FlexboxItem,CellBox,Actionsheet,
  XDialog,Badge
} from 'vux'
export default {
  components: {
    Cell,
    XInput,
    Group,Badge,Flexbox, FlexboxItem,CellBox ,Actionsheet,
    XHeader,
    XButton,
    XDialog

  },
  methods: {
    toorder(){
      this.$router.push('order')
      this.$store.state.vux.tabs = 0
      this.$store.state.vux.status = '待下单'
    },
    topage(item){
      this.$router.push('order')
      console.log(item.index);
      this.$store.state.vux.tabs = item.index
      this.$store.state.vux.status = item.name
    },
    finish(){
      if(this.newpass!=''&&this.oldpass!=''&&this.iconType=='success'){
        this.$http.post('http://sd.a10store.com/api/user.center.password.update.php', {newpass:this.newpass}).then(res => {
          console.log(res);
        }, res => {})
      }
    },
    oldchange(){
      this.$http.post('http://sd.a10store.com/api/user.center.password.update.php', {oldpass:this.oldpass}).then(res => {
        console.log(res);
        this.iconType = res.body.status
      }, res => {})
    },
    show() {
      this.showmodal = true
    },
    onDelete () {
      cookie.remove('username')
      cookie.remove('id')
      cookie.remove('pass')
      this.$router.push('/login')
    },
    logout() {
      this.show1 = true
    },
    onValuesChange(picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0]);
      }
    },
  },

  mounted() {
    this.$http.get('http://sd.a10store.com/api/user.center.info.get.php', {}).then(res => {
      console.log(res);
      this.user = res.body;
    }, res => {})
  },
  data() {
    return {
      setpass:false,
      newpass:'',
      oldpass:'',
      iconType: '',
      show1: false,
      menus1: {
        'title.noop': '你确定要登出账号吗?',
       delete: '<span style="color:red">登出</span>'
      },
      showmodal: false,
      user: {
        orderNews:[{index:2,name:'待付款',badge:'99+',svg:'dfk.svg'},{index:3,name:'待发货',badge:'99+',svg:'dfh.svg'},
        {index:4,name:'待收货',badge:'99+',svg:'dsh.svg'},{index:5,name:'退款/售后',badge:'99+',svg:'tksh.svg'}],
        "money_yongjin": "",
        "money_benjin": "",
        "money_yue": "",
        "user_name": "",
        "user_level": "",
        avatar: '',
        "taobao_nick": "",
        "phone": "",
        "address": "",
        "qq": ""
      },
      edit: true,
    }
  }
}
</script>
