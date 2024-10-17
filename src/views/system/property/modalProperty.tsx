import {
  Button,
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
import { PropertyDetail, PropertyUpdateSummary } from '../../../types/property'
import CommissionTab from '../../../components/Tab/Property/commissionTab'
import BuyerTab from '../../../components/Tab/Property/buyerTab'
import OriginalOwnerTab from '../../../components/Tab/Property/originalOwerTab'
import config from '../../../config'
import { message } from '../../../utils/AntdGlobal'
import { RcFile } from 'antd/es/upload'
import './property.module.less'
import { SimpleList } from '../../../services/userSercice'
import { UserDetail } from '../../../types/User'
import { AxiosError } from 'axios'

import {
  CreateProperty,
  SetSold,
  updateProperty
} from '../../../services/propertyService'
import dayjs from 'dayjs'
import storage from '../../../utils/storage'

const ModalProperty = (props: IModalProp<PropertyDetail>) => {
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [propertyGuid, setPropertyGuid] = useState('')
  const [img, setImg] = useState('')
  const [isSold, setIsSold] = useState(false)
  const [form] = Form.useForm()
  const [commissionForm] = Form.useForm()
  const [buyerForm] = Form.useForm()
  const [originalOwnerForm] = Form.useForm()
  const [agentList, setAgentList] = useState<UserDetail[]>([])
  const addressInputRef = useRef<InputRef>(null)
  const dateFormate = 'DD MMM YYYY'

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }

    // need less than 10MB
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      message.error('Image must smaller than 10MB!')
    }

    return isJpgOrPng && isLt2M
  }
  const onChangeClick = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const imageUrl = info.file.response?.data || '' // Get the uploaded image URL
      setImg(`${config.fileUrl}${imageUrl}`) // Set the image URL
      setLoading(false)
      message.success('Image uploaded successfully!')
      props.update()
    } else if (info.file.status === 'error') {
      setLoading(false)
      message.error('Upload failed.')
    }
  }

  const uploadProps = {
    name: 'file',
    action: `https://localhost:44365/api/property/${propertyGuid}/uploadImage`,
    headers: {
      Authorization: `Bearer ${storage.get('token')}`
    },
    beforeUpload: beforeUpload,
    onChange: onChangeClick
  }

  //clear image
  useEffect(() => {
    return () => {
      if (img) {
        URL.revokeObjectURL(img)
      }
    }
  }, [img])

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
        <Form
          form={form}
          labelCol={{ span: 4 }}
          labelAlign='right'
          disabled={isSold}
        >
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
            <DatePicker format={dateFormate} />
          </Form.Item>
          <Form.Item
            label='Image'
            style={{ display: action === 'create' ? 'none' : 'block' }}
          >
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
      children: <CommissionTab form={commissionForm} disabled={isSold} />
    },
    {
      key: '3',
      label: 'Buyers',
      children: <BuyerTab form={buyerForm} disabled={isSold} />
    },
    {
      key: '4',
      label: 'Original Owner',
      children: <OriginalOwnerTab form={originalOwnerForm} disabled={isSold} />
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
  }, [visible, form, commissionForm, buyerForm, originalOwnerForm])

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  const open = (type: IAction, data?: PropertyDetail) => {
    //clear form
    form.resetFields()
    commissionForm.resetFields()
    buyerForm.resetFields()
    originalOwnerForm.resetFields()

    setAction(type)
    setVisible(true)

    if (type === 'edit' && data) {
      setPropertyGuid(data.guid)
      const dateValue = dayjs(data.dateTimeDisplay, dateFormate)

      setIsSold(data.statusId === 3)

      form.setFieldsValue({
        address: data.address,
        typeId: data.typeId,
        statusId: data.statusId,
        listingAgent1Guid: data.listingAgent1Guid,
        listingAgent2Guid: data.listingAgent2Guid,
        date: dateValue.isValid() ? dateValue : ''
      })
      setImg(`${config.fileUrl}${data.imageUrl}`)

      //commission tab
      commissionForm.setFieldsValue({
        soldPrice: data.soldPrice,
        firstPartPrice: data.firstPartPrice,
        firstPartPercentage: data.firstPartPercentage,
        restPartPrice: data.restPartPrice,
        restPartPercentage: data.restPartPercentage,
        commission: data.commission
      })

      //original owner tab
      originalOwnerForm.setFieldsValue({
        originalOwnerFirstName: data.originalOwnerFirstName,
        originalOwnerLastName: data.originalOwnerLastName,
        originalOwnerPhoneNumber: data.originalOwnerPhoneNumber,
        originalOwnerEmail: data.originalOwnerEmail
      })

      // Buyers tab
      const buyers = []

      if (data.buyer1FirstName || data.buyer1LastName) {
        buyers.push({
          firstName: data.buyer1FirstName,
          lastName: data.buyer1LastName,
          phoneNumber: data.buyer1PhoneNumber,
          email: data.buyer1Email
        })
      }

      if (data.buyer2FirstName || data.buyer2LastName) {
        buyers.push({
          firstName: data.buyer2FirstName,
          lastName: data.buyer2LastName,
          phoneNumber: data.buyer2PhoneNumber,
          email: data.buyer2Email
        })
      }

      buyerForm.setFieldsValue({
        buyers: buyers.length > 0 ? buyers : [{}]
      })
    }
  }

  const onCancelClick = () => {
    form.resetFields()
    commissionForm.resetFields()
    buyerForm.resetFields()
    originalOwnerForm.resetFields()
    setImg('')
    setVisible(false)
  }

  const onSaveClick = async () => {
    const valid = await form.validateFields()
    if (isSold) {
      return // Prevent saving if the property is already sold
    }

    setLoading(true)

    if (valid) {
      if (action === 'create') {
        try {
          const createSummaryData: PropertyUpdateSummary = {
            address: valid.address,
            statusId: valid.statusId,
            typeId: valid.typeId,
            listingAgent1Guid: valid.listingAgent1Guid,
            listingAgent2Guid: valid.listingAgent2Guid,
            dateTimeStamp: valid.date.unix()
          }
          await CreateProperty(createSummaryData)
          message.success('User created successfully!')
          props.update()
          setVisible(false)
        } catch (error) {
          //console.log('User logged in error:', error)
          let errorMessage = 'Error Creating User'
          if (error instanceof AxiosError) {
            errorMessage = error.response?.data?.message || error.message
          } else if (error instanceof Error) {
            errorMessage = error.message
          }
          message.error(errorMessage)
        } finally {
          setLoading(false)
        }
      } else {
        try {
          const updateSummaryData: PropertyUpdateSummary = {
            guid: propertyGuid,
            address: valid.address,
            statusId: valid.statusId,
            typeId: valid.typeId,
            listingAgent1Guid: valid.listingAgent1Guid,
            listingAgent2Guid: valid.listingAgent2Guid,
            dateTimeStamp: valid.date.unix()
          }
          await updateProperty(updateSummaryData)
          message.success('User updated successfully!')
          props.update()
          setVisible(false)
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
    }
    // const commissionValues = commissionForm.getFieldsValue()
    // console.log('commissionValues', commissionValues)
  }

  const handleSoldClick = () => {
    Modal.confirm({
      title: 'Please Confirm',
      content: 'Are you sure you want to mark this property as sold?',
      onOk() {
        realSold()
      }
    })
  }

  const realSold = async () => {
    const valid = await form.validateFields()
    const commissionValues = commissionForm.getFieldsValue()
    const buyers = buyerForm.getFieldsValue().buyers

    // Check if buyers is an array and has at least one element
    const buyer1 = Array.isArray(buyers) && buyers.length > 0 ? buyers[0] : {}
    const buyer2 = Array.isArray(buyers) && buyers.length > 1 ? buyers[1] : {}

    const originalOwnerValues = originalOwnerForm.getFieldsValue()

    setLoading(true)

    if (valid) {
      const validationError = checkSetSold(
        commissionValues,
        originalOwnerValues,
        buyer1,
        buyer2
      )
      if (validationError) {
        message.error(validationError)
        setLoading(false)
        return
      }

      try {
        //calculate total commission
        const totalCommission =
          (commissionValues.firstPartPrice *
            commissionValues.firstPartPercentage) /
            100 +
          (commissionValues.restPartPrice *
            commissionValues.restPartPercentage) /
            100 -
          850
        const updateSummaryData: PropertyUpdateSummary = {
          guid: propertyGuid,
          soldPrice: commissionValues.soldPrice,
          firstPartPrice: commissionValues.firstPartPrice,
          firstPartPercentage: commissionValues.firstPartPercentage,
          restPartPrice: commissionValues.restPartPrice,
          restPartPercentage: commissionValues.restPartPercentage,
          commission: totalCommission,
          buyer1FirstName: buyer1?.firstName,
          buyer1LastName: buyer1?.lastName,
          buyer1PhoneNumber: buyer1?.phoneNumber,
          buyer1Email: buyer1?.email,
          buyer2FirstName: buyer2?.firstName,
          buyer2LastName: buyer2?.lastName,
          buyer2PhoneNumber: buyer2?.phoneNumber,
          buyer2Email: buyer2?.email,
          originalOwnerFirstName: originalOwnerValues.originalOwnerFirstName,
          originalOwnerLastName: originalOwnerValues.originalOwnerLastName,
          originalOwnerPhoneNumber:
            originalOwnerValues.originalOwnerPhoneNumber,
          originalOwnerEmail: originalOwnerValues.originalOwnerEmail
        }
        await SetSold(updateSummaryData)
        message.success('Set Sold successfully!')
        props.update()
        setVisible(false)
      } catch (error) {
        let errorMessage = 'Failed to mark property as sold'
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
  }

  const checkSetSold = (
    commissionValues: any,
    originalOwnerValues: any,
    buyer1Values: any,
    buyer2Values: any
  ) => {
    const {
      soldPrice,
      firstPartPrice,
      firstPartPercentage,
      restPartPrice,
      restPartPercentage
    } = commissionValues

    const { originalOwnerFirstName, originalOwnerLastName } =
      originalOwnerValues

    // Ensure originalOwner fields are not empty
    if (!originalOwnerFirstName || !originalOwnerLastName) {
      return 'Original owner information cannot be empty'
    }

    // Ensure at least one buyer's information is provided
    const buyer1Filled = buyer1Values.firstName && buyer1Values.lastName
    const buyer2Filled = buyer2Values.firstName && buyer2Values.lastName

    if (!buyer1Filled && !buyer2Filled) {
      return "At least one buyer's information must be provided"
    }

    // Ensure financial details are not empty
    if (
      !soldPrice ||
      !firstPartPrice ||
      !firstPartPercentage ||
      !restPartPrice ||
      !restPartPercentage
    ) {
      return 'Financial details cannot be empty'
    }

    return null // No validation errors
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
      destroyOnClose={true}
      footer={[
        <Button
          key='sold'
          type='primary'
          onClick={() => handleSoldClick()}
          style={{ float: 'left' }}
          disabled={isSold}
        >
          Sold
        </Button>,
        <Button key='cancel' onClick={onCancelClick}>
          Cancel
        </Button>,
        <Button
          key='submit'
          type='primary'
          onClick={onSaveClick}
          loading={loading}
          disabled={isSold}
        >
          {action === 'create' ? 'Create New' : 'Save Changes'}
        </Button>
      ]}
    >
      <Tabs defaultActiveKey='1' items={tabItems}></Tabs>
    </Modal>
  )
}

export default ModalProperty
