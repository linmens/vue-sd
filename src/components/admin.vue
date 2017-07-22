<template>
<div class="white-bg">
  <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;">订单管理<a slot="right"><i class="el-icon-plus" @click="Importorder = true"></i></a></x-header>
  <search class="searchCus" @on-change="onChange" :auto-fixed="false" @on-submit="onSubmit" v-model="search.data" @on-focus="onFocus">
    <span slot="left" style="margin-right: 15px;" @on-change="onChange" @click="popover=!popover">{{search.option}}
      <div class="popovercus" v-if="popover" @click.stop="onChange">
        <group gutter="0">
      <radio :options="searchInfo"  v-model="search.option"></radio>
    </group>
        <!-- <ul><li  @click.stop="search.option=o;popover=false"  :key="index" v-for="(o,index) in searchInfo">{{o}}</li></ul> -->
      </div>
    </span>
  </search>
  <tab v-model="fatherTab">
    <tab-item @on-item-click="onItemClick" v-for="(t,index) in adminList.fTabs" :key="index">{{t}}</tab-item>
  </tab>
  <button-tab v-if="isPc" v-model="tabs" style="padding: 10px;">
    <button-tab-item v-for="(item,index) in adminList.cTabs" :key="index" @on-item-click="consoleIndex(item,index)">{{item.item}} {{item.num}}</button-tab-item>
  </button-tab>
  <div class="weui-cell" style="box-shadow: rgba(68, 68, 72, 0.55) 0px 4px 5px -3px;z-index: 500">
    <span class="tips" style="background:#eeeeee"></span> <span style="margin-right: 20px;">灰色为需求单</span>
    <span style="background:#d43c33" class="tips"></span> 红色为采购单
    <Page ref="page" :page-num="pageNum" :current-page="currentPage" @change="change"></Page>

  </div>
  <div ref="swiperA" class="thin-scroll" v-if="isPc" :style="{ height: wrapperHeight-53 + 'px','overflow-x': 'auto'}">


    <div v-for="(item,list) in adminList.list" :key="list">
      <div class="order-header">
        <span style="cursor: pointer;" @click="beizhuDialog = true;editBeizhu = item"><icon scale="1.1" style="margin-right:10px" name="file-text-o"></icon>{{item.beizhu_admin||'添加备注'}}
        </span>
        <span style="float:right">内部单号:{{item.id}} {{item.sd_order_state}}佣金:{{item.yongjin}} {{item.user_name}}</span>
      </div>
      <flexbox :gutter="0" wrap="wrap" style="background: #ececec;">
        <flexbox-item style="height:100%" class="pc-item">
          <group style="padding:10px" :title="item.left.time">
            <cell>
              <span slot="title" v-clipboard:success="onCopy" v-clipboard:copy="item.left.orderid">
                <span style="background:#eeeeee;display:inline-block" class="tips"></span>{{item.left.orderid}}</span>
              <span slot="value" style="font-size:18px;color:rgb(68, 68, 72)">{{item.left.total}}</span>
            </cell>
            <cell title="付款金额">
              <span slot="value" style="font-size:18px;color:rgb(68, 68, 72)">{{item.left.price_sjzf}}</span>
            </cell>
            <cell :inline-desc="item.left.tracking_company" is-link :value="item.left.tracking">
            </cell>
            <cell inline-desc="旺旺">
              <img slot="icon" src="../svg/旺旺.svg" width="20" height="20" style="margin-right:10px" /></img>{{item.left.buyer_nick}}
            </cell>
            <cell :inline-desc="'备注: '+item.left.beizhu">
            </cell>
            <cell is-link @click.native="trackEditting(item,list)" :inline-desc="'寄回单号'" v-if="status=='退款中'">
              <span slot="value"><span style="margin-right:10px">{{item.left.tkTrack_company}}</span>{{item.left.tkTrack}}</span>
            </cell>
            <cell v-for="(g,index) in item.left.list" :key="index" :inline-desc="'颜色分类:'+ g.color + '尺码:'+g.size">
              <span slot="value"><span class="font-Big20">{{g.value}}</span> 件 <span style="color:#d43c33">{{g.sd_goods_tuikuan_state}}</span></span>
              <img class="previewer-demo-img" width="50" height="50" style="margin-right:15px" :src="g.src" slot="icon" @click="imgPreiviews(item.right.list,index)" />
              <div slot="title" v-clipboard:success="onCopy" v-clipboard:copy="g.label">{{g.label}}</div>
              <span slot="after-title" style="color:#d43c33">{{g.status}}</span>
            </cell>
            <cell>
              <div slot="title" v-clipboard:success="onCopy" v-clipboard:copy="item.left.address_name">{{item.left.address_name}}</div>
              <div slot="inline-desc" v-clipboard:success="onCopy" v-clipboard:copy="item.left.address_detail">收货地址: {{item.left.address_detail}}</div>
              <span slot="after-title" v-clipboard:success="onCopy" v-clipboard:copy="item.left.address_phone">{{item.left.address_phone}}  </span>
            </cell>
            <div class="weui-cell" style="justify-content:flex-end;height:20px">
              <!-- <a v-if="tabs==0" @click="weihu(item)" class="weui-form-preview__btn_default weui-form-preview__btn ">添加商品</a> -->
              <!-- <a @click="left(item)" :class="{'weui-form-preview__btn_primary':item.left.button_type=='true','weui-form-preview__btn_default':item.left.button_type=='false'}" class="weui-form-preview__btn ">{{item.left.button_text}}</a> -->
              <!-- v-if="tabs==1" -->
            </div>
          </group>
        </flexbox-item>
        <flexbox-item style="height:100%" class="pc-item">
          <group :titile="item.right.time" style="padding:10px">
            <cell>
              <span slot="title" v-clipboard:success="onCopy" v-clipboard:copy="item.right.orderid">
                <span style="background:#d43c33;display:inline-block" class="tips"></span>{{item.right.orderid}}</span>
              <span slot="value" style="font-size:18px;color:rgb(212, 60, 51)">
                {{item.right.total}}
              </span>
            </cell>
            <cell title="付款金额">
              <span slot="value" style="font-size:18px;color:rgb(212, 60, 51)">{{item.right.price_sjzf}}
              </span>
            </cell>
            <cell :inline-desc="item.right.tracking_company" :value="item.right.tracking">
            </cell>
            <cell inline-desc="旺旺" is-link @click.native="toeditwang(c,item,list)">
              <img slot="icon" src="../svg/旺旺.svg" width="20" height="20" style="margin-right:10px" /></img>{{item.right.buyer_nick}}
            </cell>
            <cell :inline-desc="'备注: '+item.right.beizhu">
            </cell>
            <cell is-link @click.native="trackEditting(item,list)" :inline-desc="'寄回单号'" v-if="status=='退款中'">
              <span slot="value"><span style="margin-right:10px">{{item.right.tkTrack_company}}</span>{{item.right.tkTrack}}</span>
            </cell>
            <cell @click.native="checktype(g,item)" v-for="(g,index) in item.right.list" :key="index" :inline-desc="'颜色分类:'+ g.color + '尺码:'+g.size">
              <span slot="value">
                <span class="font-Big20">{{g.value}}</span> 件<span style="color:#d43c33;margin-left:10px" v-if="g.sd_goods_tuikuan_state">{{g.sd_goods_tuikuan_state}}</span>
              <span v-if="item.right.isTk=='true'">
                <i v-if="g.check=='false'" class="weui-icon weui_icon_circle weui-icon-circle"></i>
                <i v-if="g.check=='true'" class="weui-icon weui_icon_success weui-icon-success"></i>
                </span>
              </span>
              <span slot="after-title" style="color:#d43c33">{{g.status}}</span>
              <img class="previewer-demo-img" width="50" height="50" style="margin-right:15px" :src="g.src" slot="icon" />
              <div slot="title" v-clipboard:success="onCopy" v-clipboard:copy="g.label">{{g.label}}</div>
            </cell>
            <cell>
              <div slot="title" v-clipboard:success="onCopy" v-clipboard:copy="item.right.address_name">{{item.right.address_name}}</div>
              <div slot="inline-desc" v-clipboard:success="onCopy" v-clipboard:copy="item.right.address_detail">收货地址: {{item.right.address_detail}}</div>
              <span slot="after-title" v-clipboard:success="onCopy" v-clipboard:copy="item.right.address_phone">{{item.right.address_phone}}  </span>
            </cell>
            <div class="weui-cell" style="justify-content:flex-end;height:20px">
              <span class="handlebtn highlight" v-if="item.sd_order_state=='未发布'" @click="right(item,'发布')">发布</span>
              <span class="handlebtn highlight" v-if="item.sd_order_state=='已发布'||item.sd_order_state=='已领取'" @click="right(item,'取消发布')">取消发布</span>
              <span class="handlebtn highlight" v-if="item.sd_order_state=='待审核'" @click="right(item,'确认订单')">确认订单</span>
              <span class="handlebtn" v-if="item.sd_order_state=='付款中'" @click="right(item,'确认付款')">确认付款</span>
              <span class="handlebtn highlight" v-if="item.sd_order_state=='待发货'" @click="right(item,'退款')">
                <span v-if="item.right.isTk == 'false'">退款</span>
              <span @click.stop="finshTk(item,'退款完成')" v-if="item.right.isTk == 'true'">退款完成</span>
              </span>

              <span class="handlebtn highlight" v-if="item.sd_order_state=='待发货'" @click="right(item,'发货')">发货</span>
              <template v-if="item.sd_order_state=='退款中'">
                <span class="handlebtn highlight"  @click="right(item,'交易关闭')">交易关闭</span>
                <span class="handlebtn"  @click="right(item,'发货')">发货</span>
