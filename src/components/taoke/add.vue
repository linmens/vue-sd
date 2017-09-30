<template>
      <div ref="wrapperTable" class="thin-scroll" style="overflow-y: auto;overflow-x: hidden;padding: 10px;" :style="{height:wrapperHeight-50+'px'}" >
    <el-form  :model="formItem" label-position="top" label-width="80">
        <el-form-item label="淘宝链接">
            <el-input :icon="iconstatus" v-model="formItem.tblink" @blur="pattrn" placeholder="请输入"></el-input>
             <div class="sub-title" style="color:#FF4949">示例:https://item.taobao.com/item.htm?id=41272161429</div>
        </el-form-item>
        <el-form-item label="商品名称">

            <el-input v-model="formItem.name" placeholder="请输入"></el-input>
            <div class="sub-title" style="color:#FF4949">示例:康师傅 冰红茶 柠檬味茶饮料1L</div>
        </el-form-item>
        <el-form-item label="分类"  >
          <div @click="getoptions">
<el-cascader  @change="changefenlei" v-model="formItem.fenlei" :options="fenleidata" filterable ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="在售价格">
          <el-input type="number"  v-model="formItem.price"></el-input>
        </el-form-item>

        <el-form-item >
            <el-button type="primary" :loading="loading" :disabled="formItem.tblink==''||patternCheck" @click="tosendLoading" icon="checkmark-round">
              <span v-if="!loading">新增</span>
              <span v-else>Loading...</span>
            </el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<style>
.tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin-top: 20px;
}
</style>

<script>
    export default {
      mounted(){
        this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapperTable.getBoundingClientRect().top;
      },
      methods:{
        changefenlei(val){
          console.log(val);
          this.userselFenlei = val
        },
        getoptions(){
          console.log('get ');
          this.$http.post('http://www.a10store.com/api/taoke/get_goods_class_info.php', {
          }).then(res => {
          this.fenleidata = res.body.list
          }, res => {
          })
        },
        pattrn(){
          this.iconstatus = 'loading'
          this.$http.post('http://www.a10store.com/api/taoke/check_goods_url.php', {
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
        tosendLoading(){
          this.loading = true
          console.log(this.userselFenlei);
          this.$http.post('http://www.a10store.com/api/taoke/goods_add_new.php', {
            addform:this.formItem,
            user:this.$cookie.get('username')
          }).then(res => {
            this.$message.success('添加产品成功!');
            this.formItem = {tblink: '',
            name: '',
            fenlei:this.userselFenlei,
            price:0}
            this.loading = false
          }, res => {
          })
        }
      },
        data () {
            return {
              loading:false,
              wrapperHeight:0,
              iconstatus:'',
              patternCheck:false,//判断是否可提交按钮
              userselFenlei:[],
                formItem: {
                    tblink: '',
                    name: '',
                    fenlei:[],
                    price:'',
                },
                fenleidata:[{
                    value: 'jiushui',
                    label: '酒水饮料',
                    children: [
                        {
                            value: 'kafei',
                            label: '咖啡饮料'
                        },
                        {
                            value: 'gongneng',
                            label: '功能饮料'
                        },
                        {
                            value: 'tansuan',
                            label: '碳酸饮料'
                        },
                        {
                            value: 'cha',
                            label: '茶饮料'
                        },{
                            value: 'water',
                            label: '水'
                        }
                    ]
                },{
                    value: '002',
                    label: '休闲零食',
                    children: [
                        {
                            value: 'kafei',
                            label: '咖啡饮料'
                        },
                        {
                            value: 'gongneng',
                            label: '功能饮料'
                        },
                        {
                            value: 'tansuan',
                            label: '碳酸饮料'
                        },
                        {
                            value: 'cha',
                            label: '茶饮料'
                        },{
                            value: 'water',
                            label: '水'
                        }
                    ]
                }],
                value3: []
            }
        }
    }
</script>
