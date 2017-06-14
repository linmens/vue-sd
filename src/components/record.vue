<template>
<div>
  <div style="height:44px;">
    <sticky scroll-box="vux_view_box_body" :offset="46">
      <div class="noMargin">
        <group style="">
          <cell title="2017年6月" inline-desc="支出 1080.00  收入  25.00">
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
          <div class="vux-flexbox-item vux-popup-picker-header-menu vux-popup-picker-cancel" style="margin-left: 8px;">取消</div>
          <div class="vux-flexbox-item vux-popup-picker-header-menu vux-popup-picker-header-menu-right" style="margin-left: 8px;">完成</div>
        </div>
      </div>
      <picker :data='years1' v-model='year4' @on-change='change'></picker>
    </group>
  </popup>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" class="page-loadmore-wrapper thin-scroll" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
    <mt-loadmore :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore">
      <ul class="page-loadmore-list">
        <group>
          <cell :title="i.item" :value="i.money" v-for="i in record.list">
            <img slot="icon" src="../svg/activity.svg" width="50" height="50" />
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
      console.log('new Value', value)
    },
    loadMore() {
      this.loading = true;
      //  setTimeout(() => {
      //    let last = this.list[this.list.length - 1];
      //    for (let i = 1; i <= 10; i++) {
      //      this.list.push(last + i);
      //    }
      //    this.loading = false;
      //  }, 2500);
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
      setTimeout(() => {
        let firstValue = this.list[0];
        for (let i = 1; i <= 10; i++) {
          this.list.unshift(firstValue - i);
        }
        this.$refs.loadmore.onTopLoaded();
      }, 1500);
    }
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    this.$vux.loading.show({
      text: '加载中...'
    })
    this.$http.get('http://sd.a10store.com/api/user.center.expense.list.get.php', {}).then(res => {
      this.$vux.loading.hide()
      this.record = res.body;
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
      list: [],
      topStatus: '',
      wrapperHeight: 0,
      showYear: false,
      year4: ['2002', '4'],
      years1: [years, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
      translate: 0,
      moveTranslate: 0,
      loading: false,
      allLoaded: false,
      record: {
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
