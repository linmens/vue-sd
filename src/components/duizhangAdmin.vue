<template>
<div class="mui-scrollspy duizhang " ref="wrapper">
  <!-- <div class="mui-scrollspy-text" v-if="isopen">切换</div> -->
  <!-- <a ref="scrollspybtn" href="javascript:;" class="mui-scrollspy-btn" :style="{'z-index':zIndex}" @click="toopenTab">  <img v-if="!isopen" width="22" height="44" src="../svg/up.svg"/>
        <img v-if="isopen" width="22" height="44" src="../svg/down.svg"/>
      </a> -->
  <!-- <div style="height:44px;position: relative;">
    <sticky scroll-box="vux_view_box_body" class="mui-scrollspy" :offset="46" :check-sticky-support="false">

    </sticky>
  </div> -->
  <search @on-change="onChange" :auto-fixed="false" placeholder="输入会员名" @on-submit="onSubmit" v-model="search" @on-focus="onFocus"></search>
  <group>
    <cell >
      <div slot="title">
        {{page}} / {{duizhanglist.list_num}}
      </div>
      <div slot="value" style="display:inline-block">

        <icon class="fa-icon" @click.native="changePage('low')" :class="{'disabled':page==1}" name="angle-left" scale="1.8" ></icon>
        <icon class="fa-icon" @click.native="upPage()"  :class="{'disabled':page==duizhanglist.list_num}" name="angle-right" scale="1.8"></icon>
      </div>
    </cell>
  </group>
  <group title="红色数字为合计">
    <cell value="<<< 左右滑动"></cell>
    <scroller scrollbar-x lock-y class="scrollspy-iscroll" :style="{height:wrapperHeight+'px'}" @on-scroll="onScroll" ref="scroller">
      <div class="box1" :style="{width:boxWidth + 'px'}" ref="wrapperTable">
        <x-table :cell-bordered='false'  >
          <thead>
            <tr>
              <th :style="{width:viewWidth+'px'}" :key="index" v-for="(th,index) in duizhanglist.thead">{{th.label}}  <span style="color:red">({{th.num}})</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tr,index) in duizhanglist.list" :key="index">
              <td v-clipboard:success="onCopy" v-clipboard:copy="tr.order_id_jh">{{tr.order_id_jh}}<img width="18" height="18" src="../svg/复制.svg" /></td>
              <td>{{tr.buyer_nick_jh}}</td>
              <td>{{tr.price_jh}}</td>
              <td>{{tr.price_sjzf_jh}}</td>
              <td class="font-green">- {{tr.price_tuikuan_jh}}</td>
              <td>{{tr.sd_order_state}}</td>
              <td>{{tr.sd_yongjin}}</td>
              <td>{{tr.lirun}}</td>
              <td v-clipboard:success="onCopy" v-clipboard:copy="tr.order_id_xs">{{tr.order_id_xs}}<img width="18" height="18" src="../svg/复制.svg" /></td>
              <td >{{tr.order_state_xs}}</td>
              <td>{{tr.price_xs}}</td>
              <td>{{tr.price_sjzf_xs}}</td>
              <td class="font-green">- {{tr.price_tuikuan_xs}}</td>
            </tr>
          </tbody>
        </x-table>

        <!-- <div class="box1-item" :class="{itemselected:tabs==index}" :style="{width:viewWidth + 'px'}" v-for="(item, index) in orderlist.num" :key="index" @click="onItemClick(item,index)">
            <icon name="map-marker" class="mapicon" v-if="tabs == index"></icon>
            <span>{{item.item}} {{item.num}}</span></div> -->
      </div>
    </scroller>
  </group>


</div>
</template>

<style scoped lang="less">@import '~vux/src/styles/1px.less';
.fa-icon {
  width: 50px;
  height: 1em; /* or any other relative font sizes */
}
.disabled{
  color: gray
}
// .duizhang {
//     margin-top: 10px;
// }
.duizhang .scrollspy-iscroll {
    height: auto;
    box-shadow: none;
}
// .duizhang .vux-table {
//     padding: 10px;
//
// }
.duizhang .vux-table::after {
    border: 0!important;
}
.font-green{
  color: green
}
.duizhang .vux-table th {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
}
// body {
//     background: rgba(209, 219, 229, 0.15);
// }

