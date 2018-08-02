import axios from 'axios'
import store from '../store'
import { getToken, getRefreshToken, setToken } from '@/utils/auth'
import { Message } from 'element-ui'

axios.defaults.retry = 3
axios.defaults.retryDelay = 1000
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_LOGIN_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token || getToken()) {
    config.headers['X-Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.data.message && response.data.message.indexOf('Token已过期') > -1) {
      store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
    return response.data
  },
  err => {
    // 服务器错误，则提示信息
    if (err.message.indexOf('500') > -1) {
      Message({
        type: 'error',
        message: `500：${err.response.data.message}`
      })
      return Promise.reject(err)
    }
    if (err.message.indexOf('403') > -1) {
      Message({
        type: 'error',
        message: `403：${err.response.data.message}`
      })
      return Promise.reject(err)
    }
    console.log('error:', err)
    var config = err.config

    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err)

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      Message({
        message: '你的身份验证已过有效期，请重新登录！',
        type: 'error',
        onClose() {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        }
      })
      return Promise.reject(err)
    }

    // Increase the retry count
    config.__retryCount += 1

    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, config.retryDelay || 1)
    })

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
      if (err.message.indexOf('401') > -1) {
        return axios.get(process.env.BASE_LOGIN_API + '/api/auth/login', { headers: { 'X-Authorization': 'Bearer ' + getRefreshToken() }}).then(response => {
          const data = response.data
          setToken(data.token)
          store.commit('SET_TOKEN', data.token)
        }).then(() => {
          console.log('401-config', config)
          return service(config)
        })
      }
    })
    // return Promise.reject(error);
  }
)

export default service
