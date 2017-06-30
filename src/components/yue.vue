<template>
<div>
  <group>
    <cell title="总余额账户(元)">
      <span slot="value" class="weui-form-preview__btn_primary" style="font-size:24px">￥{{personPrice.yue}}</span>
    </cell>
    <cell-form-preview :list="personPrice.list"></cell-form-preview>
  </group>
  <group>
    <cell title="提现" is-link @click.native="tixian"></cell>
  </group>
  <div v-transfer-dom>
    <popup position="right" width="100%" v-model="showTixian" height="100%">
      <div class="popup1 tixian">
        <x-header :left-options="{preventGoBack:true}" @on-click-back="showTixian= false">提现
          <router-link to="txrecord" slot="right">提现记录</router-link>
        </x-header>
        <group class="noMargin">
          <div class="pop-header">
            选择提现方式
          </div>
          <flexbox :gutter="0" class="flex-content" wrap="wrap">
            <flexbox-item :span="1/3" v-for="(s,index) in tixianlist.account" :key="index">
              <div class="flex-demo" @click="changeTab(s,index)" :class="{active:actab == index}">{{s.label}}</div>
            </flexbox-item>
          </flexbox>
        </group>
        <group>
          <cell title="提现金额"></cell>
          <x-input :disabled="actab=='-1'" type="tel" ref="money" @on-change="priceOnchange" required v-model="tixianPrice" title="￥"></x-input>
          <cell :inline-desc="'可提现余额:'+enablePrice">
            <span style="color:red" v-if="tixianPrice>enablePrice"  slot="inline-desc">金额已超过可提现金额</span>
          </cell>
        </group>
        <div style="margin:10px">
          <x-button type="primary" @click.native="qTixian()" :disabled="myitem.value==0||tixianPrice==0||tixianPrice>enablePrice">确认提现</x-button>
        </div>
      </div>
    </popup>
  </div>
  <div v-transfer-dom>
    <popup position="right" v-model="showInfo" width="100%" height="100%">
      <div class="popup2">
        <x-header :left-options="{preventGoBack:true}" @on-click-back="showInfo= false">提现
        </x-header>
        <msg title="提现申请已提交" :buttons="buttons" :icon="icon">
          <group slot="description">
            <cell-form-preview :list="info"></cell-form-preview>
          </group>
        </msg>
      </div>
    </popup>
  </div>
  <div v-transfer-dom>
    <popup position="right" v-model="Addalipaypopup" width="100%" height="100%">
      <div class="Addalipaypopup">
        <x-header :left-options="{preventGoBack:true}" @on-click-back="Addalipaypopup= false">添加{{myitem.label}}账号</x-header>
        <group>
          <x-input title="收款人" disabled v-model="addAlipay.name"></x-input>
          <x-input :title="myitem.label+'账号'" v-model="addAlipay.account" required></x-input>
        </group>
        <div style="margin:10px">
          <x-button type="primary"  @click.native="addAlipayaccount();Addalipaypopup= false">添加</x-button>
        </div>
      </div>
    </popup>
  </div>
</div>
</template>
<style>
.popup1 .weui-label {
  font-size: 30px;
}

.tixian .flex-content {
  background: rgb(238, 238, 238);
}

.popup1 .weui-cell__primary {
  font-size: 30px;
}
</style>
<script>
import {
  Cell,
  Msg,
  Group,
  XSwitch,
  XInput,
  XHeader,
  XButton,
  Flexbox,
  FlexboxItem,
  CellFormPreview,
  TransferDom,
  Popup
} from 'vux'


