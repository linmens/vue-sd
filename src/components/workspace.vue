<template>
<div>
  <grid>
    <grid-item :link="i.link" :label="i.label" :key="index" v-for="(i,index) in workspaceApi">
      <icon slot="icon" :name="i.icon" scale="1.7"></icon>
    </grid-item>
  </grid>
</div>
</template>
<script>
import {
  Grid,
  GridItem
} from 'vux'
export default {
  components: {
    Grid,
    GridItem
  },
  data() {
    return {
      workspaceApi:[{
        icon: 'reorder',
        link:'adminorder',
        label: '订单管理'
      }, {
        icon: '12',
        link:'duizhangAdmin',
        label: '对账'
      }]
    }
  }
}
</script>
