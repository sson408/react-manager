import { MenuFoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Switch, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import styles from './index.module.less'

const NavHeader = () => {
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
      key: '1',
      label: 'email：TestName@gmail.com'
    },
    {
      key: '2',
      label: 'Logout'
    }
  ]
  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <MenuFoldOutlined />
        <Breadcrumb items={breadList} style={{ marginLeft: 10 }} />
      </div>
      <div className={styles.right}>
        <Switch
          checkedChildren='Dark'
          unCheckedChildren='Default'
          style={{ marginRight: 10 }}
        />
        <Dropdown menu={{ items }} trigger={['click']}>
          <span className={styles.nickName}>Test Name</span>
        </Dropdown>
      </div>
    </div>
  )
}

export default NavHeader
