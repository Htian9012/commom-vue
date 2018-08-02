// import { login, logout, getInfo } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'
//
// const user = {
//   state: {
//     token: getToken(),
//     name: '',
//     avatar: '',
//     roles: []
//   },
//
//   mutations: {
//     SET_TOKEN: (state, token) => {
//       state.token = token
//     },
//     SET_NAME: (state, name) => {
//       state.name = name
//     },
//     SET_AVATAR: (state, avatar) => {
//       state.avatar = avatar
//     },
//     SET_ROLES: (state, roles) => {
//       state.roles = roles
//     }
//   },
//
//   actions: {
//     // 登录
//     Login({ commit }, userInfo) {
//       const username = userInfo.username.trim()
//       return new Promise((resolve, reject) => {
//         login(username, userInfo.password).then(response => {
//           const data = response.data
//           setToken(data.token)
//           commit('SET_TOKEN', data.token)
//           resolve()
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 获取用户信息
//     GetInfo({ commit, state }) {
//       return new Promise((resolve, reject) => {
//         getInfo(state.token).then(response => {
//           const data = response.data
//           if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
//             commit('SET_ROLES', data.roles)
//           } else {
//             reject('getInfo: roles must be a non-null array !')
//           }
//           commit('SET_NAME', data.name)
//           commit('SET_AVATAR', data.avatar)
//           resolve(response)
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 登出
//     LogOut({ commit, state }) {
//       return new Promise((resolve, reject) => {
//         logout(state.token).then(() => {
//           commit('SET_TOKEN', '')
//           commit('SET_ROLES', [])
//           removeToken()
//           resolve()
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 前端 登出
//     FedLogOut({ commit }) {
//       return new Promise(resolve => {
//         commit('SET_TOKEN', '')
//         removeToken()
//         resolve()
//       })
//     }
//   }
// }
//
// export default user

// 这里分开的啊 李泽浩
// import { login, logout, getInfo } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '@/router'
// import Loggin from '@/api/login'
import { getToken, setToken, setRefreshToken, clearSession, getRefreshToken } from '@/utils/auth'
import { Message } from 'element-ui'
import axios from 'axios'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userinfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USERINFO: (state, userinfo) => {
      state.userinfo = userinfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    // Login({ commit }, userInfo) {
    //   const username = userInfo.username.trim()
    //   return new Promise((resolve, reject) => {
    //     login(username, userInfo.password).then(response => {
    //       const data = response.data
    //       setToken(data.token)
    //       commit('SET_TOKEN', data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(response => {
    //       const data = response.data
    //       commit('SET_ROLES', data.roles)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // // 前端 登出
    // FedLogOut({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     resolve()
    //   })
    // }

    // 登入 -- 保存token、refreshToken
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        axios.post(process.env.BASE_LOGIN_API + '/api/auth/login', { ...userInfo }, { headers: { 'X-Requested-With': 'XMLHttpRequest' }}).then(response => {
          // Loggin.login(userInfo).then(response => {
          const data = response.data
          if (data.token) {
            setToken(data.token)
            setRefreshToken(data.refreshToken)
            commit('SET_TOKEN', data.token)
            resolve()
          } else {
            // Message.error('用户名或密码错误！')
            reject('用户名或密码错误！')
          }
        }).catch(error => {
          // Message.error(i18n.t(\'all.loginErr\'))
          Message.error(error.response.data.message)
          reject(error)
        })
      })
    },

    // 登录成功后获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // Loggin.getInfo(state.token).then(response => {
        axios.get(process.env.BASE_LOGIN_API + '/admin/mscUser/load', { headers: { 'X-Authorization': 'Bearer ' + getToken() }}).then(response => {
          const data = response.data
          commit('SET_ROLES', 'admin')
          commit('SET_USERINFO', data)
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          resolve(response)
        }).catch(error => {
          // 401token过期
          if ((error + '').indexOf('401') > -1) {
            axios.get(process.env.BASE_LOGIN_API + '/api/auth/token', { headers: { 'X-Authorization': 'Bearer ' + getRefreshToken() }}).then(response => {
              const data = response.data
              setToken(data.token)
              commit('SET_TOKEN', data.token)
              window.location.reload()
              //            var to = router.currentRoute.fullPath
              //            console.log(to)
              //            router.replace(to)
            }).catch(error => {
              clearSession()
              router.push('/login')
              reject(error)
            })
          } else {
            Message.error('服务器出错了')
            console.dir(error)
            // 清空token
            clearSession()
            router.replace('/login')
          }
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        clearSession()
        resolve()
      })
    }
  }
}

export default user
