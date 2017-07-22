<template>
<div class="mui-scrollspy duizhang ">
  <flexbox class="du-header">
    <!-- <flexbox-item :span="3" style="border-right: 1px dotted rgba(255, 255, 255, 0.33);">
      <div class="labesppan">{{splitMonth.y}}年</div>
      <div @click="show7 = true">{{splitMonth.m}}月
        <icon name="calendar"></icon>
      </div>
    </flexbox-item> -->
    <flexbox-item>
      <div class="flex-demo">
        <div class="labesppan">销售金额(元)</div>
        <div>{{duizhanglist.money_pay}}</div>
      </div>
    </flexbox-item>
    <flexbox-item>
      <div class="labesppan">回款金额(元)</div>
      <div>{{duizhanglist.money_huikuan}}</div>
    </flexbox-item>
  </flexbox>
  <button-tab v-model="demo01" style="    z-index: 500;
    position: relative;padding: 10px;background:white;box-shadow: 0 4px 5px -3px hsl(0, 0%, 65%);">
    <button-tab-item v-for="(t,index) in duizhanglist.tabs" :key="index" @on-item-click="consoleIndex()">{{t}}</button-tab-item>
  </button-tab>
  <group gutter="0">
    <cell @click.native="timefilter = !timefilter;ilength=0">
      <span slot="title">{{dateFilter.starttime}}~{{dateFilter.endtime}}<span v-show="ilength==1">{{dateFilter.text}}</span>
      <span v-show="ilength==0">{{dateFilter.text}}</span>
      <icon name="caret-down"></icon>
      </span>
      <span slot="value" class="chevron">
      <icon name="chevron-left" scale="1"  @click.native.stop="addDate" ></icon>
      <icon name="chevron-right" scale="1" @click.native.stop="nextWeek" :class="{disabled:ilength==0}" ></icon></span>
    </cell>
    <cell v-show="timefilter">
      <div slot="title">
        <span class="timefilter" @click="toTimefilter(t)" v-for="t in ['全部','月','周']" :class="{active:activeTime==t}">{{t}}</span>
      </div>
    </cell>
  </group>
  <!-- <Page ref="page" :page-num="pageNum" :current-page="currentPage" @change="pagechange"></Page> -->
  <scroller lock-y scrollbar-x :height="wrapperHeight-38+'px'">
    <div class="box1" ref="wrapper" :style="{width:viewWidth*duizhanglist.thead.length + 'px',position: 'relative'}">
      <x-table :cell-bordered='false'>
        <thead>
          <tr>
            <th :style="{width:viewWidth + 'px'}" :key="index" v-for="(th,index) in duizhanglist.thead">{{th}} </th>
          </tr>
        </thead>
        <tbody>
          <tr class="tabletd" @click="toDetail(tr)" v-for="(tr,index) in duizhanglist.list" :key="index">
            <td :style="{width:viewWidth + 'px'}">{{tr.time}}</td>
            <td :style="{width:viewWidth + 'px'}">{{tr.money_pay}}</td>
            <td :style="{width:viewWidth + 'px'}">{{tr.money_shouhou}}</td>
            <td :style="{width:viewWidth + 'px'}">{{tr.money_huikuan}}</td>
            <td :style="{width:viewWidth + 'px'}">{{tr.order_state_xs}}</td>
          </tr>
        </tbody>
      </x-table>
    </div>
  </scroller>
  <group gutter="0">
    <div class="weui-cell" style="background:white">
      <div>
        <!-- <p class="">数量</p> -->
      </div>
      <div class="weui-cell__ft vux-cell-primary" style="font-size: 0px;">
        <div style="float: right;">
          <a class="vux-number-selector vux-number-selector-sub" @click="pagesub" :class="{disabled:currentPage==1}">
            <icon name="chevron-left" scale="1"></icon>
          </a>
          <input pattern="[0-9]*" type="number" class="vux-number-input" v-model="currentPage" style="width: 50px;">
          <a class="vux-number-selector vux-number-selector-plus" @click="pageplus" :class="{disabled:currentPage>=pageNum}">
            <icon name="chevron-right" scale="1"></icon>
          </a>
        </div>
      </div>
      <div class="weui-cell__ft vux-cell-primary" style="display: none;">
        10
      </div>
    </div>
  </group>

  <div v-transfer-dom>
    <popup v-model="showDetail" position="right" width="100%">
      <div>
        <x-header class="white-header" title="详情" style="width:100%;background:white;position:absolute;left:0;top:0;z-index:100;">
          <span slot="overwrite-left" @click="showDetail=false">
          <a class="white-header-back" >返回</a> <div class="white-left-arrow"></div>
          </span>
        </x-header>
        <form-preview style=" padding-top: 46px;" :header-label="(formheader.label)" :header-value="'¥'+formheader.value" :body-items="list"></form-preview>
      </div>
    </popup>
  </div>

</div>
</template>

