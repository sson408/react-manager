import { Button, Table, Form, Input, Select, Space } from 'antd'
import { ListAll } from '../../../services/userSercice'
import { useEffect, useState } from 'react'
import { UserDetail, UserSearchSummary } from '../../../types/User'
import { ColumnsType } from 'antd/es/table'

export default function UserList() {
  const [data, setData] = useState<UserDetail[]>([])
  const [loading, setLoading] = useState(false) // Loading state for UX
  const [searchForm] = Form.useForm() // Use form instance for controlling form

  // Initial user fetch when the component is mounted
  useEffect(() => {
    getUserList()
  }, [])

  // Fetch user list based on searchSummary
  const getUserList = async (searchSummary: UserSearchSummary = {}) => {
    setLoading(true) // Start loading
    try {
      const userData = await ListAll(1, 20, searchSummary)
      const userList = userData.data
      const usersWithKeys = userList.map(user => ({
        ...user,
        key: user.guid
      }))
      setData(usersWithKeys)
    } catch (error) {
      console.error('Error fetching user list:', error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  // Handle search form submission
  const onSearch = async () => {
    try {
      const formValues = await searchForm.validateFields() // Validate and get form values
      const searchSummary: UserSearchSummary = {
        filterWord: formValues.filterText || '', // Safely get filterText
        stateId: formValues.state || 0 // Safely get stateId, default to 0
      }
      getUserList(searchSummary) // Call the function with searchSummary
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  // Handle reset form action
  const onReset = () => {
    searchForm.resetFields() // Reset all fields
    getUserList() // Fetch all users without filters
  }

  const columns: ColumnsType<UserDetail> = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'User Role',
      dataIndex: 'userRoleId',
      key: 'userRoleId',
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
      key: 'stateId',
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
      key: 'departmentId',
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
      key: 'actions',
      render() {
        return (
          <Space>
            <Button type='text'>Edit</Button>
            <Button type='text' danger>
              Delete
            </Button>
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
          <Input placeholder='Enter keyword' />
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
            <Button type='primary'>Add</Button>
            <Button type='primary' danger>
              Delete
            </Button>
          </div>
        </div>
        <Table
          bordered
          loading={loading}
          rowSelection={{ type: 'checkbox' }}
          dataSource={data}
          columns={columns}
        />
      </div>
    </div>
  )
}
