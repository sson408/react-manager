import httpService from './httpService'
import { PropertyDetail, PropertySearchSummary } from '../types/property'
import { IConfig, ResultData } from '../types/api'
import qs from 'qs'

export const ListAll = async (
  pageNum: number,
  pageSize: number,
  searchSummary: PropertySearchSummary,
  config: IConfig = { showLoading: true, showError: true }
): Promise<ResultData<PropertyDetail>> => {
  try {
    const queryString = qs.stringify({ pageNum, pageSize })
    const response = await httpService.postDataList<PropertyDetail>(
      '/property/listAll?' + queryString,
      searchSummary,
      config
    )

    return response
  } catch (error) {
    console.error('Error listing properties:', error)
    throw error
  }
}
