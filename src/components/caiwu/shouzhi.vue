<template>
  <div>
    <el-dialog lock-scroll custom-class="cus-dialog" style="" title="费用" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item>
          <el-select filterable style="width: 100%;" v-model="form.option" placeholder="费用项">
    <el-option
      v-for="item in form.options"
      :key="item.value"
      :label="item.label"
      :value="item.label">
    </el-option>
  </el-select>
        </el-form-item>
        <el-form-item label="" >
          <el-row :gutter="10">
            <el-col :span="12">
            <el-input style="width: 100%;" type="number" v-model="form.pay"></el-input>
            </el-col>
            <el-col :span="12">
              <el-date-picker
              style="width: 100%;"
            v-model="form.time"
            type="date"
            placeholder="选择日期时间">
            </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="">
          <el-input v-model="form.beizhu" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="border-bottom:1px solid #bfcbd9"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
<el-row>
  <el-col :span="12">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-select @change="weihuApi" v-model="formInline.szxm" placeholder="项目">
    <el-option
      v-for="item in szxmoptions"

      :key="item.value"
      :label="item.label"
      :value="item.label">
    </el-option>
  </el-select>
</el-form-item>
      <el-form-item>
          <el-input placeholder="交易编号" :on-icon-click="weihuApi"  v-model="formInline.search" icon="search"></el-input>
        </el-form-item>
    <el-form-item>
    <!-- <el-button type="primary" :loading="loading" @click="weihuApi" >查询</el-button> -->
    <el-button @click="formInline=[];weihuApi()">重置</el-button>
    <el-button icon="plus" @click="dialogFormVisible = true" type="text">新增费用</el-button>
    </el-form-item>
    </el-form>
  </el-col>
  <el-col :span="4" style="color:#F7BA2A">
    <div>支出</div>
    <div>- {{tableData.expenditure_all}}</div>
  </el-col>
  <el-col :span="4" style="color:#13CE66">
    <div>收入</div>
    <div>+ {{tableData.income_all}}</div>
  </el-col>
  <el-col :span="4" style="color:#20A0FF">
    <div>余额</div>
    <div>+ {{tableData.balance}}</div>
  </el-col>
</el-row>
    <!-- :style="{height:wrapperHeight-50+'px'}" -->
  <div  style="overflow-y: auto;overflow-x: hidden;"  class="thin-scroll">
  <div ref="wrapperTable" style="    padding-right: 10px;">
    <el-table
      :data="tableData.expense_list"
      style="width: 100%;"
      :height="wrapperHeight-60"
      show-summary
      @filter-change="weihuApi"
      >
      <el-table-column
        label="交易编号"
        prop="id"
        >
      </el-table-column>
      <el-table-column
        label="交易时间"
        prop="time_expense"
        >
        <template scope="scope">
          {{scope.row.time_expense}}
        </template>
      </el-table-column>
      <el-table-column
        label="收入"
        prop="income"
        >
        <template scope="scope" style="color:#13CE66">
          {{scope.row.income}}
        </template>
      </el-table-column>
      <el-table-column
        label="支出"
        prop="expenditure"
        >
        <template scope="scope" style="color:#F7BA2A">
          {{scope.row.expenditure}}
        </template>
      </el-table-column>

      <el-table-column
        label="上传时间"
        prop="time_up"
        >
        <template scope="scope">
          {{scope.row.time_up}}
        </template>
      </el-table-column>
      <el-table-column
        label="交易对象"
        prop="target"
        >
        <template scope="scope">
          {{scope.row.target}}
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
        >
        <template scope="scope">
          <el-popover trigger="hover" placement="top">
          <p>{{scope.row.remark}}</p>
          <div slot="reference" class="name-wrapper" style="overflow: hidden;text-overflow: ellipsis;">
            {{scope.row.remark}}
          </div>
        </el-popover>
          <!-- <el-tooltip effect="dark" :content="scope.row.remark"  placement="top-start" >
    <span>{{scope.row.remark}}</span>
</el-tooltip> -->
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
        console.log('is');
        this.$http.post('http://www.a10store.com/api/caiwu/expense.list.get.php', {
          page:this.page,
          data:this.formInline
        }).then(res => {
          console.log(res.body,'shouzhi.vue');
          this.tableData = res.body
          this.page.total = res.body.total
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
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    data() {
      return {
        checkrow:'',
        loading:false,
        dialogFormVisible:false,
        form:{options:[
          {label:'设备费',value:'200'}
        ],option:'',pay:'1000',time:'',person:'参与人',beizhu:'备注'},
        wrapperHeight:0,
        page:{currentPage:1,perpage:20,total:300},
        formInline: {
         category: [],
         search: '',
         person:'',
         picstatus:'',
         szxm:"",

       },
       szxmoptions:[{
         value: '001',
          label: '代运营'
       },
       {
         value: '002',
          label: '便利店'
       }
     ],
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
        tableData:
          {expense_list:[{
            bianhao: '12987122',
            remark:'kljljlkjklsjkldjaskldjlskadjlasdjsajkld',
            price:'080808080',//条形码
            time:'',//主图
            income: '12',//商品名称
            outcome:'2',
            up_time:'',//全家售价
            person:'linmens',
            beizhu: ['1', '1-1'],//分类
          }]
          }
      }
    }
  }
</script>
