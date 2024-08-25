import httpService from './httpService'
import { UserDetail } from '../types/User'
import { Result } from '../types/api'

export const getUserDetail = async (): Promise<Result<UserDetail>> => {
  try {
    const response = await httpService.get<UserDetail>('/user/currentUser')
    return response
  } catch (error) {
    console.error('Error getting user detail:', error)
    throw error
  }
}
