export interface User {
  id?: number
  username: string
  password: string
  email?: string
}

export interface UserDetail {
  _id: string
  guid: string
  userName: string
  email: string
  userRoleId: number
  userRole: string
  state: string
  stateId: number
  department: string
  departmentId: number
}

export interface UserSearchSummary {
  filterWord?: string
  stateId?: string
}

export interface UserState {
  user: UserDetail | null
}
