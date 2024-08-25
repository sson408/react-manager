import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TokenState } from '../types/common'

const initialState: TokenState = {
  token: null
}

const tokenSlice = createSlice({
  name: 'authToken',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },
    clearToken(state) {
      state.token = null
    }
  }
})

export const { setToken, clearToken } = tokenSlice.actions

export default tokenSlice.reducer
