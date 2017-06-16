<template>
<div>
  <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;">后台<a slot="right"><i class="el-icon-plus" @click="Importorder = true"></i></a></x-header>
  <search @on-change="onChange" :auto-fixed="false" @on-submit="onSubmit" v-model="search" @on-focus="onFocus"></search>
  <tab v-model="tabs">
    <tab-item :selected="status === item" v-for="(item, index) in orderlist.num" :key="index" @on-item-click="onItemClick(item,index)">{{item.item}} {{item.num}}</tab-item>
  </tab>

  <flexbox wrap="wrap" :gutter="0" v-for="(item,list) in orderlist.list" :key="list" class="flexBefore">
    <flexbox-item :span="1/2" v-for="(c,orderindex) in item.orderneed" :key="orderindex">
      <group :title="'内部单号:  '+item.weborder + '      利润:  '+item.lirun">
        <cell title="付款金额" :value="c.total">
        </cell>
        <cell inline-desc="订单编号" :value="c.orderid">
        </cell>
        <cell inline-desc="订单时间" :value="c.time_buy">
        </cell>
        <cell :inline-desc="c.tracking_company" is-link :value="c.tracking">
        </cell>
        <cell inline-desc="旺旺">
          <img slot="icon" src="../svg/旺旺.svg" width="20" height="20" style="margin-right:10px" /></img>{{c.buyer_nick}}
        </cell>
        <cell v-for="(g,index) in c.list" :key="index" :title="g.label" :value="g.value+'件'" :inline-desc="'颜色分类:'+ g.color + '尺码:'+g.size">
          <img slot="icon" :src="g.src" width="50" height="50" style="margin-right:15px" />
          <span slot="value" style="color:#F7BA2A">{{g.status}}</span>
        </cell>
        <cell :title="'收货人:' +c.address_name" :value="c.address_phone" :inline-desc="'收货地址:' + c.address_detail">
        </cell>
        <div class="weui-form-preview__ft">
          <a @click="left(c)" :class="{'weui-form-preview__btn_primary':c.button_type=='true','weui-form-preview__btn_default':c.button_type=='false'}" style="border-right: 1px solid #D9D9D9;" class="weui-form-preview__btn ">{{c.button_text}}</a>

        </div>
      </group>
    </flexbox-item>
    <flexbox-item :span="1/2" v-for="(c,get) in item.orderGet" :key="get">
      <group title="采购单">
        <cell title="付款金额" :value="c.total">
        </cell>
        <cell inline-desc="订单编号" :value="c.orderid">
        </cell>
        <cell inline-desc="订单时间" :value="c.time_buy">
        </cell>
        <cell :inline-desc="c.tracking_company"  :value="c.tracking">
        </cell>
        <cell inline-desc="旺旺" is-link @click.native="toeditwang(c,item,list)">
          <img slot="icon" src="../svg/旺旺.svg" width="20" height="20" style="margin-right:10px" /></img>{{c.buyer_nick}}
        </cell>
        <cell v-for="(g,index) in c.list" :key="index" :title="g.label" :value="g.value+'件'" :inline-desc="'颜色分类:'+ g.color + '尺码:'+g.size">
          <img slot="icon" :src="g.src" width="50" height="50" style="margin-right:15px" />
          <span slot="value" style="color:#F7BA2A">{{g.status}}</span>
        </cell>
        <cell :title="'收货人:' +c.address_name" :value="c.address_phone" :inline-desc="'收货地址:' + c.address_detail">
        </cell>
        <div class="weui-form-preview__ft">
          <a @click="right(c,item)" :class="{'weui-form-preview__btn_primary':c.button_type=='true','weui-form-preview__btn_default':c.button_type=='false'}" class="weui-form-preview__btn ">{{c.button_text}}</a>
        </div>
      </group>
    </flexbox-item>
  </flexbox>

  <el-dialog :visible.sync="Importorder">
    <div style="text-align: center;">
      <el-radio-group v-model="importform.shop">
        <el-radio-button label="依布工厂店"></el-radio-button>
        <el-radio-button label="依布科尚精选"></el-radio-button>
      </el-radio-group>
    </div>
    <el-form :model="importform" label-width="80px">
      <el-form-item label="导入内容">
        <el-radio-group v-model="importform.radio2">
          <el-radio label="订单信息"></el-radio>
          <el-radio label="商品信息"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件">
        <el-upload class="upload-demo" ref="upload" :data="importform" action="http://sd.a10store.com/api/order.excel.update.php" :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传execl文件，且不超过2MB</div>
        </el-upload>
      </el-form-item>
    </el-form>

  </el-dialog>
  <x-dialog v-model="show" class="dialog-demo" :dialog-style="{'max-width': '50%', width: '50%','text-align': 'left'}">
    <group>
      <x-input title="原订单号" disabled v-model="fabu.orderid"></x-input>
      <x-input title="内部单号" disabled v-model="fabu.weborder"></x-input>
      <cell :title="g.label" v-for="(g,index) in fabu.list" :key="index">
        <img slot="icon" :src="g.src" width="50" height="50" style="margin-right:15px" />
        <span slot="inline-desc">{{g.color}}   {{g.size}}   {{g.value}}件</span>
        <x-input slot="value" v-model="g.price" text-align="right" :show-clear="false"><span slot="right">元</span></x-input>
      </cell>
      <x-input text-align="right" disabled title="总计金额" v-model="fabu.total"></x-input>
      <x-input text-align="right"  title="佣金" v-model="fabu.yongjin"></x-input>
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
</div>
</template>

<style>
.buyer {
  vertical-align: middle;
  float: right;
}

.buyer img {
  vertical-align: middle;
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
      edit: {
        wangwang: ''
      },
      fabu: {
        orderid: '',
        id: '',
        total: '',
        yongjin:"",
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
      list: [{
        label: 'Apple',
        value: '3.29'
      }, {
        label: 'Banana',
        value: '1.04'
      }, {
        label: 'Fish',
        value: '8.00'
      }],
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
          }],
          "orderGet": [{
            "orderid": "缺失",
            "buyer_nick": "缺失",
            "status": "缺失",
            "tracking_company_no": "",
            "tracking_company": "缺失",
            "tracking": "缺失",
            "address_detail": "缺失",
            "address_name": "缺失",
            "address_phone": "缺失",
            "total": "0.00",
            "yongjin": 7,
            "time_buy": "缺失",
            "list": []
          }]
        }],
        "info": "获取列表",
        "num": [{
          "item": "未发布",
          "num": "1"
        }, {
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

      index: 0,
      Importorder: false,
    }
  },
  mounted() {
    this.$store.state.vux.status = '未发布'
    this.getlist()

  },
  methods: {
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
