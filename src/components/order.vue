<template>
<div>

  <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;">订单
    <div slot="right" style="height:20px" @click="showfilter = true" class="header-right">
      <icon name="filter" style="float:left"></icon>
      <span v-if="pagefilter.length" class="ifhasFilter">{{pagefilter.length}}</span>
    </div>
  </x-header>
  <search @on-submit="onSubmit" :auto-fixed="false" @on-change="searchApi" v-model="search" @on-focus="onFocus" @on-cancel="onCancel"></search>
  <!-- <sticky scroll-box="vux_view_box_body" class="mui-scrollspy" :offset="46" :check-sticky-support="false" :class="{open:isopen}">
    <div class="mui-scrollspy-text" v-if="isopen">切换</div>
    <a ref="scrollspybtn" href="javascript:;" class="mui-scrollspy-btn" :style="{'z-index':zIndex}" @click="toopenTab">
      <icon v-if="!isopen" name="chevron-down" style="color:#d43c33" scale="1"></icon>
      <icon v-if="isopen" name="chevron-up" style="color:#d43c33" scale="1"></icon>
    </a>
    <scroller lock-y :scrollbar-x=false class="scrollspy-iscroll" @on-scroll="onScroll" ref="scroller">
      <div class="box1" :style="{width:boxWidth + 'px'}">
        <div class="box1-item" :class="{itemselected:tabs==index}" :style="{width:viewWidth + 'px'}" v-for="(item, index) in orderlist.num" :key="index" @click="onItemClick(item,index)">
          <icon name="map-marker" class="mapicon" v-if="tabs == index"></icon>
          <span>{{item.item}} {{item.num}}</span>
        </div>
      </div>
    </scroller>

  </sticky> -->
  <div v-if="pagefilter.length">
       <div class="sortMenu clearfix " >
        <ul class="sortMenu-ul " :style="{'min-width':viewWidth*pagefilter.length+10*pagefilter.length+100 + 'px'}">
          <li @click="removeFilter(item,index)" :style="{width:(boxWidth-70-10*pagefilter.length)/3 + 'px'}"  class="cell" v-for="(item, index) in pagefilter" :key="index">
            <span class="remove">{{item}}</span>
          </li>
        </ul>
        <div class="all" >
        <span class="empty" @click="resetFilter">清空</span>
        </div>

      </div>
