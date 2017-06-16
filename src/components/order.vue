<template>
<div>
  <div style="height:44px;position: relative;">
    <sticky scroll-box="vux_view_box_body" class="mui-scrollspy" :offset="46" :check-sticky-support="false" :class="{open:isopen}">
      <div class="mui-scrollspy-text" v-if="isopen">切换</div>
      <a href="javascript:;" class="mui-scrollspy-btn" :style="{'z-index':zIndex}" @click="toopenTab">  <img v-if="!isopen" width="22" height="44" src="../svg/up.svg"/>
          <img v-if="isopen" width="22" height="44" src="../svg/down.svg"/>
        </a>
      <scroller lock-y :scrollbar-x=false class="scrollspy-iscroll" @on-scroll="onScroll" ref="scroller">
        <div class="box1" :style="{width:boxWidth + 'px'}">
          <div class="box1-item" :class="{itemselected:tabs==index}" :style="{width:viewWidth + 'px'}" v-for="(item, index) in orderlist.num" :key="index" @click="onItemClick(item,index)">
            <icon name="map-marker" class="mapicon" v-if="tabs == index"></icon>
            <span>{{item.item}} {{item.num}}</span></div>
        </div>
      </scroller>
    </sticky>
  </div>

  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="50" class="page-loadmore-wrapper thin-scroll" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <load-more v-if="!orderlist.list.length" :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
      <group v-else :title="'领取时间:'+ c.time+'  内部单号:  '+c.id" v-for="(c,index) in orderlist.list" :key="index">
        <cell title="依布科尚精选">
          <span slot="value" style="color:#FF905B">{{c.status}}</span>
        </cell>
        <cell :inline-desc="'订单编号'" :value="c.orderid" v-if="tabs!=0">
        </cell>
        <cell v-for="(g,index) in c.list" :key="index" :value="g.value+'件'" :inline-desc="'颜色分类:'+ g.color + '尺码:'+g.size">
          <img width="50" height="50" style="margin-right:15px" :src="g.src" slot="icon" @click="imgPreiviews(g.src)" />
          <div slot="title" v-clipboard:success="onCopy" v-clipboard:copy="g.label">{{g.label}} <img width="18" height="18" src="../svg/复制.svg" /></div>
        </cell>
        <cell :title="c.address_name">
          <div slot="inline-desc" v-clipboard:success="onCopy" v-clipboard:copy="c.address_detail">收货地址: {{c.address_detail}}<img width="18" height="18" src="../svg/复制.svg" /></div>
          <span slot="after-title">{{c.address_phone}}</span>
        </cell>
        <cell>
          <div slot="value">
            共{{c.list.length}}件商品 合计: ￥{{c.total}}
          </div>
        </cell>
        <div class="weui-form-preview__ft">
          <a v-if="tabs==2" @click="findtracking(c)" class="weui-form-preview__btn weui-form-preview__btn_default">查看物流 </a>
          <a v-if="tabs==0&&!edit" v-clipboard:success="onCopy" v-clipboard:copy="copyData" class="weui-form-preview__btn weui-form-preview__btn_default">复制链接</a>
          <a v-if="!edit" @click="tofinish(b,c)" v-for="(b,index) in c.button_text" :key="index" :class="{'weui-form-preview__btn_primary':b.class=='primary','weui-form-preview__btn_default':b.class=='default'}" class="weui-form-preview__btn">{{b.label}}</a>
          <a v-if="tabs==0|1|2&&edit" @click="togiveup(c)" class="weui-form-preview__btn weui-form-preview__btn_primary">放弃任务</a>
        </div>
      </group>
      <div slot="top" class="mint-loadmore-top">
        <span v-show="topStatus !== 'loading'&&topStatus !== 'pull'" :class="{ 'rotate': topStatus === 'drop' }">下拉刷新~</span>
        <span v-show="topStatus === 'loading'" style="line-height: 30px;"><spinner type="ios-small"></spinner>加载中...</span>
      </div>

    </mt-loadmore>
    <p v-show="loading" class="page-infinite-loading">
      <spinner type="ios-small"></spinner>加载中...
    </p>
  </div>
  <!--pulldown slot-->
  <!-- <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
        <span v-show="scrollstatus.pulldownStatus === 'default'"></span>

      </div> -->




  <x-dialog @on-show="rezIndex" @on-hide="hidezIndex" v-model="show" class="dialog-demo">
    <group>
      <x-input title="填入订单" v-model="forderid"></x-input>
      <div class="weui-form-preview__ft">
        <a @click="show=false" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a>
        <a @click="finishorder()" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
    </group>
  </x-dialog>
  <x-dialog @on-hide="hidezIndex" @on-show="rezIndex" v-model="showScrollBox" :dialog-style="{'max-width': '90%', width: '90%','text-align': 'left'}" class="dialog-tracking">
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
        <timeline-item v-for="(da,index) in tracking_info.data" :key="index">
          <h4 class="recent">{{da.context}}</h4>
          <p class="recent">{{da.time}}</p>
        </timeline-item>
      </timeline>
    </div>
    <div @click="showScrollBox=false" style="text-align:center;padding:10px">
      <span class="vux-close"></span>
    </div>
  </x-dialog>
  <x-dialog @on-show="rezIndex" @on-hide="hidezIndex" v-model="imgPreiview" class="dialog-demo">
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

