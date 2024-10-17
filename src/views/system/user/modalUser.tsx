import config from '../../../config'
import { Form, Input, Modal, Select, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import storage from '../../../utils/storage'
import { useImperativeHandle, useState } from 'react'
import { RcFile } from 'antd/es/upload'
import { message } from '../../../utils/AntdGlobal'
import { IAction, IModalProp } from '../../../types/modal'
import { UserDetail, UserUpdateSummary } from '../../../types/User'
import { createUser, updateUser } from '../../../services/userSercice'
import { AxiosError } from 'axios'

const ModalUser = (props: IModalProp<UserDetail>) => {
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState('')
  const [form] = Form.useForm()
  const [visible, setVisbile] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [data, setData] = useState<UserDetail>()
  const [userGuid, setUserGuid] = useState('')
  //expose open method
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  const open = (type: IAction, data?: UserDetail) => {
    //clear form
    form.resetFields()

    setAction(type)
    setVisbile(true)

    if (type === 'edit' && data) {
      setData(data)
      //console.log('data:', data)
      setUserGuid(data.guid)
      form.setFieldsValue({
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.phoneNumber,
        departmentId: data.departmentId,
        stateId: data.stateId,
        userRoleId: data.userRoleId
      })
      setImg(`${config.fileUrl}${data.avatarUrl}`)
    }
  }

  //before upload
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
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
      const avatarUrl = info.file.response?.data || '' // Get the uploaded image URL
      setImg(`${config.fileUrl}${avatarUrl}`) // Set the image URL
      setLoading(false)
      message.success('Avatar uploaded successfully!')
      props.update()
    } else if (info.file.status === 'error') {
      setLoading(false)
      message.error('Upload failed.')
    }
  }

  const uploadProps = {
    name: 'file',
    action: `https://localhost:44365/api/user/${userGuid}/uploadAvatar`,
    headers: {
      Authorization: `Bearer ${storage.get('token')}`
    },
    beforeUpload: beforeUpload,
    onChange: onChangeClick
  }

  const onSaveClick = async () => {
    const valid = await form.validateFields()
    setLoading(true)

    if (valid) {
      const values = form.getFieldsValue()
      //console.log(values)
      if (action === 'create') {
        //create user
        try {
          const userUpdateData: UserUpdateSummary = {
            guid: '',
            password: values.password,
            firstName: values.firstName ?? '',
            lastName: values.lastName ?? '',
            userName: values.userName ?? '',
            email: values.email ?? '',
            userRoleId: values.userRoleId ?? 0,
            stateId: values.stateId ?? 0,
            departmentId: values.departmentId ?? 0,
            phoneNumber: values.mobile ?? ''
          }

          await createUser(userUpdateData)
          message.success('User created successfully!')
          props.update()
          setVisbile(false)
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
        //update user
        try {
          const userUpdateData: UserUpdateSummary = {
            guid: userGuid,
            firstName: values.firstName ?? '',
            lastName: values.lastName ?? '',
            userName: values.userName ?? '',
            email: values.email ?? '',
            userRoleId: values.userRoleId ?? 0,
            stateId: values.stateId ?? 0,
            departmentId: values.departmentId ?? 0,
            phoneNumber: values.mobile ?? '',
            password: ''
          }
          await updateUser(userUpdateData)
          message.success('User updated successfully!')
          props.update()
          setVisbile(false)
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
  }
  const onCancelClick = () => {
    form.resetFields()
    setImg('')
    setVisbile(false)
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
      <Form labelCol={{ span: 4 }} labelAlign='right' form={form}>
        <Form.Item
          label='User Name'
          name='userName'
          rules={[
            { required: true, message: '' },
            {
              min: 5,
              max: 50,
              message: 'User name must be between 5 and 50 characters'
            }
          ]}
        >
          <Input
            placeholder='Please enter user name'
            autoComplete='off'
            disabled={action === 'edit'}
          ></Input>
        </Form.Item>
        <Form.Item
          label='First Name'
          name='firstName'
          rules={[
            { message: '' },
            {
              max: 50,
              message: 'first name must be less than 50 characters'
            }
          ]}
        >
          <Input placeholder='Please enter first name'></Input>
        </Form.Item>
        <Form.Item
          label='Last Name'
          name='lastName'
          rules={[
            { message: '' },
            {
              max: 50,
              message: 'last name must be less than 50 characters'
            }
          ]}
        >
          <Input placeholder='Please enter last name'></Input>
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Please enter user email' },
            { type: 'email', message: 'Please enter a valid email address' },
            {
              pattern: /^\w+@\w+\.com$/,
              message: 'Email must end with .com'
            }
          ]}
        >
          <Input placeholder='Please enter user email'></Input>
        </Form.Item>
        <Form.Item
          label='Mobile'
          name='mobile'
          rules={[
            { len: 10, message: 'Please enter an mobile number' },
            {
              pattern: /^02\d{7,11}$/,
              message: 'Mobile number must start with 9 and be 10 digits'
            }
          ]}
        >
          <Input type='number' placeholder='Please enter mobile number'></Input>
        </Form.Item>
        <Form.Item
          label='Department'
          name='departmentId'
          rules={[
            {
              required: true,
              message: 'Please select a department'
            }
          ]}
        >
          <Select
            placeholder='Please select a department'
            disabled={action === 'edit' && data?.userRoleId !== 1}
          >
            <Select.Option value={1}>Admin</Select.Option>
            <Select.Option value={2}>Sales</Select.Option>
            <Select.Option value={3}>Marketing</Select.Option>
            <Select.Option value={4}>Rental</Select.Option>
          </Select>
          {/* <TreeSelect
            placeholder='Please select a department'
            allowClear
            treeDefaultExpandAll
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={deptList}
          /> */}
        </Form.Item>
        <Form.Item label='Status' name='stateId' rules={[{ required: true }]}>
          <Select
            placeholder='Please select a statue'
            disabled={action === 'edit' && data?.userRoleId !== 1}
          >
            <Select.Option value={1}>Active</Select.Option>
            <Select.Option value={2}>Inactive</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='User Role'
          name='userRoleId'
          rules={[{ required: true }]}
        >
          <Select
            placeholder='Please select a role'
            disabled={action === 'edit' && data?.userRoleId !== 1}
          >
            <Select.Option value={1}>Admin</Select.Option>
            <Select.Option value={2}>Normal User</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[
            { required: action === 'create', message: 'Please enter password' },
            { min: 8, message: 'Password must be at least 8 characters' },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            }
          ]}
        >
          <Input.Password
            placeholder='Please enter password'
            autoComplete='off'
          />
        </Form.Item>
        <Form.Item
          label='Confirm Password'
          name='confirmPassword'
          dependencies={['password']}
          rules={[
            {
              required: action === 'create',
              message: 'Please confirm your password'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(
                  new Error('The new password that you entered do not match!')
                )
              }
            })
          ]}
        >
          <Input.Password placeholder='Please enter confirm password' />
        </Form.Item>
        <Form.Item
          label='User Photo'
          style={{ display: action === 'create' ? 'none' : 'block' }}
        >
          <Upload
            listType='picture-circle'
            showUploadList={false}
            {...uploadProps}
          >
            {img ? (
              <img src={img} style={{ width: '100%', borderRadius: '100%' }} />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 5 }}>Upload Avatar</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalUser
