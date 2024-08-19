import httpService from './httpService'
import { User } from '../types/User'
import { LoginResponse } from '../types/LoginResponse'
import { TokenRequest } from '../types/TokenRequest'
import storage from '../utils/storage'
import { Result } from '../types/api'

export const registerUser = async (user: User): Promise<void> => {
  try {
    await httpService.post<void>('/auth/register', user)
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}

export const loginUser = async (
  credentials: Pick<User, 'username' | 'password'>
): Promise<Result<LoginResponse>> => {
  try {
    const response = await httpService.post<LoginResponse>(
      '/auth/login',
      credentials,
      {
        showLoading: false
      }
    )
    const data = response.data
    if (data) {
      storage.set('token', data.token)
      storage.set('refreshToken', data.refreshToken)
    }
    return response
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const refreshToken = async (): Promise<LoginResponse> => {
  const token = getToken()
  const refreshToken = localStorage.getItem('refreshToken')
  try {
    const response = await httpService.post<LoginResponse>('/auth/refresh', {
      token,
      refreshToken
    } as TokenRequest)
    if (response.data) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    return response.data
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw error
  }
}

export const logout = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}
