export interface Result<T = any> {
  code: number
  data: T
  message: string
}

// export interface ResultData<T = any> {
//   List: T[]
//   Page: {
//     PageNum: number
//     PageSize: number
//     Total: number | 0
//   }
// }

export interface IConfig {
  showLoading?: boolean
  showError?: boolean
}

export interface PageInfo {
  PageNum: number
  PageSize: number
  Total: number
}

export interface ResultData<T = any> {
  code: number
  message: string
  data: T[]
  pageInfo: PageInfo
}
