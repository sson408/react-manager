import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { showLoading, hideLoading } from '../utils/loading'
import storage from '../utils/storage'
import env from '../config'
import { Result } from '../types/api'

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
    showLoading()
    const token = storage.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
      message.error(data.msg)
      storage.remove('token')
      // location.href = '/login'
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

          //storage.set('token', response.data.token)
          //storage.set('refreshToken', response.data.refreshToken)
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`
          return instance(originalRequest)
        } catch (refreshError) {
          message.error('Session expired. Please log in again.')
          storage.remove('token')
          storage.remove('refreshToken')
          location.href = '/login'
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
  get: async <T>(url: string, params?: object): Promise<Result<T>> => {
    const response = await instance.get<Result<T>>(url, { params })
    return response.data
  },
  post: async <T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> => {
    const response = await instance.post<Result<T>>(url, data, config)
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