</div>
  <!-- <div>
    <x-switch v-show="status=='待收货'" title="默认设置"></x-switch>
  </div> -->
  <!-- v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50" -->
  <div class="page-infinite-wrapper thin-scroll" ref="wrapper" :style="{height:wrapperHeight+'px','overflow': 'scroll'}">
    <mt-loadmore :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore">
      <group :title="'  内部单号:  '+c.id" v-for="(c,index) in orderlist.list" :key="index">
        <cell>
          <span slot="title" class="clipbtn" v-clipboard:copy="c.orderid" v-clipboard:success="onCopy">{{c.orderid}}
            </span>
          <!-- <span slot="value" >{{c.status}}</span> -->
          <!-- class="order-status" -->
          <span slot="value" style="color:#d43c33">
            {{c.sd_order_state}}
          </span>
        </cell>
        <cell :inline-desc="'备注:  '+c.beizhu">
        </cell>

        <cell :inline-desc="'寄回单号'" v-if="status=='退款/售后'">
          <span slot="value">{{c.tkTrack}}
            </span>
        </cell>
        <cell v-for="(g,index) in c.list" :key="index" :inline-desc="'颜色分类:'+ g.color + '尺码:'+g.size">
          <span slot="value"><span class="font-Big20">{{g.value}}</span> 件
          <span v-if="g.sd_goods_tuikuan_state=='已申请'" style=" margin-left: 10px;color: #d43c33;">{{g.sd_goods_tuikuan_state}}</span>
          <div>
            <span class="handlebtn fl-left" v-show="g.sd_goods_tuikuan_state=='需退货'" @click="goodHandle(g,'确认退货',c)">确认退货</span>
            <span class="handlebtn fl-left" v-show="g.sd_goods_tuikuan_state=='需退款'" @click="goodHandle(g,'确认退款',c)">确认退款</span>
            <span class="handlebtn fl-left" v-show="g.sd_goods_tuikuan_state=='需售后'" @click="goodHandle(g,'确认售后',c)">确认售后</span>
            <span class="handlebtn fl-left" v-show="c.sd_order_state=='已领取'" v-clipboard:success="onCopy" v-clipboard:copy="g.label">复制</span>
          </div>
          </span>

          <a slot="icon" class="imgs" href="https://uland.taobao.com/coupon/edetail?activityId=48256a5ce5fc480999bb05f031b08b5a&itemId=536336330892&pid=mm_121543781_20942779_70836990&dx=1&src=tkm_tkmwz" target="_blank">
            <icon class="img-link" name="link"></icon>
            <img class="previewer-demo-img" width="50" height="50" style="margin-right:15px" :src="g.src" />
          </a>

          <div slot="title">{{g.label}}
          </div>

        </cell>

        <cell>
          <div slot="title" :key="index" v-clipboard:copy="c.address_name" v-clipboard:success="onCopy">{{c.address_name}}
          </div>
          <div slot="inline-desc" :key="index" v-clipboard:success="onCopy" v-clipboard:copy="c.address_detail">收货地址: {{c.address_detail}}

          </div>
          <span slot="after-title" :key="index" v-clipboard:success="onCopy" v-clipboard:copy="c.address_phone">{{c.address_phone}}
          </span>
        </cell>
        <cell>

          <div slot="value">
            共<span class="font-Big20">{{c.list.length}}</span>件商品 合计: ￥{{c.total}}
          </div>
        </cell>
        <div class="weui-cell" style="justify-content:flex-end;height:20px">
          <template v-if="c.sd_order_state =='待付款'">
            <div class="handlebtn" @click="togiveup(c)">取消订单</div>
            <div class="handlebtn highlight" @click="toPay(c,'付款')">付款</div>
</template>
          <template v-if="c.sd_order_state =='已领取'">
<div class="handlebtn" @click="togiveup(c)">
  取消订单</div>
<div class="handlebtn" v-clipboard:success="onCopy" :key="index" v-clipboard:copy="copyData">复制淘口令</div>
<div class="handlebtn highlight" v-if="isCopy" @click="typing(c,'输入订单号')">输入订单号</div>
</template>
            <template v-if="c.sd_order_state =='待审核'">
<div class="handlebtn highlight" @click="typing(c,'修改订单号')">
  修改订单号</div>
</template>
            <template v-if="c.sd_order_state =='待签收'">
<div class="handlebtn highlight" @click="toPay(c,'确认收货')">
  确认收货</div>
</template>
        </div>
      </group>

      <infinite-loading :on-infinite="loadMore" ref="infiniteLoading">
        <span slot="no-more">暂时没有数据了 :)</span>
        <span slot="no-results">暂时没有数据了 :)</span>
      </infinite-loading>
    <div slot="top" class="mint-loadmore-top" style="text-align:center">
      <span v-show="moveTranslate > 1&&topStatus !=='loading'">
        <template v-if="moveTranslate < 2&&moveTranslate>
 1 "> 下拉即可刷新...
</template>
        <template v-if="moveTranslate  >
 2"> 释放即可刷新...
</template>
      </span>
        <span v-show="topStatus === 'loading'">
          <spinner type="ios"></spinner>
        </span>
      </div>
</mt-loadmore>
  </div>
  <div v-transfer-dom >
      <popup v-model="showfilter" width="80%" position="right" >
        <div class="thin-scroll" ref="filter" :style="{height:filterMainH-50+'px','overflow':'auto'}">
          <group :key="index" v-for="(com,index) in commonList">
          <checklist :title="com.group" label-position="left" required :options="com.list" v-model="com.pagefilter" @on-change="pagefilterchange(com,index)"></checklist>
          </group>
        </div>


        <div class="weui-form-preview__ft bottom-fixed">
          <a href="javascript:" @click="resetFilter" class="weui-form-preview__btn weui-form-preview__btn_default">重置</a>
          <a href="javascript:" @click="tofilter" class="weui-form-preview__btn weui-form-preview__btn_primary">完成</a></div>
      </popup>
    </div>
