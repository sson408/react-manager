export interface User {
  id?: number
  username: string
  password: string
  email?: string
}

export interface UserDetail {
  guid: string
  userName: string
  email: string
}

export interface UserState {
  user: UserDetail | null
}
