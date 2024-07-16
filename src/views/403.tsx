import { Button, Result } from 'antd'
import { useNavigate } from 'react-router'
function NotFound() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/')
  }
  return (
    <Result
      status={403}
      title='403'
      subTitle='You do not have permission to access this page.'
      extra={
        <Button type='primary' onClick={handleClick}>
          Back Home
        </Button>
      }
    />
  )
}

export default NotFound
