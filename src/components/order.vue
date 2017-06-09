<template>
<div class="order">
  <div style="height:44px;">
  <sticky scroll-box="vux_view_box_body" :offset="46" :check-sticky-support="false">

       <div style="width: 100%;overflow:scroll;-webkit-overflow-scrolling:touch;" class="no-scroller">
      <tab v-model="tabs" :style="{width:box+'px'}" :line-width="1" >
        <tab-item :selected="tabs == index"  v-for="(item, index) in orderlist.num" :key="index" @click.native="onItemClick(item,index)">
          <a>{{item.item}} {{item.num}}</a>
        </tab-item>
      </tab>
    </div>
  </sticky>

  </div>
  <load-more v-if="!orderlist.list.length" :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
  <group :title="'领取时间:'+ c.time+'  内部单号:  '+c.id" v-for="(c,index) in orderlist.list" :key="index">
    <cell title="付款金额" :value="c.total">
    </cell>
    <cell :inline-desc="'订单编号'" :value="c.orderid">
    </cell>
    <cell v-for="(g,index) in c.list" :key="index" :value="g.value+'件'" :inline-desc="'颜色分类:'+ g.color + '尺码:'+g.size">
      <img width="50" height="50" style="margin-right:15px" :src="g.src" slot="icon" @click="imgPreiviews(g.src)" />
      <div slot="title" v-clipboard:success="onCopy" v-clipboard:copy="g.label">{{g.label}} <img width="18" height="18" src="../svg/复制.svg" /></div>
    </cell>
    <cell :title="'收货人'" :value="c.address_name">
      <div slot="inline-desc" v-clipboard:success="onCopy" v-clipboard:copy="c.address_detail">收货地址: {{c.address_detail}}<img width="18" height="18" src="../svg/复制.svg" /></div>
    </cell>
    <cell title="手机" :value="c.address_phone">
    </cell>
    <div class="weui-form-preview__ft">
      <a v-if="tabs==2" @click="findtracking(c)" class="weui-form-preview__btn weui-form-preview__btn_default">查看物流 </a>
      <!-- <a v-if="tabs==1" v-clipboard:success="onCopy" v-clipboard:copy="c.address_detail" class="weui-form-preview__btn weui-form-preview__btn_default">复制地址</a> -->
      <a v-if="tabs==0" v-clipboard:success="onCopy" v-clipboard:copy="copyData" class="weui-form-preview__btn weui-form-preview__btn_default">复制链接</a>
      <a @click="tofinish(c)" class="weui-form-preview__btn weui-form-preview__btn_primary">{{c.button_text}}</a></div>
  </group>

  <x-dialog v-model="show" class="dialog-demo">
    <group>
      <x-input title="填入订单" v-model="forderid"></x-input>
      <div class="weui-form-preview__ft">
        <a @click="show=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
        <a @click="finishorder()" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
    </group>
  </x-dialog>
  <x-dialog v-model="showScrollBox" :dialog-style="{'max-width': '90%', width: '90%','text-align': 'left'}" class="dialog-tracking">
    <div class="dialog-title">
      <p style="text-align:center;padding: 10px;">
        <span v-if="tracking_info.ischeck==0">卖家已发货</span>
        <span v-if="tracking_info.ischeck==1">已签收</span>
      </p>
      <group>
        <cell :title="trakID" is-link style="background: #20A0FF;margin: 0">
          <img slot="icon" width="50" height="50" style="margin-right:20px" />
          <span slot="inline-desc" class="dialog-cell">{{tracking_info.com}}: <span v-clipboard:success="onCopy" v-clipboard:copy="tracking_info.nu">{{tracking_info.nu}}<img width="18" height="18" src="../svg/复制0.svg"/></span></span>
          <span slot="value" class="dialog-cell">共{{trakNum}}件</span>
        </cell>
      </group>
    </div>
    <div class="thin-scroll" style="height:200px;padding:15px 0;overflow-y: scroll;;-webkit-overflow-scrolling:touch;">
      <timeline>
        <timeline-item v-for="da in tracking_info.data">
          <h4 class="recent">{{da.context}}</h4>
          <p class="recent">{{da.time}}</p>
        </timeline-item>
      </timeline>
    </div>
    <div @click="showScrollBox=false" style="text-align:center;padding:10px">
      <span class="vux-close"></span>
    </div>
  </x-dialog>
  <x-dialog v-model="imgPreiview" class="dialog-demo">
    <div class="thin-scroll" style="overflow-y:scroll;overflow-x:hidden;-webkit-overflow-scrolling:touch;">
      <img :src="imgView" class="ximg-demo"></x-img>
    </div>
    <div @click="imgPreiview=false">
      <span class="vux-close"></span>
    </div>
  </x-dialog>
