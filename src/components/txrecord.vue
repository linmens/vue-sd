<template>
<div>
    <sticky scroll-box="vux_view_box_body" :offset="46">
      <flexbox class="du-header">

          <flexbox-item style="border-right: 1px dotted rgba(255, 255, 255, 0.33);"><div class="flex-demo">
            <div class="labesppan">提现中(元)</div>
            <div>{{record.intixian}}</div>
          </div></flexbox-item>
          <flexbox-item>  <div class="labesppan">已提现(元)</div>
            <div>{{record.yitixian}}</div></flexbox-item>
        </flexbox>
      <button-tab v-model="demo01" style="padding: 10px;background:white;box-shadow: 0 4px 5px -3px hsl(0, 0%, 65%);">
         <button-tab-item v-for="(t,index) in record.tabs" :key="index" @on-item-click="consoleIndex()">{{t}}</button-tab-item>
       </button-tab>
    </sticky>
  <group  title="红色为提现中">
    <x-table :cell-bordered='false' >
      <thead>
        <tr>
          <th  :key="index" v-for="(th,index) in record.thead">{{th.label}} </th>
          <!-- :style="{width:viewWidth+'px'}" -->

        </tr>
      </thead>
      <tbody>
        <tr @click="toDetail(tr)" v-for="(tr,index) in record.list" :key="index">
          <td>{{tr.time}}</td>
          <td :class="{hastuikuan:tr.status=='有退款'}">{{tr.pay}}</td>
          <td>{{tr.status}}</td>
        </tr>
      </tbody>
    </x-table>
  </group>
</div>
</template>
<style>
.noMargin .weui-cells {
  margin-top: 0
}
</style>
<script>
import {
  Cell,
  Sticky,
  Scroller,
  Group,
  XInput,
  XHeader,
  XButton,XTable,
  CellFormPreview,
  TransferDom,Spinner,ButtonTab, ButtonTabItem,
  Popup,Flexbox, FlexboxItem,
  Picker
} from 'vux'


export default {
  directives: {
    TransferDom
  },
  components: {
    Cell,
    XInput,
    XHeader,XTable,
    XButton,Spinner,ButtonTab, ButtonTabItem,Flexbox, FlexboxItem,
    Sticky,
    Scroller,
    Picker,
    CellFormPreview,
    TransferDom,
    Popup,
    Group,
  },
  methods: {

    consoleIndex () {
        this.loadList()
      },
    loadList() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.post('http://sd.a10store.com/api/user.center.money.tixian.history.php', {tabs:this.record.tabs[this.demo01]}).then(res => {
        this.$vux.loading.hide()
        this.record = res.body;
      }, res => {
        this.showYear = false;
        this.$vux.toast.show({
          text: '加载数据失败!',
          type: 'cancel',
          position: 'middle'
        })
        this.$vux.loading.hide()
      })

    },
  },
  mounted() {
    this.loadList()
  },
  data() {
    return {
      list: [],
      demo01:0,
      record: {
        tabs:['全部','提现中','已提现'],
        intixian:'222',
        thead:['提现时间','提现金额','提现状态'],
        yitixian:'1',
        "list": [{
          "time": "佣金",
          "pay": "13.29元",
          status:'tixianzhong',

        },{
          "time": "佣金",
          "pay": "13.29元",
          status:'tixianzhong',
        },{
          "time": "佣金",
          "pay": "13.29元",
          status:'tixianzhong',
        },{
          "time": "佣金",
          "pay": "13.29元",
          status:'tixianzhong',
        },],
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
