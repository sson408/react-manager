import { Button, Table, Form, Input, Select, Space, message, Modal } from 'antd'
import {
  ListAll,
  DeleteUser,
  BatchDeleteUser
} from '../../../services/userSercice'
import React, { useEffect, useRef, useState } from 'react'
import { UserDetail, UserSearchSummary } from '../../../types/User'
import { ColumnsType } from 'antd/es/table'
import { IAction } from '../../../types/modal'
import ModalUser from './modalUser'
import { AxiosError } from 'axios'

export default function UserList() {
  const [data, setData] = useState<UserDetail[]>([])
  const [loading, setLoading] = useState(false) // Loading state for UX
  const [searchForm] = Form.useForm() // Use form instance for controlling form
  const [total, setTotal] = useState(0) // Total number of users
  const [selectedUserGuids, setSelectedUserGuids] = useState<string[]>([]) // Selected user guids
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 }) // Pagination state
  const userRef = useRef<{
    open: (type: IAction, data?: UserDetail) => void
  }>()

  // Initial user fetch when the component is mounted
  useEffect(() => {
    getUserList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize])

  // Fetch user list based on searchSummary
  const getUserList = async () => {
    setLoading(true) // Start loading
    try {
      const formValues = await searchForm.validateFields() // Validate and get form values
      const searchSummary: UserSearchSummary = {
        filterWord: formValues.filterText || '', // Safely get filterText
        stateId: formValues.state || 0 // Safely get stateId, default to 0
      }
      const pageNum = pagination.current // Get current page numbern
      const pageSize = pagination.pageSize // Get page size
      const userData = await ListAll(pageNum, pageSize, searchSummary, {
        showLoading: false
      }) // Fetch user list
      const userList = userData.data
      setData(userList)
      setTotal(userData.pageInfo.total)
      setPagination({
        current: userData.pageInfo.pageNum,
        pageSize: userData.pageInfo.pageSize
      })
    } catch (error) {
      console.error('Error fetching user list:', error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  // Handle search form submission
  const onSearch = async () => {
    try {
      getUserList() // Call the function with searchSummary
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  // Handle reset form action
  const onReset = () => {
    searchForm.resetFields() // Reset all fields
    getUserList() // Fetch all users without filters
  }

  const onAddClick = () => {
    userRef.current?.open('create')
  }

  const onRowEditClick = (data: UserDetail) => {
    userRef.current?.open('edit', data)
  }

  const onRowDeleteClick = async (guid: string) => {
    Modal.confirm({
      title: 'Please Confirm',
      content: 'Are you sure you want to delete this user?',
      onOk() {
        realDelete(guid)
      }
    })
  }

  const realDelete = async (guid: string) => {
    try {
      setLoading(true)
      const response = await DeleteUser(guid)
      message.success(response.message)
      getUserList()
    } catch (error) {
      let errorMessage = 'Failed to delete user'
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

  // Handle batch delete action
  const onBatchDeleteClick = () => {
    if (selectedUserGuids.length === 0) {
      message.warning('Please select at least one user')
      return
    }
    Modal.confirm({
      title: 'Please Confirm',
      content: 'Are you sure you want to delete these users?',
      onOk() {
        batchDelete()
      }
    })
  }

  const batchDelete = async () => {
    try {
      setLoading(true)
      const response = await BatchDeleteUser(selectedUserGuids)
      message.success(response.message)
      getUserList()
    } catch (error) {
      let errorMessage = 'Failed to delete users'
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

  const columns: ColumnsType<UserDetail> = [
    {
      title: 'User Name',
      dataIndex: 'userName'
    },
    {
      title: 'First Name',
      dataIndex: 'firstName'
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'User Role',
      dataIndex: 'userRoleId',
      render(userRoleId: number) {
        return {
          1: 'Admin',
          2: 'Normal User'
        }[userRoleId]
      }
    },
    {
      title: 'State',
      dataIndex: 'stateId',
      render(stateId: number) {
        return {
          1: 'Active',
          2: 'Inactive'
        }[stateId]
      }
    },
    {
      title: 'Department',
      dataIndex: 'departmentId',
      render(departmentId: number) {
        return {
          1: 'Admin',
          2: 'Sales',
          3: 'Marketing',
          4: 'Rental'
        }[departmentId]
      }
    },
    {
      title: '',
      render(record) {
        return (
          <Space>
            <Button type='text' onClick={() => onRowEditClick(record)}>
              Edit
            </Button>
            {record.stateId !== 2 && (
              <Button
                type='text'
                danger
                onClick={() => onRowDeleteClick(record.guid)}
              >
                Delete
              </Button>
            )}
          </Space>
        )
      }
    }
  ]

  return (
    <div className='user-list'>
      <Form
        form={searchForm} // Bind the form instance to control the form
        className='search-form'
        layout='inline'
        initialValues={{ state: 0 }}
      >
        <Form.Item name='filterText' label='Search'>
          <Input
            placeholder='Enter keyword'
            onPressEnter={onSearch} // Trigger search on Enter key
          />
        </Form.Item>
        <Form.Item name='state' label='State'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>All</Select.Option>
            <Select.Option value={1}>Active</Select.Option>
            <Select.Option value={2}>Inactive</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={onSearch}>
              Search
            </Button>
            <Button type='default' onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>UserList</div>
          <div className='action'>
            <Button type='primary' onClick={onAddClick}>
              Add
            </Button>
            <Button type='primary' danger onClick={onBatchDeleteClick}>
              Delete
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey='guid'
          loading={loading}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedUserGuids,
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedUserGuids(selectedRowKeys as string[])
            }
          }}
          dataSource={data}
          columns={columns}
          pagination={{
            position: ['bottomRight'],
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `Total ${total} users`,
            onChange: (page, pageSize) => {
              setPagination({
                current: page,
                pageSize: pageSize
              })
            }
          }}
        />
      </div>
      <ModalUser
        mRef={userRef}
        update={() => {
          getUserList()
        }}
      />
    </div>
  )
}
