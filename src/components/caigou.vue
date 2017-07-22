<template>
<div>
  <load-more v-if="!cai.length" :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
  <group :title="'发布时间:'+c.time" v-for="(c,index) in cai" :key="index">
    <cell-form-preview :list="c.list"></cell-form-preview>

    <cell title="合计" :value="'共'+c.num+'件商品 ' + '￥'+c.total"></cell>
    <div class="weui-form-preview__ft">
      <a @click="get(c)" class="weui-form-preview__btn weui-form-preview__btn_primary">领取</a></div>
  </group>

</div>
</template>
<style>
.weui-cell__ft {
  color: black!important
}
</style>
<script>
import {
  XHeader,
  CellFormPreview,
  LoadMore,
  Group,
  Cell,
  Tabbar,
  TabbarItem,
  XInput,
  XSwitch,
  XButton
} from 'vux'
export default {
  components: {
    XHeader,
    LoadMore,
    CellFormPreview,
    Group,
    Cell,
    Tabbar,
    TabbarItem,
    XInput,
    XSwitch,
    XButton
  },
  mounted() {
    this.getlist()
  },
  methods: {
    getlist() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.get('http://sd.a10store.com/api/order.caigou.list.get.php', {}).then(res => {
        this.$vux.loading.hide()
        this.cai = res.body.list;
        this.$store.state.vux.num = this.cai.length
      }, res => {
        this.$vux.loading.hide()
      })
    },
    get(cid) {
      this.$http.post('http://sd.a10store.com/api/order.caigou.renlin.php', {
        orderid: cid.orderid
      }).then(res => {
        if(res.body.result=='success'){
          this.$vux.toast.text('领取成功!', 'middle')
          this.$router.push('order')
            this.$store.state.vux.tabs = 0 ;
            this.$store.state.vux.status = '全部'
        }else {
          this.$vux.toast.text('改单已被领取!', 'middle')
        }
        this.getlist()
      }, res => {})
    },
    changpage(item) {
      this.sortActive = item.sortname
    },
    itemChange(i) {
      this.subitemsExpanded = i
      console.log(i);
    },
    switchTo(index) {
      this.current = index.toString();
    }
  },
  data() {
    return {
      type: '1',
      show: false,
      cai: [{
        orderid: '3232323',
        total: '9898',
        list: [{
          label: '佣金',
          value: '3.29'
        }, {
          label: '本金',
          value: '1.04'
        }]
      }],
      selected: 'tab-container1',
      dialogVisible: false,
      current: '0',
      user: {
        "money_yongjin": "16.33",
        "money_benjin": "1100.00",
        "money_yue": "1116.33",
        "user_name": "Ein",
        "user_level": "1",
        "taobao_nick": "昆神数码",
        "phone": "18115768813",
        "address": "江苏省无锡市北塘区惠泉花园216栋602室",
        "qq": "263467927"
      },
      sortActive: false,
      sortMenu: [{
          sortname: '领单中心'
        },
        {
          sortname: '待付款'
        },
        {
          sortname: '待发货'
        },
        {
          sortname: '已发货'
        },
      ],
      sortName: [{
          sortname: '已完成'
        },
        {
          sortname: '已关闭'
        },
      ],

      subitemsExpanded: false,

    }
  }
}
</script>
