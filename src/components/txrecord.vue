<template>
<div>
  <div style="height:44px;">
    <sticky scroll-box="vux_view_box_body" :offset="46">
      <div class="noMargin">
        <group style="">
          <cell :title="headtext" >
            <img @click="showYear=true" slot="value" src="../svg/日期.svg" width="25" height="25" />
          </cell>
        </group>
      </div>

    </sticky>
  </div>
  <popup v-model="showYear" position="bottom" class="noMargin">
    <group>
      <div class="vux-popup-picker-header">
        <div class="vux-flexbox vux-flex-row">
          <div class="vux-flexbox-item vux-popup-picker-header-menu vux-popup-picker-cancel" style="margin-left: 8px;" @click="showYear = false">取消</div>
        </div>
      </div>
      <picker :data='years1' v-model='year4' @on-change='change'></picker>
    </group>
  </popup>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="35" class="page-loadmore-wrapper thin-scroll" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
    <mt-loadmore :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore">
      <ul class="page-loadmore-list">
        <group>
          <cell :title="i.item"  v-for="i in record.list" >
            <span slot="value">
              <div style="font-size: 20px;">{{i.money}}</div>
              <p style="color:#ccc">{{i.time_jd}}</p>
            </span>
            <img  slot="icon" :src="i.icon" width="35" height="35" style="margin-right:15px" />
          </cell>
        </group>

      </ul>
      <div slot="top" class="mint-loadmore-top">
        <span v-show="topStatus !== 'loading'&&topStatus !== 'pull'" :class="{ 'rotate': topStatus === 'drop' }">下拉刷新~</span>
        <span v-show="topStatus === 'loading'" style="line-height: 30px;"><spinner type="ios-small"></spinner>加载中...</span>
      </div>
    </mt-loadmore>
  </div>

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
  XButton,
  CellFormPreview,
  TransferDom,Spinner,
  Popup,
  Picker
} from 'vux'

let years = []
for (var i = 2017; i <= 2018; i++) {
  years.push({
    name: i + '年',
    value: i + ''
  })
}
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell,
    XInput,
    XHeader,
    XButton,Spinner,
    Sticky,
    Scroller,
    Picker,
    CellFormPreview,
    TransferDom,
    Popup,
    Group,
  },
  methods: {
    change(value) {
      this.headtext = value[0]+'年' + (value[1])+'月'
      this.loadList()
    },
    loadMore(){

    },
    loadList() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.post('http://sd.a10store.com/api/user.center.money.tixian.history.php', {info:this.headtext}).then(res => {
        this.$vux.loading.hide()
        this.showYear = false;
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
      //  setTimeout(() => {
      //    let last = this.list[this.list.length - 1];
      //    for (let i = 1; i <= 10; i++) {
      //      this.list.push(last + i);
      //    }
      //    this.loading = false;
      //  }, 2350);
    },
    handleTopChange(status) {
      this.moveTranslate = 1;
      this.topStatus = status;
    },
    translateChange(translate) {
      const translateNum = +translate;
      this.translate = translateNum.toFixed(2);
      this.moveTranslate = (1 + translateNum / 70).toFixed(2);
    },
    loadTop() {
      console.log('lodtop');
      setTimeout(() => {
        this.loadList();
        this.$refs.loadmore.onTopLoaded();
      }, 1350);
    }
  },
  mounted() {
    var myDate = new Date();
    // this.headtext = myDate.getFullYear()+'年'+ (myDate.getMonth()+1)+'月';
    this.headtext = '近30天'
    this.year4 = [myDate.getFullYear(),myDate.getMonth()+1]
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;

    this.loadList()
  },
  data() {
    return {
      list: [],
      topStatus: '',
      headtext:'',
      wrapperHeight: 0,
      showYear: false,
      year4: [],
      years1: [years, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
      translate: 0,
      moveTranslate: 0,
      loading: false,
      allLoaded: false,
      record: {
        "list": [{
          "item": "佣金",
          "money": "13.29元",
          icon:'佣金',
        }, {
          "item": "本金",
          "money": "23.29元",
          icon:'本金'
        }, {
          "item": "本金(冻结中)",
          "money": "33.29元",
          icon:'提现'
        }, {
          "item": "退款",
          "money": "33.29元",
          icon:'退款'
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