export default {
  directives: {
    TransferDom
  },
  components: {
    Cell,
    XSwitch,
    XInput,
    XHeader,
    XButton,
    Msg,
    Flexbox,
    FlexboxItem,
    CellFormPreview,
    TransferDom,
    Popup,
    Group,
  },
  methods: {
    getMoney(){
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.get('http://sd.a10store.com/api/user.center.money.info.get.php', {}).then(res => {
        this.$vux.loading.hide()
        this.personPrice = res.body;
        this.enablePrice = this.personPrice.list[0].value
      }, res => {
        this.$vux.toast.show({
          text: '加载数据失败!',
          type: 'cancel',
          position: 'middle'
        })
        this.$vux.loading.hide()
      })
    },
    setFocus(t) {
      console.log(t);
    },
    qTixian() {
      this.icon = 'waiting'
      this.$http.post('http://sd.a10store.com/api/user.center.money.tixian.php', {
        price:this.tixianPrice,type:this.myitem.label
      }).then(res => {
        this.$vux.toast.text('提交成功~', 'middle')
        this.showInfo = true
        this.info = res.body.list
        this.getMoney()
        // this.itemforButton = true
      }, res => {

      })

    },
    priceOnchange(val){
    },
    addAlipayaccount(){
      this.$http.post('http://sd.a10store.com/API/user.center.money.zfb.add.php', {
        addalipay:this.addAlipay,type:this.myitem.label
      }).then(res => {
        this.tixian()
        this.$vux.toast.text('添加成功~', 'middle')
        // this.itemforButton = true
        this.Addalipaypopup = false
      }, res => {

      })
    },
    changeTab(item, index) {
      this.actab = index
      this.myitem = item
      // this.info[1].label = item.label
      console.log(this.info);
        if(item.value==0){
          this.$vux.toast.text('您还没有绑定'+item.label+'账号~', 'middle')
          this.Addalipaypopup = true
          // this.itemforButton = false
          this.$http.post('http://sd.a10store.com/api/user.center.info.account.zfb.get.php', {}).then(res => {
            if (res.body.name == "缺失") {
              this.$vux.toast.text('请完善真实姓名~', 'middle')
              this.$router.push('person')
            }else {
              this.addAlipay.name = res.body.name
            }
          }, res => {

          })
        }
    },
    changeIcon() {
      this.showInfo = false
      this.getMoney()
      this.tixianPrice = ''
    },
    tixian() {
      this.showTixian = true;
      var that = this
      this.$http.post('http://sd.a10store.com/api/user.center.money.account.get.php', {}).then(res => {
        console.log(res.body);
        this.tixianlist = res.body
      }, res => {})

      // console.log(this.personPrice.list[0]);
      this.$nextTick(() => {
        that.$refs.money.$refs.input.focus()
      })
      // this.$refs.money.$refs.input.focus()
      // console.log(this.$refs.money.$refs);
    }
  },
  mounted() {
    this.getMoney()
  },
  data() {
    return {
      enablePrice: '',
      showTixian: false,
      myitem:'',
      tixianPrice: '',
      showInfo: false,
      itemforButton:false,
      Addalipaypopup: false,
      icon: '',
      actab: -1,
      buttons: [{
        type: 'primary',
        text: '完成',
        onClick: this.changeIcon.bind(this)
      }],
      addAlipay: {
        name:'',
        account:''
      },
      tixianlist: {
        "info": "获取账号信息",
        "account": [{
          "label": "支付宝",
          "value": 1
        }, {
          "label": "银行卡",
          "value": 0
        }, {
          "label": "微信",
          "value": 0
        }]
      },
      personPrice: {
        "list": [{
          "label": "可提现金额",
          "value": "120"
        }, {
          "label": "佣金",
          "value": "210"
        }, {
          "label": "本金",
          "value": "1728.4"
        }, {
          "label": "佣金(冻结)",
          "value": "36"
        }, {
          "label": "本金(冻结)",
          "value": "305.8"
        }],
        "yue": "341.80元",
        "mes": "更新成功"
      },
      info: [{
        "label": "预计到账时间",
        "value": "2017-06-13 16:40:44"
      }, {
        "label": "储蓄卡",
        "value": "招商银行 尾号6785"
      }, {
        "label": "提现金额",
        "value": "33.29元"
      }]
    }
  }
}
</script>
