import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import tokenReducer from './tokenSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    authToken: tokenReducer,
    ui: uiReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
