<template>

  <div style="height: 100%; ">
    <x-header title="个人信息" :left-options="{showBack: !edit}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
      <span slot="right" @click="edit = !edit" v-if="!edit">编辑</span>
  <span slot="right" v-if="edit" @click="finish()">完成</span>
  <span slot="left" v-if="edit" @click="edit=false">取消</span>
    </x-header>
    <group labelWidth="80">
       <cell :title="user.user_name"  :inline-desc="'淘宝昵称:'+user.taobao_nick" >
         <img width="80" v-if="!edit"  slot="icon" height="80" class="avatar" style="display:block;margin-right:5px;" :src="user.avatar" />
         <div   slot="icon"  style="position: relative;" class="room_add_img">
           <!-- <input @change='add_img'  type="file"> -->
           <vue-core-image-upload
           v-if="edit"
           ref="upload"
         :class="['btn', 'btn-primary']"
         :crop="false"
         @imageuploading="imageuploading"
         @imageuploaded="imageuploaded"
         :data="user"
         compress="50"
         url="http://sd.a10store.com/api/user.center.info.update.php" >
          <img width="80" height="80" class="avatar" style="display:block;margin-right:5px;" :src="user.avatar" />
       </vue-core-image-upload>

         </div>
  <div slot="title" v-if="edit">
      <x-input   v-model="user.user_name"></x-input>
  </div>
        <div slot="inline-desc" v-if="edit">
            <x-input   v-model="user.taobao_nick"></x-input>
        </div>
       </cell>
     </group>
     <group>
        <x-input title="真实姓名"  :disabled="!edit"  v-model="user.trueName"></x-input>
       <x-input title="银行卡" :max="24" :disabled="!edit" @on-change="bankchange" v-model="user.bank"></x-input>
       <x-input title="支付宝"  :disabled="!edit"  v-model="user.zfb"></x-input>
       <x-input  title="微信" :disabled="!edit" text-align="right"  v-model="user.wx"></x-input>
       <x-input title="手机" :disabled="!edit"  text-align="right"  v-model="user.phone"></x-input>
       <x-input  title="QQ" :disabled="!edit" text-align="right"  v-model="user.qq"></x-input>
  <x-address title="所在地区"  :disabled="!edit"  v-model="user.address" :list="addressData" placeholder="请选择地址" ></x-address>
  <!-- <x-input  :disabled="!edit" v-model="user.address_detail"></x-input> -->
     </group>
     <loading v-model="show1" ></loading>
  </div>
  </template>
<style>
.avatar-input {
  position: absolute;
  top: 0;
  height: 100%;
  opacity: 0;
  width: 80px;
}
.room_add_img input{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99999;
    opacity: 0;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
  <script>
  import VueCoreImageUpload  from 'vue-core-image-upload';
  import { XHeader,CellFormPreview, Group, Cell ,Tabbar, TabbarItem,XInput,XAddress,ChinaAddressV3Data ,XTextarea   } from 'vux'
  export default {
    components: {
      XHeader,
      CellFormPreview, Group, Cell,Tabbar, TabbarItem,XInput,XAddress,XTextarea,VueCoreImageUpload
    },
    methods:{
      bankchange(c){
        var op="";
      var tmp = c.replace(/\D/g, "");
      for (var i=0;i<tmp.length;i++)
      {
          if (i%4===0 && i>0)
          {
              op = op + " " + tmp.charAt(i);
          } else {
              op = op + tmp.charAt(i);

          }
      }
      this.user.bank = op;
      },
      add_img(event){
     		 	  	  var reader =new FileReader();
     		 	  	   var img1=event.target.files[0];
                        reader.readAsDataURL(img1);
                        var that=this;
                        reader.onloadend=function(){
                        	   that.user.avatar = reader.result
                        }},
         imageuploading(){
           console.log(this.$refs.upload);
           this.$vux.loading.show({
  text: '上传中...'
 })
         },
      imageuploaded(res) {
        console.log(res);
        this.$vux.loading.hide()
        this.$vux.toast.show({
          text: '修改成功!',
          type:'success',
          position:'middle'
        })
        this.user.avatar = res.list;
    },
      finish(){
        console.log(this.user);
        this.$http.post('http://sd.a10store.com/api/user.center.info.update.php', {update:this.user}).then(res => {
          this.$vux.toast.show({
            text: '修改成功!',
            type:'success',
            position:'middle'
          })
          this.edit = false
        }, res => {
          this.$vux.toast.show({
            text: '修改失败!',
            type:'warn',
            position:'middle'
          })
        })
      }
    },
    mounted() {
      this.$http.get('http://sd.a10store.com/api/user.center.info.get.php', {}).then(res => {
        console.log(res);
        this.user = res.body;
      }, res => {})
    },
    data(){
      return{
imageUrl:'',
        edit:false,
        show: true,
        show1: false,
      text1: '上传中...',
         headerImage:'',picValue:'',
        addressData: ChinaAddressV3Data,
        src: '',
        user:{avatar:'',bank:'3232323232323232'},
      }
    }
  }

</script>