<style lang="css">
.tabletd{
  height: 40px;
  word-break:keep-all;           /* 不换行 */
white-space:nowrap;          /* 不换行 */
overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
text-overflow:ellipsis;
}
.tabletd td{
  font-size: 12px;

}
/*@import '~vux/src/styles/close.less';*/
.timefilter{
      padding-right: 30px;
}
.timefilter.active{
  color: #d43c33
}
.group-title{
  padding: 10px;
color: gray;
font-size: 15px;

}
.chevron svg{
  margin-left: 20px
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
    background: white;
    margin-top: 10px

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
  Popup,
  TransferDom,
  Radio,
  XButton,
  ButtonTab,
  ButtonTabItem,
  XHeader,
  Popover,
  Cell,
  Flexbox,
  FlexboxItem,
  XDialog,
  XInput,
  Scroller,
  Sticky,
  Search,
  Tab,
  TabItem,
  XTable,
  FormPreview
} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    Popup,
    Popover,
    XButton,
    Flexbox,
    FlexboxItem,
    ButtonTab,
    ButtonTabItem,
    FormPreview,
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
      dateFilter: {
        starttime: '',
        endtime: '',
        text: '本周'
      },
      activeTime: '周',
      timefilter: false,
      showDetail: false,
      wrapperHeight: '',
      ilength: 0,
      demo01: 0,
      show7: false,
      pageNum: 5, //总页码
      currentPage: 1, //当前页

      formheader: {
        value: '',
        label: '付款金额'
      },
      sCrolleft: '',
      splitMonth: {
        y: '',
        m: ''
      },
      monthVal: '',
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
        list_num: '20',
        benjin: '2',
        yongjin: '13213',
        money_huikuan:'2222',
        money_pay:'212121',
        "tabs": [
      "全部",
      "已付款",
      "已发货",
      "交易成功",
      "可提现"
  ],
        "data": ['1', '2', '3', '4', '5', '6', '7', '8'],
        "thead": [
        "日期",
        "支付金额",
        "售后退款",
        "实际收款",
        "交易状态"
    ],
        "list": [],
      }
    }
  },
  watch: {
    currentPage(newindex, oldindex) {
      console.log(newindex);
      this.currentPage = newindex
      this.getduizhangApi()
      this.ilength = 0
    }
  },
  methods: {
    toTimefilter(item) {
      this.activeTime = item

      this.addDate('month')
    },
    pageplus() {
      if (this.currentPage < this.pageNum) {
        this.currentPage++
      } else {
        return
      }
    },
    pagesub() {
      if (this.currentPage == 1) {
        return
      } else {
        this.currentPage--
      }
    },
    pagechange(index) {
      this.currentPage = index;
      this.getduizhangApi();
    },
    formatDate(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();

      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return (myyear + "-" + mymonth + "-" + myweekday);
    },

    addDate: function(type) {
      var now = new Date(); //当前日期
      var nowDayOfWeek = now.getDay(); //今天本周的第几天
      var nowDay = now.getDate(); //当前日
      var nowMonth = now.getMonth(); //当前月
      var nowYear = now.getYear(); //当前年
      nowYear += (nowYear < 2000) ? 1900 : 0; //
      if (type == "month") {
        this.ilength = 0
      } else {
        this.ilength = this.ilength + 1
      }
      if (this.activeTime == '周') {
        //获得上周的开始日期
        console.log(this.ilength);
        if (this.ilength == 0) {
          this.dateFilter.text = "本周"
        } else if (this.ilength == 1) {
          this.dateFilter.text = "上周"
        }
        this.getUpWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - this.ilength * 7);
        this.dateFilter.starttime = this.formatDate(this.getUpWeekStartDate);

        //获得上周的结束日期
        this.getUpWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek - this.ilength * 7));
        this.dateFilter.endtime = this.formatDate(this.getUpWeekEndDate);
      } else if (this.activeTime == '月') {
        if (this.ilength == 0) {
          this.dateFilter.text = "本月"
        } else if (this.ilength == 1) {
          this.dateFilter.text = "上月"
        }
        var lastMonthDate = new Date(); //上月日期
        // lastMonthDate.setMonth(lastMonthDate.getMonth()-this.ilength);
        function getDaysInOneMonth(year, month) {
          var d = new Date(year, month, 0);
          console.log(month);
          // console.log(d.getDate()+'tian');
          return d.getDate();
        }
        console.log('上月' + (nowMonth + 1 - this.ilength));
        //获得上月开始时间
        var getLastMonthStartDate = new Date(nowYear, nowMonth - this.ilength, 1);
        this.dateFilter.starttime = this.formatDate(getLastMonthStartDate);
        //获得上月结束时间
        var getLastMonthEndDate = new Date(nowYear, nowMonth - this.ilength, getDaysInOneMonth(nowYear, nowMonth + 1 - this.ilength));
        this.dateFilter.endtime = this.formatDate(getLastMonthEndDate);
        console.log(this.dateFilter);
      }
      this.getduizhangApi()
    },
    nextWeek: function() {
      var now = new Date(); //当前日期
      var nowDayOfWeek = now.getDay(); //今天本周的第几天
      var nowDay = now.getDate(); //当前日
      var nowMonth = now.getMonth(); //当前月
      var nowYear = now.getYear(); //当前年
      nowYear += (nowYear < 2000) ? 1900 : 0; //
      this.ilength = this.ilength - 1
      if (this.ilength < 0) {
        return this.ilength = 0
      } else if (this.activeTime == '周') {
        console.log(this.ilength);
        //获得上周的开始日期
        if (this.ilength == 0) {
          this.dateFilter.text = "本周"
        } else if (this.ilength == 1) {
          this.dateFilter.text = "上周"
        }
        var getUpWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - this.ilength * 7);
        this.dateFilter.starttime = this.formatDate(getUpWeekStartDate);

        //获得上周的结束日期
        var getUpWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek - this.ilength * 7));
        this.dateFilter.endtime = this.formatDate(getUpWeekEndDate);

      } else if (this.activeTime == '月') {
        if (this.ilength == 0) {
          this.dateFilter.text = "本月"
        } else if (this.ilength == 1) {
          this.dateFilter.text = "上月"
        }

        function getDaysInOneMonth(year, month) {
          var d = new Date(year, month, 0);
          return d.getDate();
        }
        //获得上月开始时间
        var getLastMonthStartDate = new Date(nowYear, nowMonth - this.ilength, 1);
        this.dateFilter.starttime = this.formatDate(getLastMonthStartDate);
        //获得上月结束时间
        var getLastMonthEndDate = new Date(nowYear, nowMonth - this.ilength, getDaysInOneMonth(nowYear, nowMonth + 1 - this.ilength));
        this.dateFilter.endtime = this.formatDate(getLastMonthEndDate);
        console.log(this.dateFilter);
      } else {

      }
      this.getduizhangApi()

    },
    toDetail(tr) {

      if (window.location.host == 'localhost:8081') {
        this.showDetail = true
      } else {
        this.$vux.loading.show({
          text: '加载中...'
        })
        this.$http.post('http://sd.a10store.com/api/user.center.money.duizhang.detail.php', {
          order_id_jh: tr.order_id_jh
        }).then(res => {
          this.formheader.value = tr.pay
          this.showDetail = true
          this.list = res.body.list
          this.$vux.loading.hide()
        }, res => {
          this.$vux.loading.hide()
        })
      }
    },
    consoleIndex() {
      // console.log( )
      this.getduizhangApi()
    },
    monthChange(val) {
      this.monthVal = val
      this.splitMonth = {
        y: val.substr(0, 4),
        m: val.substring(5, 7)
      }
      this.getduizhangApi();
      this.show7 = false
    },
    upPage() {
      if (this.page < this.duizhanglist.list_num) {
        this.page = this.page + 1
      } else {

        return
      }
    },
    changePage(type) {
      if (type == 'low' && this.page > 1) {
        this.page = this.page - 1
      } else {
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
      // console.log('222',this.wrapperHeight)
      this.$http.post('http://sd.a10store.com/api/shop.money.duizhang.php', {
        tab: this.duizhanglist.tabs[this.demo01],
        page: this.currentPage,
        dateFilter: this.dateFilter,
        timeType:this.activeTime,
        Perpage: (this.wrapperHeight - 48-40) / 40
      }).then(res => {
        console.log(res);
        this.pageNum = res.body.page_no
        this.duizhanglist = res.body
        this.$vux.loading.hide()
      }, res => {
        this.$vux.loading.hide()
      })
    }
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    console.log(this.wrapperHeight);
    if(window.location.host=='localhost:8081'){
      this.duizhanglist.list = [{
        "time": "2017-07-14",
        "money_pay": "98.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已付款已付款已付款已付款已付款"
      }, {
        "time": "2017-07-14",
        "money_pay": "19.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已付款"
      }, {
        "time": "2017-07-14",
        "money_pay": "29.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已发货"
      }, {
        "time": "2017-07-14",
        "money_pay": "19.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "缺失"
      }, {
        "time": "2017-07-14",
        "money_pay": "66.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已发货"
      }, {
        "time": "2017-07-14",
        "money_pay": "38.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已发货"
      }, {
        "time": "2017-07-14",
        "money_pay": "9.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已发货"
      }, {
        "time": "2017-07-14",
        "money_pay": "152.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已发货"
      }, {
        "time": "2017-07-14",
        "money_pay": "19.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已发货"
      }, {
        "time": "2017-07-14",
        "money_pay": "0.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "缺失"
      }, {
        "time": "2017-07-14",
        "money_pay": "0.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "缺失"
      }, {
        "time": "2017-07-14",
        "money_pay": "29.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已发货"
      }, {
        "time": "2017-07-14",
        "money_pay": "9.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已发货"
      }, {
        "time": "2017-07-14",
        "money_pay": "9.00",
        "money_shouhou": "0",
        "money_huikuan": "0",
        "order_state_xs": "已付款"
      }]
    }

    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.boxWidth = w
    this.viewWidth = w / 3
    this.addDate()
  }
}
</script>
