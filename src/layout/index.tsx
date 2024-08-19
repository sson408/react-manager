import React from 'react'
import { Layout } from 'antd'
import 'antd/dist/reset.css'

import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import SideMenu from '../components/Menu'

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
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360
            }}
          >
            content
          </div>
        </Content>
        <NavFooter />
      </Layout>
    </Layout>
  )
}

export default App
