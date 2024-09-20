import { RouterProvider } from 'react-router'
import { ConfigProvider, App as AntdApp } from 'antd'
import router from './router'
import AntdGlobal from './utils/AntdGlobal'
import './App.less'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b'
        }
      }}
    >
      <AntdApp>
        <AntdGlobal />
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
