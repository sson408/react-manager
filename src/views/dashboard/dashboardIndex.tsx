import { Button, Card, Descriptions } from 'antd'
import styles from './dashboardIndex.module.less'
import ProfileIcon from '../../assets/profile_icon.jpg'
import { useUserAndUiState } from '../../hooks/useUserAndUiState'
import { useEffect } from 'react'
import { useCharts } from '../../hooks/useCharts'

export default function DashBoard() {
  const { currentUser } = useUserAndUiState()
  const [lineRef, lineCharts] = useCharts()
  const [pieRef, pieCharts] = useCharts()

  useEffect(() => {
    const setChartOptions = () => {
      lineCharts?.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Listing', 'Sold']
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 20
        },
        xAxis: {
          data: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Listing',
            type: 'line',
            data: [50, 55, 30, 28, 35, 47, 48, 35, 65, 25, 55, 35]
          },
          {
            name: 'Sold',
            type: 'line',
            data: [15, 22, 33, 12, 5, 2, 15, 17, 28, 34, 2, 15]
          }
        ]
      })

      pieCharts?.setOption({
        title: {
          text: 'Area Distribution',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Area',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 12, name: 'South Auckland' },
              { value: 15, name: 'North Auckland ' },
              { value: 6, name: 'East Auckland' },
              { value: 82, name: 'Central Auckland' },
              { value: 56, name: 'City' }
            ]
          }
        ]
      })
    }

    setChartOptions()

    // Handle window resize
    const handleResize = () => {
      lineCharts?.resize()
      pieCharts?.resize()
    }

    window.addEventListener('resize', handleResize)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      lineCharts?.dispose()
      pieCharts?.dispose()
    }
  }, [lineCharts, pieCharts])

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
      <div className={styles.chart}>
        <Card
          title='Listing And Sold'
          extra={<Button type='primary'>Refresh</Button>}
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='Area' extra={<Button type='primary'>Refresh</Button>}>
          <div ref={pieRef} className={styles.itemChart}></div>
        </Card>
      </div>
    </div>
  )
}
