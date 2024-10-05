import { Button, Table, Form, Input, Select, Space, Modal } from 'antd'
import {
  BatchDeleteProperty,
  DeleteProperty,
  ListAll
} from '../../../services/propertyService'
import { useEffect, useRef, useState } from 'react'
import { PropertyDetail, PropertySearchSummary } from '../../../types/property'
import { ColumnsType } from 'antd/es/table'
import config from '../../../config'
import ModalProperty from './modalProperty'
import { IAction } from '../../../types/modal'
import { message } from '../../../utils/AntdGlobal'
import { AxiosError } from 'axios'

export const PropertyList = () => {
  const [data, setData] = useState<PropertyDetail[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false) // Loading state for UX
  const [searchForm] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [selectedPropertyGuids, setSelectedPropertyGuids] = useState<string[]>(
    []
  ) // Selected user
  const userRef = useRef<{
    open: (type: IAction, data?: PropertyDetail) => void
  }>()

  useEffect(() => {
    getPropertyList()
  }, [pagination.current, pagination.pageSize])

  const getPropertyList = async () => {
    setLoading(true) // Start loading
    try {
      const formValues = await searchForm.validateFields() // Validate and get form values
      const searchSummary: PropertySearchSummary = {
        filterWord: formValues.filterText || '', // Safely get filterText
        statusId: formValues.statusId || 0, // Safely get statusId, default to 0
        typeId: formValues.typeId || 0 // Safely get typeId, default to 0
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

  const onSearch = () => {
    getPropertyList()
  }
  const onReset = () => {
    searchForm.resetFields()
    getPropertyList()
  }
  const onAddClick = () => {
    userRef.current?.open('create')
  }

  const onRowEditClick = (data: PropertyDetail) => {
    userRef.current?.open('edit', data)
  }

  const onRowDeleteClick = (guid: string) => {
    Modal.confirm({
      title: 'Please Confirm',
      content: 'Are you sure you want to delete this property?',
      onOk() {
        realDelete(guid)
      }
    })
  }

  const realDelete = async (guid: string) => {
    try {
      setLoading(true)
      const response = await DeleteProperty(guid)
      message.success(response.message)
      getPropertyList()
    } catch (error) {
      let errorMessage = 'Failed to delete property'
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

  const onBatchDeleteClick = () => {
    if (selectedPropertyGuids.length === 0) {
      message.warning('Please select at least one property')
      return
    }
    Modal.confirm({
      title: 'Please Confirm',
      content: 'Are you sure you want to delete these properties?',
      onOk() {
        batchDelete()
      }
    })
  }

  const batchDelete = async () => {
    try {
      setLoading(true)
      const response = await BatchDeleteProperty(selectedPropertyGuids)
      message.success(response.message)
      getPropertyList()
    } catch (error) {
      let errorMessage = 'Failed to delete properties'
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
      title: 'Type',
      width: 100,
      dataIndex: 'typeId',
      render(typeId: number) {
        return {
          1: 'House',
          2: 'Apartment',
          3: 'Townhouse',
          4: 'Land',
          5: 'Rural',
          6: 'Commercial'
        }[typeId]
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
      render(record) {
        return (
          <Space>
            <Button type='text' onClick={() => onRowEditClick(record)}>
              Edit
            </Button>
            <Button
              type='text'
              danger
              onClick={() => onRowDeleteClick(record.guid)}
            >
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
        initialValues={{ statusId: 0, typeId: 0 }}
      >
        <Form.Item name='filterText' label='Search'>
          <Input
            placeholder='Enter keyword'
            onPressEnter={onSearch} // Trigger search on Enter key
          />
        </Form.Item>
        <Form.Item name='statusId' label='Status'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>All</Select.Option>
            <Select.Option value={1}>Listing</Select.Option>
            <Select.Option value={2}>Withdrawn</Select.Option>
            <Select.Option value={3}>Sold</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='typeId' label='Type'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>All</Select.Option>
            <Select.Option value={1}>House</Select.Option>
            <Select.Option value={2}>Apartment</Select.Option>
            <Select.Option value={3}>Townhouse</Select.Option>
            <Select.Option value={4}>Land</Select.Option>
            <Select.Option value={5}>Rural</Select.Option>
            <Select.Option value={6}>Commercial</Select.Option>
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
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedPropertyGuids,
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedPropertyGuids(selectedRowKeys as string[])
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
      <ModalProperty
        mRef={userRef}
        update={() => {
          getPropertyList()
        }}
      />
    </div>
  )
}
