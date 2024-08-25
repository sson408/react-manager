import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserDetail, UserState } from '../types/User'

const initialState: UserState = {
  user: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserDetail>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer
