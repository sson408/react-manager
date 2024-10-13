import httpService from './httpService'
import {
  PropertyDetail,
  PropertySearchSummary,
  PropertyUpdateSummary
} from '../types/property'
import { IConfig, Result, ResultData } from '../types/api'
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

export const getPropertyDetail = async (
  guid: string,
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result<PropertyDetail>> => {
  try {
    const response = await httpService.get<PropertyDetail>(
      `/property/${guid}`,
      {},
      config
    )
    return response
  } catch (error) {
    console.error('Error getting property detail:', error)
    throw error
  }
}

export const updateProperty = async (
  updateSummary: PropertyUpdateSummary,
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.post<Result>(
      '/property/update',
      updateSummary,
      config
    )
    return response
  } catch (error) {
    console.error('Error updating property:', error)
    throw error
  }
}

export const CreateProperty = async (
  updateSummary: PropertyUpdateSummary,
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.post<Result>(
      '/property/create',
      updateSummary,
      config
    )
    return response
  } catch (error) {
    console.error('Error adding property:', error)
    throw error
  }
}

export const DeleteProperty = async (
  guid: string,
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.delete<Result>(
      `/property/${guid}`,
      config
    )
    return response
  } catch (error) {
    console.error('Error deleting property:', error)
    throw error
  }
}

export const BatchDeleteProperty = async (
  guids: string[],
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.post<Result>(
      '/property/batchDelete',
      guids,
      config
    )
    return response
  } catch (error) {
    console.error('Error batch deleting properties:', error)
    throw error
  }
}

export const SetSold = async (
  updateSummary: PropertyUpdateSummary,
  config: IConfig = { showLoading: true, showError: true }
): Promise<Result> => {
  try {
    const response = await httpService.post<Result>(
      '/property/setSold',
      updateSummary,
      config
    )
    return response
  } catch (error) {
    console.error('Error adding property:', error)
    throw error
  }
}
