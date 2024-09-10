import { RouterProvider } from 'react-router'
import { ConfigProvider } from 'antd'
import router from './router'
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
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
