import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {
      userId: '',
      username: '',
      nickName: '',
      createDate: '',
      updateDate: '',
      userFlag: '',
      accountStatus: '',
      physicianLicense: ''
    },
    token: '',
    roles: [],
    permission: []
  },
  mutations: {
    setCurrentUserInfo: (state, user) => { state.userInfo = user },
    SET_TOKEN: (state, token) => { state.token = token },
    SET_ROLES: (state, roles) => { state.roles = roles },
    SET_PERMISSION: (state, permission) => { state.permission = permission }
  },
  actions: {
    setCurrentUserInfo: ({ commit }, user) => { commit('setCurrentUserInfo', user) },
    setToken: ({ commit }, token) => { commit('SET_TOKEN', token) },
    setRoles: ({ commit }, roles) => { commit('SET_ROLES', roles) },
    setPermisson_routes: ({ commit }, permission) => { commit('SET_PERMISSION', permission) }
  },
  modules: {
  },
  getters: {
    getCurrentUserInfo: state => { return state.userInfo },
    getToken: state => { return state.token },
    roles: state => state.user.roles,
    permission_routers: state => state.permission.routers
  }
})
export default store
