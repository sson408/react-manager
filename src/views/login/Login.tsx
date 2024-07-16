import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { loginUser } from '../../services/authService'
import { LoginResponse } from '../../types/LoginResponse'

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const response: LoginResponse = await loginUser(values)
      //console.log('User logged in:', response)
      message.success('User logged in successfully')
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
    } catch (error) {
      message.error('Error logging in')
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
