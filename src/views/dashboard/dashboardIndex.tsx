import { Descriptions } from 'antd'
import styles from './dashboardIndex.module.less'
import ProfileIcon from '../../assets/profile_icon.jpg'
import { useUserAndUiState } from '../../hooks/useUserAndUiState'

export default function DashBoard() {
  const { currentUser } = useUserAndUiState()

  return (
    <div className={styles.dashboard}>
      <div className={styles.userInfo}>
        <img src={ProfileIcon} alt='' className={styles.userImg} />
        <Descriptions title='WELCOME'>
          <Descriptions.Item label='ID'>100001</Descriptions.Item>
          <Descriptions.Item label='Email'>
            {currentUser?.email}
          </Descriptions.Item>
          <Descriptions.Item label='Status'>Active</Descriptions.Item>
          <Descriptions.Item label='Phone'>021 1234756</Descriptions.Item>
          <Descriptions.Item label='Position'>Sales</Descriptions.Item>
          <Descriptions.Item label='Department'>
            Sales Department
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>Listing</div>
          <div className={styles.data}>100</div>
        </div>
        <div className={styles.card}>
          <div className='title'>Sold</div>
          <div className={styles.data}>50</div>
        </div>
      </div>
    </div>
  )
}
