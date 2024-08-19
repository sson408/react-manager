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
      key: '1',
      icon: <DesktopOutlined />
    },
    {
      label: 'System Settings',
      key: '2',
      icon: <SettingOutlined />,
      children: [
        {
          label: 'User Management',
          key: '3',
          icon: <TeamOutlined />
        }
      ]
    }
  ]
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
        defaultSelectedKeys={['1']}
        mode='inline'
        theme='dark'
        items={items}
      />
    </div>
  )
}

export default SideMenu
