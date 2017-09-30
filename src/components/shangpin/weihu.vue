<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
          <el-input placeholder="条形码/商品ID"  v-model="formInline.search" ></el-input>
        </el-form-item>
  <el-form-item>
    <el-cascader
  :options="fenleidata"
  filterable
  v-model="formInline.category"

  placeholder="所属分类"
  ></el-cascader>
  </el-form-item>
  <el-form-item>
    <div @click="getperson">
      <el-select v-model="formInline.person"  placeholder="添加人">
        <el-option
          v-for="item in persons"
          :key="item.value"
          :label="item.label"
          :value="item.label">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
    </div>

  </el-form-item>
    <el-form-item>


      <el-radio-group v-model="formInline.check" @change="weihuApi()">
   <el-radio v-for="city in cities" :label="city">{{city}}</el-radio>
 </el-radio-group>
    </el-form-item>
<el-form-item>
    <el-button class="gradBtn"  :loading="loading" @click="weihuApi">查询</el-button>
    <el-button @click="formInline=[];weihuApi()">重置</el-button>
  </el-form-item>
</el-form>
<!--
  <div ref="wrapperTable" style="overflow-y: auto;overflow-x: hidden;" :style="{height:wrapperHeight-50+'px'}" class="thin-scroll"> -->
  <!-- <div style="    padding-right: 10px;"> -->
    <el-table
      :data="tableData5"
      ref="multipleTable"
      :border="false"
      :height="wrapperHeight"
      style="width: 100%;"
      @filter-change="weihuApi"
      @selection-change="handleSelectionChange"
      >
      <el-table-column  type="expand">
        <template scope="props">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="主图">
                  <el-input  @blur="updataApi(props.row)" v-model="props.row.pic" ></el-input>
                </el-form-item>
                <el-form-item label="商品链接">
                  <el-input  @blur="updataApi(props.row);pattrn"  v-model="props.row.link" ></el-input>
                </el-form-item>
                <el-form-item label="商品 ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="用户">
                  <el-input  @blur="updataApi(props.row)" v-model="props.row.up_user" ></el-input>
                </el-form-item>
                <el-form-item label="上传时间">
                  {{props.row.up_time}}
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="主图"
        prop="pic"
        :filters="[{ text: '无图', value: '无图' },{ text: '有图', value: '有图' }]"
     :filter-method="filterTag"
     filter-placement="bottom-end"
        >
        <template scope="scope" >
          <a :href="scope.row.link" target="_blank" class="item_thumbnail" style="position: relative;">
              <img v-lazy="scope.row.pic"  style="width:70px;height:70px"  class="">
              <div style="position:absolute;background: linear-gradient(transparent, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.2) 35%, rgba(0, 0, 0, 0.6) 65%, rgba(0, 0, 0, 0.9));right: 0;color: #fff;text-align:center;
    width: 100%;bottom:0" v-show="scope.row.stockin=='yes'">A10</div>
          </a>

        </template>
      </el-table-column>
      <el-table-column
        label="条形码"
        >
        <template scope="scope">
          <el-input  @blur="updataApi(scope.row)" v-model="scope.row.bar_code" ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        >
        <template scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
            <el-input  @blur="updataApi(scope.row)" v-model="scope.row.name" ></el-input>
   </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="所属分类"
        >
        <template scope="scope">
          <el-cascader
      :options="fenleidata"
      filterable
      @change="updataApi(scope.row)"
      v-model="scope.row.category"
    ></el-cascader>
        </template>

      </el-table-column>
      <el-table-column
        label="进货价"
        >
        <template scope="scope">
          <el-input type="number" :debounce="1500" @blur="updataApi(scope.row)" v-model="scope.row.price_jh"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        >
        <template scope="scope">
          {{scope.row.days}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150"
        >
        <template scope="scope">
           <el-button v-show="!scope.row.isAdd"  @click="addCart(scope.row)">加入A10采购</el-button>
           <el-button v-show="scope.row.isAdd" type="text"  @click="addCart(scope.row)">取消加入A10</el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- </div> -->
  <el-dialog
  :visible.sync="caigoudanDg"
  ref="wrapperDialog"
  size="large"
  top="50px"
  >
  <el-row  :gutter="0" style="margin-bottom:10px">
  <el-col :span="8">
  <el-select @change="selectChange"   v-model="rkgl.ck" placeholder="选择仓库">
   <el-option
     v-for="item in options"
     :key="item.value"
     :label="item.label"
     :value="item.value">
   </el-option>
  </el-select>
  </el-col>
  <el-col :span="6">
  <el-input  :disabled="rkgl.ck == ''" v-model="rkgl.bar_code" @change="pushData" placeholder="条形码"></el-input>
  </el-col>
  </el-row>
  <!-- :max-height="wrapperDialogheight" -->
  <div  :style="{height:wrapperDialogheight+'px','overflow':'auto'}" class="thin-scroll">
    <div ref="tjCgDialog">
  <el-table
   :data="multipleSelection"
   show-summary
   style="width: 100%">
   <el-table-column
     prop="pic"
     label="主图"
     width="150"
     >
     <template scope="scope" >
       <a :href="scope.row.link" target="_blank" class="item_thumbnail" style="position: relative;">
           <img v-lazy="scope.row.pic"  style="width:70px;height:70px"  class="">
           <div style="position:absolute;background: linear-gradient(transparent, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.2) 35%, rgba(0, 0, 0, 0.6) 65%, rgba(0, 0, 0, 0.9));right: 0;color: #fff;text-align:center;
 width: 100%;bottom:0" v-show="scope.row.stockin=='yes'">A10</div>
       </a>
     </template>
   </el-table-column>
   <el-table-column
     prop="bar_code"
     label="条形码"
     width="200"
     >
   </el-table-column>
   <el-table-column
     prop="name"
     label="商品名称"
     width="250"
     >
   </el-table-column>
   <el-table-column
     prop="num"
     label="数量"
     width="150">
     <template scope="scope">
       <el-input type="number" min="1" @change="changeNum(scope.row)" v-model="scope.row.num"  placeholder="数量"></el-input>
     </template>
   </el-table-column>
   <el-table-column
     prop="cg_money"
     label="总金额"
     >
     <template scope="scope">
       <el-input type="number" min="1" @change="changeNum(scope.row)" v-model="scope.row.cg_money"  placeholder="总金额"></el-input>
     </template>
   </el-table-column>
   <el-table-column
     prop="unit_price_cg"
     label="单价"
     >
     <template scope="scope">
       {{scope.row.unit_price_cg}}
     </template>
   </el-table-column>
   <el-table-column
     prop="unit_price_ls"
     label="历史进货价"
     >
   </el-table-column>
   <el-table-column
     label="操作"
     fixed="right"
     width="150"
     >
     <template scope="scope">
        <el-button  class="gradBtn"  size="small" @click="deleteCart(scope.row,
scope.$index)">删除</el-button>
     </template>
   </el-table-column>
  </el-table>
