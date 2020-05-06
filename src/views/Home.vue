<template>
  <div class="home">
    <div class="home">
    <Header/>
    </div>
    <transition name="el-fade-in-linear">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
export default {
  name: 'Home',
  components: {
    Header
  },
  created () {
    this.$store.dispatch('setToken', JSON.parse(sessionStorage.getItem('token')))
  },
  mounted () {
    this.$router.push('/remedy')
  }
}
</script>
<style scoped>
</style>
