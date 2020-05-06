<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#409EFF"
    text-color="#fff"
    active-text-color="#ffd04b" router>
    <!--<el-menu-item index="/remedy" style="margin-left: 10%">偏方管理</el-menu-item>
    <el-menu-item index="/dynamic" style="margin-left: 10%">动态管理</el-menu-item>
    <el-menu-item index="/user" style="margin-left: 10%">用户管理</el-menu-item>
    <el-menu-item index="/role" style="margin-left: 10%">角色管理</el-menu-item>-->
    <el-menu-item v-for="item in routesArr" :index="item.url" :key="item.id" style="margin-left: 10%">{{item.permissionName}}</el-menu-item>
    <el-menu-item index="/person" style="margin-left: 10%">
        <div class="avatar-wrapper">
          <svg v-if="iconFlag === 1" t="1585424176603" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6159" width="32" height="32"><path d="M510.973624 140.324956c102.866832 0 186.251961 82.024132 186.251961 183.192276 0 101.189633-83.384106 183.217858-186.251961 183.217858-102.862739 0-186.246845-82.028225-186.246845-183.217858C324.725756 222.325551 408.138514 140.324956 510.973624 140.324956L510.973624 140.324956 510.973624 140.324956 510.973624 140.324956z" p-id="6160"></path><path d="M430.147784 556.559868l163.703409 0c140.123364 0 253.700119 92.656283 253.700119 230.494605l0 16.07614c0 54.31914-113.601314 80.543408-253.700119 80.543408L430.147784 883.674021c-140.127458 0-253.700119-24.239054-253.700119-80.543408l0-16.07614C176.449711 649.216151 290.02135 556.559868 430.147784 556.559868L430.147784 556.559868 430.147784 556.559868 430.147784 556.559868z" p-id="6161"></path></svg>
          <svg v-if="iconFlag === 2" class="icon" t="1585423147201" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4460" data-spm-anchor-id="a313x.7781069.0.i4" width="32" height="32"><path d="M472 608c123.2 0 229.6-88 254.4-136.8C744 436 744.8 296 744 253.6c-0.8-82.4-4.8-184-20.8-200.8C689.6 18.4 522.4 16 472 16 356 16 223.2 34.4 204.8 52.8c-4 3.2-14.4 14.4-16.8 203.2-1.6 126.4 3.2 199.2 14.4 216C224.8 507.2 352 608 472 608z m225.6-151.2C677.6 497.6 579.2 576 472 576c-104.8 0-224-91.2-242.4-120-8-16-10.4-112.8-9.6-205.6 26.4-8 173.6-49.6 252-49.6 70.4 0 196 41.6 240 57.6 0.8 87.2-3.2 177.6-14.4 198.4zM472 48c135.2 0 213.6 15.2 228 26.4 6.4 14.4 11.2 77.6 12 148.8-52.8-18.4-169.6-55.2-240-55.2-76.8 0-208.8 36-251.2 48 1.6-65.6 4.8-123.2 8.8-141.6C251.2 65.6 353.6 48 472 48z" fill="#1296db" p-id="4461" data-spm-anchor-id="a313x.7781069.0.i6"></path><path d="M428 124.8h24V144c0 8.8 7.2 16 16 16s16-7.2 16-16v-19.2h24c8.8 0 16-7.2 16-16s-7.2-16-16-16h-24V75.2c0-8.8-7.2-16-16-16s-16 7.2-16 16v17.6h-24c-8.8 0-16 7.2-16 16s7.2 16 16 16zM472 632c-198.4 0-360 237.6-360 296 0 22.4 27.2 32 109.6 39.2 54.4 4.8 131.2 7.2 216 7.2 92.8 0 187.2-3.2 259.2-8 126.4-9.6 136-20.8 136-38.4-0.8-44.8-164-296-360.8-296z m0 310.4c-184 1.6-302.4-8.8-328-20C155.2 872 299.2 664 472 664c171.2 0 309.6 207.2 326.4 256.8-31.2 9.6-156 20-326.4 21.6zM991.2 859.2c-0.8-4-28.8-95.2-57.6-140-29.6-44.8-90.4-75.2-128.8-91.2 38.4-26.4 99.2-80.8 107.2-163.2 8.8-97.6-2.4-264-6.4-326.4-0.8-8.8-0.8-16-1.6-20-2.4-47.2-78.4-54.4-86.4-55.2-8.8-0.8-16.8 5.6-16.8 14.4s5.6 16.8 14.4 16.8c23.2 1.6 56.8 12 57.6 24.8 0 4 0.8 11.2 1.6 20 1.6 18.4 3.2 46.4 4.8 78.4-23.2-11.2-57.6-25.6-93.6-27.2l-1.6 32c40.8 2.4 81.6 24 96.8 32.8 3.2 68.8 4.8 149.6 0 205.6C872 560 762.4 615.2 761.6 616c-5.6 3.2-9.6 8.8-8.8 16 0.8 6.4 4.8 12 11.2 14.4 0.8 0 106.4 32.8 143.2 89.6 26.4 40.8 53.6 131.2 54.4 132 2.4 7.2 8.8 11.2 15.2 11.2 1.6 0 3.2 0 4.8-0.8 7.2-1.6 12-10.4 9.6-19.2z" fill="#1296db" p-id="4462"></path></svg>
          <svg v-if="iconFlag === 3" t="1585424117211" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5366" width="32" height="32"><path d="M512 597.333333v85.333334a256 256 0 0 0-256 256H170.666667a341.333333 341.333333 0 0 1 341.333333-341.333334z m0-42.666666c-141.44 0-256-114.56-256-256s114.56-256 256-256 256 114.56 256 256-114.56 256-256 256z m0-85.333334c94.293333 0 170.666667-76.373333 170.666667-170.666666s-76.373333-170.666667-170.666667-170.666667-170.666667 76.373333-170.666667 170.666667 76.373333 170.666667 170.666667 170.666666z m384 256h42.666667v213.333334h-341.333334v-213.333334h42.666667v-42.666666a128 128 0 0 1 256 0v42.666666z m-85.333333 0v-42.666666a42.666667 42.666667 0 0 0-85.333334 0v42.666666h85.333334z" p-id="5367"></path></svg>
          <i class="el-icon-caret-bottom" />
        </div>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Header',
  data () {
    return {
      activeIndex: '1',
      iconFlag: 1,
      routesArr: []
    }
  },
  created () {
    this.$store.dispatch('setToken', JSON.parse(sessionStorage.getItem('token')))
    this.$store.dispatch('setCurrentUserInfo', JSON.parse(sessionStorage.getItem('userInfo')))
  },
  mounted () {
    const routes = sessionStorage.getItem('permission_routes')
    this.routesArr = JSON.parse(routes)
    const role = sessionStorage.getItem('role')
    if (role.indexOf('管理员') !== -1) {
      this.iconFlag = 1
    } else if (role.indexOf('医师') !== -1) {
      this.iconFlag = 2
    } else {
      this.iconFlag = 3
    }
  },
  computed: {
    ...mapGetters({ userInfo: 'getCurrentUserInfo' })
  },
  methods: {
    handleSelect (key, keyPath) {
    }
  }
}
</script>

<style scoped>
</style>