</template>
              <template v-if="item.sd_order_state=='已发货'" >
<span class="handlebtn" @click.stop="right(item,'提示买家签收')">提示买家签收</span>
<span class="handlebtn highlight" @click="right(item,'退货退款')">
                  <span v-if="item.right.isTk == 'false'">退货退款</span>
<span @click.stop="finshTk(item,'完成退货退款')" v-if="item.right.isTk == 'true'">完成</span>
</span>
</template>
<template v-if="item.sd_order_state=='退货中'">
  <span class="handlebtn"  @click="right(item,'移至待签收')">移至待签收</span>
  <span class="handlebtn highlight"  @click="right(item,'交易关闭')">交易关闭</span>
</template>
<template v-if="item.sd_order_state=='签收中'">
  <span class="handlebtn highlight"  @click="right(item,'移至交易成功')">移至交易成功</span>
</template>
<span class="handlebtn highlight" v-if="item.sd_order_state=='交易成功'" @click="right(item,'申请售后')">
  <span v-if="item.right.isTk == 'false'">售后</span>
<span @click.stop="finshTk(item,'售后完成')" v-if="item.right.isTk == 'true'">售后完成</span>
</span>
            </div>
          </group>
        </flexbox-item>
      </flexbox>
    </div>

  </div>
  <x-dialog v-model="beizhuDialog"  class="dialog-demo">
    <group labelAlign="left" labelWidth="100">
      <x-textarea v-model="editBeizhu.beizhu_admin" :max="50" :placeholder="('placeholder')" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')"></x-textarea>
      <div class="weui-form-preview__ft">
        <a @click="beizhuDialog=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
        <a @click="finishBeizhu" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
    </group>
  </x-dialog>

    <x-dialog v-model="fahuo"  class="dialog-demo">
      <group labelAlign="left" labelWidth="100">
        <selector v-model="fahuoInput.company" title="快递公司" :options="trackInfo" ></selector>
        <x-input title="快递单号" v-model="fahuoInput.track"></x-input>
        <div class="weui-form-preview__ft">
          <a @click="fahuo=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
          <a @click="finishFahuo" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
      </group>
    </x-dialog>
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
  <popup v-model="show">
    <div class="popup0">
      <group :gutter="0">
        <cell :title="fabu.orderid" style="box-shadow: 0 4px 5px -3px hsl(0, 0%, 65%)">
        </cell>
        <div class="thin-scroll fabuEdit" v-if="!faisEdit" :style="{height:111*fabu.list.length+'px'}">
          <cell v-for="(g,index) in fabu.list" :key="index">
            <span slot="after-title">{{g.color}};{{g.size}}</span>
            <span slot="value">  <x-number :min="0" style="padding:0" @on-change="countPrice"  v-model="g.value" ></x-number></span>
            <img class="previewer-demo-img" width="50" height="50" style="margin-right:15px" :src="g.src" slot="icon" @click="imgPreiviews(item.right.list,index)" />
            <div slot="title" v-clipboard:success="onCopy" v-clipboard:copy="g.label">{{g.label}} </div>
            <span slot="inline-desc" style="color:red;font-size: 14px;color:#d43c33">
              ¥<x-input @on-change="countPrice" :show-clear="false" style="font-size:18px;width:auto;padding:0;display:inline-block" v-model="g.price"></x-input>
            <span style="font-size:16px;color:gray;text-decoration:line-through;">¥{{g.price_gs}}</span>
            <checker @on-change="priceOnchange(g)" slot="value" v-model="g.zhekou" default-item-class="size-item" selected-item-class="size-item-selected">
              <checker-item :value="item" v-for="(item, index) in items2" :key="index">{{item}}</checker-item>
            </checker>
            </span>
          </cell>
        </div>

        <x-number @on-change="countPrice" title="佣金" v-model="fabu.yongjin" fillable></x-number>
        <x-input text-align="right" disabled title="原总计金额" v-model="fabu.total"></x-input>
        <cell text-align="right" title="总计金额">
          <span slot="value"><span style="margin-right:15px">共<span class="font-Big20">{{fabu.jsTotal}}</span>件</span><span class="font-Big20">{{fabu.netotal}}</span></span>
        </cell>
        <!-- <x-input text-align="right" @on-change="countPrice" title="佣金" type="number" v-model="fabu.yongjin"></x-input> -->
        <div class="weui-form-preview__ft">
          <a @click="show=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
          <a @click="finish" class="weui-form-preview__btn weui-form-preview__btn_primary">发布</a></div>
      </group>
    </div>
  </popup>

  <x-dialog v-model="editwang" class="dialog-demo">
    <group>
      <x-input title="旺旺" v-model="edit.wangwang"></x-input>
      <div class="weui-form-preview__ft">
        <a @click="editwang=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
        <a @click="finishwang" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
    </group>
  </x-dialog>

  <x-dialog v-model="istrackEditting" class="dialog-demo">
    <group>
      <x-input title="快递公司" v-model="edittrack.com"></x-input>
      <x-input title="寄回单号" v-model="edittrack.trackNum"></x-input>
      <div class="weui-form-preview__ft">
        <a @click="istrackEditting=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
        <a @click="finishTrack" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
    </group>
  </x-dialog>
  <popup v-model="editGoods">
    <div class="popup0">
      <group labelAlign="left">
        <x-input title="货号" v-model="goods.huohao"></x-input>
        <x-input title="颜色" v-model="goods.color"></x-input>
        <popup-radio title="尺码" :options="list1" v-model="goods.size"></popup-radio>
        <x-input title="数量" v-model="goods.num"></x-input>
        <div class="weui-form-preview__ft">
          <a @click="editGoods=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
          <a @click="finishgoods" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
      </group>
    </div>
  </popup>
