import httpService from './httpService'
import { UserDetail, UserSearchSummary } from '../types/User'
import { Result, ResultData } from '../types/api'
import qs from 'qs'

export const getUserDetail = async (): Promise<Result<UserDetail>> => {
  try {
    const response = await httpService.get<UserDetail>('/user/currentUser')
    return response
  } catch (error) {
    console.error('Error getting user detail:', error)
    throw error
  }
}

export const ListAll = async (
  pageNum: number,
  pageSize: number,
  searchSummary: UserSearchSummary
): Promise<ResultData<UserDetail>> => {
  try {
    const queryString = qs.stringify({ pageNum, pageSize })
    const response = await httpService.postDataList<UserDetail>(
      '/user/listAll?' + queryString,
      searchSummary
    )

    return response
  } catch (error) {
    console.error('Error listing users:', error)
    throw error
  }
}
