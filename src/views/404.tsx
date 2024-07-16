import { Button, Result } from 'antd'
import { useNavigate } from 'react-router'
function NotFound() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/')
  }
  return (
    <Result
      status={404}
      title='404'
      subTitle='Page not found'
      extra={
        <Button type='primary' onClick={handleClick}>
          Back Home
        </Button>
      }
    />
  )
}

export default NotFound