</div>
</template>
<style>
.header-right svg{
  height: 100%;
    pointer-events: none; /* so that you can resize the element */
}
.ifhasFilter{
      margin-left: 5px;
  border: 1px solid;
padding: 0px 4px;
border-radius: 3px;
float: right;
}
/* 分类菜单*/
.sortMenu{
  width: 100%;
  /*background-color:#fff;*/
  overflow-x: scroll;
  -webkit-overflow-x: scroll;
}
.sortMenu::-webkit-scrollbar{
  width: 0;
  height: 0;
  background-color: #fff;
}
.sortMenu-ul {
  min-width:325px;
  display: flex;
border-bottom: 1px solid #e3e3e8;
  justify-content: flex-start;
}
.sortMenu .empty{
  padding: 3px 12px;
    font-size: 13px;
    border-radius: 3px;
    border: 1px solid #e3e3e8;
    color: #696969;
    font-weight: 400;
}
.sortMenu .cell{
  display: inline-block;
  font-size: 14px;
  margin: 5px;
  padding:5px;
  background: white;
  /*height: 40px;*/
  /*line-height: 40px;*/
  border-radius: 3px;
border: 1px solid #e3e3e8;
  text-align: center;
  position: relative;
      text-overflow: ellipsis;
    word-break: keep-all;
}
.sortMenu .cell .remove{
  cursor: pointer;
}
.sortMenu .cell .remove::after{
  content: " X";
  color: gray;
  margin-left: 5px
}
.sortMenu .cell.special a{
  color: #ff474c;
}
.sortMenu .cell.special:before {
  content: '';
  height: 2px;
  width: 100%;
  background: #ff474c;
  position: absolute;
  bottom: 0px;
}
.sortMenu .all{
  right: 0;
  top: 90px;
height: 44px;
  width: 70px;
  position: fixed;
  background: whitesmoke;
  z-index: 10;
  display: flex;
  justify-content:center;
  align-items:center;
}
.sortMenu .all:before{
  content: '';
  height: 80%;
  width: 1px;
  position: absolute;
  box-shadow: 1px 0px 1px #e0e0e0;
  left: 0px;
}
.bottom-fixed {
  position: absolute!important;
  bottom: 0;
  width: 100%;
  background: white;
}

.copyText {
  padding: 2px 15px 2px 15px;
  border-radius: 3px;
  color: #565656;
  border: 1px solid grey;
}

.fangStatus {
  color: white;
  background: #d43c33;
  padding: 5px;
}

.order-status {
  border: 1px solid #d43c33;
  padding: 2px;
  border-radius: 5px;
  display: inline-block;
  color: #d43c33;
}

.vux-label-desc {
  font-size: 12px;
}

.handlebtn {
  border: 1px solid #ececec;
  border-radius: 40px;
  margin-left: 15px;
  padding: 3px;
  padding-left: 15px;
  padding-right: 15px;
}

.handlebtn.highlight {
  border: 1px solid #d43c33;
  color: #d43c33
}

.handlebtn:active {
  background: #d43c33;
  color: white
}

.imgs {
  width: 50px;
  position: relative;
}

.img-link {
  position: absolute;
  right: 15px;
  color: #d43c33
}

