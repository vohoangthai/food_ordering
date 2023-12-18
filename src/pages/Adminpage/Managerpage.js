import { Menu } from 'antd'
import AdminDashboard from './components/Dashboard';
import React, { useEffect, useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined,FundOutlined , ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons'
import Navbar from '../../navbar';
import AdminWarehouse from './components/AdminWarehouse';
import AdminUser from './components/AdminUser';
import AdminProduct from './components/AdminProduct';
import OrderAdmin from './components/OrderAmin';
import * as WarehouseService from "../../services/WarehouseService"
import * as OrderService from '../../services/OrderService'
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'
import {QueryClient, QueryClientProvider} from 'react-query';
import { useSelector } from 'react-redux';
import { useQueries } from 'react-query';
import { useMemo } from 'react';
import Loading from '../../components/spin';

const queryClient = new QueryClient();
const ManagerPage = () => {

  const user = useSelector((state) => state?.user)

  const items = [
    getItem('Thống kê', 'mainpage', <FundOutlined />),
    getItem('Thực đơn', 'products', <AppstoreOutlined />),
    getItem("Kho hàng", "warehouse",<HomeOutlined />)
    
  ];

  const [keySelected, setKeySelected] = useState('');
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return {data: res?.data, key: 'orders'}
  }
  const getAllElements = async () => {
    const res = await WarehouseService.getAllElement()
    console.log('res2', res)
    return {data: res?.data, key: 'warehouse'}
  }
  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    console.log('res1', res)
    return {data: res?.data, key: 'products'}
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    console.log('res', res)
    return {data: res?.data, key: 'users'}
  }

  const queries = useQueries(
    [
      {queryKey: ['products'], queryFn: getAllProducts, staleTime: 1000 * 60},
      {queryKey: ['warehouse'], queryFn: getAllElements, staleTime: 1000 * 60},

      {queryKey: ['users'], queryFn: getAllUsers, staleTime: 1000 * 60},
      {queryKey: ['orders'], queryFn: getAllOrder, staleTime: 1000 * 60},
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
      
      case 'products':
        return (
          <AdminProduct />
        )
     
        case 'warehouse':
        return (
          <AdminWarehouse/>
        )
        case 'mainpage':
          return (
            <AdminDashboard></AdminDashboard>
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