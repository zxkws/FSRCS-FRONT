import Axios from 'axios'
import store from '../store'
function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  Axios.defaults.timeout = 180000
  Vue.http = Axios
  Vue.prototype.$http = Axios
}
// 请求拦截器
Axios.interceptors.request.use(config => {
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 相应拦截器
Axios.interceptors.response.use(function (res) {
  if (res.headers.Authorization) {
    sessionStorage.setItem('token', JSON.stringify(res.headers.Authorization))
  }
  if (res.data.code === 9999) {
    sessionStorage.clear()
    window.location.href = '/'
    return
  }
  return res
}
)
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
export default plugin
