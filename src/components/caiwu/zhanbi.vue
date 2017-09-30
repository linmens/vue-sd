<template>
  <div>
  <div ref="wrapperTable" style="overflow-y: auto;overflow-x: hidden;" :style="{height:wrapperHeight-90+'px'}" class="thin-scroll">
          <el-row class="gufen" :key="i" v-for="(i,index) in list">
            <el-col :span="4" style="text-align:center">
              <img v-lazy="i.src"  class="avatar" >
                <div>{{i.name}}</div>
            </el-col>
            <el-col :span="16">
              <div class="bottom" v-for="z in i.zhanbi">
                <el-progress type="circle" :width="50" :percentage="z.value"></el-progress>
                <div>{{z.label}} | <span style="color:#475669">{{z.price}}元</span></div>
              </div>
            </el-col>
            <el-col :span="4">
              <div>总投资金额: {{i.total}} 元</div>
              <el-button type="text">查看详细</el-button>
            </el-col>
          </el-row>
      </div>
      <div style="padding:10px">
        <el-row type="flex" justify="end">
          <el-col :span="4" style="color:#13CE66">
            <div>总入股金额</div>
            <div>+ {{apidata.total}}</div>
          </el-col>
        </el-row>

      </div>
</div>



</template>

<style>
.gufen{
  border-bottom: 1px solid #eef1f6;
padding: 10px;
}
.bottom {
       width: 200px;
       text-align: center;
 }

</style>

<script>
  export default {
    mounted(){
      this.weihuApi()
        this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapperTable.getBoundingClientRect().top;
    },
    methods:{
      weihuApi(){
        this.$http.post('http://www.a10store.com/api/caiwu/get_shares_percent_detail.php', {
          page:this.page,
          data:this.formInline
        }).then(res => {
          this.page.total = res.body.total
          this.list = res.body.list
          this.apidata = res.body
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

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    data() {
      return {
        wrapperHeight:0,
        apidata:'',
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
        list: [{
          id: '12987122',
          src:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2421786001,3201529775&fm=200&gp=0.jpg',
          name:'Linmens',
          zhanbi:[
            {label:'项目一',value:25,price:'1222'}
          ],
          total:'9999'
        },
        {
          id: '12987122',
          src:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2421786001,3201529775&fm=200&gp=0.jpg',
          name:'Linmens',
          zhanbi:[
            {label:'项目一',value:25,price:'1222'}
          ],
          total:'9999'
        },
        {
          id: '12987122',
          src:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2421786001,3201529775&fm=200&gp=0.jpg',
          name:'Linmens',
          zhanbi:[
            {label:'项目一',value:25,price:'1222'}
          ],
          total:'9999'
        },
        {
          id: '12987122',
          src:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2421786001,3201529775&fm=200&gp=0.jpg',
          name:'Linmens',
          zhanbi:[
            {label:'项目一',value:25,price:'1222'}
          ],
          total:'9999'
        }]
      }
    }
  }
</script>
