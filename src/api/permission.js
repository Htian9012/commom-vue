import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'get',
//     params
//   })
// }

export default {
  getList: params => request({ url: '/admin/mscPerms', method: 'get', params }),
  updatePerm: data => request({ url: '/admin/mscPerm', method: 'put', data })
}
