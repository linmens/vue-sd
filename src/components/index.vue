<style scoped>

</style>
<template>
  <div style="overflow: hidden;">
  <el-row :gutter="20" style="margin-right: 10px;" >
  <el-col :span="4">
    <el-menu unique-opened @open="menuopen" :default-openeds="[indexpath]" :default-active="$route.path" router class="el-menu-vertical-demo" >

  <el-submenu index="1">
    <template slot="title">产品</template>
    <el-menu-item class="vertical-item" index="/shangpin/add">新增商品</el-menu-item>
    <el-menu-item class="vertical-item" index="/shangpin/weihu">产品维护</el-menu-item>
  </el-submenu>
  <el-submenu index="2">
    <template slot="title">仓库</template>
    <el-menu-item class="vertical-item" index="/cangku/ruku_gl">采购入库</el-menu-item>
    <el-menu-item class="vertical-item" index="/cangku/kucun">库存查询</el-menu-item>
  </el-submenu>
  <el-submenu index="3">
    <template slot="title">档案</template>
      <el-menu-item class="vertical-item" index="/dangan/cangkuset">仓库维护</el-menu-item>
    <el-menu-item class="vertical-item" index="/dangan/categoryset">产品分类设置</el-menu-item>
  </el-submenu>
  </el-menu>
</el-col>
  <el-col :span="20"  style="background: white;padding:10px;padding-bottom:0
  ">
  <!-- <div ref="wrapperTable" style="overflow-y: auto;overflow-x: hidden;" :style="{height:wrapperHeight-20+'px'}" class="thin-scroll"> -->
  <router-view ></router-view>
<!-- </div> -->
  </el-col>
  </el-row>

</div>

</template>
<script>
    export default {
      computed:{
        loading(){
          console.log(this.$store.state.a10store.loading);
          return this.$store.state.a10store.loading
        }
      },
      data(){
        return {
          activeIndex:'0',
          wrapperHeight:0,
          indexpath:'1'
        }
      },
      methods:{
        menuopen(indexpath){
          console.log(indexpath);
          this.indexpath = indexpath
        }
      },
      mounted() {
        // this.activeIndex = this.$route.path
        // this.indexpath = this.$route.meta.indexpath
        // this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapperTable.getBoundingClientRect().top;
        if(window.location.host=='localhost:8081'){
          this.$cookie.set('username','kjkjlj')
        }
      }
    }
</script>
