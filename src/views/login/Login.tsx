import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { loginUser } from '../../services/authService'
import './index.less'
import { AxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import { setToken } from '../../store/tokenSlice'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const response = await loginUser(values)
      //console.log('User logged in:', response)
      message.success('User logged in successfully')

      //save token to redux store
      const token = response.data.token
      dispatch(setToken(token))

      //const params = new URLSearchParams(location.search)
      const callbackUrl = new URLSearchParams(location.search).get('callback')
      location.href = callbackUrl || '/welcome'
    } catch (error) {
      //console.log('User logged in error:', error)
      let errorMessage = 'Error logging in'
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login'>
      <div className='login-wrapper'>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            label='Username'
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' block htmlType='submit' loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
