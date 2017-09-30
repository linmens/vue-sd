
<template>
<div style="height:100%">
  <el-form :model="ruleForm2"  class="login-pc" ref="ruleForm2" label-width="100px" >
  <el-form-item label="">
    <el-input v-model="ruleForm2.account" placeholder="请输入用户名"></el-input>
  </el-form-item>
  <el-form-item label="">
      <el-input type="password" v-model="ruleForm2.pass" placeholder="请输入密码"></el-input>
  </el-form-item>
  <el-form-item label-width="100px">
    <el-button type="success" @click="submitForm('ruleForm2')">登录</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<style>
.login-pc{
  padding: 10px;
width: 35%;
margin: 0 auto;
}
</style>
<script>
// import { cookie } from 'vux'
export default {

  data() {
    return {

      ruleForm2: {
        pass: '',
        account: '',
      },
    };
  },
  mounted(){
    // let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    // this.boxHeight = h -46
  },
  methods: {
    submitForm() {
      console.log(this.$cookie);
      this.$http.post('api/login.php', {
        form: this.ruleForm2
      }).then(res => {
        if(res.body.mes=='登陆成功'){
          this.$cookie.set('username', res.body.nick_name);
          this.$cookie.set('avatar', res.body.avatar);
          this.$cookie.set('id', res.body.account_id)
          this.$router.push('/shangpin/weihu')
        }else {
        }
      }, res => {
      })
    }
  }
}
</script>
