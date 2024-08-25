import { createSelector } from 'reselect'

const selectCurrentUser = (state: any) => state.user.user
const selectIsSidebarCollapsed = (state: any) => state.ui.isSidebarCollapsed

// Combined selector
export const selectUserAndUiState = createSelector(
  [selectCurrentUser, selectIsSidebarCollapsed],
  (currentUser, isSidebarCollapsed) => ({
    currentUser,
    isSidebarCollapsed
  })
)
