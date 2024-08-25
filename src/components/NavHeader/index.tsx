import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Switch, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import styles from './index.module.less'
import { useDispatch } from 'react-redux'
import storage from '../../utils/storage'
import { clearToken } from '../../store/tokenSlice'
import { toggleSidebar } from '../../store/uiSlice'
import { useUserAndUiState } from '../../hooks/useUserAndUiState'

const NavHeader = () => {
  const dispatch = useDispatch()
  // const currentUser = useSelector((state: any) => state.user.user)
  // const isSidebarCollapsed = useSelector(
  //   (state: any) => state.ui.isSidebarCollapsed
  // )

  const { currentUser, isSidebarCollapsed } = useUserAndUiState()
  const breadList = [
    {
      title: 'Home'
    },
    {
      title: 'Workspace'
    }
  ]
  const items: MenuProps['items'] = [
    {
      key: 'email',
      label: `Email: ${currentUser?.email}`
    },
    {
      key: 'logout',
      label: 'Logout'
    }
  ]

  //set sidebar collapse or expand
  const toggleCollapse = () => {
    dispatch(toggleSidebar())
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      storage.clear()
      //clear token in redux store
      dispatch(clearToken())
      location.href = '/login?callback=' + encodeURIComponent(location.href)
    }
  }
  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <div onClick={toggleCollapse}>
          {isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <Breadcrumb items={breadList} style={{ marginLeft: 10 }} />
      </div>
      <div className={styles.right}>
        <Switch
          checkedChildren='Dark'
          unCheckedChildren='Default'
          style={{ marginRight: 10 }}
        />
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <span className={styles.nickName}>{currentUser?.username}</span>
        </Dropdown>
      </div>
    </div>
  )
}

export default NavHeader
