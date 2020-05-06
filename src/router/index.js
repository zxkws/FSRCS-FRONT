import Vue from 'vue'
import VueRouter from 'vue-router'
import Message from 'element-ui/packages/message/src/main'
import Home from '../views/Home.vue'
import Login from '../views/login/Login.vue'
import Dynamic from '../views/dynamicManage/Dynamic.vue'
import Remedy from '../views/remedyManage/Remedy.vue'
import User from '../views/userManage/User.vue'
import Role from '../views/roleManage/Role.vue'
import Person from '../views/personCenter/PersonCenter.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Login', component: Login },
  {
    path: '/home',
    component: Home,
    name: 'Home',
    children: [{
      path: '/dynamic',
      name: '动态管理',
      component: Dynamic,
      meta: { requireAuth: true }
    }, {
      path: '/remedy',
      name: '偏方管理',
      component: Remedy,
      meta: { requireAuth: true }
    }, {
      path: '/user',
      name: '用户管理',
      component: User,
      meta: { requireAuth: true }
    }, {
      path: '/role',
      name: '角色管理',
      component: Role,
      meta: { requireAuth: true }
    }, {
      path: '/person',
      name: '个人中心',
      component: Person,
      meta: { requireAuth: true }
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (sessionStorage.getItem('token') && sessionStorage.getItem('permission_routes')) {
      let routes = sessionStorage.getItem('permission_routes')
      routes = JSON.parse(routes)
      let routeArr = []
      routes.map(item => {
        routeArr.push(item.url)
      })
      routeArr = routeArr.toString()
      if (routeArr.indexOf(to.path) !== -1 || to.path === '/person') {
        next()
      } else {
        Message.error('您无权限访问此模块')
        next(from.path)
      }
    } else {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})
