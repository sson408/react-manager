import httpService from './httpService'
import { UserDetail, UserSearchSummary } from '../types/User'
import { IConfig, Result, ResultData } from '../types/api'
import qs from 'qs'

export const getUserDetail = async (
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result<UserDetail>> => {
  try {
    const response = await httpService.get<UserDetail>(
      '/user/currentUser',
      {},
      config
    )
    return response
  } catch (error) {
    console.error('Error getting user detail:', error)
    throw error
  }
}

export const ListAll = async (
  pageNum: number,
  pageSize: number,
  searchSummary: UserSearchSummary,
  config: IConfig = { showLoading: true, showError: true }
): Promise<ResultData<UserDetail>> => {
  try {
    const queryString = qs.stringify({ pageNum, pageSize })
    const response = await httpService.postDataList<UserDetail>(
      '/user/listAll?' + queryString,
      searchSummary,
      config
    )

    return response
  } catch (error) {
    console.error('Error listing users:', error)
    throw error
  }
}
