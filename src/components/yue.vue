<template>
<div>
  <group>
    <cell title="总余额账户(元)" >
      <span slot="value" class="weui-form-preview__btn_primary" style="font-size:24px">￥{{personPrice.yue}}</span>
    </cell>
    <cell-form-preview :list="personPrice.list"></cell-form-preview>
  </group>
  <group>
    <cell title="提现" is-link @click.native="tixian"></cell>
  </group>
  <div v-transfer-dom>
     <popup position="right" v-model="showTixian" height="100%">
       <div class="popup1">
           <x-header :left-options="{preventGoBack:true}" @on-click-back="showTixian= false">提现</x-header>
         <group>
           <cell title="提现金额"></cell>
           <x-input type="tel" ref="money" v-model="tixianPrice" title="￥"></x-input>
           <cell inline-desc="可提现余额:950">
              <span style="color:red" v-if="tixianPrice>950" slot="inline-desc">金额已超过可提现金额</span>
           </cell>
         </group>
         <div style="margin:10px" >
           <x-button type="primary" @click.native="qTixian()">确认提现</x-button>
         </div>
       </div>
     </popup>
   </div>
   <div v-transfer-dom>
      <popup position="top" v-model="showInfo" height="100%">
        <div class="popup2">
            <x-header :left-options="{preventGoBack:true}" @on-click-back="showInfo= false">提现</x-header>
              <msg title="提现申请已提交"  :buttons="buttons" :icon="icon">
                <group slot="description">
                  <cell-form-preview :list="info"></cell-form-preview>
                </group>
              </msg>
        </div>
      </popup>
    </div>

</div>
</template>
<style>
.popup1 .weui-label{
  font-size: 30px;
}
.popup1 .weui-cell__primary{
  font-size: 30px;
}
</style>
<script>
import {
  Cell,Msg,
  Group,XSwitch,XInput,XHeader,XButton,
  CellFormPreview,TransferDom,Popup
} from 'vux'


export default {
  directives: {
    TransferDom
  },
  components: {
    Cell,XSwitch,XInput,XHeader,XButton,Msg,
    CellFormPreview,TransferDom,Popup,
    Group,
  },
  methods:{
  setFocus(t){
    console.log(t);
  },
  qTixian(){
    console.log('res');

    this.showInfo = true
    this.icon = 'waiting'
  },
  changeIcon () {
    this.showInfo = false
    this.showTixian = false
    },
    tixian(){
      this.showTixian = true;
      var that = this
      this.$nextTick(() =>{
       that.$refs.money.$refs.input.focus()
   })
      // this.$refs.money.$refs.input.focus()
      // console.log(this.$refs.money.$refs);
    }
  },
  mounted() {
    // console.log();
    this.$vux.loading.show({
      text: '加载中...'
    })
    this.$http.get('http://sd.a10store.com/api/user.center.money.info.get.php', {}).then(res => {
      this.$vux.loading.hide()
      this.personPrice = res.body;
    }, res => {
      this.$vux.toast.show({
        text: '加载数据失败!',
        type: 'cancel',
        position: 'middle'
      })
      this.$vux.loading.hide()
    })
  },
  data() {
    return {
      showTixian:false,
      tixianPrice:'',
      showInfo:false,
      icon: '',
      buttons: [{
        type: 'primary',
        text: '完成',
        onClick: this.changeIcon.bind(this)
      }],
      personPrice: {
        "list": [{
          "label": "佣金",
          "value": "13.29元"
        }, {
          "label": "本金",
          "value": "23.29元"
        }, {
          "label": "本金(冻结中)",
          "value": "33.29元"
        }],
        "yue": "55"
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
