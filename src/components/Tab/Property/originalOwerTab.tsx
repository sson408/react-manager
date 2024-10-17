import React from 'react'
import { Form, Input, Row, Col } from 'antd'
import { FormInstance } from 'antd/lib/form'
import styles from './originalOwerTab.module.less'

interface OriginalOwnerTabProps {
  form: FormInstance
  disabled?: boolean
}

const OriginalOwnerTab: React.FC<OriginalOwnerTabProps> = ({
  form,
  disabled = false
}) => {
  return (
    <Form
      form={form}
      layout='vertical'
      className={styles.ownerContainer}
      disabled={disabled}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='originalOwnerFirstName'
            label='First Name'
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input placeholder='First Name' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='originalOwnerLastName'
            label='Last Name'
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input placeholder='Last Name' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name='originalOwnerEmail' label='Email'>
            <Input placeholder='Email' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='originalOwnerPhoneNumber'
            label='Mobile Number'
            rules={[
              { len: 10, message: 'Please enter an mobile number' },
              {
                pattern: /^02\d{7,11}$/,
                message: 'Mobile number must start with 9 and be 10 digits'
              }
            ]}
          >
            <Input placeholder='Phone Number' />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default OriginalOwnerTab
