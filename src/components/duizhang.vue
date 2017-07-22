<template>
<div class="mui-scrollspy duizhang " >
  <flexbox class="du-header">
      <flexbox-item :span="3" style="border-right: 1px dotted rgba(255, 255, 255, 0.33);">
        <div class="labesppan">{{splitMonth.y}}年</div>
        <div @click="show7 = true">{{splitMonth.m}}月<icon name="calendar"></icon></div>
      </flexbox-item>
      <flexbox-item><div class="flex-demo">
        <div class="labesppan">本金(元)</div>
        <div>{{duizhanglist.benjin}}</div>
      </div></flexbox-item>
      <flexbox-item>  <div class="labesppan">佣金(元)</div>
        <div>{{duizhanglist.yongjin}}</div></flexbox-item>
    </flexbox>
    <button-tab v-model="demo01" style="    z-index: 500;
    position: relative;padding: 10px;background:white;box-shadow: 0 4px 5px -3px hsl(0, 0%, 65%);">
       <button-tab-item v-for="(t,index) in duizhanglist.tabs" :key="index" @on-item-click="consoleIndex()">{{t}}</button-tab-item>
     </button-tab>

<div v-transfer-dom>
   <popup v-model="showDetail" position="right" width="100%">
     <div>
       <x-header  class="white-header" title="详情" style="width:100%;background:white;position:absolute;left:0;top:0;z-index:100;">
          <span slot="overwrite-left" @click="showDetail=false">
          <a class="white-header-back" >返回</a> <div class="white-left-arrow"></div>
          </span>
       </x-header>
       <form-preview style=" padding-top: 46px;" :header-label="(formheader.label)" :header-value="'¥'+formheader.value" :body-items="list"></form-preview>
             </div>
</popup>
 </div>
     <popup v-model="show7" :height="40*duizhanglist.month.length+40+63+'px'" is-transparent>
       <div :style="{height:40*duizhanglist.month.length+40+63-20+'px'}"  style="width: 95%;background-color:#fff;margin:0 auto;border-radius:5px;padding-top:10px">
        <group>
          <radio @on-change="monthChange" title="title" :options="duizhanglist.month" v-model="monthVal"></radio>
        </group>
        <div style="padding:10px 15px;">
         <x-button @click.native="show7 = false">取消</x-button>
        </div>
       </div>
     </popup>
     <div class="thin-scroll"  ref="wrapper" :style="{height:wrapperHeight-7.7+'px','overflow-x': 'auto'}">
       <group  title="红色为订单内有退款">
         <x-table :cell-bordered='false' >
           <thead>
             <tr>
               <th  :key="index" v-for="(th,index) in duizhanglist.thead">{{th.label}} </th>
               <!-- :style="{width:viewWidth+'px'}" -->

             </tr>
           </thead>
           <tbody>
             <tr @click="toDetail(tr)" v-for="(tr,index) in duizhanglist.list" :key="index">
               <td>{{tr.month}}</td>
               <td :class="{hastuikuan:tr.type=='有退款'}">{{tr.pay}}</td>
               <td>{{tr.yongjin}}</td>
               <td>{{tr.status}}</td>
                <td>{{tr.status_neibu}}</td>
             </tr>
           </tbody>
         </x-table>
       </group>
     </div>



</div>
</template>

<style scoped lang="less">@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';

.group-title{
  padding: 10px;
color: gray;
font-size: 15px;

}


.fa-icon {
  width: 50px;
  height: 1em; /* or any other relative font sizes */
}
.disabled{
  color: gray
}

.duizhang .scrollspy-iscroll {
    height: auto;
    box-shadow: none;
}
.duizhang .vux-table {
    padding: 10px;

}
.duizhang .vux-table::after {
    border: 0!important;
}
.duizhang .vux-table th {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
}

