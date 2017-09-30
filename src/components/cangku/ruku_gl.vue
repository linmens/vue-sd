<script>
export default {
  data() {
    return {
      textarea2: '',
      textarea3: ''
    }
  }
}
</script>
<template>
  <div>
    <el-row :gutter="10" style="margin-bottom:10px">
      <el-col :span="4">
        <el-input    placeholder="入库单号"></el-input>
      </el-col>
    </el-row>
    <el-table
    ref="multipleTable"
         :data="girdData"
         @row-click="handleSelection"
         @selection-change="handleSelectionChange"
         style="width: 100%"
         :height="wrapperHeight-50"
         >
         <el-table-column
     type="selection"
     width="55">
   </el-table-column>
         <el-table-column
           prop="id"
           label="采购单号"
           width="100"
           >
         </el-table-column>
         <el-table-column
           prop="cg_time"
           label="采购时间"
           width="200">
         </el-table-column>
         <el-table-column
           prop="ck_id"
           label="仓库编号"
           width="100"
           >
         </el-table-column>
         <el-table-column
           prop="ck_name"
           label="仓库名称"
           width="200"
           >
         </el-table-column>
         <el-table-column
           prop="cg_num"
           label="采购数量"
           width="100">
         </el-table-column>
         <el-table-column
           prop="cg_money"
           label="采购金额"
           width="100">
         </el-table-column>
         <el-table-column
           prop="rk_num"
           label="入库数量"
           width="100">
         </el-table-column>
         <el-table-column
           prop="rk_money"
           label="入库金额"
           width="100">
         </el-table-column>

         <el-table-column
           prop="cg_user"
           label="采购人"
           width="100">
         </el-table-column>
         <el-table-column
           prop="cg_review"
           label="采购审核"
           width="100">
           <template scope="scope">
              <el-checkbox style="margin:0" v-show="scope.row.cg_review=='yes'" disabled checked></el-checkbox>
              <el-checkbox style="margin:0"  v-show="scope.row.cg_review=='no'" disabled></el-checkbox>
           </template>
         </el-table-column>
         <el-table-column
           prop="cg_review_user"
           label="审核人"
           width="100">
         </el-table-column>
         <el-table-column
           prop="dh_review"
           label="到货审核"
           width="150">
           <template scope="scope">
              <el-checkbox style="margin:0" v-show="scope.row.dh_review=='yes'" disabled checked></el-checkbox>
              <el-checkbox style="margin:0"  v-show="scope.row.dh_review=='no'" disabled></el-checkbox>
           </template>
         </el-table-column>
         <el-table-column
           prop="dh_review_user"
           label="到货审核人"
           width="150">
         </el-table-column>
         <el-table-column
           prop="rk_review"
           label="入库审核"
           width="150">
           <template scope="scope">
              <el-checkbox style="margin:0" v-show="scope.row.rk_review=='yes'" disabled checked></el-checkbox>
              <el-checkbox style="margin:0"  v-show="scope.row.rk_review=='no'" disabled></el-checkbox>
           </template>
         </el-table-column>
         <el-table-column
           prop="rk_review_user"
           label="入库审核人"
           width="150">
         </el-table-column>
         <el-table-column
           prop="cw_review"
           label="完成审核"
           width="150">
           <template scope="scope">
              <el-checkbox style="margin:0" v-show="scope.row.cw_review=='yes'" disabled checked></el-checkbox>
              <el-checkbox style="margin:0"  v-show="scope.row.cw_review=='no'" disabled></el-checkbox>
           </template>
         </el-table-column>
         <el-table-column
           prop="cw_review_user"
           label="完成审核人"
           width="150">
         </el-table-column>
         <el-table-column
           prop="wl_gs"
           label="物流公司"
           :fixed="canEdit"
           width="200">
           <template scope="scope">
             <span v-show="!scope.row.showEdit">{{scope.row.wl_gs}}</span>
              <el-input  @click.native.stop v-show="scope.row.showEdit" v-model="scope.row.wl_gs" ></el-input>
           </template>
         </el-table-column>
         <el-table-column
           prop="wl_no"
           label="物流单号"
           :fixed="canEdit"
           width="200">
           <template scope="scope">
             <span v-show="!scope.row.showEdit">{{scope.row.wl_no}}</span>
              <el-input @click.native.stop  v-if="scope.row.showEdit" v-model="scope.row.wl_no"></el-input>
           </template>
         </el-table-column>
         <el-table-column
           label="操作"
           fixed="right"
           width="150"
           >
           <template scope="scope">
             <!-- <i style="margin-right:20px" v-show="canEdit&&!scope.row.canEdit" @click="scope.row.canEdit=true" class="el-icon-edit"></i> -->
               <i style="margin-right:20px" v-show="scope.row.showEdit" @click.stop="scope.row.canEdit=false;eDitrow(scope.row)" class="el-icon-check"></i>
              <el-button  type="text" @click.native.stop="openMingxi(scope.row)">查看明细</el-button>

           </template>
         </el-table-column>
       </el-table>
