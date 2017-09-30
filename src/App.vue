<style>
body{
  margin:0!important;
  padding: 0;
  width: 100%;
  background: rgb(238, 241, 246);
  overflow: hidden;
}
.row-bg{
  box-shadow: 0 -2px 3px -1px rgba(0,0,0,.22);
padding: 10px;
z-index: 99
}
.el-dialog__footer{
  box-shadow: 0 -2px 3px -1px rgba(0,0,0,.22);
  z-index: 99;
  position: relative;
}

.el-dialog{
  /*bottom: 50px*/
}
.gradBtn.el-button{
  background: #E44D26;  /* fallback for old browsers */
  color:white;
  border-color: transparent;
  background: -webkit-linear-gradient(to right, #F16529, #E44D26);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #F16529, #E44D26); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
.el-select .el-input{
  width: auto!important
}
.gradBtn.el-button:focus,.gradBtn.el-button:hover{
  opacity: 0.98;
  border-color: transparent!important;
  color: white!important
}
.header{
  margin-bottom:20px;background:white;
  height: 44px;
  line-height: 44px;
  text-align: center;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
}

.el-menu-vertical-demo{
  background: white!important
}
.el-dialog__body{
  padding: 20px!important;
      padding-bottom: 10px!important;
      /*margin-bottom: -1px*/
}
.vertical-item{
  background: white!important
}
.el-menu-header{
  background: none!important
}
.el-menu-header .el-menu-item{
  height: 100%!important;
  line-height: 44px!important;
}
.el-table__body{
  width: 100%!important
}
.clearfix:before,
 .clearfix:after {
     display: table;
     content: "";
 }

.avatar{
  width: 50px;
    height: 50px;
    border-radius: 50px;
}
.avatar-header{
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
}
.personal-avatar{
  display: inline-block;
position: relative;
top: 8px;
width: 28px;
height: 28px;
}
.img-circle {
    border-radius: 50%;
}
 .clearfix:after {
     clear: both
 }
.el-table .cell{
  white-space: nowrap!important;
  word-break: normal!important;
}
.el-dialog__wrapper{
  overflow: hidden!important
}

.el-dialog__wrapper::-webkit-scrollbar{
  width: 5px;
}
.el-dialog__wrapper::-webkit-scrollbar-thumb{
  background-color: #A6A6A6;
  border-left: 2px solid transparent;
}
.el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #A6A6A6;
  border-left: 2px solid transparent;
}
.el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: #E5E5E5;
  border-left: 2px solid transparent;
}
.thin-scroll::-webkit-scrollbar {
  width: 5px;
}
.thin-scroll::-webkit-scrollbar-thumb {
  background-color: #A6A6A6;
  border-left: 2px solid transparent;
}

.thin-scroll::-webkit-scrollbar-track {
  background-color: #E5E5E5;
  border-left: 2px solid transparent;
}
.per-block{
  border-bottom: 1px solid #eef1f6;
margin-bottom: 15px;
}

</style>
<template>
<div id="app" style="height:100%;    overflow: hidden;" >
  <div>
    <el-popover
ref="popover1"
placement="bottom"
width="200px"
trigger="click"
>
  <div class="per-block" v-for="acc in accountinfo">
    <h3 style="margin-top:0">{{acc.title}}</h3>
    <div class="">
      <div v-for="list in acc.list">
        <time class="time">{{list.label}}</time>
        <el-progress  :percentage="list.value"></el-progress>
      </div>
      <el-button type="text" class="button">{{acc.btn}}</el-button>
    </div>
  </div>
</el-popover>
    <el-row :gutter="20" justify="end" type="flex" class="header" >
    <el-col :span="21" >
      <el-menu  :default-active="activepath" class="el-menu-header" mode="horizontal" @select="handleSelect">
        <el-menu-item  index="/store"><router-link to="/shangpin/add" tag="div">便利店</router-link></el-menu-item>
        <el-menu-item index="/taoke"><router-link to="/taoke/add" tag="div">淘宝客</router-link></el-menu-item>
        <el-menu-item index="/caiwu"><router-link to="/caiwu/add" tag="div">财务</router-link></el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="3" v-popover:popover1>
      <img class="avatar-header img-circle personal-avatar" v-lazy="$cookie.get('avatar')"></img>
      <span >{{$cookie.get('username')}}</span>
    </el-col>

  </el-row>
      <router-view></router-view>
  </div>


</div>
</template>

<script>


export default {
  data(){
    return {
      activeIndex:'0',
      indexpath:'',
      // accountinfo:[
      //   {title:'我的股份',btn:'入股记录',list:[
      //     {value:'20',label:'项目1-淘宝客  2000元'},
      //     {value:'10',label:'项目2-便利店  3000元'}
      //     ]
      //   },
      //   {title:'正在融资项目',btn:'我要入股',list:[
      //     {value:'20',label:'项目2-便利店 一期35000元'},
      //     ]
      //   }
      // ]
    }
  },
  computed: {
    activepath() {
      return this.$store.state.a10store.activepath
    },
    accountinfo() {
      return this.$store.state.a10store.accountinfo
    },
  },
  methods:{
    handleSelect(val){
      // this.indexpath = val
    }
  },
  mounted() {

    this.$store.state.a10store.activepath = this.$route.matched["0"].path
    console.log(this.$store.state.a10store.activepath,'App.vue');
  }
}
</script>
