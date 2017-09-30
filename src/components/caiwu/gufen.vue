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
      <el-table-column
        label="出资人"
        prop="shareholder"
        >
      </el-table-column>
      <el-table-column
        label="金额"
        prop="money"
        >
      </el-table-column>
      <el-table-column
        label="出资项目"
        >
        <template scope="scope">
          {{scope.row.days}}
        </template>
      </el-table-column>
      <el-table-column
        label="出资时间"
        prop="time_date"
        >
        <template scope="scope">
          {{scope.row.time_date}}
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
</style>

<script>
  export default {
    mounted(){
      this.weihuApi()
      this.getoptions()
        this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapperTable.getBoundingClientRect().top;
    },
    methods:{
      weihuApi(){
        this.$http.post('http://www.a10store.com/api/caiwu/get_buy_shares_list.php', {
          page:this.page,
          data:this.formInline
        }).then(res => {
          this.page.total = res.body.total
          this.tableData5 = res.body.list
        }, res => {
        })

      },

      updataApi(row){
        this.$http.post('http://www.a10store.com/api/caiwu/goods_info_update.php', {
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
        this.$http.post('http://www.a10store.com/api/caiwu/get_goods_class_info.php', {
        }).then(res => {
        this.fenleidata = res.body.list
        }, res => {
        })
      },
      getperson(){
        this.$http.post('http://www.a10store.com/api/caiwu/get_up_user_list.php', {
        }).then(res => {
        this.persons = res.body.list
        }, res => {
        })
      },
      // findsomthing(){
      //   console.log(this.formInline);
      //   this.loading = true
      //   this.$http.post('http://www.a10store.com/api/caiwu/get_goods_info.php', {
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
        loading:false,
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
          pic:'',//主图
          name: '好滋好味鸡蛋仔',//商品名称
          price_jh:'',
          price_fm:'',//全家售价
          up_user:'linmens',
          category: ['1', '1-1'],//分类
          link: '10333',//产品链接
          up_time:'2017-8-19 20:00'
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