<el-dialog @open="checkgirdMingxiData()" :title="'采购明细 - '+dialogData.id" top="50px" :visible.sync="dialogMingxi" @close="getlist" size="large">
  <el-row :gutter="20" style="margin-bottom:20px">
    <el-col :span="6">
      <el-input @change="SaomapushData" placeholder="扫条码"></el-input>
    </el-col>
    <el-col :span="6">
      <el-alert
       v-if="Saomahaserror"
   title="请先取消入库,再修改"
   type="error">
 </el-alert>
    </el-col>
  </el-row>
    <div  :style="{height:wrapperDialogheight+'px','overflow':'auto'}" class="thin-scroll">
  <el-table highlight-current-row :data="girdMingxiData" ref="multipleMingxiTable">
    <el-table-column type="selection"></el-table-column>
    <el-table-column property="pic" label="主图" width="150">
      <template scope="scope" >
        <a :href="scope.row.link" target="_blank" class="item_thumbnail" style="position: relative;">
            <img v-lazy="scope.row.pic"  style="width:70px;height:70px"  class="">
            <div style="position:absolute;background: linear-gradient(transparent, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.2) 35%, rgba(0, 0, 0, 0.6) 65%, rgba(0, 0, 0, 0.9));right: 0;color: #fff;text-align:center;
      width: 100%;bottom:0" v-show="scope.row.stockin=='yes'">A10</div>
        </a>
      </template>
    </el-table-column>
    <el-table-column property="bar_code" label="条形码" width="200"></el-table-column>
    <el-table-column property="cg_money" label="采购金额" ></el-table-column>
    <el-table-column property="cg_num" label="采购数量"></el-table-column>
    <el-table-column property="rk_money" label="入库金额">
    </el-table-column>
    <el-table-column property="rk_num" label="入库数量">
      <template scope="scope">
        <el-input v-if="scope.row.rk_review=='no'&&btnstatus.dh_review=='yes'" @change="dhnumchange(scope.row)" type="number" v-model="scope.row.rk_num"></el-input>
        <span v-if="scope.row.rk_review!='no'">{{scope.row.rk_num}}</span>
      </template>
    </el-table-column>
    <el-table-column property="unit_price_cg" label="采购单价">

    </el-table-column>
    <el-table-column property="unit_price_rk" label="到货单价">

    </el-table-column>
    <el-table-column  label="操作" fixed="right" v-if="btnstatus.cg_review=='yes'&&btnstatus.dh_review=='yes'&&btnstatus.rk_review=='no'">
      <template scope="scope">
        <!-- {{btnstatus.dh_review}} -->
        <el-button class="gradBtn" v-show="scope.row.rk_review=='no'"  @click="qrDh(scope.row)">确认入库</el-button>
        <el-button type="text" v-show="scope.row.rk_review=='yes'" @click="qxDh(scope.row)">取消入库</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
  <div slot="footer" class="dialog-footer">
   <el-button @click="dialogMingxi = false">取 消</el-button>
   <el-button type="primary" @click="shenhe('采购审核')" v-show="btnstatus.cg_review == 'no'">采购审核</el-button>
   <!-- v-show="btnstatus.cg_review=='yes'&&btnstatus.dh_review == 'no'" -->
   <el-button type="primary" @click="shenhe('到货审核')"  v-show="btnstatus.cg_review=='yes'&&btnstatus.dh_review == 'no'">到货审核</el-button>
   <el-button type="primary" @click="shenhe('入库审核')" :disabled="disHandle" v-show="btnstatus.cg_review=='yes'&&btnstatus.dh_review == 'yes'&&btnstatus.rk_review=='no'">入库审核</el-button>
    <el-button type="primary" @click="shenhe('完成审核')" v-show="btnstatus.cg_review=='yes'&&btnstatus.dh_review == 'yes'&&btnstatus.rk_review=='yes'&&btnstatus.cw_review=='no'">完成审核</el-button>
 </div>