.duizhang .box1 {
    padding: 0;
}
</style>
<script>
import {
  Group,
  Popup,TransferDom,Radio,XButton, ButtonTab, ButtonTabItem,
  XHeader,
  Popover,
  Cell,Flexbox, FlexboxItem,
  XDialog,
  XInput,
  Scroller,
  Sticky,
  Search,
  Tab,
  TabItem,
  XTable,FormPreview
} from 'vux'
export default {
  directives: {
   TransferDom
 },
  components: {
    Group,
    Popup,Popover,XButton,Flexbox, FlexboxItem, ButtonTab, ButtonTabItem,FormPreview,
    XHeader,
Radio,
    Popover,
    Cell,
    XDialog,
    XInput,
    Sticky,
    Scroller,
    Search,
    Tab,
    TabItem,
    XTable
  },
  data() {
    return {
      boxWidth: '',
      viewWidth: '',
      showDetail:false,
      wrapperHeight: '',
      page:1,
      demo01: 0,
      show7:false,
      formheader:{value:'',label:'付款金额'},
      sCrolleft: '',
      splitMonth:{y:'',m:''},
      monthVal:'',
      list: [{
       label: '商品',
       value: '电动打蛋机'
     }, {
       label: '标题标题',
       value: '名字名字名字'
     }, {
       label: '标题标题',
       value: '很长很长的名字很长很长的名字很长很长的名字很长很长的名字很长很长的名字'
     }],
      duizhanglist: {
        list_num:'20',
        benjin:'2',
        yongjin:'13213',
        tabs:['全部','已付款','已发货','交易成功'],
        month:['2017年06月','2017年05月','2017年06月','2017年06月','2017年06月'],
        "thead": [{
          "label": "日期",
          "num": ""
        }, {
          "label": "支付",
          "num": ""
        }, {
          "label": "佣金",
          "num": ""
        }, {
          "label": "交易状态",
          "num": ""
        },{
          "label": "交易状态",
          "num": ""
        }],
      "list": [{
        "month": "7月16日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
        type:'有退款'
      },{
        "month": "7月15日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月14日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月13日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月16日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月15日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月14日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月13日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月16日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月15日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月14日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月13日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月16日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月15日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月14日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },{
        "month": "7月13日",
        "pay": "12.79",
        "yongjin": "12.79",
        "status": "jiaoyi",
      },],
    }
  }
},

methods: {
  toDetail(tr){

    if(window.location.host=='localhost:8081'){
      this.showDetail = true
    }else {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.post('http://sd.a10store.com/api/user.center.money.duizhang.detail.php',
      {order_id_jh:tr.order_id_jh}).then(res => {
        this.formheader.value = tr.pay
        this.showDetail = true
        this.list = res.body.list
        this.$vux.loading.hide()
      }, res => {
        this.$vux.loading.hide()
      })
    }
  },
  consoleIndex () {
      // console.log( )
      this.getduizhangApi()
    },
  monthChange(val){
    this.monthVal = val
    this.splitMonth = {y:val.substr(0, 4),m:val.substring(5,7)}
    this.getduizhangApi();
    this.show7 = false
  },
  upPage(){
    if(this.page<this.duizhanglist.list_num){
      this.page = this.page+1
    }else {

      return
    }
  },
  changePage(type){
    if(type=='low'&&this.page>1){
      this.page = this.page-1
    }else {
      return
    }
  },
    onScroll(val) {
      this.sCrolleft = val.left
    },
    getduizhangApi() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      console.log(this.wrapperHeight/40);
      this.$http.post('http://sd.a10store.com/api/user.center.money.duizhang.php',
      {month:this.monthVal,tab:this.duizhanglist.tabs[this.demo01],page:this.page,perPage:(this.wrapperHeight-50)/40}).then(res => {
        console.log(res);
        this.duizhanglist = res.body
        this.$vux.loading.hide()
      }, res => {
        this.$vux.loading.hide()
      })
    }
  },
  mounted() {
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    // this.wrapperHeight = h - 46 - 48 -22
    // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapperTable.getBoundingClientRect().top ;
    // console.log(this.wrapperHeight);
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    var date=new Date;
    var month = ''
    if((date.getMonth()+1).toString().length==1){
      month = '0'+(date.getMonth()+1)
    }else {
      month = date.getMonth()+1
    }
    this.splitMonth = {y:date.getFullYear(),m:month}
    // console.log(month);
    //  this.monthVal = date.getFullYear()+'年'+month +'月'
    //  console.log( this.monthVal );
    this.getduizhangApi()
    if (w < 1024) {
      this.viewWidth = w / 2
      this.boxWidth = this.viewWidth * this.duizhanglist.thead.length - 20
    } else {
      this.boxWidth = w
    }
  }
}
</script>
