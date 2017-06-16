<template>
<div>
  <group>
    <cell @click.native="showTixianPop()"  title="提现审核" is-link >
    </cell>

  </group>
  <group>
    <cell @click.native="showuserEdit(user)" :key="index" v-for="(user,index) in users"  :title="user.user_name" is-link  :inline-desc="'淘宝昵称:'+user.taobao_nick+'  QQ:' +user.qq" value="等级Lv1">
      <span slot="after-title">15098898989</span>
      <img slot="icon" class="avatar" @click.stop="show()" width="80" height="80" style="display:block;margin-right:5px;" :src="user.avatar">
    </cell>
  </group>
  <popup v-model="showEdit" position="right" width="100%">
          <group>
            <x-input v-model="userEdit.user_name" text-align="right" title="用户名"></x-input>
            <x-input v-model="userEdit.taobao_nick" text-align="right" title="旺旺ID"></x-input>
            <x-input v-model="userEdit.level" text-align="right" title="用户等级"></x-input>
            <x-input v-model="userEdit.phone" text-align="right" title="手机号"></x-input>
            <x-input v-model="userEdit.qq" text-align="right" title="QQ号"></x-input>
            <x-input v-model="userEdit.password" text-align="right" title="密码"></x-input>
          </group>
          <div style="padding: 15px;">
            <x-button @click.native="showEdit = false" type="primary">修改</x-button>
          </div>
        </popup>
        <popup v-model="showTixian" position="right" height="100%" width="100%">
           <x-header :left-options="{preventGoBack:true}" @on-click-back="showTixian= false">提现</x-header>
                <group>
                  <form-preview :header-label="('付款金额')" header-value="¥2400.00" :body-items="list" :footer-buttons="buttons2"></form-preview>
                </group>

              </popup>
</div>
</template>

<style lang="less" scoped>

</style>
<script>

import {
  Cell,
  Group,
  XHeader,
  XInput,
  XButton,
  cookie,
  Flexbox, FlexboxItem,CellBox,FormPreview,
  XDialog,Badge,Popup
} from 'vux'
export default {
  components: {
    Cell,
    XInput,Popup,
    Group,Badge,Flexbox, FlexboxItem,CellBox ,FormPreview,
    XHeader,
    XButton,
    XDialog
  },
  methods: {
    showuserEdit(user){
      this.showEdit = true
      console.log(user);
      this.userEdit = user
    },
    showTixianPop(){
      this.showTixian = true
    }
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
      showEdit:false,
      showmodal: false,
      userEdit:{},
      showTixian:false,
      list: [{
       label: '姓名',
       value: '王理琦'
     }, {
       label: '交易号',
       value: '13213123123123'
     }, {
       label: '收款方式',
       value: '银行卡 2378273827382738'
     }],
     buttons1: [{
       style: 'default',
       text: '辅助操作'
     }, {
       style: 'primary',
       text: '跳转到首页',
       link: '/'
     }],
     buttons2: [{
       style: 'primary',
       text: '确认',
       onButtonClick: (name) => {
         alert(`clicking ${name}`)
       }
     }],
      users:[{
        "money_yongjin": "",
        "money_benjin": "",
        "money_yue": "",
        "user_name": "刘金玲1",
        "user_level": "",
          avatar: '',
          level:'',
          password:'',
        "taobao_nick": "2131231231231",
        "phone": "",
        "address": "",
        "qq": "2780656565"
      },{
        "money_yongjin": "",
        "money_benjin": "",
        "money_yue": "",
        "user_name": "刘金玲",
        "user_level": "",
          avatar: '',
          level:'',
          password:'',
        "taobao_nick": "2131231231231",
        "phone": "",
        "address": "",
        "qq": "2780656565"
      }]
    }
  }
}
</script>
