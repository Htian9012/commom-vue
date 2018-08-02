import request from '@/utils/request'

export default {
  getList: params => request({ url: '/admin/mscUsers', method: 'get', params }),
  addUser: data => request({ url: '/admin/mscUser', method: 'post', data })
}
