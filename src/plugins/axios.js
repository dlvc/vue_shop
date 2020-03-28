import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://api.dengylccc.icu/api/private/v1'
})

axiosInstance.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token') || ''
  return config
})

export default axiosInstance