</div>
</div>

  <span slot="footer" class="dialog-footer">
  <el-button @click="caigoudanDg = false">取 消</el-button>
  <el-button class="gradBtn"  @click="addrkd" :disabled="multipleSelection.length ==0||rkgl.ck==''" :loading="isdisabled">生 成</el-button>
  </span>
  </el-dialog>

<!-- </div> -->
<el-row type="flex" :gutter="20" class="row-bg" justify="end">
  <el-col :span="18" style="text-algin:left">
    <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="page.perpage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
  </el-col>
  <el-col :span="6" style="text-algin:right">
    <span>已选择 <span style="color:#E44D26;font-size:18px">{{multipleSelection.length}}</span> 个产品</span>
    <el-button class="gradBtn" :disabled="!multipleSelection.length" @click="caigoudanDg=true;shengcheng()" >去生成</el-button>
  </el-col>
</el-row>


</div>




</template>

<style>

</style>

<script>
import { debounce } from 'vux'
const cityOptions = ['全部','已进货产品', '未进货产品'];
  export default {
    computed:{

    },
    mounted(){
      this.weihuApi()
      this.getoptions()
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.multipleTable.$refs.bodyWrapper.getBoundingClientRect().top-30;
        this.wrapperDialogheight=document.documentElement.clientHeight-140-61-25-15;

    },
    methods:{
      changeNum(val){
        var x = val.cg_money/val.num
        var f = parseFloat(x);
         if (isNaN(f)) {
             return false;
         }

         var f = Math.round(x*100)/100;
         var s = f.toString();
         var rs = s.indexOf('.');
         if (rs < 0) {
             rs = s.length;
             s += '.';
         }
         while (s.length <= rs + 2) {
             s += '0';
         }
         val.unit_price_cg = s
        console.log(s);
      },
      deleteCart(row,index){
        console.log(index);
        row.isAdd = !row.isAdd
        this.multipleSelection.splice(index,1)
      },
      addrkd(){
        this.isdisabled = true

        // console.log(this.$cookie.get('username'));
        var postdata = {data:this.multipleSelection,ck:this.rkgl.ck,upuser:this.$cookie.get('username')}
        for(var i = 0 ;i<this.multipleSelection.length;i++)
{
            if(this.multipleSelection[i].num == "" || typeof(this.multipleSelection[i].num) == "undefined"||this.multipleSelection[i].unit_price_cg==""||typeof(this.multipleSelection[i].unit_price_cg) =="undefined")
            {
              this.$message({
               message: '数据未填写,请填写完整',
               type: 'error'
              });
              this.isdisabled = false

            }

}
if(this.isdisabled){
  this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in.php', {
    data:postdata
  }).then(res => {
    this.$message({
     message: '采购单生成成功',
     type: 'success'
   });
   this.multipleSelection = []
   this.isdisabled = false
  //  this.getlist()
  }, res => {
  })
}
      },
      selectChange(val){
        console.log(val);

      },
      shengcheng(){
        // .wrapperDialog.getBoundingClientRect().height
        // console.log(this.multipleSelection,'this.multipleSelection');

        this.$http.post('http://www.a10store.com/api/konbini/warehouse_stock_in_ck_list_get.php', {
        }).then(res => {
          this.options = res.body.options
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
            this.multipleSelection.push({bar_code:val,name:res.body.name,num:1,sl_detail:res.body.sl_detail})//扫码后填入数据
            this.rkgl.bar_code = ''
            for(var i = 0; i < this.multipleSelection.length; i++){
            if(i == 0) arr.push(this.multipleSelection[i]);
            b = false;
            if(arr.length > 0 && i > 0){
                for(var j = 0; j < arr.length; j++){
                    if(arr[j].bar_code == this.multipleSelection[i].bar_code){
                        b = true;
                        //当数据重复时 将重复数据条 当数量+1
                        arr[j].num  =  Number(arr[j].num) +1
                    console.log('重复数据'+arr[j].num);
                    }
                }
                //如果未重复则增加新数据
                if(!b){ arr.push(this.multipleSelection[i]);}
            }
            }
            this.multipleSelection = arr //将表格数据更新渲染
          }, res => {
          })

        }

      }, 500),
      addCart(row){
        row.isAdd = !row.isAdd;
        // (row.isAdd == '') ?row.isAdd = true:row.isAdd = false
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      handleSelectionChange(val) {
       this.multipleSelection = val;
       console.log( this.multipleSelection);
     },
      expandChange(val){
        // this.expandall = val
        console.log(val);
      },
      success (src, ele) {
            console.log('success load', src)
          },
          error (src, ele, msg) {
            console.log('error load', msg, src)

          },
      pattrn(){
        this.iconstatus = 'loading'
        this.$http.post('http://www.a10store.com/api/konbini/check_goods_url.php', {
          addform:this.formItem,
        }).then(res => {
          if(res.body.status=='不可添加'){
            this.$message.warning('已有该条产品信息');
            this.patternCheck = true
          }
        else {
            this.$message.success('可添加');
            this.formItem.tblink = res.body.url_jh
            this.patternCheck = false
          }
          this.iconstatus = ''
        }, res => {
        })
      },
      weihuApi(){
        this.$http.post('http://www.a10store.com/api/konbini/get_goods_info.php', {
          page:this.page,
          data:this.formInline
        }).then(res => {
          this.tableData5 = res.body.list
          this.page.total = res.body.total
        }, res => {
        })

      },

      updataApi(row){
        this.$http.post('http://www.a10store.com/api/konbini/goods_info_update.php', {
          data:row
        }).then(res => {
          this.$message({
            showClose: true,
            message: '更新成功',
            type: 'success'
          });
        }, res => {
        })
      },
      filterTag(value,row) {
        console.log(value,'sdsd');
        this.formInline.picstatus = value
        // this.weihuApi()
     },
      handleSizeChange(val) {
        this.page.perpage = val
        this.weihuApi()
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.page.currentPage = val
        this.weihuApi()
      },
      getoptions(){
        this.$http.post('http://www.a10store.com/api/konbini/get_goods_class_info.php', {
        }).then(res => {
        this.fenleidata = res.body.list
        }, res => {
        })
      },
      getperson(){
        this.$http.post('http://www.a10store.com/api/konbini/get_up_user_list.php', {
        }).then(res => {
        this.persons = res.body.list
        }, res => {
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    data() {
      return {
        checkrow:'',
        loading:false,
        isdisabled:false,
        rkgl:{ck:'',bar_code:''},
        options: [{
            value: '001',
            label: '仓库1'
          }, {
            value: '002',
            label: '仓库2'
          }],
        wrapperHeight:0,
        wrapperDialogheight:0,
        caigoudanDg:false,
        multipleSelection:[],
        cities: cityOptions,
        page:{currentPage:1,perpage:20,total:300},
        formInline: {
         category: [],
         search: '',
         person:'',
         picstatus:'',
        check: '全部',
       },
       persons: [{
          value: '20',
          label: 'Linmens'
        }, {
          value: '100',
          label: 'Ein'
        }, {
          value: '0',
          label: 'Cmi'
        }, {
          value: '0',
          label: 'Kuki'
        }],
        fenleidata:[],
        tableData5: [{
          id: '12987122',
          isAdd:'',
          num:'',
          bar_code:'080808080',//条形码
          pic:"https://gd3.alicdn.com/imgextra/i1/2689523945/TB2t04bXhf9F1JjSZFNXXbtIVXa_!!2689523945.jpg",//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          price_fm:'',//全家售价
          up_user:'linmens',
          category: ['1', '1-1'],//分类
          link: '10333',//产品链接
          up_time:'2017-8-19 20:00',
          unit_price_cg:'',
          stockin:'yes',
          cg_money:'ss',
          unit_price_ls:'222'
        },{
          id: '12987122',
          bar_code:'080808080',//条形码
          stockin:'no',
          isAdd:'',
          num:'',
          cg_money:',',
          pic:'https://img.alicdn.com/bao/uploaded/i3/TB1NIVMSXXXXXaAXFXXXXXXXXXX_!!0-item_pic.jpg',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333',//产品链接
          unit_price_ls:'22223'
        },{
          id: '12987122',
          bar_code:'080808080',//条形码
          stockin:'no',
          isAdd:'',
          cg_money:',',
          pic:'https://img.alicdn.com/bao/uploaded/i3/TB1NIVMSXXXXXaAXFXXXXXXXXXX_!!0-item_pic.jpg',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333',//产品链接
          unit_price_ls:'22223'
        },{
          id: '12987122',
          bar_code:'080808080',//条形码
          stockin:'no',
          isAdd:'',
          cg_money:',',
          pic:'https://img.alicdn.com/bao/uploaded/i3/TB1NIVMSXXXXXaAXFXXXXXXXXXX_!!0-item_pic.jpg',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333',//产品链接
          unit_price_ls:'22223'
        },{
          id: '12987122',
          bar_code:'080808080',//条形码
          stockin:'no',
          isAdd:'',
          cg_money:',',
          pic:'https://img.alicdn.com/bao/uploaded/i3/TB1NIVMSXXXXXaAXFXXXXXXXXXX_!!0-item_pic.jpg',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333',//产品链接
          unit_price_ls:'22223'
        },{
          id: '12987122',
          bar_code:'080808080',//条形码
          stockin:'no',
          isAdd:'',
          cg_money:',',
          pic:'https://img.alicdn.com/bao/uploaded/i3/TB1NIVMSXXXXXaAXFXXXXXXXXXX_!!0-item_pic.jpg',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333',//产品链接
          unit_price_ls:'22223'
        },{
          id: '12987122',
          bar_code:'080808080',//条形码
          stockin:'no',
          isAdd:'',
          cg_money:',',
          pic:'https://img.alicdn.com/bao/uploaded/i3/TB1NIVMSXXXXXaAXFXXXXXXXXXX_!!0-item_pic.jpg',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333',//产品链接
          unit_price_ls:'22223'
        }]
      }
    }
  }
</script>
