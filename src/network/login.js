import {request} from './request'

export function getLogin (username,password) {
  return request({
      url: '/login',
      params: {
        username,
        password
      }
    }
  )
}

export function getMenuList () {
  return request({
        url: '/menus',
      }
  )
}