</div>
</template>

<style lang="less">@import '~vux/src/styles/1px.less';
.order-header {
    background: #d43c33;
    padding: 10px;
    color: white;
}

.tips {
    /*background: red;*/
    width: 10px;
    margin-right: 10px;

    height: 10px;
    display: block;
}

.white-bg {
    background: white!important;
    height: 100%;
}

.fabuEdit {
    /*height: 136px;*/
    overflow: auto;
}
.popovercus {
    position: absolute;
    top: 50px;
    width: 100%;
    z-index: 500;
    left: 0;
}
.popovercus ul li {
    padding: 5px;
    color: white;
}
.popovercus ul li.active {
    background: #efeff4;
    color: black;
}
.vux-slider {
    border-radius: 8px;
    border: 1px solid rgba(229, 229, 229, 0.81);
    background: rgba(229, 229, 229, 0.27);
}

.pc-item .weui-cells {
    margin-top: 0 !important;
}

.buyer {
    vertical-align: middle;
    float: right;
}

.size-item {
    border: 1px solid #ececec;
    padding: 5px;
    /*height: 20px;*/
    background: rgba(238, 238, 238, 0.52);
    border-radius: 8px;
    /*line-height: 20px;*/
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
}

.size-item-selected {
    background: #d43c33;
    color: white;
}

