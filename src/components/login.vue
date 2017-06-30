
<template>
<div style="height:100%">
    <group >
      <x-input  v-model="ruleForm2.account" placeholder="请输入用户名" novalidate :icon-type="iconType"   placeholder-align=""></x-input>
      <x-input  type="password" v-model="ruleForm2.pass" placeholder="请输入密码" novalidate :icon-type="iconType"   placeholder-align=""></x-input>
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
      boxHeight:'',
      ruleForm2: {
        pass: '',
        account: '',
      },
    };
  },
  mounted(){
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.boxHeight = h -46
  },
  methods: {
    submitForm() {
      this.$http.post('http://sd.a10store.com/api/login.php', {
        form: this.ruleForm2
      }).then(res => {
        if(res.body.data_info=='success'){
          cookie.set('username', this.ruleForm2.account)
          cookie.set('pass', this.ruleForm2.account)
          cookie.set('id', res.body.id)
          this.$router.push('/caigou')
        }else {
            this.$vux.toast.show({
            type: 'cancel',
            position: 'middle',
            text: '登陆失败!'
          })
        }
      }, res => {

      })
    }
  }
}
</script>