.mint-loadmore-top {
  text-align: center;
}

.no-scroller::-webkit-scrollbar {
  display: none;
  width: 0
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

.page-infinite-loading {
  text-align: center;
  height: 50px;
  line-height: 50px;
}

.vux-tab-right {
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

.weui-form-preview__btn_primary {
  color: #FF905B
}

.weui-cells {
  font-size: 14px!important
}

.vux-popover {
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

.my-scrollbar {
  width: 35%;
  min-width: 300px;
  max-height: 450px;
}

.rotate {
  transform: rotate(-180deg);
}

.pulldown-arrow {
  display: inline-block;
  transition: all linear 0.2s;
  color: #666;
  font-size: 18px;
}

.ximg-demo {
  width: 100%;
}

.box1 {
  padding-left: 0;
  padding-right: 40px;
  position: relative;
}

.scrollspy-iscroll {
  position: relative;
  z-index: 1000;
  height: 44px;
  -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .2);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .2);
  background: #FFF;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.box1-item {
  display: inline-block;
  letter-spacing: 0;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  color: #757575;
  background: 0 0;
}

.box1-item span {
  display: inline-block;
  line-height: 44px;
  vertical-align: top;
  margin: 0 auto;
  position: relative;
}

.box1-item.itemselected span {
  color: #FF905B;
}
.box1-item.itemselected .mapicon{
  color:#FF905B
}

.tab {
  overflow: visible!important;
}

.listyle li {
  list-style: none;
  padding: 0px 15px 0px 15px;
  border-bottom: 1px solid #ececec!important;
}

.mui-scrollspy.open .scrollspy-iscroll {
  position: relative;
  height: auto!important;
  overflow: visible;
  opacity: 0.9;
}

.mui-scrollspy.open .scrollspy-iscroll:before {
  background-color: #fff !important;
}

.mui-scrollspy.open .mui-scrollspy-text {
  background-color: #fff;
  color: #ef2e2f;
}

.mui-scrollspy {
  margin-top: 0;
}

.mui-scrollspy.open .mui-scrollspy-text {
  display: block;
  height: 44px;
  line-height: 44px;
  padding-left: 17px;
  font-size: 12px;
}

.mui-scrollspy-text {
  display: none;
  background: #FFF;
  position: relative;
}

.mui-scrollspy.open .scrollspy-iscroll:before {
  position: absolute;
  left: 0;
  top: 0;
  content: ' ';
  display: block;
  height: 100%;
  width: 100%;
  background: #fff;
  opacity: .9;
}

.mui-scrollspy.open .box1 {
  white-space: initial;
}

.mui-scrollspy.open .box1-item {
  width: 33%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
}

.mui-scrollspy-btn {
  width: 40px;
  height: 44px;
  line-height: 44px;
  background: #FFF;
  border-left: 1px solid #EEE;
  position: absolute;

  right: 0;
  top: 0;
  text-align: center;
  color: #9E9E9E;
}

.mui-scrollspy-btn {
  background-color: #fff;
  border-left-color: #eee;
}

.page-loadmore-wrapper {
  overflow-y: scroll;
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
  FormPreview,
  XHeader,
  Popover,
  Timeline,
  Checklist,
  TimelineItem,
  Spinner,
  Cell,
  XDialog,
  XImg,
  XInput,
  CellFormPreview,
  Scroller,
  Divider,
  XButton,
  Search,
  Tab,
  TabItem,
  Sticky,
  Swiper,
  SwiperItem
} from 'vux'
import 'vue-awesome/icons/map-marker'
export default {
  components: {
    Group,
    Spinner,
    XHeader,
    Scroller,
    Popover,
    Divider,
    Checklist,
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
    rezIndex(val) {
      console.log(val);
      this.zIndex = 990
    },
    hidezIndex() {
      this.zIndex = 10002
    },
    loadTop() {
      this.getlist()
      this.$refs.loadmore.onTopLoaded();
    },
    loadMore() {
      this.loading = true;
      this.page++

      setTimeout(() => {
        this.$http.post('http://sd.a10store.com/api/user.center.order.get.php', {
          page: this.page,status:this.$store.state.vux.status
        }).then(res => {
          this.orderlist.list.push(res.body);
        }, res => {})
        console.log(this.page);
        console.log(this.orderlist);
        this.loading = false;
      }, 2500);
    },
    handleTopChange(status) {
      console.log(status);
      this.topStatus = status;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    change(val) {
      console.log('change', val)
    },
    onScroll(val) {
      console.log(val);
      this.sCrolleft = val.left
    },
    toopenTab() {
      this.isopen = !this.isopen
      let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (this.isopen) {
        this.boxWidth = w
        this.viewWidth = w / 4;
        this.$nextTick(() => {
          this.$refs.scroller.reset({
            left: 0
          });
        })
      } else {
        console.log(this.viewWidth);
        this.boxWidth = this.viewWidth * this.orderlist.num.length + 40
        this.$nextTick(() => {
          this.$refs.scroller.reset({
            left: this.sCrolleft
          }); //重置位置到原始点击位置
        })

      }
    },

    togiveup(item) {
      console.log(item.id);
      var _this = this
      this.$vux.confirm.show({
        title: '确认放弃该单？',
        onConfirm() {
          _this.$http.post('http://sd.a10store.com/api/order.reset.php', {
            id: item.id
          }).then(res => {
            _this.$store.state.vux.edit = false
            _this.$vux.toast.show({
              text: '放弃成功!',
              type: 'success',
              position: 'middle'
            })
            _this.getlist()
          }, res => {

          })

        }
      })
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
    tofinish(cid, item) {
      var _this = this
      this.$store.state.vux.iid = item.id
      if (cid.class == 'default') {
        this.$vux.toast.text('不可操作~', 'middle')
      } else {
        if (cid.label == "输入订单号") {
          this.show = true
        } else {
          this.zIndex = 990
          this.$vux.confirm.show({
            title: '是否' + cid.label + '?',
            onCancel() {
              _this.zIndex = 10002
              console.log(_this.zIndex);
            },
            onConfirm() {
              _this.$http.post('http://sd.a10store.com/api/user.center.order.state.update.php', {
                action: _this.$store.state.vux.status,
                label: cid.label,
                id: item.id
              }).then(res => {
                _this.$vux.toast.text('提交成功!', 'middle')
                console.log(res);
              }, res => {})
            }
          })
        }
      }

    },
    finishorder() {
      this.$http.post('http://sd.a10store.com/api/user.center.order.id.jh.update.php', {
        forder: this.forderid,
        w: this.$store.state.vux.iid
      }).then(res => {
        this.$vux.toast.text('提交成功!', 'middle')
        this.show = false
        this.getlist()
      })
    },
    onItemClick(i, index) {
      // this.$store.commit('increment')
      this.boxWidth = this.viewWidth * this.orderlist.num.length + 40

      this.isopen = false
      this.$store.state.vux.tabs = index
      this.$nextTick(() => {
        this.$refs.scroller.reset({
          left: this.viewWidth * this.$store.state.vux.tabs
        });
      })
      this.$store.state.vux.status = i.item
      this.getlist()
    },
    onCopy: function(e) {
      this.$vux.toast.text('复制成功!', 'top')
    },
  },
  watch: {
    status(curVal, oldVal) {　　　　　　　　　　
      console.log('status'+curVal, oldVal);　　　　　　　　
    },
    tabs(curVal, oldVal) {　　　　　　　　　　
      console.log(curVal, oldVal);　　　　　　　　
    },
  },
  mounted() {
    console.log(this.$store.state.vux.status);
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.viewWidth = w / 4;
    this.$nextTick(() => {
      this.$refs.scroller.reset({
        left: this.viewWidth * this.$store.state.vux.tabs
      });
    })
    this.boxHeight = h
    this.boxWidth = this.viewWidth * this.orderlist.num.length + 40
    this.$store.state.vux.edit = false
    this.getlist()
  },
  computed: {
    status() {
      return this.$store.state.vux.status
    },
    tabs() {
      return this.$store.state.vux.tabs
    },
    edit() {
      return this.$store.state.vux.edit
    }
  },
  data() {
    return {
      results: [],
      page: 1,
      sCrolleft: '',
      isopen: false,
      zIndex: 10002,
      resize: '',
      boxWidth: '',
      loading: false,
      wrapperHeight: 0,
      allLoaded: '',
      boxHeight: '',
      topStatus: '',
      imgPreiview: false,
      imgView: '',
      istab: '',
      labelPosition: '',
      error: '',
      viewWidth: 0,
      checklist001: [],
      index: 2,
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
          "button_text": [{
            label: "输入订单号",
            class: "primary"
          }],
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
          "button_text": [{
            label: "付款",
            class: "primary"
          }],
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
          "button_text": [{
            label: "付款",
            class: "primary"
          }],
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
            "no": 1,
            "item": "待下单",
            "num": "0"
          },
          {
            "no": 2,
            "item": "待审核",
            "num": "1"
          },
          {
            "no": 3,
            "item": "待付款",
            "num": "0"
          },
          {
            "no": 4,
            "item": "待发货",
            "num": "0"
          },
          {
            "no": 5,
            "item": "待收货",
            "num": "17"
          },
          {
            "no": 6,
            "item": "退款/售后",
            "num": "0"
          },
          {
            "no": 7,
            "item": "交易成功",
            "num": "0"
          },
          {
            "no": 8,
            "item": "交易关闭",
            "num": "0"
          }
        ]
      }

    }
  }
}
</script>