.fl-left {
  float: left;
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


.page-infinite-loading {
  text-align: center;
  height: 50px;
  line-height: 50px;
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

.thin-scroll::-webkit-scrollbar-thumb {
  background-color: #A6A6A6;
  border-left: 2px solid transparent;
}

.thin-scroll::-webkit-scrollbar-track {
  background-color: #E5E5E5;
  border-left: 2px solid transparent;
}

.box1 {
  padding-left: 0;
  padding-right: 40px;
  position: relative;
}

.scrollspy-iscroll {
  position: relative;
  z-index: 499;
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
  color: #d43c33;
}

.box1-item.itemselected .mapicon {
  color: #d43c33
}
</style>

<script>
import {
  Group,
  FormPreview,
  TransferDom,
  Popup,
  XHeader,
  Popover,
  Previewer,
  Timeline,
  Checklist,
  TimelineItem,
  Spinner,
  XSwitch,
  Cell,
  XDialog,
  XImg,
  XInput,
  CellFormPreview,
  Confirm,
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
import {
  debounce
} from 'vux'
import InfiniteLoading from 'vue-infinite-loading'
import clipboard from 'clipboard/dist/clipboard.min.js'

export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    Popup,
    Spinner,
    XSwitch,
    Confirm,
    InfiniteLoading,
    XHeader,
    Previewer,
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
  watch: {
    showfilter(newFilter, oldfilter) {
      if (newFilter) {
        console.log(this.status);

        this.filterMainH = document.documentElement.clientHeight - this.$refs.filter.getBoundingClientRect().top;
        console.log(this.filterMainH);
      }
    }
  },
  methods: {
    removeFilter(item,index){
      console.log(item);
      this.pagefilter.splice(index,1)
      var _this = this
      this.commonList.forEach(function(com){
        com.pagefilter.forEach(function(page,i){
          console.log(page==item);
          if(page==item){
            com.pagefilter.splice(i,1)
            // com.pagefilter.replace(/item/g, "")
          }
         });
        //  console.log(item);-
       });
       this.getlist()
       console.log(this.commonList);
    },
    pagefilterchange(val,index) {
      console.log('change', val)
      // this.pagefilter.push(val.pagefilter)

    },

resetFilter(){
  this.pagefilter = []
  this.wrapperHeight = this.wrapperHeight - 45
  this.commonList.forEach(function(item){
    item.pagefilter = []
    //  console.log(item);-
   });
},
    goodHandle(g, type, c) {
      console.log(g);
      let _this = this
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
          g.sd_goods_tuikuan_state = '已申请'
          _this.$vux.toast.text(type + '成功!', 'middle')
          _this.$http.post('http://sd.a10store.com/api/user.center.order.state.update.php', {
            gid: g.id,
            id: c.id,
            istype: type
          }).then(res => {
            console.log(_this.page);
            // _this.getlist();
          }, res => {

          })
        }
      })
    },
    toPay(c, type) {
      let _this = this
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
          if (type == "确认收货") {
            c.sd_order_state = '交易成功'
          } else {
            c.sd_order_state = '待发货'
          }
          _this.$vux.toast.text(type + '成功!', 'middle')
          _this.$http.post('http://sd.a10store.com/api/user.center.order.state.update.php', {
            id: c.id,
            istype: type
          }).then(res => {
            // _this.page = 1
            // _this.getlist();
          }, res => {

          })
        }
      })
    },
    handleTopChange(status) {
      this.moveTranslate = 1;
      this.topStatus = status;
      console.log(status);
    },
    translateChange(translate) {
      const translateNum = +translate;
      this.translate = translateNum.toFixed(2);
      this.moveTranslate = (1 + translateNum / 70).toFixed(2);

    },
    loadTop() {
      this.page = 1
      setTimeout(() => {
        this.getlist()
        this.$refs.loadmore.onTopLoaded();
      }, 1500);
    },
    loadMore() {

      this.busy = true;
      var that = this
      this.page = this.page + 1
      setTimeout(() => {
        this.$http.post('http://sd.a10store.com/api/user.center.order.get.php', {
          page: this.page,
          status: this.$store.state.vux.status,
          search: this.search,
          status_c: this.pagefilter
        }).then(res => {
          const temp = [];
          if (res.data.list.length) {
            res.body.list.forEach(function(item) {
              temp.push(item);
            })
            this.orderlist.list = this.orderlist.list.concat(temp);
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
        }, res => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
        })

      }, 1000);

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
    searchApi: debounce(function() {
      this.orderlist.list = []
      this.page = 1
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
      this.getlist()
    }, 500),
    change(val) {
      console.log('change', val)
    },
    onScroll(val) {
      console.log(val);
      this.sCrolleft = val.left
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
    tofilter() {
      console.log(this.pagefilter);
      // if(this.$store.state.vux.status =="待付款"){
      //   this.orderlist.atus_c =['已领取','待审核','待付款','付款中']
      // }else {
      //
      // }
      // this.$store.state.vux.status = this.pagefilter
      this.showfilter = false
        this.orderlist.list = []
        var temp = []
        this.commonList.forEach(function(item,index){
          item.pagefilter.forEach(function(page,i){
            console.log(page,'ssss');
            temp.push(page)
           });
          // temp.push(item.pagefilter[index])
         });
         this.pagefilter = temp
         console.log(this.pagefilter);
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
      this.page=1
      this.getlist()
      this.wrapperHeight = this.wrapperHeight+45;
    },
    getlist() {
      // this.$vux.loading.show({
      //   text: '加载中...'
      // })
      this.$http.post('http://sd.a10store.com/api/user.center.order.get.php', {
        page: this.page,
        status: this.$store.state.vux.status,
        search: this.search,
        status_c: this.commonList
      }).then(res => {
        // this.$vux.loading.hide()
        this.orderlist = res.body;
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
      }, res => {
        // this.$vux.loading.hide()
      })
    },
    typing(c, type) {
      console.log(type);
      const _this = this
      this.$vux.confirm.prompt(c.orderid, {
        title: '请输入订单号',
        onShow() {
          console.log('promt show')
        },
        onHide() {
          console.log('prompt hide')
        },
        onCancel() {
          console.log('prompt cancel')
        },
        onConfirm(msg) {
          console.log(c);
          c.sd_order_state = '待审核'
          c.orderid = msg
          _this.$vux.toast.text(type + '成功!', 'middle')
          _this.$http.post('http://sd.a10store.com/api/user.center.order.state.update.php', {
            forder: msg,
            id: c.id,
            istype: type
          }).then(res => {

            _this.getlist();
          }, res => {

          })
        }
      })
    },
    onItemClick(i, index) {
      this.orderlist.list = []
      this.page = 1
      this.$nextTick(() => {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
      });
      this.boxWidth = this.viewWidth * this.orderlist.num.length + 40

      this.isopen = false
      this.$store.state.vux.tabs = index
      this.$nextTick(() => {
        this.$refs.scroller.reset({
          left: this.sCrolleft
        });
      })
      this.$store.state.vux.status = i.item
      // this.getlist()
    },
    onCopy: function(e) {
      this.isCopy = true
      this.$vux.toast.text('复制成功', 'middle')
    },
  },
  mounted() {

    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.viewWidth = w / 4;
    this.$nextTick(() => {
      this.$refs.scroller.reset({
        left: this.viewWidth * this.$store.state.vux.tabs
      });
    })
    this.boxWidth = w
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
      page: 1,
      busy: false,
      showfilter: false,
      sCrolleft: '',
      translate: 0,
      moveTranslate: 0,
      topStatus: '',
      filterMainH: '',
      isopen: false,
      isCopy: false, //check
      zIndex: 500,
      boxWidth: '',
      wrapperHeight: 0,
      viewWidth: 0,
      index: 2,
      search: '',
      value: '',
      commonList:[{list:['已领取', '待审核', '待付款', '付款中'],group:'待付款',pagefilter:[]},
{list:['已发货', '待签收', '签收中'],group:'待收货',pagefilter:[]},
{list:['需退款', '退款中', '需退货', '退货中'],group:'退款中',pagefilter:[]},
{list:['交易成功'],group:'交易成功',pagefilter:[]},
    ],
      pagefilter: [],
      copyData: '￥LLnpZAwTcAC￥',
      // https://s.click.taobao.com/SjggJkw
      show: false,
      orderlist: {
        "list": [{
          "id": "60",
          beizhu_admin: '123',
          status: '王农dengdais,sdsdjksdjlskjdl',
          sd_order_state: '已领取',
          "orderid": "23018743799339302",
          "address_detail": "山东省 青岛市 黄岛区 辛安街道山东科技大学家属区B区23号楼一单元301(266590)",
          "address_name": "王农",
          "address_phone": "15966826831",
          "tracking_company": "缺失",
          "tracking": "缺失",
          "total": "19.00",
          tkTrack: '159668268312323',
          "time": "2017-06-06 16:17",
          "num": "",
          "button_text": [{
            label: "输入订单号",
            class: "primary"
          }],
          "list": [{
            sd_goods_tuikuan_state: '需退货',
            "label": "Y13B171",
            "color": "绿底红花",
            "src": "https://gd3.alicdn.com/imgextra/i3/0/TB1cedJIFXXXXaNaXXXXXXXXXXX_!!0-item_pic.jpg_50x50.jpg",
            "size": "XL",
            "value": "1"
          }]
        }, {
          "id": "4",
          status: '王农dengdais,sdsdjksdjlskjdl',
          sd_order_state: '待付款',
          "orderid": "23018743799339302",
          "address_detail": "山东省 青岛市 黄岛区 辛安街道山东科技大学家属区B区23号楼一单元301(266590)",
          "address_name": "王农",
          "address_phone": "15966826831",
          "tracking_company": "缺失",
          "tracking": "缺失",
          "total": "19.00",
          tkTrack: '159668268312323',
          "time": "2017-06-06 16:17",
          "num": "",
          "button_text": [{
            label: "输入订单号",
            class: "primary"
          }],
          "list": [{
            sd_goods_tuikuan_state: '',
            "label": "Y13B171",
            "color": "绿底红花",
            "src": "https://gd3.alicdn.com/imgextra/i3/0/TB1cedJIFXXXXaNaXXXXXXXXXXX_!!0-item_pic.jpg_50x50.jpg",
            "size": "XL",
            "value": "1"
          }]
        }, {
          "id": "4",
          status: '王农dengdais,sdsdjksdjlskjdl',
          sd_order_state: '待发货',
          "orderid": "23018743799339302",
          "address_detail": "山东省 青岛市 黄岛区 辛安街道山东科技大学家属区B区23号楼一单元301(266590)",
          "address_name": "王农",
          "address_phone": "15966826831",
          "tracking_company": "缺失",
          "tracking": "缺失",
          "total": "19.00",
          tkTrack: '159668268312323',
          "time": "2017-06-06 16:17",
          "num": "",
          "button_text": [{
            label: "输入订单号",
            class: "primary"
          }],
          "list": [{
            sd_goods_tuikuan_state: '需退款',
            "label": "Y13B171",
            "color": "绿底红花",
            "src": "https://gd3.alicdn.com/imgextra/i3/0/TB1cedJIFXXXXaNaXXXXXXXXXXX_!!0-item_pic.jpg_50x50.jpg",
            "size": "XL",
            "value": "1"
          }]
        }, {
          "id": "61",
          "orderid": "23034781589339302",
          sd_order_state: '待付款',
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
            sd_goods_tuikuan_state: '需售后',
            "color": "粉色",
            "src": "https://gd3.alicdn.com/imgextra/i3/0/TB1bq..HpXXXXcQapXXXXXXXXXX_!!0-item_pic.jpg_50x50.jpg",
            "size": "L",
            "value": "1"
          }]
        }, {
          "id": "45",
          "orderid": "111111",
          sd_order_state: '已发货',
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
            sd_goods_tuikuan_state: '',
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
        status_c: [],
        "num": [{
            "no": 1,
            "item": "全部",
            "num": "0"
          },
          {
            "no": 2,
            "item": "待付款",
            "num": "1"
          },
          {
            "no": 3,
            "item": "待发货",
            "num": "0"
          },
          {
            "no": 4,
            "item": "待收货",
            "num": "0"
          },
          {
            "no": 5,
            "item": "交易成功",
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
