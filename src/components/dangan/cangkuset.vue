
<template>
  <div>
    <el-popover
  ref="popover5"
  placement="right"
  width="auto"
  v-model="visible2">
  <div >
    <el-form>
  <el-form-item label="仓库名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="地址">
    <el-input v-model="form.address"></el-input>
  </el-form-item>
  <el-form-item label="库位数">
    <el-input-number  v-model="form.sl_num"></el-input-number>
  </el-form-item>
  <el-form-item label="货架数量">
      <el-input-number v-model="form.gs_num"></el-input-number>
  </el-form-item>
  </el-form>
  <el-button  type="text">确定</el-button>
  </div>
</el-popover>

<el-button v-popover:popover5 type="text">新建仓库</el-button>

  <el-table

    :data="tableData"

    style="width: 100%">
    <el-table-column
      prop="id"
      label="仓库编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="仓库名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
    <el-table-column
      prop="sl_num"
      label="库位数">
      <template scope="scope">
        <span>{{scope.row.sl_num}}</span>
        <el-button  @click="openDialog(scope.row.id)"  type="text" icon="view">库位列表</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="gs_num"
      label="货架数量">
    </el-table-column>
  </el-table>

<div  style="overflow-y: auto;overflow-x: hidden;"  class="thin-scroll">
<div ref="wrapperTable" style="    padding-right: 10px;">
  <el-dialog  title="库位列表" :visible.sync="dialogTableVisible">
    <!-- <ul class="el-scrollbar__view el-select-dropdown__list" style="position: relative;">
      <li class="el-select-dropdown__item" v-for="(i,index) in list" :key="index">
        <el-input v-if="isContentEditable&&EditIndex == index" v-model="i.id"></el-input>
        <span v-if="!isContentEditable">{{i.id}}</span>
        <i style="float:right" class="el-icon-edit" @click="toContentEditable(index)"></i></li>
    </ul> -->
    <i style="margin-bottom:10px;cursor:pointer" class="el-icon-plus" @click="toAdd()">添加</i>
    <el-alert
    style="margin-bottom:10px;"
    title="tips: 库位编号组成 = 仓库编号 - 货架编号 - 货架库位"
    type="info"
    show-icon>
  </el-alert>
    <!-- <div style="padding-top:10px"></div> -->
    <el-table :data="gridData" :height="wrapperHeight-wrapperHeight*0.45" >
      <el-table-column property="sl_detail" label="库位编号" >
        <template scope="scope">
          {{scope.row.sl_detail}}
        </template>
      </el-table-column>
      <el-table-column property="ck_id" label="仓库编号" >
        <template scope="scope">
          {{scope.row.ck_id}}
        </template>
      </el-table-column>

  <el-table-column property="gs_no" label="货架编号">
    <template scope="scope">
      <el-input v-if="!scope.row.isAdd" @blur="updateApi(scope.row)" v-model="scope.row.gs_no"></el-input>
  <el-select  v-model="scope.row.gs_no" v-if="scope.row.isAdd"  placeholder="请选择">
<el-option
v-for="item in scope.row.option"
:key="item"
:label="item"
:value="item">
</el-option>
</el-select>
    </template>
  </el-table-column>
  <el-table-column  property="sl_no" label="货架库位" >
    <template scope="scope">
      <div style="padding-top:10px;padding-bottom:10px">
      <el-input  v-if="!scope.row.isAdd" @blur="updateApi(scope.row)" v-model="scope.row.sl_no"></el-input>
      <el-input  v-if="scope.row.isAdd" @blur="checknull(scope.row)"  :disabled="scope.row.gs_no==''"   v-model="scope.row.sl_no"></el-input>
    </div>
    </template>
  </el-table-column>
</el-table>
<span slot="footer" class="dialog-footer">
    <el-button @click="dialogTableVisible = false">取 消</el-button>
    <el-button type="primary" :disabled="checknullIstrue" @click="toAddnew">保存修改</el-button>
  </span>
</el-dialog>
</div>
</div>
  </div>
</template>
<script>
export default {
  mounted(){
    this.cangkusetApi()
      this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapperTable.getBoundingClientRect().top;
  },
  data() {
    return {
      dialogTableVisible:false,
      visible2:false,
      isselect:false,
      checknullIstrue:false,
      gid:'',
      add:{gs_no:'',sl_no:''},
      wrapperHeight:'0',
      page:{total:''},
      tableData: [{
          id:'1',
           name: '王小虎',
           address: '上海市普陀区金沙江路 1518 弄',
           sl_num: '20',
           gs_num:'150'
         }],
         gridData:[{
           sl_detail:'14-5-3',
           ck_id:'1',
           gs_no:'2',

         }],
         form:{
           name:'',
           adress:'',
           sl_num:'',
           gs_num:''
         }
    }
  },
  methods:{
    checknull(item){
      if(item.gs_no==''||item.sl_no ==''){
        this.checknullIstrue = true
      }else {
        console.log('可以添加');
        this.checknullIstrue = false
      }
      // this.gridData.forEach(function(item){ console.log(item);
      //   if(item.gs_no==''&&)
      // });
    },
    //保存修改
    toAddnew(){
      this.$http.post('http://www.a10store.com/api/konbini/warehouse_sl_add.php', {
        id:this.gridData
      }).then(res => {
        this.gridData = res.body.list
        this.$message({
          message: '修改成功!',
          type: 'success'
        })
      }, res => {
      })
    },
    toAdd(){
      this.checknullIstrue = true
      // this.gridData.unshift({
      //   ck_id:this.gid,
      //   sl_detail:"",
      //   gs_no:"",
      //   sl_no:'',
      //   isAdd:true,
      //   isselect:false,
      //   option:[1,2,3,4,5]
      // })

      this.$http.post('http://www.a10store.com/api/konbini/warehouse_gs_list_get.php', {
        id:this.gid
      }).then(res => {
        // this.gridData = res.body.list
        this.gridData.unshift({
          ck_id:this.gid,
          sl_detail:"",
          gs_no:"",
          sl_no:'',
          isAdd:true,
          isselect:false,
          option:res.body.list
        })
      }, res => {
      })

    },

    updateApi(row){
      this.$http.post('http://www.a10store.com/api/konbini/warehouse_sl_update.php', {
        data:row
      }).then(res => {
        this.gridData = res.body.list
        this.$message({
          message: '更新成功!',
          type: 'success'
        })
      }, res => {
      })
    },
    openDialog(id){
      this.gid = id
      this.dialogTableVisible = true
      this.$http.post('http://www.a10store.com/api/konbini/warehouse_sl_list.php', {
        id:id
      }).then(res => {
        this.gridData = res.body.list
      }, res => {
      })
    },
    cangkusetApi(){
      this.$http.post('http://www.a10store.com/api/konbini/warehouse_get_list.php', {
        page:this.page,
        data:this.form
      }).then(res => {
        this.page.total = res.body.total
        this.tableData = res.body.list
      }, res => {
      })

    }
  }
}
</script>
