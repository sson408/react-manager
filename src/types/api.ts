export interface Result<T = any> {
  code: number
  data: T
  message: string
}

export interface IConfig {
  showLoading?: boolean
  showError?: boolean
}
