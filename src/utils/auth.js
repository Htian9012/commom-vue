// import Cookies from 'js-cookie'
//
// const TokenKey = 'Admin-Token'
//
// export function getToken() {
//   return Cookies.get(TokenKey)
// }
//
// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }
//
// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

var session = window.sessionStorage

export function setToken(token) {
  return session.setItem('token', token)
}
export function getToken() {
  return session.getItem('token')
}
export function setRefreshToken(refreshToken) {
  return session.setItem('refreshToken', refreshToken)
}
export function getRefreshToken() {
  return session.getItem('refreshToken')
}

export function clearSession() {
  return session.clear()
}
