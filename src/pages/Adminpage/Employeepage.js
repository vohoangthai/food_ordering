import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined,FundOutlined , ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons'
import Navbar from '../../navbar';
import * as OrderService from '../../services/OrderService'
import {QueryClient, QueryClientProvider} from 'react-query';
import { useSelector } from 'react-redux';
import { useQueries } from 'react-query';
import { useMemo } from 'react';
import Loading from '../../components/spin';
import OrderAdmin from './components/OrderAmin';
const queryClient = new QueryClient();
const ManagerPage = () => {

  const user = useSelector((state) => state?.user)

  const items = [
    
    getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
    
  ];

  const [keySelected, setKeySelected] = useState('');
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return {data: res?.data, key: 'orderss'}
  }
  

  const queries = useQueries(
    [
      {queryKey: ['orderss'], queryFn: getAllOrder, staleTime: 1000 * 60},

      
    ]
  )
  const memoCount = useMemo(() => {
    const result = {}
    try {
      if(queries) {
        queries.forEach((query) => {
          result[query?.data?.key] = query?.data?.data?.length
        })
      }
    return result
    } catch (error) {
      return result
    }
  },[queries])
  const COLORS = {
   users: ['#e66465', '#9198e5'],
   products: ['#a8c0ff', '#3f2b96'],
   orders: ['#11998e', '#38ef7d'],
  };

  const renderPage = (key) => {
    switch (key) {
      
        case 'orders':
            return (
              <OrderAdmin />
            )
      default:
        return <></>
    }
  }

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }
  console.log('memoCount', memoCount)
  return (

<QueryClientProvider client={queryClient}>
    
      <Navbar />
      <div style={{ display: 'flex',overflowX: 'hidden' }}>

        <Menu
          mode="inline"
          style={{
            width: 200,
            boxShadow: '1px 1px 2px #ccc',
            height: '100vh'
          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>
          {/* <Loading isLoading={memoCount && Object.keys(memoCount) &&  Object.keys(memoCount).length !== 4}>
            {!keySelected && (
              <CustomizedContent data={memoCount} colors={COLORS} setKeySelected={setKeySelected} />
            )}
          </Loading> */}
          {renderPage(keySelected)}
        </div>
      </div>
</QueryClientProvider>
    
  )
}

export default ManagerPage