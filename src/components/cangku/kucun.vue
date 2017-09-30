<template>
<div>
   <div style="margin-bottom:15px">
     <el-input placeholder="请输入内容" v-model="input5">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="条形码" value="bar_code"></el-option>
          <el-option label="商品名称" value="name"></el-option>
          <el-option label="货号" value=""></el-option>
        </el-select>
        <el-button slot="append" icon="search"></el-button>
      </el-input>
   </div>
  <el-table
  @row-click="getmore"
       :data="tableData"
       style="width: 100%">
       <el-table-column
         prop="bar_code"
         label="条形码"
         width="180">
       </el-table-column>
       <el-table-column
         prop="name"
         label="商品名称"
         width="180">
       </el-table-column>
       <el-table-column
         prop="num"
         label="库存">
       </el-table-column>
     </el-table>

     <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  size="tiny"
  >
  <el-table :data="gridData">
   <el-table-column property="ck_id" label="仓库ID" ></el-table-column>
   <el-table-column property="ck_name" label="仓库名"></el-table-column>
   <el-table-column property="num" label="可用库存"></el-table-column>
   <el-table-column property="sl_detail" label="库位"></el-table-column>
 </el-table>
</el-dialog>
</div>
</template>
<style>
.el-select .el-input {
   width: 110px;
 }
</style>
<script>
    export default {
      mounted(){
        this.gettableData()
      },
      methods:{
        getmore(row, event, column){
          console.log(row);
          this.dialogVisible = true
          this.$http.post('http://www.a10store.com/api/konbini/goods_stock_info.php', {
            data:row
          }).then(res => {
            this.gridData = res.body.list
          }, res => {
          })
        },
        gettableData(){
          this.$http.post('http://www.a10store.com/api/konbini/goods_stock_info.php', {

          }).then(res => {
            this.tableData = res.body.list
          }, res => {
          })
        }
      },
      data() {
        return {
          input5:'',
          select:'',
           dialogVisible: false,
           gridData:[{
             ck_id:'',
             ck_name:'',
             num:'',
             sl_detail:''
           }],
          tableData: [{
            bar_code: '2016-05-02',
            name: '王小虎',
            num: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        }
      }
    }
  </script>
