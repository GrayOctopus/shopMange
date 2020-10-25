import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://timemeetyou.com:8889/api/private/v1',
    timeout: 5000
      }
  )
  /**
   * 这是一个相应请求
   */
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  return instance(config)
}