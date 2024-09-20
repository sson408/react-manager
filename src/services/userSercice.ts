import httpService from './httpService'
import { UserDetail, UserSearchSummary, UserUpdateSummary } from '../types/User'
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

export const createUser = async (
  userUpdateSummary: UserUpdateSummary,
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.post<Result>(
      '/user/create',
      userUpdateSummary,
      config
    )
    return response
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const updateUser = async (
  userUpdateSummary: UserUpdateSummary,
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.post<Result>(
      '/user/update',
      userUpdateSummary,
      config
    )
    return response
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export const DeleteUser = async (
  guid: string,
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.delete<Result>(`/user/${guid}`, config)
    return response
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

export const BatchDeleteUser = async (
  guids: string[],
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.post<Result>(
      '/user/batchDelete',
      guids,
      config
    )
    return response
  } catch (error) {
    console.error('Error batch deleting users:', error)
    throw error
  }
}
