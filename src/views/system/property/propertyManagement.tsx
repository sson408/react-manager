import { Button, Table, Form, Input, Select, Space } from 'antd'
import { ListAll } from '../../../services/propertyService'
import { useEffect, useState } from 'react'
import { PropertyDetail, PropertySearchSummary } from '../../../types/property'
import { ColumnsType } from 'antd/es/table'
import config from '../../../config'

export const PropertyList = () => {
  const [data, setData] = useState<PropertyDetail[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false) // Loading state for UX
  const [searchForm] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })

  useEffect(() => {
    getPropertyList()
  }, [pagination.current, pagination.pageSize])

  const getPropertyList = async () => {
    setLoading(true) // Start loading
    try {
      const formValues = await searchForm.validateFields() // Validate and get form values
      const searchSummary: PropertySearchSummary = {
        filterWord: formValues.filterText || '', // Safely get filterText
        stateId: formValues.state || 0 // Safely get stateId, default to 0
      }
      const pageNum = pagination.current // Get current page numbern
      const pageSize = pagination.pageSize // Get page size
      const propertyData = await ListAll(pageNum, pageSize, searchSummary, {
        showLoading: false
      })
      //console.log('propertyData', propertyData)
      const propertyList = propertyData.data
      setData(propertyList)
      setTotal(propertyData.pageInfo.total)
      setPagination({
        current: propertyData.pageInfo.pageNum,
        pageSize: propertyData.pageInfo.pageSize
      })
    } catch (error) {
      console.error('Error fetching property list:', error)
    } finally {
      setLoading(false) // Stop loading
    }
  }

  const onSearch = () => {}
  const onReset = () => {}
  const onAddClick = () => {}
  const onBatchDeleteClick = () => {}

  const columns: ColumnsType<PropertyDetail> = [
    {
      title: '',
      width: 100,
      dataIndex: 'imageUrl',
      render: (imageUrl: string) => (
        <img
          src={`${config.fileUrl}${imageUrl}`}
          alt='Property'
          style={{ width: 100, height: 60, objectFit: 'cover' }}
        />
      )
    },
    {
      title: 'Property',
      dataIndex: 'address'
    },
    {
      title: 'Status',
      width: 60,
      dataIndex: 'statusId',
      render(stateId: number) {
        return {
          1: 'Listing',
          2: 'Withdrawn',
          3: 'Sold'
        }[stateId]
      }
    },
    {
      title: 'Contact',
      width: 150,
      dataIndex: 'listingAgentNameDisplay',
      render: (text: string) => (
        <span style={{ whiteSpace: 'pre-line' }}>{text}</span>
      )
      // render: (text: string) => (
      //   <span dangerouslySetInnerHTML={{ __html: text }} />
      // )
    },
    {
      title: 'Listing date',
      width: 120,
      dataIndex: 'dateTimeDisplay'
    },
    {
      title: 'Last Updated',
      width: 150,
      dataIndex: 'updatedDateTimeDisplay'
    },
    {
      title: '',
      width: 60,
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
    <div className='propery-list'>
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
            <Select.Option value={1}>Listing</Select.Option>
            <Select.Option value={2}>Withdrawn</Select.Option>
            <Select.Option value={3}>Sold</Select.Option>
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
          <div className='title'>Property List</div>
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
          dataSource={data}
          columns={columns}
          pagination={{
            position: ['bottomRight'],
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `Total ${total} Properties`,
            onChange: (page, pageSize) => {
              setPagination({
                current: page,
                pageSize: pageSize
              })
            }
          }}
        />
      </div>
    </div>
  )
}
