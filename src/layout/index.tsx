import React from 'react'
import { Layout } from 'antd'

import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import SideMenu from '../components/Menu'
import { Outlet } from 'react-router-dom'
import styles from './index.module.less'

const { Content, Sider } = Layout
const App: React.FC = () => {
  return (
    <Layout>
      <Sider
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
