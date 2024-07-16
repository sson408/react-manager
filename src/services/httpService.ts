import axios, { AxiosRequestConfig } from 'axios'
import config from '../config.ts'

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
          token: localStorage.getItem('token'),
          refreshToken
        })
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + response.data.token
        return apiClient(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

const httpService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config)
    return response.data
  },
  post: async <T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  },
  put: async <T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  }
}

export default httpService
