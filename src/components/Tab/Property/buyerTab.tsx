import React from 'react'
import { Button, Form, Input, Row, Col } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import styles from './buyerTab.module.less'

interface BuyerTabProps {
  form: FormInstance
}

const BuyerTab: React.FC<BuyerTabProps> = ({ form }) => {
  return (
    <Form form={form} layout='vertical'>
      <Form.List name='buyers' initialValue={[{}]}>
        {(fields, { add, remove }) => {
          // Limit buyers to 2
          const canAddMore = fields.length < 2

          return (
            <>
              {fields.map((field, index) => (
                // Use field.key as the key for the React element
                <div key={field.key} className={styles.buyerContainer}>
                  <h4>Buyer {index + 1}</h4>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      // Use field.name when removing
                      onClick={() => remove(field.name)}
                      className={styles.deleteIcon}
                    />
                  )}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        // Spread field to include necessary props
                        {...field}
                        name={[field.name, 'firstName']}
                        label='First Name'
                        rules={[
                          { required: true, message: 'Please enter first name' }
                        ]}
                      >
                        <Input placeholder='First Name' />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'lastName']}
                        label='Last Name'
                        rules={[
                          { required: true, message: 'Please enter last name' }
                        ]}
                      >
                        <Input placeholder='Last Name' />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'email']}
                        label='Email'
                      >
                        <Input placeholder='Email' />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'phoneNumber']}
                        label='Phone Number'
                      >
                        <Input placeholder='Phone Number' />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}

              {canAddMore && (
                <Form.Item>
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Buyer
                  </Button>
                </Form.Item>
              )}
            </>
          )
        }}
      </Form.List>
    </Form>
  )
}

export default BuyerTab
