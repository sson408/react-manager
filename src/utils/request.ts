// import axios, { AxiosError } from 'axios'
// import { message } from 'antd'
// import { showLoading, hideLoading } from './loading'
// import storage from './storage'
// import env from '../config.ts'
// import { Result } from '../types/api.ts'
// console.log('config', env)
// // create an axios instance
// const instance = axios.create({
//   timeout: 8000,
//   timeoutErrorMessage: 'The request timed out, please try again later.',
//   withCredentials: true
// })

// // request interceptor
// instance.interceptors.request.use(
//   config => {
//     showLoading()
//     const token = storage.get('token')
//     if (token) {
//       config.headers.Authorization = 'Token::' + token
//     }
//     config.headers.icode = 'A7EEA094EAA44AF4'
//     config.baseURL = env.apiBaseUrl
//     return {
//       ...config
//     }
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// instance.interceptors.response.use(
//   response => {
//     const data: Result = response.data
//     hideLoading()
//     if (data.code === 500001) {
//       message.error(data.msg)
//       storage.remove('token')
//       // location.href = '/login'
//     } else if (data.code != 0) {
//       message.error(data.msg)
//       return Promise.reject(data)
//     }
//     return data.data
//   },
//   error => {
//     hideLoading()
//     message.error(error.message)
//     return Promise.reject(error.message)
//   }
// )

// export default {
//   get<T>(url: string, params?: object): Promise<T> {
//     return instance.get(url, { params })
//   },
//   post<T>(url: string, params?: object): Promise<T> {
//     return instance.post(url, params)
//   }
// }
