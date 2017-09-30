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
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
    </div>

  </el-form-item>

<el-form-item>
    <el-button type="primary" :loading="loading" @click="weihuApi">查询</el-button>
    <el-button @click="formInline=[];weihuApi()">重置</el-button>
  </el-form-item>
</el-form>
  <div ref="wrapperTable" style="overflow-y: auto;overflow-x: hidden;" :style="{height:wrapperHeight-50+'px'}" class="thin-scroll">
  <div style="    padding-right: 10px;">
    <el-table
      :data="tableData5"
      style="width: 100%;"
      @filter-change="weihuApi"
      >
      <el-table-column type="expand">
        <template scope="props">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="主图">
                  <el-input  @blur="updataApi(props.row)" v-model="props.row.pic" ></el-input>
                </el-form-item>
                <el-form-item label="商品链接">
                  <el-input  @blur="updataApi(props.row)" v-model="props.row.link" ></el-input>
                </el-form-item>
                <el-form-item label="商品 ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="淘客链接">
                  <el-input  @blur="updataApi(props.row)" v-model="props.row.tbk_link" ></el-input>
                </el-form-item>
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
          <a :href="scope.row.link" target="_blank">
            <img :src="scope.row.pic" alt="" class="item_thumbnail">
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="淘口令"
        >
        <template scope="scope">
          <!--  -->
          <el-input     @blur="updataApi(scope.row)" v-model="scope.row.tkl"   >
            <el-button ref="btn" slot="append" icon="document" v-clipboard:success="onCopy" v-clipboard:copy="scope.row.barcode"></el-button>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        >
        <template scope="scope">
          <el-input  @blur="updataApi(scope.row)" v-model="scope.row.name" >
            <el-button ref="btn" slot="append" icon="document" v-clipboard:success="onCopy" v-clipboard:copy="scope.row.name"></el-button>
          </el-input>
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
        label="在售价"
        >
        <template scope="scope">
          <el-input type="number" :debounce="1500" @blur="updataApi(scope.row)" v-model="scope.row.price_jh"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="淘客价"
        >
        <template scope="scope">
          <el-input type="number" :debounce="1500" @blur="updataApi(scope.row)" v-model="scope.row.price_tbk"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        >
        <template scope="scope">
          {{scope.row.days}}
        </template>
      </el-table-column>
    </el-table>
  </div>

  </div>
  <el-pagination
  style="    margin-top: 8px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
</div>



</template>

<style>

.item_thumbnail{
  vertical-align: middle;
display: inline-block;
width: 70px;
margin-top: 10px;
margin-bottom: 10px;
height: 70px;
position: relative;
z-index: 1;
}
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 10px;
    width: 50%
  }
</style>

<script>
// import Clipboard from 'clipboard';
  export default {
    mounted(){

      this.weihuApi()
      this.getoptions()
        this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapperTable.getBoundingClientRect().top;
    },
    methods:{
      onCopy(){
        this.$message({
           showClose: true,
           message: '复制成功!',
           type: 'success'
         });
      },
      weihuApi(){
        this.$http.post('http://www.a10store.com/api/taoke/get_goods_info.php', {
          page:this.page,
          data:this.formInline
        }).then(res => {
          this.page.total = res.body.total
          this.tableData5 = res.body.list
        }, res => {
        })

      },

      updataApi(row){
        this.inputcVal = row
        this.$http.post('http://www.a10store.com/api/taoke/goods_info_update.php', {
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
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.page.currentPage = val
        this.weihuApi()
      },
      getoptions(){
        this.$http.post('http://www.a10store.com/api/taoke/get_goods_class_info.php', {
        }).then(res => {
        this.fenleidata = res.body.list
        }, res => {
        })
      },
      getperson(){
        this.$http.post('http://www.a10store.com/api/taoke/get_up_user_list.php', {
        }).then(res => {
        this.persons = res.body.list
        }, res => {
        })
      },
      // findsomthing(){
      //   console.log(this.formInline);
      //   this.loading = true
      //   this.$http.post('http://www.a10store.com/api/taoke/get_goods_info.php', {
      //     data:this.formInline,
      //     page:this.page
      //   }).then(res => {
      //     this.loading=false
      //     this.page.total = res.body.total
      //     this.tableData5 = res.body.list
      //   }, res => {
      //   })
      // },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    data() {
      return {
        checkrow:'',
        inpuIcon:'document',

        loading:false,
        clipboard:'',
        wrapperHeight:0,
        page:{currentPage:1,perpage:20,total:300},
        formInline: {
         category: [],
         search: '',
         person:'',
         picstatus:''
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
          barcode:'080808080',//条形码
          pic:'https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/1144806017763356328/TB2kvEIn98mpuFjSZFMXXaxpVXa_!!0-saturn_solar.jpg',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          price_fm:'',//全家售价
          up_user:'linmens',
          category: ['1', '1-1'],//分类
          link: '10333',//产品链接
          up_time:'2017-8-19 20:00'
        },{
          id: '12987122',
          barcode:'2',//条形码
          pic:'',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333'//产品链接
        },{
          id: '12987122',
          barcode:'080808080',//条形码
          pic:'',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333'//产品链接
        },{
          id: '12987122',
          barcode:'080808080',//条形码
          pic:'',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333'//产品链接
        },{
          id: '12987122',
          barcode:'080808080',//条形码
          pic:'',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333'//产品链接
        },{
          id: '12987122',
          barcode:'080808080',//条形码
          pic:'',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          up_user:'linmens',
          category: ['jiushui', 'cha'],//分类
          link: '10333'//产品链接
        }]
      }
    }
  }
</script>