</div>
</template>
<style>
.group {
  margin-top: 44px
}

.dialog-tracking .weui-cell_access .weui-cell__ft:after {
  border-color: white;
}
.no-scroller::-webkit-scrollbar {
    display: none;
}

.vux-timeline ul li:first-child {
  color: black;
  font-size: 16px;
}

.vux-timeline-item {
  color: #999999;
  font-size: 14px;
  font-weight: 100;
}
.scroller .vux-tab-item {
    display: block;
    height: 44px;
    text-align: center;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-scroll-snap-coordinate: -26.78571429% 0;
    position: relative;
}
.scroller {
  display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
width: 100%;
-webkit-box-sizing: border-box;
box-sizing: border-box;
overflow-x: auto;
background-color: #fff;
position: relative;
z-index: 0;
-webkit-overflow-scrolling: touch;
-webkit-scroll-snap-type: mandatory;
}
.dialog-tracking .weui-cells {
  margin: 0
}
.vux-tab-right{
  position: absolute;
  border-left: 1px solid #e5e5e5;
right: 0;
top: 0;
width: 50px;
height: 44px;
    line-height: 44px;
background: -webkit-linear-gradient(top, #e5e5e5, #e5e5e5, rgba(229, 229, 229, 0)) bottom left no-repeat;
background: linear-gradient(180deg, #e5e5e5, #e5e5e5, rgba(229, 229, 229, 0)) bottom left no-repeat;
background-size: 100% 1px;
}

.thin-scroll::-webkit-scrollbar {
  width: 5px;
}
.vux-popover{
  top: 44px!important;
  position: fixed;
 left: initial!important;
width: auto;
right: 0!important;
top: 0;
background-color: #35495e;
color: #fff;
border-radius: 3px;
z-index: 500;
}
.thin-scroll::-webkit-scrollbar-thumb {
  background-color: #A6A6A6;
  border-left: 2px solid transparent;
}

.thin-scroll::-webkit-scrollbar-track {
  background-color: #E5E5E5;
  border-left: 2px solid transparent;
}
.my-scrollbar{
  width: 35%;
  min-width: 300px;
  max-height: 450px;
}
.vux-tab-item.tab-selected {
    color: #04BE02;
    border-bottom: 3px solid #04BE02;
}
.ximg-demo{
  width: 100%;
}
.tab{
  overflow: visible!important;
}
.listyle li{
  list-style: none;
  padding: 0px 15px 0px 15px;
border-bottom: 1px solid #ececec!important;
}
/*.vux-tab{
  padding-right: 45px
}*/
</style>
<style lang="less" scoped>
@import '~vux/src/styles/close';

.dialog-tracking {
    .dialog-cell {
        color: white;
    }
    .weui-cell__ft::after {
        border-color: white;
    }
    .dialog-title {
        background: #20A0FF!important;
        line-height: 30px;
        color: white;
        font-size: 20px;
    }
    .weui-cells:before {

        border-top: 0!important;
    }
}
</style>
<script>
 // require("vue2-scrollbar/style/vue2-scrollbar.css")
import {
  Group,
  FormPreview,Popover ,
  Timeline,
  TimelineItem,
  Cell,
  XDialog,
  XImg,
  XInput,
  CellFormPreview,Scroller,Divider ,
  XButton,
  Search,
  Tab,
  TabItem,
  Sticky,
  Swiper,
  LoadMore,
  SwiperItem
} from 'vux'

export default {
  components: {
    Group,Scroller,Popover ,Divider ,
    LoadMore,
    XImg,
    Search,
    Sticky,
    FormPreview,
    Timeline,
    TimelineItem,
    Swiper,
    SwiperItem,
    XDialog,
    Tab,
    TabItem,
    Cell,
    XInput,
    CellFormPreview,
    XButton,
  },
  methods: {
    onScroll (index) {
      console.log(index);
   },
    getlist() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.post('http://sd.a10store.com/api/user.center.order.get.php', {
        status: this.$store.state.vux.status
      }).then(res => {
        this.$vux.loading.hide()
        this.orderlist = res.body;
      }, res => {
        this.$vux.loading.hide()
      })
    },
    imgPreiviews(index) {
      console.log(this.imgView);
      let reimg = index.replace(/_50x50.jpg/, "")
      this.imgPreiview = true
      this.imgView = reimg
      // this.$refs.imgView.src
    },
    findtracking(track) {
      this.showScrollBox = true
      console.log(track);
      this.trakNum = track.list.length
      this.trakID = track.list[0].label
      this.$vux.loading.show({
        text: '加载中...'
      })
      this.$http.post('http://sd.a10store.com/api/wl.info.get.php', {
        tracking: track.tracking,
        com: track.tracking_company
      }).then(res => {
        this.$vux.loading.hide()
        if (res.body.message == '参数错误') {
          this.$vux.toast.show({
            type: 'warn',
            position: 'middle',
            text: '未查询到数据'
          })
          this.showScrollBox = false
        } else {
          this.tracking_info = res.body
        }
      }, res => {
        // this.showScrollBox = false
        this.$vux.loading.hide()
        // this.$vux.toast.show({
        //   type: 'warn',
        //   position: 'middle',
        //   text: '未查询到数据'
        // })
      })
    },
    tofinish(cid) {
      var _this = this
      this.cid = cid.id
      if (cid.button_text != "输入订单号") {
        this.$vux.confirm.show({
          title: '是否' + cid.button_text + '?',
          onCancel() {},
          onConfirm() {
            _this.$vux.toast.text('提交成功!', 'top')
          }
        })
      } else {
        this.show = true
      }
    },
    finishorder() {
      this.$http.post('http://sd.a10store.com/api/user.center.order.id.jh.update.php', {
        forder: this.forderid,
        w: this.cid
      }).then(res => {
        this.$vux.toast.text('提交成功!', 'top')
        this.show = false
        this.$http.post('http://sd.a10store.com/api/user.center.order.get.php', {
          status: this.status
        }).then(res => {
          console.log(res);
          this.orderlist = res.data.list;
        }, res => {})
      })
    },
    onItemClick(i, index) {
      this.$store.state.vux.tabs = index
      // this.istab = index
      this.getlist(i)
    },
    onCopy: function(e) {
      this.$vux.toast.text('复制成功!', 'top')
    },
  },

  mounted() {
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if(w<1366){
      this.resize = w/4;
      this.box = this.resize*this.orderlist.num.length
    }
    this.getlist()
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
      results: [],
      resize:'',
      box:'',
      imgPreiview: false,
      imgView: '',
      istab:'',
      index:2,
      value: '',
      copyData: 'https://s.click.taobao.com/SjggJkw',
      show: false,
      trakID: '',
      trakNum: '',
      showScrollBox: false,
      forderid: '',
      cid: '',
      tracking_info: {
        "message": "ok",
        "nu": "3936190754774",
        "ischeck": "1",
        "condition": "F00",
        "com": "yunda",
        "status": "200",
        "state": "3",
        "data": [{
          "time": "2017-06-03 12:42:05",
          "ftime": "2017-06-03 12:42:05",
          "context": "[江苏江阴公司]快件已被 已签收 签收",
          "location": "江苏江阴公司"
        }, {
          "time": "2017-06-03 09:12:31",
          "ftime": "2017-06-03 09:12:31",
          "context": "[江苏江阴公司]进行派件扫描；派送业务员：青阳分部；联系电话：18861651399",
          "location": "江苏江阴公司"
        }, {
          "time": "2017-06-03 06:45:20",
          "ftime": "2017-06-03 06:45:20",
          "context": "[江苏江阴公司]到达目的地网点，快件将很快进行派送",
          "location": "江苏江阴公司"
        }, {
          "time": "2017-06-02 23:17:38",
          "ftime": "2017-06-02 23:17:38",
          "context": "[江苏苏州分拨中心]从站点发出，本次转运目的地：江苏江阴公司",
          "location": "江苏苏州分拨中心"
        }, {
          "time": "2017-06-02 20:23:37",
          "ftime": "2017-06-02 20:23:37",
          "context": "[江苏无锡北塘区北塘公司]进行下级地点扫描，将发往：江苏江阴公司",
          "location": "江苏无锡北塘区北塘公司"
        }, {
          "time": "2017-06-02 18:20:24",
          "ftime": "2017-06-02 18:20:24",
          "context": "[江苏无锡北塘区北塘公司]进行揽件扫描",
          "location": "江苏无锡北塘区北塘公司"
        }]
      },
      orderlist: {
        "list": [{
          "id": "60",
          "orderid": "23018743799339302",
          "address_detail": "山东省 青岛市 黄岛区 辛安街道山东科技大学家属区B区23号楼一单元301(266590)",
          "address_name": "王农",
          "address_phone": "15966826831",
          "tracking_company": "缺失",
          "tracking": "缺失",
          "total": "19.00",
          "time": "2017-06-06 16:17",
          "num": "",
          "button_text": "输入订单号",
          "list": [{
            "label": "Y13B171",
            "color": "绿底红花",
            "src": "https://gd3.alicdn.com/imgextra/i3/0/TB1cedJIFXXXXaNaXXXXXXXXXXX_!!0-item_pic.jpg_50x50.jpg",
            "size": "XL",
            "value": "1"
          }]
        }, {
          "id": "61",
          "orderid": "23034781589339302",
          "address_detail": "江苏省 徐州市 邳州市 运河街道华山路明珠小区西门向北50米(菜鸟驿站:13063537775)(000000)",
          "address_name": "邵士勇",
          "address_phone": "15852275386",
          "tracking_company": "缺失",
          "tracking": "缺失",
          "total": "19.00",
          "time": "2017-06-06 16:01",
          "num": "",
          "button_text": "输入订单号",
          "list": [{
            "label": "Y14A004",
            "color": "粉色",
            "src": "https://gd3.alicdn.com/imgextra/i3/0/TB1bq..HpXXXXcQapXXXXXXXXXX_!!0-item_pic.jpg_50x50.jpg",
            "size": "L",
            "value": "1"
          }]
        }, {
          "id": "45",
          "orderid": "111111",
          "address_detail": "广东省 深圳市 南山区 西丽街道留仙洞村46栋(518052)",
          "address_name": "容雪芬",
          "address_phone": "13682477814",
          "tracking_company": "缺失",
          "tracking": "缺失",
          "total": "38.00",
          "time": "2017-06-04 22:32",
          "num": "",
          "button_text": "输入订单号",
          "list": [{
            "label": "Y14B101",
            "color": "黄色",
            "src": "https://gd2.alicdn.com/imgextra/i1/2002028931/TB2tw3duXXXXXaGXpXXXXXXXXXX_!!2002028931.jpg_50x50.jpg",
            "size": "M",
            "value": "1"
          }, {
            "label": "Y13B113",
            "color": "湖蓝色",
            "src": "https://gd4.alicdn.com/imgextra/i4/2002028931/TB2XVD4o7qvpuFjSZFhXXaOgXXa_!!2002028931.jpg_50x50.jpg",
            "size": "M",
            "value": "1"
          }]
        }],
        "info": "获取待付款列表",
        "num": [{
          "item": "待下单",
          "num": "0"
        }, {
          "item": "待付款",
          "num": "0"
        }, {
          "item": "待收货",
          "num": "0"
        }, {
          "item": "退款/售后",
          "num": "0"
        }, {
          "item": "退款/售后",
          "num": "0"
        }, {
          "item": "退款/售后",
          "num": "0"
        }]
      }

    }
  }
}
</script>
