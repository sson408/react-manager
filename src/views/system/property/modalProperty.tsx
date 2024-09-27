import { Form, Input, Modal, Select, Tabs, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { IAction, IModalProp } from '../../../types/modal'
import { useImperativeHandle, useState } from 'react'
import { PropertyDetail } from '../../../types/property'
import CommissionTab from '../../../components/Tab/Property/commissionTab'

const { TabPane } = Tabs

const ModalProperty = (props: IModalProp<PropertyDetail>) => {
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState('')
  const [form] = Form.useForm()
  const [commissionForm] = Form.useForm()

  const [tabItems, setTabItems] = useState([
    {
      key: '1',
      label: 'Basic Details',
      children: (
        <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
          <Form.Item
            label='Property Name'
            name='name'
            rules={[{ required: true, message: 'Please enter property name' }]}
          >
            <Input placeholder='Please enter property name' />
          </Form.Item>
          <Form.Item
            label='Property Type'
            name='typeId'
            rules={[{ required: true, message: 'Please select property type' }]}
          >
            <Select placeholder='Please select property type'>
              <Select.Option value='1'>House</Select.Option>
              <Select.Option value='2'>Apartment</Select.Option>
              <Select.Option value='3'>Condo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Property Status'
            name='statusId'
            rules={[
              { required: true, message: 'Please select property status' }
            ]}
          >
            <Select placeholder='Please select property status'>
              <Select.Option value='1'>Active</Select.Option>
              <Select.Option value='2'>Inactive</Select.Option>
              <Select.Option value='3'>Pending</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Image'>
            <Upload
              listType='picture-circle'
              showUploadList={false}
              // {...uploadProps}
            >
              {img ? (
                <img
                  src={img}
                  style={{ width: '100%', borderRadius: '100%' }}
                />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 5 }}>Upload Avatar</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      )
    },
    {
      key: '2',
      label: 'Commission',
      children: <CommissionTab form={commissionForm} />
    }
  ])

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  const open = (type: IAction, data?: PropertyDetail) => {
    //clear form
    form.resetFields()

    setAction(type)
    setVisible(true)
  }

  const onCancelClick = () => {
    form.resetFields()
    setImg('')
    setVisible(false)
  }

  const onSaveClick = () => {
    // const commissionValues = commissionForm.getFieldsValue()
    // console.log('commissionValues', commissionValues)
  }

  return (
    <Modal
      title={action === 'create' ? 'Create User' : 'Edit User'}
      okText={action === 'create' ? 'Create New' : 'Save Changes'}
      width={800}
      open={visible}
      onOk={onSaveClick}
      onCancel={onCancelClick}
      confirmLoading={loading}
      maskClosable={false}
    >
      <Tabs defaultActiveKey='1' items={tabItems}></Tabs>
    </Modal>
  )
}

export default ModalProperty
