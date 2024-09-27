// CommissionTab.tsx
import React from 'react'
import { Form, FormInstance, Input } from 'antd'

interface CommissionTabProps {
  form: FormInstance
}

const CommissionTab: React.FC<CommissionTabProps> = ({ form }) => {
  return (
    <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
      <Form.Item
        label='Commission Rate'
        name='commissionRate'
        rules={[{ required: true, message: 'Please enter commission rate' }]}
      >
        <Input placeholder='Please enter commission rate' />
      </Form.Item>
      {/* Add more commission-related fields as needed */}
    </Form>
  )
}

export default CommissionTab
