export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

export interface IConfig {
  showLoading?: boolean
  showError?: boolean
}
