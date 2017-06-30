<template>
<div>
  <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;">补单<a slot="right"><i class="el-icon-plus" @click="show = true"></i></a></x-header>
  <search @on-change="onChange" :auto-fixed="false" @on-submit="onSubmit" v-model="search" @on-focus="onFocus"></search>
  <tab v-model="tabs">
    <tab-item :selected="status === item" v-for="(item, index) in orderlist.num" :key="index" @on-item-click="onItemClick(item,index)">{{item.item}} {{item.num}}</tab-item>
  </tab>
  <div v-for="(item,list) in orderlist.list" :key="list">
    <group v-for="(c,orderindex) in item.orderneed" :key="orderindex" :title="'内部单号:  '+item.weborder + '      利润:  '+item.lirun">
      <cell title="付款金额" :value="c.total">
      </cell>
      <cell inline-desc="订单编号" :value="c.orderid">
      </cell>
      <cell inline-desc="订单时间" :value="c.time_buy">
      </cell>
      <cell :inline-desc="c.tracking_company" is-link :value="c.tracking">
      </cell>
      <cell inline-desc="旺旺">
        <img slot="icon" src="../../svg/旺旺.svg" width="20" height="20" style="margin-right:10px" /></img>{{c.buyer_nick}}
      </cell>
      <cell v-for="(g,index) in c.list" :key="index" :title="g.label" :value="g.value+'件'" :inline-desc="'颜色分类:'+ g.color + '尺码:'+g.size">
        <img slot="icon" :src="g.src" width="50" height="50" style="margin-right:15px" />
        <span slot="value" style="color:#F7BA2A">{{g.status}}</span>
      </cell>
      <cell :title="'收货人:' +c.address_name" :value="c.address_phone" :inline-desc="'收货地址:' + c.address_detail">
      </cell>
      <div class="weui-form-preview__ft">
        <a @click="weihu(c)" class="weui-form-preview__btn_default weui-form-preview__btn ">添加商品</a>
        <a @click="left(c)" :class="{'weui-form-preview__btn_primary':c.button_type=='true','weui-form-preview__btn_default':c.button_type=='false'}" style="border-right: 1px solid #D9D9D9;" class="weui-form-preview__btn ">{{c.button_text}}</a>
        <!-- v-if="tabs==1" -->
      </div>
    </group>
  </div>
  <x-dialog v-model="show" class="dialog-demo" :dialog-style="{'max-width': '50%', width: '50%','text-align': 'left'}">

    <group>
      <cell title="店铺">
        <checker slot="default" v-model="demo6"  default-item-class="demo5-item" selected-item-class="demo5-item-selected">
          <checker-item v-for="i in ['依布工厂店','依布服饰旗舰店']" :key="i" :value="i">{{i}}</checker-item>
        </checker>
      </cell>
      <x-input title="内部单号" disabled v-model="fabu.weborder"></x-input>
      <cell :title="g.label" v-for="(g,index) in fabu.list" :key="index">
        <img slot="icon" :src="g.src" width="50" height="50" style="margin-right:15px" />
        <span slot="inline-desc">{{g.color}}   {{g.size}}   {{g.value}}件</span>
        <x-input slot="value" v-model="g.price" text-align="right" :show-clear="false"><span slot="right">元</span></x-input>
      </cell>
      <x-input text-align="right" disabled title="总计金额" v-model="fabu.total"></x-input>
      <x-input text-align="right" title="佣金" v-model="fabu.yongjin"></x-input>
      <div class="weui-form-preview__ft">
        <a @click="show=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
        <a @click="finish" class="weui-form-preview__btn weui-form-preview__btn_primary">发布</a></div>
    </group>
  </x-dialog>
  <x-dialog v-model="editwang" class="dialog-demo">
    <group>
      <x-input title="旺旺" v-model="edit.wangwang"></x-input>

      <div class="weui-form-preview__ft">
        <a @click="editwang=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
        <a @click="finishwang" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
    </group>

  </x-dialog>
  <x-dialog v-model="editGoods" class="dialog-demo" :dialog-style="{'width':'50%','max-width': '100%'}">
    <group labelAlign="left">
      <x-input title="货号" v-model="goods.huohao"></x-input>
      <x-input title="颜色" v-model="goods.color"></x-input>
      <!-- <x-input title="尺码" v-model="goods.size"></x-input> -->

      <cell title="尺码">
        <checker slot="value" v-model="goods.size" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
          <checker-item :value="item" v-for="(item, index) in items1" :key="index">{{item.value}}</checker-item>
        </checker>
      </cell>
      <x-input title="数量" v-model="goods.num"></x-input>
      <div class="weui-form-preview__ft">
        <a @click="editGoods=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
        <a @click="finishgoods" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
    </group>

  </x-dialog>
