import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { showLoading, hideLoading } from '../utils/loading'
import storage from '../utils/storage'
import env from '../config'
import { Result, IConfig, ResultData } from '../types/api'

// Create an axios instance
const instance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  timeoutErrorMessage: 'The request timed out, please try again later.',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Request interceptor
instance.interceptors.request.use(
  async config => {
    if (config.showLoading) showLoading()

    const token = storage.get('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (error: AxiosError) => {
    hideLoading()
    return Promise.reject(error)
  }
)

// Response interceptor
instance.interceptors.response.use(
  response => {
    hideLoading()
    const data: Result = response.data
    if (data.code === 500001) {
      message.error(data.message)
      storage.remove('token')
      storage.remove('refreshToken')
      location.href = '/login?callback=' + encodeURIComponent(location.href)
    } else if (data.code != 0) {
      if (data.code !== 200) {
        if (!response.config.showError) {
          return Promise.resolve(response)
        } else {
          message.error(data.message)
          return Promise.reject(data)
        }
      } else {
        return Promise.resolve(response)
      }
    }
    return response
  },
  async error => {
    hideLoading()
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const errorMessage = error.response.data.message
      if (
        errorMessage === 'Token expired' ||
        errorMessage === 'Invalid token'
      ) {
        try {
          const refreshToken = storage.get('refreshToken')
          const response = await axios.post(`${env.apiBaseUrl}/auth/refresh`, {
            token: storage.get('token'),
            refreshToken
          })

          storage.set('token', response.data.token)
          storage.set('refreshToken', response.data.refreshToken)
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`
          return instance(originalRequest)
        } catch (refreshError) {
          message.error('Login expired. Please log in again.')
          storage.remove('token')
          storage.remove('refreshToken')
          location.href = '/login?callback=' + encodeURIComponent(location.href)
          return Promise.reject(refreshError)
        }
      } else {
        //message.error(errorMessage || 'Unauthorized')
        return Promise.reject(error)
      }
    }
    message.error(error.message)
    return Promise.reject(error)
  }
)

// Unified httpService
const httpService = {
  get: async <T>(
    url: string,
    params?: object,
    config: IConfig = { showLoading: true, showError: true }
  ): Promise<Result<T>> => {
    const response = await instance.get<Result<T>>(url, { params, ...config })
    return response.data
  },
  getDataList: async <T>(
    url: string,
    params?: object,
    config: IConfig = { showLoading: true, showError: true }
  ): Promise<ResultData<T>> => {
    // Return the full Axios response
    const response = await instance.get<ResultData<T>>(url, {
      params,
      ...config
    })
    return response.data
  },
  post: async <T>(
    url: string,
    data: unknown,
    config: IConfig = { showLoading: true, showError: true }
  ): Promise<Result<T>> => {
    const response = await instance.post<Result<T>>(url, data, config)
    return response.data
  },
  postDataList: async <T>(
    url: string,
    data: unknown,
    config: IConfig = { showLoading: true, showError: true }
  ): Promise<ResultData<T>> => {
    const response = await instance.post<ResultData<T>>(url, data, config)
    return response.data
  },
  put: async <T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> => {
    const response = await instance.put<Result<T>>(url, data, config)
    return response.data
  },
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> => {
    const response = await instance.delete<Result<T>>(url, config)
    return response.data
  }
}
export default httpService
