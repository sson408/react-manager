import httpService from './httpService'
import { User } from '../types/User'
import { LoginResponse } from '../types/LoginResponse'
import { TokenRequest } from '../types/TokenRequest'

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
): Promise<LoginResponse> => {
  try {
    const response = await httpService.post<LoginResponse>(
      '/auth/login',
      credentials
    )
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
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
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
    }
    return response
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw error
  }
}

export const logout = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}
