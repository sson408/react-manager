import React, { useState, useEffect } from 'react'
import { Form, FormInstance, Input, Space, Typography } from 'antd'
import styles from './commissionTab.module.less'
import FormItem from 'antd/es/form/FormItem'
import numeral from 'numeral'

interface CommissionTabProps {
  form: FormInstance
  disabled?: boolean
}

const CommissionTab: React.FC<CommissionTabProps> = ({
  form,
  disabled = false
}) => {
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined)
  const [firstPart, setFirstPart] = useState<number | undefined>(undefined)
  const [firstPartPercentage, setFirstPartPercentage] = useState<
    number | undefined
  >(undefined)
  const [firstPartCommission, setFirstPartCommission] = useState<
    number | undefined
  >(undefined)
  const [rest, setRest] = useState<number | undefined>(undefined)
  const [restPercentage, setRestPercentage] = useState<number | undefined>(
    undefined
  )
  const [restPartCommission, setRestPartCommission] = useState<
    number | undefined
  >(undefined)
  const [totalCommission, setTotalCommission] = useState<number | undefined>(
    undefined
  )

  useEffect(() => {
    // Reset all values when component is mounted or tab is opened
    setSalePrice(undefined)
    setFirstPart(undefined)
    setFirstPartPercentage(undefined)
    setFirstPartCommission(undefined)
    setRest(undefined)
    setRestPercentage(undefined)
    setRestPartCommission(undefined)
    setTotalCommission(undefined)
  }, [])

  const onSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const salePrice = parseFloat(e.target.value) || 0
    setSalePrice(salePrice)
  }

  const onFirstPartValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const firstPartValue = parseFloat(e.target.value) || 0
    setFirstPart(firstPartValue)

    calculateRestValueBaseOnFirstPart(salePrice ?? 0, firstPartValue)

    calculateFirstPartCommission(firstPartValue, firstPartPercentage ?? 0)
  }

  const onFirstPartPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const firstPartPercentage = parseFloat(e.target.value) || 0
    setFirstPartPercentage(firstPartPercentage)

    calculateFirstPartCommission(firstPart ?? 0, firstPartPercentage)
  }

  const onRestValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const restValue = parseFloat(e.target.value) || 0
    setRest(restValue)

    calculateFirstPartValueBaseOnRest(salePrice ?? 0, restValue)

    calculateRestPartCommission(restValue, restPercentage ?? 0)
  }

  const onRestPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const restPercentage = parseFloat(e.target.value) || 0
    setRestPercentage(restPercentage)
    calculateRestPartCommission(rest ?? 0, restPercentage)
  }

  const calculateFirstPartValueBaseOnRest = (
    salePrice: number,
    restValue: number
  ) => {
    if (!salePrice || !restValue) {
      return
    }
    const firstPartValue = salePrice - restValue
    setFirstPart(firstPartValue)
  }

  const calculateRestValueBaseOnFirstPart = (
    salePrice: number,
    firstPartValue: number
  ) => {
    if (!salePrice || !firstPartValue) {
      return
    }
    const restValue = salePrice - firstPartValue
    setRest(restValue)
  }

  const calculateFirstPartCommission = (
    firstPartValue: number,
    firstPartPercentage: number
  ) => {
    if (!firstPartValue || !firstPartPercentage) {
      setFirstPartCommission(0)
      return
    }
    const firstPartCommission = (firstPartValue * firstPartPercentage) / 100
    setFirstPartCommission(firstPartCommission)
    calculateTotalCommission(firstPartCommission, restPartCommission ?? 0)
  }

  const calculateRestPartCommission = (
    restValue: number,
    restPercentage: number
  ) => {
    if (!restValue || !restPercentage) {
      setRestPartCommission(0)
      return
    }
    const restPartCommission = (restValue * restPercentage) / 100
    setRestPartCommission(restPartCommission)
    calculateTotalCommission(firstPartCommission ?? 0, restPartCommission)
  }

  const calculateTotalCommission = (
    firstPartCommission: number,
    restPartCommission: number
  ) => {
    const totalCommission = firstPartCommission + restPartCommission - 850
    setTotalCommission(totalCommission)

    // Update the form field
    form.setFieldsValue({ commission: totalCommission })
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      labelAlign='right'
      disabled={disabled}
    >
      <FormItem
        label='Sale Price'
        name='soldPrice'
        rules={[{ required: true, message: 'Please enter sale price' }]}
      >
        <Input
          className={styles.longTextBox}
          prefix='$'
          onChange={onSalePriceChange}
          value={salePrice}
        />
      </FormItem>
      <Form.Item label='Admin Fee'>
        <Typography.Text>$ 850</Typography.Text>
      </Form.Item>
      <Form.Item
        label='First Part'
        rules={[{ required: true, message: 'Please enter first part Details' }]}
      >
        <Space.Compact>
          <Form.Item name='firstPartPrice' noStyle>
            <Input
              type='number'
              className={`${styles.longTextBox} ${styles.borderRadius}`}
              onChange={onFirstPartValueChange}
              value={firstPart}
              prefix='$'
            />
          </Form.Item>
          <Form.Item name='firstPartPercentage' noStyle>
            <Input
              type='number'
              className={`${styles.shortTextBox} ${styles.marginLeft5} ${styles.borderRadius}`}
              onChange={onFirstPartPercentageChange}
              value={firstPartPercentage}
              suffix='%'
            />
          </Form.Item>

          <Typography.Text
            className={`${styles.marginLeft10} ${styles.marginTop5}`}
          >
            {' '}
            {firstPartCommission !== undefined
              ? numeral(firstPartCommission).format('$0,0.0')
              : ''}
          </Typography.Text>
        </Space.Compact>
      </Form.Item>
      <Form.Item
        label='Rest'
        rules={[
          { required: true, message: 'Please enter second part details' }
        ]}
      >
        <Space.Compact>
          <Form.Item name='restPartPrice' noStyle>
            <Input
              type='number'
              className={`${styles.longTextBox} ${styles.borderRadius}`}
              onChange={onRestValueChange}
              value={rest}
              prefix='$'
            />
          </Form.Item>

          <Form.Item name='restPartPercentage' noStyle>
            <Input
              type='number'
              className={`${styles.shortTextBox} ${styles.marginLeft5} ${styles.borderRadius}`}
              onChange={onRestPercentageChange}
              value={restPercentage}
              suffix='%'
            />
          </Form.Item>

          <Typography.Text
            className={`${styles.marginLeft10} ${styles.marginTop5}`}
          >
            {' '}
            {restPartCommission !== undefined
              ? numeral(restPartCommission).format('$0,0.0')
              : ''}
          </Typography.Text>
        </Space.Compact>
      </Form.Item>
      <Form.Item label='Total' name='commission'>
        <Input
          className={`${styles.longTextBox}`}
          prefix='$'
          value={
            totalCommission !== undefined
              ? numeral(totalCommission).format('0,0.0')
              : ''
          }
          readOnly
        />
      </Form.Item>
    </Form>
  )
}

export default CommissionTab
