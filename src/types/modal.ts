import { MutableRefObject } from 'react'
import { UserDetail } from './User'
export type IAction = 'create' | 'edit' | 'delete'

export interface IModalProp {
  mRef: MutableRefObject<
    { open: (type: IAction, data: UserDetail) => void } | undefined
  >
  update: () => void
}
