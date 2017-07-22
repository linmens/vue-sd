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
  <cell title="总纯利" value="20"></cell>
  <cell title="总佣金" value="20"></cell>
  <cell title="净利润" value="20"></cell>
</group>
<group>
  <cell>
    <template slot="value">
    <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="15"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageNum">
        </el-pagination>
      </template>
  </cell>

</group>
<div class="thin-scroll" ref="wrapperTable" style="margin-top:10px">
    <el-table
    v-loading.body="tableloading"
     :data="duizhanglist.list"
     :height="wrapperHeight"
     border
     :summary-method="getSummaries"
    show-summary
     style="width: 100%">
     <el-table-column
       prop="id"
       label="内部订单号"
       >
     </el-table-column>
     <el-table-column label="需求单" header-align="center">
       <el-table-column
         prop="price_xs"
         label="金额"

        >

       </el-table-column>
       <el-table-column
         prop="price_tuikuan_xs"
         label="退款金额"
         >
       </el-table-column>
       <el-table-column
         prop="price_sjzf_xs"
         label="支付金额"
        >
       </el-table-column>
       <el-table-column
         prop="price_shouhou_xs"
         label="售后金额"
         >
       </el-table-column>
       <el-table-column
         prop="order_state_xs"
         label="售卖状态"
         >
       </el-table-column>
       <el-table-column
         prop="zfb_money_xs"
         label="支付宝到账金额"
         >
       </el-table-column>

     </el-table-column>
     <el-table-column label="采购单" header-align="center">
       <el-table-column
         prop="price_jh"
         label="订单金额"
         >
       </el-table-column>
       <el-table-column
         prop="price_tuikuan_jh"
         label="退款金额"
         >
       </el-table-column>
       <el-table-column
         prop="price_sjzf_jh"
         label="支付金额"
         >
       </el-table-column>
       <el-table-column
         prop="price_shouhou_jh"
         label="售后金额"
         >
       </el-table-column>
       <el-table-column
         prop="order_state_jh"
         label="售卖状态"
         >
       </el-table-column>
       <el-table-column
         prop="zfb_money_jh"
         label="支付宝到账金额"
         >
       </el-table-column>

     </el-table-column>
     <el-table-column label="内部状态" header-align="center">
       <el-table-column
         prop="neibu_maoli"
         label="毛利"
         >
       </el-table-column>
       <el-table-column
         prop="neibu_yongjin"
         label="佣金"
         >
       </el-table-column>
       <el-table-column
         prop="neibu_yunfei"
         label="运费"
         >
       </el-table-column>
       <el-table-column
         prop="neibu_chunli"
         label="纯利"
         >
       </el-table-column>
       <el-table-column
         prop="neibu_jiesuan_state"
         label="结算"
         >
       </el-table-column>
       <el-table-column
         prop="neibu_jiesuan_time"
         label="结算时间"
         >
       </el-table-column>
     </el-table-column>
   </el-table>

</div>

</div>
</template>

