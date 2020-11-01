import {request} from "network/request";
export function getUserList(query,pagenum,pagesize) {
  return request({
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}
