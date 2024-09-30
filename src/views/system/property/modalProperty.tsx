import {
  DatePicker,
  Form,
  Input,
  InputRef,
  Modal,
  Select,
  Tabs,
  Upload
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { IAction, IModalProp } from '../../../types/modal'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { PropertyDetail } from '../../../types/property'
import CommissionTab from '../../../components/Tab/Property/commissionTab'
import config from '../../../config'
import { message } from '../../../utils/AntdGlobal'
import { RcFile } from 'antd/es/upload'
import './property.module.less'
import { SimpleList } from '../../../services/userSercice'
import { UserDetail } from '../../../types/User'
import dayjs from 'dayjs'

const ModalProperty = (props: IModalProp<PropertyDetail>) => {
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [propertyGuid, setPropertyGuid] = useState('')
  const [img, setImg] = useState('')
  const [form] = Form.useForm()
  const [commissionForm] = Form.useForm()
  const [agentList, setAgentList] = useState<UserDetail[]>([])

  const addressInputRef = useRef<InputRef>(null)

  const beforeUpload = (file: RcFile) => {}
  const onChangeClick = (info: any) => {}

  const uploadProps = {
    name: 'file',
    beforeUpload: beforeUpload,
    onChange: onChangeClick
  }

  //fetch dropdown data
  useEffect(() => {
    getAgentList()
  }, [])

  const getAgentList = async () => {
    try {
      const resp = await SimpleList({ showLoading: false })
      const agentList = resp.data
      setAgentList(agentList)
    } catch (error) {
      console.error('Error fetching agent list:', error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  const tabItems = [
    {
      key: '1',
      label: 'Basic Details',
      children: (
        <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
          <Form.Item
            label='Address'
            name='address'
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input
              ref={addressInputRef}
              placeholder='Please enter property address'
            />
          </Form.Item>
          <Form.Item
            label='Type'
            name='typeId'
            rules={[{ required: true, message: 'Please select property type' }]}
          >
            <Select placeholder='Please select property type'>
              <Select.Option value={1}>House</Select.Option>
              <Select.Option value={2}>Apartment</Select.Option>
              <Select.Option value={3}>Townhouse</Select.Option>
              <Select.Option value={4}>Land</Select.Option>
              <Select.Option value={5}>Rural</Select.Option>
              <Select.Option value={6}>Commercial</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Status'
            name='statusId'
            rules={[
              { required: true, message: 'Please select property status' }
            ]}
          >
            <Select placeholder='Please select property status'>
              <Select.Option value={1}>Listing</Select.Option>
              <Select.Option value={2}>Withdrawn</Select.Option>
              <Select.Option value={3}>Sold</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Listing Agent 1'
            name='listingAgent1Guid'
            rules={[
              { required: true, message: 'Please select Listing Agent 1' }
            ]}
          >
            <Select placeholder='Please select Listing Agent 1'>
              {agentList.map(user => (
                <Select.Option key={user.guid} value={user.guid}>
                  {user.userNameDisplay}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label='Listing Agent 2'
            name='listingAgent2Guid'
            rules={[
              { required: true, message: 'Please select Listing Agent 2' }
            ]}
          >
            <Select placeholder='Please select Listing Agent 2'>
              {agentList.map(user => (
                <Select.Option key={user.guid} value={user.guid}>
                  {user.userNameDisplay}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label='Date'
            name='date'
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker format='DD MMM YYYY' />
          </Form.Item>
          <Form.Item label='Image'>
            <Upload
              listType='picture-card'
              showUploadList={false}
              className='property-upload'
              {...uploadProps}
            >
              {img ? (
                <img
                  src={img}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 5 }}>Upload Image</div>
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
  ]

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        if (window.google) {
          const autocomplete = new window.google.maps.places.Autocomplete(
            addressInputRef.current?.input, // 使用 InputRef
            {
              types: ['geocode'],
              componentRestrictions: { country: 'nz' }
            }
          )

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            if (place.formatted_address) {
              form.setFieldsValue({
                address: place.formatted_address
              })
            }
          })

          clearInterval(interval)
        }
      }, 100)
    }
  }, [visible, form])

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

    if (type === 'edit' && data) {
      console.log('data.imageUrl', data.imageUrl)
      setPropertyGuid(data.guid)
      const dateValue = dayjs(data.dateTimeDisplay, 'DD MMM YYYY')

      form.setFieldsValue({
        address: data.address,
        typeId: data.typeId,
        statusId: data.statusId,
        listingAgent1Guid: data.listingAgent1Guid,
        listingAgent2Guid: data.listingAgent2Guid,
        date: dateValue.isValid() ? dateValue : null
      })
      setImg(`${config.fileUrl}${data.imageUrl}`)
    }
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
      title={action === 'create' ? 'Create Property' : 'Edit Property'}
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
