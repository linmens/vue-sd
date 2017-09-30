<style scoped>

</style>
<template>
  <div style="overflow: hidden;">
  <el-row :gutter="20" style="margin-right: 10px;" >
  <el-col :span="4">
    <el-menu unique-opened @open="menuopen" :default-openeds="[indexpath]" :default-active="$route.path" router class="el-menu-vertical-demo" >
  <el-submenu index="1">
    <template slot="title">股份</template>
    <el-menu-item class="vertical-item" index="/caiwu/add">新增股份</el-menu-item>
    <el-menu-item class="vertical-item" index="/caiwu/gufen">股份记录</el-menu-item>
    <el-menu-item class="vertical-item" index="/caiwu/zhanbi">股份占比</el-menu-item>
  </el-submenu>
  <el-submenu index="2">
    <template slot="title">收支</template>
    <el-menu-item class="vertical-item" index="/caiwu/shouzhi">收支记录</el-menu-item>
  </el-submenu>
  </el-menu>
</el-col>
  <el-col :span="20"  style="background: white;padding:10px;
  ">
  <!-- <div ref="wrapperTable" style="overflow-y: auto;overflow-x: hidden;" :style="{height:wrapperHeight-20+'px'}" class="thin-scroll"> -->
  <router-view></router-view>
<!-- </div> -->
  </el-col>
  </el-row>

</div>

</template>
<script>
    export default {
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
