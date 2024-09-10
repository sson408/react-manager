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

// export const ListAll = async (
//   pageNum: number = 1,
//   pageSize: number = 20,
// ): Promise<ResultData<UserDetail>> => {
//   try {
//     const queryString = qs.stringify({ pageNum, pageSize })

//     const response = await httpService.getDataList<UserDetail>(
//       '/user/listAll?' + queryString
//     )

//     return response
//   } catch (error) {
//     console.error('Error listing users:', error)
//     throw error
//   }
// }

export const ListAll = async (
  pageNum: number = 1,
  pageSize: number = 20,
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
