<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  public logout() {
    window.sessionStorage.clear()
    this['$router'].push('/login')
  }
}
</script>

<style lang="less" scoped></style>
