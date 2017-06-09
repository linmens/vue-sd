
<template>
<div>
  <group title="禁用内置验证及显示成功或者错误样式">
    <x-input title="用户名" v-model="ruleForm2.account" placeholder="请输入用户名" novalidate :icon-type="iconType"   placeholder-align="right"></x-input>
    <x-input title="密码" type="password" v-model="ruleForm2.pass" placeholder="请输入密码" novalidate :icon-type="iconType"   placeholder-align="right"></x-input>
  </group>
  <div style="padding:15px;">
    <x-button @click.native="submitForm" :disabled="ruleForm2.account==''||ruleForm2.pass==''" type="primary">登录</x-button>
  </div>
</div>
</template>

<script>
import {
  XInput,
  Group,
  XButton,
  cookie,
  Cell
} from 'vux'
export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell
  },
  data() {
    return {
      iconType: '',
      ruleForm2: {
        pass: '',
        account: '',
      },
    };
  },
  methods: {
    submitForm() {
      console.log(this.ruleForm2);
      cookie.set('username', this.ruleForm2.account)
      this.$http.post('http://sd.a10store.com/api/login.php', {
        form: this.ruleForm2
      }).then(res => {
        console.log(res);
        cookie.set('username', this.ruleForm2.account)
        cookie.set('pass', this.ruleForm2.account)
        cookie.set('id', res.body.id)
        this.$router.push('/caigou')
      }, res => {})
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
