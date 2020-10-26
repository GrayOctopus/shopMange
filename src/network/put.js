import axios from 'axios'

export function put(userId,userState) {

  const put = axios.put(`http://timemeetyou.com:8889/api/private/v1/users/${userId}/state/${userState}`)

  return put
}