body {
    background-color: white;
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
  Selector,
  XTable,XTextarea,
  Search,
  XInput,
  XDialog,
  Grid,
  GridItem,
  ButtonTab,
  ButtonTabItem,
  CheckIcon,
  Flexbox,
  Scroller,
  Cell,
  Group,
  CellFormPreview,
  Radio,
  PopupPicker,
  Popup,
  PopupRadio,
  XNumber,
  FlexboxItem,
  XHeader,
  Tab,
  Checker,
  Swiper,
  SwiperItem,
  CheckerItem,
  Sticky,
  TabItem
} from 'vux'
import {
  debounce
} from 'vux'
import Page from './Page'
export default {
  components: {
    XButton,XTextarea,
    Sticky,
    Page,
    Radio,
    XNumber,
    Selector,
    PopupPicker,
    Popup,
    PopupRadio,
    ButtonTab,
    ButtonTabItem,
    Swiper,
    Scroller,
    SwiperItem,
    XTable,
    Search,
    Grid,
    GridItem,
    XInput,
    Flexbox,
    XDialog,
    FlexboxItem,
    CheckIcon,
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
      list1: ['M', 'XL', 'XXL', '2XL', '3XL', '4XL'],
      show: false,
      beizhuDialog:false,
      search: {
        data: '',
        option: '订单号'
      },
      fatherTab: 0,
      pageNum: 1, //总页码
      currentPage: 1, //当前页
      size: false,
      popover: false,
      isopen: false,
      faisEdit: false,
      fahuo: false,
      editBeizhu:'',
      fahuoInput: {
        id: '',
        company: '韵达快递',
        track: '',
        action: ''
      },
      trackInfo: ['韵达快递', '顺丰'],
      searchInfo: ['订单号', '用户名'],
      demo2: false,
      demo01: 0,
      adminList: {
        fTabs: ['售前', '售中', '售后'],
        cTabs: [{
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
          "item": "已发货",
          "num": "0"
        }, {
          "item": "退款中",
          "num": "0"
        }],
        list: [{
            id: '1',
            sd_order_state: '交易成功',
            sd_user_id: '13',
            beizhu_admin:'发顺丰',
            user_name: 'text',
            right: {
              price_sjzf: '50',
              id: '21',
              tkTrack: '',
              beizhu: '',
              "orderid": "26511289102818075",
              button_text: "发布任务",
              button_type: "true",
              "buyer_nick": "anniewang919",
              "status": "买家已付款，等待卖家发货",
              "tracking_company": "缺失",
              "tracking": "缺失",
              netotal: '',
              "address_detail": "江苏省 苏州市 昆山市 开发区中园华园1588号常发香城名园13栋601室(215300)",
              "address_name": "王亦清",
              "address_phone": "13656267070",
              "total": "80.00",
              isTk: 'false',
              "yongjin": '',
              "time_buy": "2017-06-07 14:24",
              "list": [{
                label: 'E28787',
                color: '绿色',
                size: 'xxl',
                value: 2,
                tuikuan: '退款',
                check: 'false',
                status: '12312312',
                price: '',
                price_gs: '190',
                zhekou: '',
              }]
            },
            left: {
              price_sjzf: '19',
              beizhu: '手袋',
              id: '21',
              time: '2017-2-1',
              "orderid": "26511289102818075",
              button_text: "发布任务",
              button_type: "true",
              "buyer_nick": "anniewang919",
              "status": "买家已付款，等待卖家发货",
              "tracking_company": "缺失",
              "tracking": "缺失",
              netotal: '',
              "address_detail": "江苏省 苏州市 昆山市 开发区中园华园1588号常发香城名园13栋601室(215300)",
              "address_name": "王亦清",
              "address_phone": "13656267070",
              "total": "80.00",
              "yongjin": '',
              "time_buy": "2017-06-07 14:24",
              "list": [{
                label: 'E28787',
                color: '绿色',
                size: 'xxl',
                value: 2,
                status: '12312312',
                price: '',
                price_gs: '190',
                zhekou: '',
              }]
            }
          },
        ]
      },
      editwang: false,
      fabuedit: false,
      editGoods: false,
      sCrolleft: '',
      goods: {
        size: '',
        color: '',
        huohao: '',
        num: ''
      },
      edit: {
        wangwang: ''
      },
      items2: [0.14, 0.035, 0.07],
      fabu: {
        orderid: '',
        id: '',
        total: '',
        netotal: '',
        jsTotal: '',
        yongjin: "",
        list: [{
          fabuedit: false,
          label: '',
          color: '',
          size: '',
          num: '',
          price: '',
          value: '',
          zhekou: ''
        }]
      },
      importform: {
        radio2: 3,
        shop: ''
      },
      index: 0,
      Importorder: false,
      boxWidth: '',
      countNum: [],
      viewWidth: '',
      tabBoxwidth: '',
      istrackEditting: false,
      wrapperHeight: '',
      swiperItemIndex: 0,
      edittrack: {
        id: '',
        trackNum: '',
        com: '',
        key: ''
      },
      isPc: true,
      tkId: [],
      loadStatus: 'none' // none 请求前  success 请求成功
    }
  },
  mounted() {
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    console.log(this.adminList.cTabs.length);
    this.viewWidth = w / this.adminList.cTabs.length;
    this.boxWidth = w
    this.tabBoxwidth = w
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.swiperA.getBoundingClientRect().top;
    this.$store.state.vux.status = '所有'
    this.getlist()

  },
  methods: {
    finishBeizhu(){
      console.log(this.editBeizhu);
      this.beizhuDialog = false
      this.$vux.toast.text('成功!', 'middle')
      this.$http.post('http://sd.a10store.com/api/admin.order.info.beizhu.admin.update.php', {
        id: this.editBeizhu.id,beizhu:this.editBeizhu.beizhu_admin
      }).then(res => {

      }, res => {})
    },
    onEvent (event) {
          console.log('on', event)
        },
    goodsDelete(g, item, type) {
      console.log(g, item);
      this.$vux.confirm.show({
        title: '操作提示',
        content: '确认' + type + '?',
        onShow() {
          console.log('plugin show')
        },
        onHide() {
          console.log('plugin hide')
        },
        onCancel() {
          console.log('plugin cancel')
        },
        onConfirm() {
          if (type == "删除") {
            c.sd_order_state = '交易成功'
          } else {
            c.sd_order_state = '待发货'
          }
          _this.$vux.toast.text(type + '成功!', 'middle')
          _this.$http.post('http://sd.a10store.com/api/user.center.order.state.update.php', {
            w: c.id,
            istype: type
          }).then(res => {
            // _this.page = 1
            // _this.getlist();
          }, res => {

          })
        }
      })
    },
    onItemClick(index) {
      this.fatherTab = index
      this.currentPage = 1
      this.getlist()
    },
    //寄回单号
    trackEditting(item, index) {
      // console.log();


      this.istrackEditting = true
      this.edittrack = {
        id: item.right.id,
        trackNum: item.right.tkTrack,
        com: item.right.tkTrack_company,
        key: index
      }
    },
    //完成寄回单号操作
    finishTrack() {
      this.adminList.list[this.edittrack.key].right.tkTrack = this.edittrack.trackNum
      this.$http.post('http://sd.a10store.com/api/admin.order.tuikuan.wl.update.php', {
        editTrack: this.edittrack
      }).then(res => {
        // this.editGoods = false
        this.istrackEditting = false
        this.$vux.toast.show({
          text: '操作成功!',
          type: 'success',
          position: 'middle'
        })
        // this.getlist()
      }, res => {})

    },
    //退款操作
    rightTk(item) {
      item.right.isTk == 'true' ? item.right.isTk = 'false' : item.right.isTk = 'true'
    },
    checktype(g, item) {
      var name = "";
      switch (item.sd_order_state) {
        case "已发货":
          name = "需退货";
          break;
        case "待发货":
          name = "需退款";
          break;
          case "交易成功":
            name = "需售后";
            break;
      }
      if(item.right.isTk == 'true'){
        g.check == 'true' ? g.check = 'false' : g.check = 'true'
        if (g.check == 'true') {
          g.sd_goods_tuikuan_state = name
        } else {
          g.sd_goods_tuikuan_state = ''
        }
      }else {
        return
      }
    },

    consoleIndex(item, index) {
      this.$store.state.vux.tabs = index
      console.log(this.$store.state.vux.tabs);
      this.$store.state.vux.status = item.item
      this.getlist()
    },
    onCopy: function(e) {
      this.$vux.toast.text('复制成功!', 'top')
    },
    defaultPrice(g, index) {
      this.countPrice()
    },
    countPrice: debounce(function() {
      let countNums = []
      let countJ = []
      for (var i = 0; i < this.fabu.list.length; i++) {
        countNums.push(this.fabu.list[i].price * this.fabu.list[i].value)
        countJ.push(this.fabu.list[i].value)
      }
      if (this.fabu.yongjin != '') {
        countNums.push(this.fabu.yongjin)
      }
      console.log(this.fabu);
      this.fabu.netotal = Number(eval(countNums.join('+'))).toFixed(2)
      this.fabu.jsTotal = Number(eval(countJ.join('+'))).toFixed(0)
      // Math.floor()
    }, 500),
    priceOnchange(g) {

      g.price = Number(g.price_gs * g.zhekou * 1.1 + 10).toFixed(2)
      // Math.floor(g.price_gs * g.zhekou * 1.1 + 10)
      this.countPrice()
    },
    tofabuEdit(g) {
      console.log(g);
      g.fabuedit = true
    },
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
    onChange: debounce(function(val) {
      console.log(this.search);
      this.popover = false
      this.fatherTab = 0
      this.getlist()
    }, 500),
    onSubmit() {
      this.getlist()
    },
    onFocus() {
      console.log('onfocus' + this.search);
    },
    getlist() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      // this.loadStatus = 'none'
      this.$http.post('http://sd.a10store.com/api/admin.order.list.get.php?attrGroupId=1&pageSize=10', {
        menu: this.$store.state.vux.status,
        fatherTab: this.fatherTab,
        serach: this.search,
        pageNo: this.currentPage
      }).then(res => {
        this.$vux.loading.hide()
        this.adminList = res.body;
        this.pageNum = res.body.pageNum;
        // this.loadStatus = 'success';
      }, res => {
        this.$vux.loading.hide()
      })
    },
    //当点击其他页时， 会触发该方法，  设置currentPage为 点击的页码
    change(index) {
      this.currentPage = index;
      this.getlist();
    },
    left(item) {

      if (item.left.button_type == 'false') {
        return this.$vux.toast.show({
          text: '无法操作~',
          type: 'cancel'
        })
      } else {
        this.show = true
        this.fabu = item.left
      }
    },
    finishFahuo() {
      this.updateApi(this.fahuoInput.id, this.fahuoInput.action,this.fahuoInput.orderStatus,{company:this.fahuoInput.company,track:this.fahuoInput.track})
      this.fahuo = false
    },
    finshTk(item, action) {
      item.right.isTk = 'false'
      console.log(item);
      this.updateApi(item.id,action,item.sd_order_state,item.right.list)
      // this.$http.post('http://sd.a10store.com/api/admin.order.state.update.php', {
      //   gid: item.id,
      //   glist: item.right.list
      // }).then(res => {
      //   this.getlist()
      // }, res => {})
    },
    updateApi(id, action,orderstatus,data) {
      console.log(data);

      this.$http.post('http://sd.a10store.com/api/admin.order.state.update.php', {
        id: id,
        action: action,
        orderStatus:orderstatus,
        data: data
      }).then(res => {
        this.getlist()
        this.$vux.toast.show({
          text: action + '成功~'
        })
      }, res => {})
    },
    right(item, type) {
      if (type == '发布') {
        this.show = true
        this.fabu = item.left
      } else if (type == '退款' || type == '退货退款' ||type == '申请售后') {
        item.right.isTk == 'true' ? item.right.isTk = 'false' : item.right.isTk = 'true'

        console.log(item.right.isTk + 'istk');
      }
      // else if(type=='退货退款'){
      //   item.btnstatus == '退货退款' ? item.right.isTk = 'false' : item.right.isTk = 'true'
      // }
      else if (type == '发货') {
        console.log('发货');
        this.fahuo = true
        this.fahuoInput = {
          id: item.id,
          action: type,
          company: '韵达快递',
          track: '',
          orderStatus:item.sd_order_state
        }
      } else {
        var _this = this
        this.$vux.confirm.show({
          title: '是否' + type + '?',
          onCancel() {},
          onConfirm() {
            _this.updateApi(item.id,type,item.sd_order_state,item)
          }
        })
      }
    },
    toeditwang(c, item, index) {
      console.log(index);
      this.editwang = true;
      this.edit.index = index
      this.edit.id = item.weborder
      this.edit.wangwang = item.right.buyer_nick
    },
    finishwang() {
      this.adminList[this.edit.index].orderGet[0].buyer_nick = this.edit.wangwang;
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
        this.getlist()
        this.$vux.toast.show({
          text: '发布成功!',
          type: 'success',
          position: 'middle'
        })
        this.show = false
      }, res => {
        this.$vux.toast.show({
          text: '发布失败!',
          type: 'cancel',
          position: 'middle'
        })
      })

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