.duizhang .box1 {
    padding: 0;
}
</style>
<script>
import {
  debounce
} from 'vux'
import {
  Group,
  Popup,
  XHeader,
  Popover,
  Cell,
  XDialog,
  XInput,
  Scroller,
  Sticky,
  Search,
  Tab,
  TabItem,
  XTable
} from 'vux'
export default {
  components: {
    Group,
    Popup,
    XHeader,
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
      wrapperHeight: '',
      results: [],
      autoFixed: false,
      search: '',
      page:1,
      sCrolleft: '',
      duizhanglist: {
        list_num:'20',
        "thead": [{
          "label": "订单编号",
          "num": "12345"
        }, {
          "label": "买家会员名",
          "num": "12345"
        }, {
          "label": "总金额",
          "num": "12345"
        }, {
          "label": "订单支付金额",
          "num": "12345"
        }, {
          "label": "订单退款金额",
          "num": "12345"
        }, {
          "label": "佣金",
          "num": "12345"
        },{
            "label": "订单编号",
            "num": "12345"
          }, {
            "label": "订单状态",
            "num": "12345"
          }, {
            "label": "总金额",
            "num": "12345"
          }, {
            "label": "订单支付金额",
            "num": "12345"
          }, {
            "label": "订单退款金额",
            "num": "12345"
          }],
      "list": [{
        "order_id_jh": "22003582563740426",
        "price_jh": "12.79",
        "price_sjfk_jh": "12.79",
        "price_tk_jh": "12.79",
        "money_ktx_jh": "12.79",
      }, {
        "order_id_jh": "22003582563740426",
        "price_jh": "17.21",
        "price_sjfk_jh": "17.21",
        "price_tk_jh": "17.21",
        "money_ktx_jh": "17.21",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "24.21"
      }, {
        "order_id_jh": "22002502334740426",
        "price_jh": "50.00",
        "price_sjfk_jh": "50.00",
        "price_tk_jh": "50.00",
        "money_ktx_jh": "50.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "57"
      }, {
        "order_id_jh": "19870421107168430",
        "price_jh": "126.00",
        "price_sjfk_jh": "126.00",
        "price_tk_jh": "126.00",
        "money_ktx_jh": "126.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "133"
      }, {
        "order_id_jh": "21885041140740426",
        "price_jh": "128.00",
        "price_sjfk_jh": "128.00",
        "price_tk_jh": "128.00",
        "money_ktx_jh": "128.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "135"
      }, {
        "order_id_jh": "21855923634339302",
        "price_jh": "150.00",
        "price_sjfk_jh": "150.00",
        "price_tk_jh": "150.00",
        "money_ktx_jh": "150.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "157"
      }, {
        "order_id_jh": "21859782708339302",
        "price_jh": "14.00",
        "price_sjfk_jh": "14.00",
        "price_tk_jh": "14.00",
        "money_ktx_jh": "14.00",
        "sd_yongjin": "3.50",
        "money_ktx_all_jh": "17.5"
      }, {
        "order_id_jh": "21859782708339302",
        "price_jh": "14.00",
        "price_sjfk_jh": "14.00",
        "price_tk_jh": "14.00",
        "money_ktx_jh": "14.00",
        "sd_yongjin": "3.50",
        "money_ktx_all_jh": "17.5"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "21879201140339302",
        "price_jh": "15.00",
        "price_sjfk_jh": "15.00",
        "price_tk_jh": "15.00",
        "money_ktx_jh": "15.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "22"
      }, {
        "order_id_jh": "21863582561740426",
        "price_jh": "9.90",
        "price_sjfk_jh": "9.90",
        "price_tk_jh": "9.90",
        "money_ktx_jh": "9.90",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "16.9"
      }, {
        "order_id_jh": "21522262946740426",
        "price_jh": "77.00",
        "price_sjfk_jh": "77.00",
        "price_tk_jh": "77.00",
        "money_ktx_jh": "77.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "84"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "21492100004740426",
        "price_jh": "15.00",
        "price_sjfk_jh": "15.00",
        "price_tk_jh": "15.00",
        "money_ktx_jh": "15.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "22"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "20468123118740426",
        "price_jh": "245.00",
        "price_sjfk_jh": "245.00",
        "price_tk_jh": "245.00",
        "money_ktx_jh": "245.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "252"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "20438720565740426",
        "price_jh": "29.00",
        "price_sjfk_jh": "29.00",
        "price_tk_jh": "29.00",
        "money_ktx_jh": "29.00",
        "sd_yongjin": "7.00",
        "money_ktx_all_jh": "36"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }, {
        "order_id_jh": "缺失",
        "price_jh": "0.00",
        "price_sjfk_jh": "0.00",
        "price_tk_jh": "0.00",
        "money_ktx_jh": "0.00",
        "sd_yongjin": "0.00",
        "money_ktx_all_jh": "0"
      }],
    }
  }
},
watch:{
  page(){
    this.getduizhangApi()
  }
},
methods: {
  resultClick (item) {
      window.alert('you click the result item: ' + JSON.stringify(item))
    },
    onChange: debounce(function() {
      console.log(this.search);
      this.getduizhangApi()
    }, 500),
    onCopy: function(e) {
      this.$vux.toast.text('复制成功!', 'top')
    },
    onSubmit (val) {
      window.alert('on submit' + val)
    },
    onCancel () {
      console.log('on cancel')
    },
    onFocus () {
      console.log('on focus')
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
      this.$http.post('http://sd.a10store.com/api/admin.money.duizhang.php',{search:this.search,page:this.page,perPage:(this.wrapperHeight-50)/40}).then(res => {
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
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapperTable.getBoundingClientRect().top ;
    console.log(this.wrapperHeight);

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