</div>
</template>

<style>
.buyer {
  vertical-align: middle;
  float: right;
}

.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 15px;
}

.demo1-item-selected {
  border: 1px solid green;
}

.buyer img {
  vertical-align: middle;
}

.demo5-item-selected {
  background: #ffffff url('../../svg/check.png') no-repeat right bottom;
  border-color: #ff4a00!important;
}

.demo5-item {
  width: 100px;
  height: 26px;
      padding: 5px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
}

.flexBefore .vux-flexbox-item .weui-cells .weui-cell {
  border-right: 1px solid #D9D9D9;
}
</style>
<script>
import {
  XButton,
  Search,
  XInput,
  XDialog,
  Grid,
  GridItem,
  Flexbox,
  Cell,
  Group,
  CellFormPreview,
  FlexboxItem,
  XHeader,
  Tab,
  Checker,
  CheckerItem,
  TabItem
} from 'vux'
import {
  debounce
} from 'vux'
export default {
  components: {
    XButton,
    Search,
    Grid,
    GridItem,
    XInput,
    Flexbox,
    XDialog,
    FlexboxItem,
    XHeader,
    Cell,
    Group,
    CellFormPreview,
    Tab,
    Checker,
    CheckerItem,
    TabItem,
  },
  computed: {
    status() {
      return this.$store.state.vux.status
    },
    tabs() {
      return this.$store.state.vux.tabs
    }
  },
  data() {
    return {
      statuslist: ['待发布', '待发货', '已发货'],
      show: false,
      search: '',
      editwang: false,
      demo6: 1,
      editGoods: false,
      goods: {
        size: '',
        color: '',
        huohao: '',
        num: ''
      },
      items1: [{
        key: '1',
        value: 'M'
      }, {
        key: '2',
        value: 'L'
      }, {
        key: '3',
        value: 'XL'
      }, {
        key: '4',
        value: '2XL'
      }, {
        key: '5',
        value: '3XL'
      }, {
        key: '6',
        value: '4XL'
      }],
      edit: {
        wangwang: ''
      },
      fabu: {
        orderid: '',
        id: '',
        total: '',
        yongjin: "",
        list: [{
          label: '',
          color: '',
          size: '',
          num: '',
          price: ''
        }]
      },
      importform: {
        radio2: 3,
        shop: ''
      },
      orderlist: {
        "list": [{
          "weborder": "63",
          "lirun": "利润",
          "orderneed": [{
            "orderid": "26511289102818075",
            button_text: "发布任务",
            button_type: "true",
            "buyer_nick": "anniewang919",
            "status": "买家已付款，等待卖家发货",
            "tracking_company": "缺失",
            "tracking": "缺失",
            "address_detail": "江苏省 苏州市 昆山市 开发区中园华园1588号常发香城名园13栋601室(215300)",
            "address_name": "王亦清",
            "address_phone": "13656267070",
            "total": "80.00",
            "yongjin": '',
            "time_buy": "2017-06-07 14:24",
            "list": []
          }]
        }],
        "info": "获取列表",
        "num": [ {
          "item": "已发布",
          "num": "0"
        }, {
          "item": "已领取",
          "num": "3"
        }, {
          "item": "已下单",
          "num": "0"
        }, {
          "item": "已付款",
          "num": "0"
        }, {
          "item": "退款中",
          "num": "0"
        }, {
          "item": "交易完成",
          "num": "0"
        }, {
          "item": "关闭订单",
          "num": "0"
        }]
      },
    }
  },
  mounted() {
    this.$store.state.vux.status = '未发布'
    this.getlist()

  },
  methods: {
    finishgoods() {
      console.log(this.goods);
      this.$http.post('http://sd.a10store.com/api/admin.order.info.goods.update.php', {
        weihu: this.goods
      }).then(res => {
        // this.editGoods = false
        this.$vux.toast.show({
          text: '添加成功,可继续添加!',
          type: 'success',
          position: 'middle'
        })
        this.getlist()
      }, res => {})
    },
    weihu(c) {
      console.log(c);
      this.editGoods = true
      this.goods.id = c.id
    },
    onChange: debounce(function() {
      console.log(this.search);
      this.searchApi()
    }, 500),
    onSubmit() {
      console.log(this.search);
      this.searchApi()
    },
    onFocus() {
      console.log('onfocus' + this.search);
    },
    searchApi() {
      this.$vux.loading.show({
        text: '搜索中...'
      })
      this.$http.post('http://sd.a10store.com/api/admin.order.list.search.php', {
        serach: this.search
      }).then(res => {
        this.$vux.loading.hide()
        this.orderlist = res.body;
      }, res => {
        this.$vux.loading.hide()
      })
    },
    getlist() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.post('http://sd.a10store.com/api/admin.order.list.get.php', {
        menu: this.$store.state.vux.status
      }).then(res => {
        this.$vux.loading.hide()
        this.orderlist = res.body;
      }, res => {
        this.$vux.loading.hide()
      })
    },
    left(item) {
      console.log(item);
      if (item.button_type == 'false') {
        return this.$vux.toast.show({
          text: '无法操作~',
          type: 'cancel'
        })
      } else {
        this.show = true
        this.fabu = item
      }
    },
    right(orderlist) {
      if (orderlist.button_type == 'false') {
        return this.$vux.toast.show({
          text: '无法操作~',
          type: 'cancel'
        })
      } else {
        var _this = this
        console.log(orderlist);
        var weborder = orderlist.id
        this.$vux.confirm.show({
          title: '是否确认订单信息?',
          onCancel() {},
          onConfirm(orderlist) {
            console.log(weborder);
            _this.$http.post('http://sd.a10store.com/api/admin.order.state.update.php', {
              id: weborder,
              action: _this.status
            }).then(res => {
              _this.getlist()
              _this.$vux.toast.show({
                text: '提交成功~'
              })
            }, res => {})
          }
        })
      }


    },
    toeditwang(c, item, index) {
      console.log(index);
      this.editwang = true;
      this.edit.index = index
      this.edit.id = item.weborder
      this.edit.wangwang = c.buyer_nick
    },
    finishwang() {
      this.orderlist[this.edit.index].orderGet[0].buyer_nick = this.edit.wangwang;
      this.$http.post('http://sd.a10store.com/api/admin.order.info.update.php', {
        edit: this.edit
      }).then(res => {
        this.getlist()
        this.$vux.toast.show({
          text: '修改成功!',
          type: 'success',
          position: 'middle'
        })
        this.editwang = false
      }, res => {})
    },
    finish() {
      this.$http.post('http://sd.a10store.com/api/admin.order.sd.publish.php', {
        fabu: this.fabu
      }).then(res => {
        console.log(res);
        this.$vux.toast.show({
          text: '发布成功!',
          type: 'success',
          position: 'middle'
        })
        this.show = false
        // this.orderlist = res.body.list;
      }, res => {
        this.$vux.toast.show({
          text: '发布失败!',
          type: 'cancel',
          position: 'middle'
        })
      })

    },
    onItemClick(item, index) {
      console.log(item.item);
      this.$store.state.vux.status = item.item
      this.$store.state.vux.tabs = index
      this.getlist()
    },

    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

  }
}
</script>