</el-dialog>
  </div>
</template>
<style>

 </style>
<script>
import { debounce } from 'vux'
// console.log(debounce);
export default {
  mounted(){
  this.getlist()
    // -this.$refs.wrapperTable.getBoundingClientRect().top
  this.wrapperHeight = document.documentElement.clientHeight - 100;
  this.wrapperDialogheight=document.documentElement.clientHeight-140-61-25-15-56;

},
  methods:{
    SaomapushData: debounce(function(val) {
      // console.log(val);
      let that = this
      var b = false;
      var arr = [];
      // this.girdMingxiData.push({bar_code:val})//扫码后填入数据
        for (var index = 0; index < this.girdMingxiData.length; index++) {
            if(val==this.girdMingxiData[index].bar_code){
              console.log('find',index);
              this.$refs.multipleMingxiTable.setCurrentRow(that.girdMingxiData[index]);
              // that.girdMingxiData[index].rk_review = 'yes'
              // this.$refs.multipleMingxiTable.toggleRowSelection(that.girdMingxiData[index],true);
              // that.girdMingxiData[index].dh_num = that.girdMingxiData[index].dh_num+1
              if(this.btnstatus.rk_review=='no'&&this.girdMingxiData[index].rk_review=='no'){
                this.girdMingxiData[index].rk_num  =  Number(this.girdMingxiData[index].rk_num) +1
                this.girdMingxiData[index].rk_money = Number(this.girdMingxiData[index].rk_num*this.girdMingxiData[index].unit_price_cg)
                this.girdMingxiData[index].unit_price_rk = Number(this.girdMingxiData[index].rk_money/this.girdMingxiData[index].rk_num)
              }else {
                console.log('not set');
                // this.Saomahaserror = true
              }
            }else {
              console.log('未找到商品');
            }
      }

    }, 500),
    //修改入库数量时改变
    dhnumchange(row){
      console.log(row);
      row.rk_money = Number(row.rk_num*row.unit_price_cg)
      row.unit_price_rk = Number(row.rk_money/row.rk_num)
    },
    qxDh(row){
      row.rk_review = 'no'
      this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in_rk_review_item.php', {
        data:row
      }).then(res => {
        console.log('更新成功');
        this.checkgirdMingxiData()//检查是否有为确认入库
        // this.$refs.multipleMingxiTable.toggleRowSelection(row,false);
        //
      }, res => {
      })
    },
    qrDh(row){
      if (row.dh_num=='') {
        this.$message({
         message: '到货数量不能为0',
         type: 'error'
       })
      }else {
        row.rk_review = 'yes'

        this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in_rk_review_item.php', {
          data:row
        }).then(res => {
          console.log('qr更新成功');
          this.checkgirdMingxiData()
        }, res => {
        })
        // this.$refs.multipleMingxiTable.toggleRowSelection(row,true);
      }

    },
    handleSelection(row){
      console.log(row);

      if(row.cg_review=='yes'){
        this.$message({
         message: '已审核订单无法修改!',
         type: 'error'
       })
        return
      }else {
        this.canEdit = 'right'
        row.showEdit = !row.showEdit
    }
    },
    handleSelectionChange(selection){
      console.log(selection);
      if(!selection.length){
        this.canEdit = false
      }
    },
    getlist(){
      console.log('getlist');
      this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in_list_get.php', {
      }).then(res => {
        this.girdData = res.body.list
      }, res => {
      })

    },
    checkgirdMingxiData(){
      //bug修改点击弹出后获取不到ref 问题
      setTimeout(() => {
  //  console.log(this.$refs.multipleMingxiTable)
   for (var i = 0; i < this.girdMingxiData.length; i++) {
     if(this.girdMingxiData[i].rk_review == 'no'){
       this.disHandle = true
       this.$refs.multipleMingxiTable.toggleRowSelection(this.girdMingxiData[i],false);
     }else {
       this.disHandle = false
       this.$refs.multipleMingxiTable.toggleRowSelection(this.girdMingxiData[i],true);
     }
   }
}, 0)

    },
    openMingxi(row){
      // this.checkgirdMingxiData()
      this.dialogData = row
      this.dialogMingxi = true
      this.btnstatus = {cg_review:'yes',dh_review:'yes',rk_review:'yes',wc_review:'no'}
      this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in_list_detail_get.php', {
        data:row.id
      }).then(res => {
        this.btnstatus = res.body.status
        this.girdMingxiData = res.body.list
      }, res => {
      })
    },
    shenhe(btn){
      // this.dialogMingxi = true

      this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in_cg_review.php', {
        data:this.dialogData.id,
        type:btn
      }).then(res => {
        if(res.body.mes=='yes'){
          this.$message({
           message: btn + '成功',
           type: 'success'
         })
       }else {
         this.$message({
          message: res.body.mes+res.body.mes2,
          type: 'error'
        })
       }
        // this.girdMingxiData = res.body.list
      }, res => {
      })
    },
    eDitrow(row){
        this.$refs.multipleTable.toggleRowSelection(row);
        this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in_wl_update.php', {
          data:row
        }).then(res => {
          if(res.body.mes=='yes'){
            this.$message({
             message: '修改成功!',
             type: 'success'
           })
          }
        }, res => {
        })

    },
    isEnter(){
      this.canEdit = true
    },
    addrkd(){
      // console.log(this.$cookie.get('username'));
      var postdata = {data:this.tableData,ck:this.rkgl.ck,upuser:this.$cookie.get('username')}

      this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in.php', {
        data:postdata
      }).then(res => {
        this.$message({
         message: res.body.mes,
         type: 'success'
       });
       this.getlist()
      }, res => {
      })
    },
  pushData: debounce(function(val) {
    if (val.indexOf(" ") >=0||val=='') {
      return
    }else {
      var b = false;
      var arr = [];
      // if(window.location.host=='localhost:8081'){
      //   this.tableData.push({bar_code:val,name:'下22',num:1,sl_detail:'res.body.sl_detail'})
      // }
      this.$http.post('http://www.a10store.com/api/konbini/goods_info_get.php', {
        data:val
      }).then(res => {
        // this.tableData = res.body.list
        this.tableData.push({bar_code:val,name:res.body.name,num:1,sl_detail:res.body.sl_detail})//扫码后填入数据
        for(var i = 0; i < this.tableData.length; i++){
        if(i == 0) arr.push(this.tableData[i]);
        b = false;
        if(arr.length > 0 && i > 0){
            for(var j = 0; j < arr.length; j++){
                if(arr[j].bar_code == this.tableData[i].bar_code){
                    b = true;
                    //当数据重复时 将重复数据条 当数量+1
                    arr[j].num  =  Number(arr[j].num) +1
                console.log('重复数据'+arr[j].num);
                }
            }
            //如果未重复则增加新数据
            if(!b){ arr.push(this.tableData[i]);}
        }
        }
        this.tableData = arr //将表格数据更新渲染
      }, res => {
      })

    }

  }, 500),
  },
  data() {
    return {
      input: '',
      wrapperDialogheight:0,
      disHandle:false,
      isfixed:false,
      btnstatus:'',
      dialogData:'',
      dialogMingxi:false,
      canEdit:false,
      Saomahaserror:false,
      wrapperHeight:'',
        girdData:[{id:'2',bar_code:'23'}],
        girdMingxiData:[{bar_code:'23',cg_review:'yes',rk_review:'yes',rk_money:"",unit_price_cg:2,rk_num:'2',unit_price_rk:''},{bar_code:'25',rk_review:'yes',rk_money:"",unit_price_cg:2,rk_num:'3',unit_price_rk:''}],
        value8: ''
    }
  }
}
</script>
