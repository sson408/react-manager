import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UIState } from '../types/common'

const initialState: UIState = {
  isSidebarCollapsed: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarCollapsed = !state.isSidebarCollapsed
    },
    setSidebarState(state, action: PayloadAction<boolean>) {
      state.isSidebarCollapsed = action.payload
    }
  }
})

export const { toggleSidebar, setSidebarState } = uiSlice.actions

export default uiSlice.reducer
