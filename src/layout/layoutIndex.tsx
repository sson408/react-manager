import React, { useEffect } from 'react'
import { Layout, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from '../store/userSlice'
import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import SideMenu from '../components/Menu'
import { Outlet } from 'react-router-dom'
import styles from './index.module.less'
import { getUserDetail } from '../services/userSercice'
import { AxiosError } from 'axios'

const { Content, Sider } = Layout

const App: React.FC = () => {
  const dispatch = useDispatch()
  const isSidebarCollapsed = useSelector(
    (state: any) => state.ui.isSidebarCollapsed
  )

  useEffect(() => {
    getLoggedUser()
  }, [])

  const getLoggedUser = async () => {
    try {
      // Get current logged in user
      const resp = await getUserDetail()
      if (resp && resp.data) {
        const data = resp.data
        dispatch(setUser(data))
      } else {
        dispatch(clearUser())
        message.error('No user data received from getUserDetail!')
      }
    } catch (error) {
      let errorMessage = 'Error fetching logged-in user details'
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      message.error(errorMessage)
      dispatch(clearUser())
    }
  }

  return (
    <Layout>
      <Sider
        collapsed={isSidebarCollapsed}
        width={220}
        breakpoint='lg'
        collapsedWidth='0'
        onBreakpoint={broken => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <SideMenu />
      </Sider>
      <Layout>
        <NavHeader />
        <Content className={styles.content}>
          <div className={styles.wrapper}>
            <Outlet></Outlet>
          </div>
          <NavFooter />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
