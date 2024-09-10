import { Menu } from 'antd'
import {
  DesktopOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons'
import styles from './index.module.less'
import { useNavigate } from 'react-router-dom'

const SideMenu = () => {
  const navigate = useNavigate()
  const items = [
    {
      label: 'Workbench',
      key: '/dashboard',
      icon: <DesktopOutlined />
    },
    {
      label: 'System Settings',
      key: '2',
      icon: <SettingOutlined />,
      children: [
        {
          label: 'User Management',
          key: '/user',
          icon: <TeamOutlined />
        }
      ]
    }
  ]

  const onMenuClick = (e: any) => {
    console.log('e', e)
    console.log('e', e.key)
    navigate(e.key) // Navigate to the route corresponding to the key
  }

  const handleClickLogo = () => {
    navigate('/welcome')
  }
  return (
    <div>
      <div className={styles.logo} onClick={handleClickLogo}>
        <img src='/imgs/logo.png' className={styles.img} />
        <span>Realestate</span>
      </div>
      <Menu
        defaultSelectedKeys={['/welcome']}
        mode='inline'
        theme='dark'
        items={items}
        onClick={onMenuClick}
      />
    </div>
  )
}

export default SideMenu
