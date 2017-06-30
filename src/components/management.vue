<template>
<div>
  <group>
    <cell @click.native="showTixianPop()" title="提现审核" is-link>
    </cell>
      <cell link="duizhangAdmin" title="对账" is-link>
    </cell>
  </group>
  <group>
    <cell @click.native="showuserEdit(user)" :key="index" v-for="(user,index) in users.list" :title="user.user_name" is-link :inline-desc="'淘宝昵称:'+user.taobao_nick+'  QQ:' +user.qq" value="等级Lv1">
      <span slot="after-title">15098898989</span>
      <img slot="icon" class="avatar" @click.stop="show()" width="80" height="80" style="display:block;margin-right:5px;" :src="user.avatar">
    </cell>
  </group>
  <popup v-model="showEdit" position="right" width="100%">
    <group>
      <x-input v-model="userEdit.user_name" text-align="right" title="用户名"></x-input>
      <x-input v-model="userEdit.id_name" text-align="right" title="姓名"></x-input>
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
    <div style="padding:15px">
      <button-tab v-model="btntab">
        <button-tab-item @on-item-click="consoleIndex(0)" :class="{selected:btntab==0}">未处理</button-tab-item>
        <button-tab-item  @on-item-click="consoleIndex(1)" :class="{selected:btntab==1}">已处理</button-tab-item>
      </button-tab>
    </div>
    <div v-for="(l,index) in list" :key="index">
      <group >
        <!-- :footer-buttons="buttons2" -->
        <form-preview :header-label="('付款金额')" :header-value="l.money" :body-items="l.content" ></form-preview>
<div class="weui-form-preview__ft custom">
  <a @click="buttonCheck(l)"  v-if="btntab==0" class="weui-form-preview__btn weui-form-preview__btn_primary">
    确认
</a>
<a   v-else class="weui-form-preview__btn weui-form-preview__btn_primary">
  交易成功
</a>
</div>
      </group>
    </div>
  </popup>
</div>
</template>
<style>
.custom::after{
  border-top: 0!important
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
  Flexbox,
  FlexboxItem,
  CellBox,
  FormPreview,
  ButtonTab,Loading,
  ButtonTabItem,
  XDialog,
  Badge,
  Popup
} from 'vux'
export default {
  components: {
    Cell,
    XInput,
    Popup,
    Group,
    Badge,
    Flexbox,
    FlexboxItem,
    CellBox,
    FormPreview,
    ButtonTab,
    ButtonTabItem,
    XHeader,
    XButton,Loading,
    XDialog
  },
  methods: {
    getlist() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.post('http://sd.a10store.com/api/admin.user.list.get.php', {}).then(res => {
        console.log(res);
        this.users = res.body;
        this.$vux.loading.hide()
      }, res => {
        this.$vux.loading.hide()
      })
    },
    showuserEdit(user) {
      this.showEdit = true
      console.log(user);
      this.userEdit = user
    },
    tixianList() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.post('http://sd.a10store.com/api/admin.money.tixian.list.get.php', {
        tab: this.btntab
      }).then(res => {
        console.log(res);
        this.list = res.body.list;
        // this.money = res.body.money;
        this.$vux.loading.hide()
      }, res => {
        this.$vux.loading.hide()
      })
    },
    buttonCheck(item){
      const _this = this
      this.$vux.confirm.show({
        title: '确认已打款？',
        onCancel() {
          console.log(_this) // 当前 vm
        },
        onConfirm() {
          _this.$http.post('http://sd.a10store.com/api/admin.money.tixian.state.update.php', {
            id: item.id
          }).then(res => {
            _this.tixianList()
            _this.$vux.toast.show({
              text: '确认成功~'
            })
            _this.$vux.loading.hide()
          }, res => {
            _this.$vux.loading.hide()
          })

        }
      })
    },
    showTixianPop() {
      this.tixianList()
      this.showTixian = true
    },
    consoleIndex() {
      this.tixianList()
    }
  },
  mounted() {
    this.getlist()
  },
  data() {
    return {
      setpass: false,
      newpass: '',
      oldpass: '',
      iconType: '',
      btntab: 0,
      showEdit: false,
      showmodal: false,
      userEdit: {},
      showTixian: false,
        "list": [{
          "money": "-317.90",
          "content": [{
            "label": "姓名",
            "value": "缺失"
          }, {
            "label": "用户名",
            "value": "福尔摩山"
          }, {
            "label": "交易号",
            "value": "247"
          }, {
            "label": "收款方式",
            "value": "提现;收款帐号:支付宝"
          }]
        },
        {
          "money": "-307.90",
          "content": [{
            "label": "姓名",
            "value": "123213"
          }, {
            "label": "用户名",
            "value": "福尔摩山"
          }, {
            "label": "交易号",
            "value": "247"
          }, {
            "label": "收款方式",
            "value": "提现;收款帐号:支付宝"
          }]
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

        }
      }],
      users: [{
        "money_yongjin": "",
        "money_benjin": "",
        "money_yue": "",
        id_name:'',
        "user_name": "刘金玲1",
        "user_level": "",
        avatar: '',
        level: '',
        password: '',
        "taobao_nick": "2131231231231",
        "phone": "",
        "address": "",
        "qq": "2780656565"
      }, {
        "money_yongjin": "",
        "money_benjin": "",
        "money_yue": "",
        "user_name": "刘金玲",
        "user_level": "",
        avatar: '',
        level: '',
        password: '',
        "taobao_nick": "2131231231231",
        "phone": "",
        "address": "",
        "qq": "2780656565"
      }]
    }
  }
}
</script>
