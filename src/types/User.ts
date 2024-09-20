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
  phoneNumber: string
  firstName: string
  lastName: string
  avatarUrl: string
}

export interface UserUpdateSummary {
  guid?: string
  userName?: string
  email?: string
  userRoleId?: number
  stateId?: number
  departmentId?: number
  phoneNumber?: string
  firstName?: string
  lastName?: string
  password?: string
}

export interface UserSearchSummary {
  filterWord?: string
  stateId?: string
}

export interface UserState {
  user: UserDetail | null
}
