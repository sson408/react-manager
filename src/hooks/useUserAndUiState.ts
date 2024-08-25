import { useSelector } from 'react-redux'
import { selectUserAndUiState } from '../store/selectors'

export const useUserAndUiState = () => {
  return useSelector(selectUserAndUiState)
}
