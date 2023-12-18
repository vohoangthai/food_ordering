import React,{ useEffect, useState } from 'react'
import { Tag, Tabs } from 'antd';
import Loading from '../../components/spin';
import { useQuery } from 'react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './MyODstyle';
import ButtonComponent from '../../components/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../pages/Adminpage/components/Message'
import Navbar from '../../navbar';
import dayjs from 'dayjs';
const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token)
    return res.data
  }
  const user = useSelector((state) => state.user)

  const queryOrder = useQuery({ queryKey: ['orderss'], queryFn: fetchMyOrder }, {
    enabled: state?.id && state?.token
  })
  const { isLoading, data } = queryOrder
  console.log("sdjhgdhjag", data)

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    })
  }

  const mutation = useMutationHooks(
    (data) => {
      const { id, token , orderItems, userId } = data
      const res = OrderService.cancelOrder(id, token,orderItems, userId)
      return res
    }
  )

  const handleCanceOrder = (order) => {
    mutation.mutate({id : order._id, token:state?.token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
    })
  }
  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success()
    } else if(isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    }else if (isErrorCancle) {
      message.error()
    }
  }, [isErrorCancle, isSuccessCancel])

  const renderProduct = (orderitem) => {
    return orderitem?.map((order) => {

      return <WrapperHeaderItem key={order?._id}> 
              <img src={order?.image} 
                style={{
                  width: '70px', 
                  height: '70px', 
                  objectFit: 'cover',
                  border: '1px solid rgb(238, 238, 238)',
                  padding: '2px'
                }}
              />
              <div style={{
                width: 260,
                overflow: 'hidden',
                textOverflow:'ellipsis',
                whiteSpace:'nowrap',
                marginLeft: '10px'
              }}>{order?.name}: {convertPrice(order?.price)} x {order?.amount}</div>
              <span style={{ fontSize: '15px', color: '#242424',marginLeft: 'auto' }}>{convertPrice(order?.price*order?.amount)}</span>
            </WrapperHeaderItem>
          })
  }
  const items = [
    {
      key: '1',
      label: 'Đơn chưa giao',
      children:  <WrapperListOrder>
      {data?.map((order) => {
      return  order.isDelivered==false ? 
      
          <WrapperItemOrder key={order?._id}>
            <WrapperStatus>
              <Tag className='max-w-fit' color="volcano">Đặt hàng ngày: {dayjs(order?.createdAt).format('DD/MM/YYYY')}</Tag>
              <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
              <div>
                <span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>
                <span style={{color: 'rgb(234, 133, 0)', fontWeight: 'bold'}}>{`${order.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</span>
              </div>
              <div>
                <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                <span style={{color: 'rgb(234, 133, 0)', fontWeight: 'bold'}}>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</span>
              </div>
            </WrapperStatus>
            {renderProduct(order?.orderItems)}
            <WrapperFooterItem>
              <span>Phí ship 10.000đ</span>
              <div>
                <span >Tổng thanh toán: </span>
                <span 
                  style={{ fontSize: '15px', color: 'rgb(234, 133, 0)',fontWeight: 700 }}
                >{convertPrice(order?.totalPrice)}</span>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
             
                <ButtonComponent
                  onClick={() => handleDetailsOrder(order?._id)}
                  size={40}
                  styleButton={{
                      height: '36px',
                      border: '1px solid #e81730',
                      borderRadius: '4px'
                  }}
                  textbutton={'Xem chi tiết'}
                  styleTextButton={{ color: '#e81730', fontSize: '14px' }}
                >
                </ButtonComponent>
              </div>
            </WrapperFooterItem>
          </WrapperItemOrder> : null
        
      })}
    </WrapperListOrder>,
    },
    {
      key: '2',
      label: 'Đơn đã giao',
      children:  <WrapperListOrder>
       {data?.map((order) => {
       return order.isDelivered==true ? 
      
          <WrapperItemOrder key={order?._id}>
            <WrapperStatus>
              <Tag className='max-w-fit' color="volcano">Đặt hàng ngày: {dayjs(order?.createdAt).format('DD/MM/YYYY')}</Tag>
              <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
              <div>
                <span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>
                <span style={{color: 'rgb(234, 133, 0)', fontWeight: 'bold'}}>{`${order.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</span>
              </div>
              <div>
                <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                <span style={{color: 'rgb(234, 133, 0)', fontWeight: 'bold'}}>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</span>
              </div>
            </WrapperStatus>
            {renderProduct(order?.orderItems)}
            <WrapperFooterItem>
              <span>Phí ship 10.000đ</span>
              <div>
                <span >Tổng thanh toán: </span>
                <span 
                  style={{ fontSize: '15px', color: 'rgb(234, 133, 0)',fontWeight: 700 }}
                >{convertPrice(order?.totalPrice)}</span>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
             
                <ButtonComponent
                  onClick={() => handleDetailsOrder(order?._id)}
                  size={40}
                  styleButton={{
                      height: '36px',
                      border: '1px solid #e81730',
                      borderRadius: '4px'
                  }}
                  textbutton={'Xem chi tiết'}
                  styleTextButton={{ color: '#e81730', fontSize: '14px' }}
                >
                </ButtonComponent>
              </div>
            </WrapperFooterItem>
          </WrapperItemOrder> : null
        
      })}
    </WrapperListOrder>,
    },
    {
      key: '3',
      label: 'Đơn đã huỷ',
      children:  <WrapperListOrder>
       {data?.map((order) => {
       return order.isCancel===1 ? 
      
          <WrapperItemOrder key={order?._id}>
            <WrapperStatus>
              <Tag className='max-w-fit' color="volcano">Đặt hàng ngày: {dayjs(order?.createdAt).format('DD/MM/YYYY')}</Tag>
              <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
              <div>
                <span style={{color: 'rgb(255, 66, 78)'}}>Đã huỷ</span>
                <p style={{color: '#0a0800'}}>Lý do huỷ đơn: {order.cancelReason}</p>
              </div>
              <div>
                <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                <span style={{color: 'rgb(234, 133, 0)', fontWeight: 'bold'}}>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</span>
              </div>
            </WrapperStatus>
            {renderProduct(order?.orderItems)}
            <WrapperFooterItem>
              <span>Phí ship 10.000đ</span>
              <div>
                <span >Tổng thanh toán: </span>
                <span 
                  style={{ fontSize: '15px', color: 'rgb(234, 133, 0)',fontWeight: 700 }}
                >{convertPrice(order?.totalPrice)}</span>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
             
                <ButtonComponent
                  onClick={() => handleDetailsOrder(order?._id)}
                  size={40}
                  styleButton={{
                      height: '36px',
                      border: '1px solid #e81730',
                      borderRadius: '4px'
                  }}
                  textbutton={'Xem chi tiết'}
                  styleTextButton={{ color: '#e81730', fontSize: '14px' }}
                >
                </ButtonComponent>
              </div>
            </WrapperFooterItem>
          </WrapperItemOrder> : null
        
      })}
    </WrapperListOrder>,
    }
  ];
  return (
    <div>

    <Navbar></Navbar>
    <Loading isLoading={isLoading}>
      <WrapperContainer>
        <div style={{height: '100%', width: '1270px', margin: ' auto'}}>
          <h4 className='font-bold text-lg text-orange-600'>Đơn hàng của tôi</h4>
          <Tabs defaultActiveKey="1" items={items}  />
         
        </div>
      </WrapperContainer>
    </Loading>
    </div>
  )
}

export default MyOrderPage