<style scoped lang="less">@import '~vux/src/styles/1px.less';
.vux-number-selector svg {
    fill: currentColor;
}
.disabled {
    color: gray;
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

.font-green {
    color: green;
}
.duizhang .vux-table th {
    color: #999999;
    font-size: 12px;
    font-weight: 400;
}
.duizhang .vux-table td {
    font-size: 10px;
}


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
      tableloading:false,
      autoFixed: false,
      search: '',
      page: 1,
      pageNum: 50, //总页码
      currentPage: 1, //当前页
      sCrolleft: '',
      duizhanglist: {
        list_num: '20',

        total_list: ["总价", "1649 元", "866 元", "677 元", "0 元", "", "0 元", "628.9 元",
        "112.47999999999999 元", "574 元", "0 元", "", "0 元", "0 元", "56 元", "0 元", "0 元", "", ""],
        "list": [
       {
           "id": "1",
           "price_xs": "19.00",
           "price_tuikuan_xs": "19.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "12.79",
           "price_tuikuan_jh": "12.79",
           "price_sjzf_jh": "17.21",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "2",
           "price_xs": "29.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "29.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "17.21",
           "price_tuikuan_jh": "12.79",
           "price_sjzf_jh": "17.21",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "7.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "3",
           "price_xs": "58.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "58.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "50.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "50.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "7.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "4",
           "price_xs": "178.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "178.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "126.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "126.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "7.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "5",
           "price_xs": "158.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "158.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "128.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "128.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "7.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "6",
           "price_xs": "178.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "178.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "150.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "150.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "7.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "7",
           "price_xs": "19.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "19.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "14.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "28.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "3.50",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "8",
           "price_xs": "19.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "19.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "14.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "28.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "3.50",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "9",
           "price_xs": "168.00",
           "price_tuikuan_xs": "168.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "0.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "缺失",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "10",
           "price_xs": "68.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "0.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "缺失",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "11",
           "price_xs": "19.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "19.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "15.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "15.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "7.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "12",
           "price_xs": "19.00",
           "price_tuikuan_xs": "19.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "9.90",
           "price_tuikuan_jh": "9.90",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易关闭",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "13",
           "price_xs": "128.00",
           "price_tuikuan_xs": "128.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "77.00",
           "price_tuikuan_jh": "77.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易关闭",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "14",
           "price_xs": "178.00",
           "price_tuikuan_xs": "178.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "0.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "缺失",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "15",
           "price_xs": "98.00",
           "price_tuikuan_xs": "98.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "0.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "缺失",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "16",
           "price_xs": "168.00",
           "price_tuikuan_xs": "168.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "0.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "缺失",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "17",
           "price_xs": "19.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "19.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易成功",
           "zfb_money_xs": "0",
           "price_jh": "15.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "15.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "交易成功",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "7.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "18",
           "price_xs": "88.00",
           "price_tuikuan_xs": "88.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "0.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "缺失",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "19",
           "price_xs": "19.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "0.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "缺失",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       },
       {
           "id": "20",
           "price_xs": "19.00",
           "price_tuikuan_xs": "0.00",
           "price_sjzf_xs": "0.00",
           "price_shouhou_xs": "0.00",
           "order_state_xs": "交易关闭",
           "zfb_money_xs": "0",
           "price_jh": "0.00",
           "price_tuikuan_jh": "0.00",
           "price_sjzf_jh": "0.00",
           "price_shouhou_jh": "0.00",
           "order_state_jh": "缺失",
           "zfb_money_jh": "0",
           "neibu_maoli": "0",
           "neibu_yongjin": "0.00",
           "neibu_yunfei": "0",
           "neibu_chunli": "0",
           "neibu_jiesuan_state": "未结算",
           "neibu_jiesuan_time": "结算时间"
       }
   ],
      }
    }
  },
  watch: {
    // currentPage(newindex, oldindex) {
    //   console.log(newindex);
    //   this.currentPage = newindex
    //   this.getduizhangApi()
    // }
  },
  methods: {
    getSummaries(param){
      const { columns, data } = param;
       const sums = [];
      //  columns.forEach((column, index) => {
      //    if (index === 0) {
      //      sums[index] = '总价';
      //      return;
      //    }
      //    const values = data.map(item => Number(item[column.property]));
      //    if (!values.every(value => isNaN(value))) {
      //      sums[index] = values.reduce((prev, curr) => {
      //        const value = Number(curr);
      //        if (!isNaN(value)) {
      //          return prev + curr;
      //        } else {
      //          return prev;
      //        }
      //      }, 0);
      //      sums[index] += ' 元';
      //    } else {
      //      sums[index] = '';
      //    }
      //  });
      //  console.log(sums);
      // console.log(this.duizhanglist.total_list);
       return this.duizhanglist.total_list;
    },
    handleSizeChange(val) {
       console.log(`每页 ${val} 条`);
     },
     handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val
        this.getduizhangApi()
     },

    resultClick(item) {
      window.alert('you click the result item: ' + JSON.stringify(item))
    },
    onChange: debounce(function() {
      console.log(this.search);
      this.getduizhangApi()
    }, 500),
    onCopy: function(e) {
      this.$vux.toast.text('复制成功!', 'top')
    },
    onSubmit(val) {
      window.alert('on submit' + val)
    },
    onCancel() {
      console.log('on cancel')
    },
    onFocus() {
      console.log('on focus')
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
      // this.$vux.loading.show({
      //   text: '加载中...'
      // })
      this.tableloading = true
      console.log(this.currentPage);
      this.$http.post('http://sd.a10store.com/api/admin.money.duizhang.php', {
        search: this.search,
        page: this.currentPage,
        perPage: (this.wrapperHeight - 50) / 40
      }).then(res => {
        console.log(res);
        this.duizhanglist = res.body
        this.pageNum = res.body.list_num
        this.tableloading = false
        // this.$vux.loading.hide()
      }, res => {
          this.tableloading = false
      })
    }
  },
  mounted() {
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    // this.wrapperHeight = h - 46 - 48 -22
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapperTable.getBoundingClientRect().top;
    // console.log(this.wrapperHeight);
    this.boxWidth = w
    this.getduizhangApi()
  }
}
</script>
