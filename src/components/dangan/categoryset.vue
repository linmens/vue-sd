<template>
  <div >
    <!-- <i class="el-icon-plus" style="margin-bottom:20px" @click="addcategory"></i> -->
  <el-row>
    <el-col :span="8">
      <div ref="wrapperTable" class="thin-scroll" style="overflow-y: auto;overflow-x: hidden;padding: 10px;"  :style="{height:wrapperHeight-50+'px'}" >
      <el-tree
    :data="fenleidata"
    :props="defaultProps"
    highlight-current
    :default-expanded-keys="defaultExpanded"
    accordion
    ref="tree"
    node-key="value"
    @node-click="handleNodeClick"
    :render-content="renderContent">

  </el-tree>
</div>

    </el-col>
    <el-col :span="16">
      <el-form style="padding: 10px;" :model="formItem" label-position="top" label-width="80">
        <el-form-item label="所属分类"  >
          <el-select v-model="formItem.category" filterable >
    <el-option
      v-for="item in fenleidata"
      :key="item.value"
      :label="item.label"
      :value="item.label">
    </el-option>
  </el-select>
          <!-- <el-cascader  @change="changefenlei"  :options="fenleidata"  ></el-cascader> -->
        </el-form-item>
          <el-form-item label="分类编号">
              <el-input :icon="iconstatus" disabled v-model="formItem.value" ></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
              <el-input v-model="formItem.label" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item >
              <el-button type="primary" :loading="loading" :disabled="formItem.tblink==''||patternCheck" @click="tosendLoading" icon="checkmark-round">
                <span v-if="!loading">确定</span>
                <span v-else>Loading...</span>
              </el-button>
          </el-form-item>
      </el-form>
    </el-col>
  </el-row>

  </div>
</template>



<script>
const name = ''
    export default {
      mounted(){
        this.getoptions()
        this.wrapperHeight = document.documentElement.clientHeight -this.$refs.wrapperTable.getBoundingClientRect().top;
      },
      methods:{
        //新增分类
        renderContent(h, { node, data, store }) {
                return (
                  <span>
                    <span>
                      <span>{node.label}</span>
                    </span>
                    <span style="float: right; margin-right: 20px">
                      <el-button size="mini"  on-click={ () => this.addcategory(store, data,event) }>添加</el-button>
                    </span>
                  </span>);
              },
              addcategory(store, data,e) {
                e.stopPropagation();
                this.defaultExpanded = [data.value]
                this.formItem.value = ''
                this.formItem.label = ''
                this.formItem.category = data.label
                 store.append({ value: this.formItem.value, label:this.formItem.label}, data);
     },
     remove(store, data) {
     store.remove(data);
   },

        handleNodeClick(val){
          this.formItem.value = val.value
          this.formItem.label = val.label

            if(val.children!=null){

              this.formItem.category = val.label
            }
        },
        changefenlei(val){
          console.log(val);
          this.userselFenlei = val
        },
        getoptions(){
          this.$http.post('http://www.a10store.com/api/konbini/get_goods_class_info.php', {
          }).then(res => {
          this.fenleidata = res.body.list
          }, res => {
          })
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
        tosendLoading(){
          console.log(name,'fenleidata');
          this.loading = true
          //  this.formItem.label = name
          this.$http.post('http://www.a10store.com/api/konbini/goods_class2_add.php', {
            addform:this.formItem,
            user:this.$cookie.get('username')
          }).then(res => {
            this.formItem= {
                value: '',
                label: '',
                category:'',
            }
            this.getoptions()
            this.loading = false
          }, res => {
          })
        }
      },
        data () {
            return {
              loading:false,
              iconstatus:'',
              defaultExpanded:[],
              wrapperHeight:0,
              patternCheck:false,//判断是否可提交按钮
              userselFenlei:[],
                formItem: {
                    value: '',
                    label: '',
                    category:'',
                    store:''
                },
                fenleidata:[{
                    value: '1',
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
                }],
                defaultProps: {
          children: 'children',
          label: 'label'
        }
            }
        }
    }
</script>
