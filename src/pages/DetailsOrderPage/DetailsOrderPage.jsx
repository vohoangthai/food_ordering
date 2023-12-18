import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './DetailsOrderPageStyle'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import * as OrderService from '../../services/OrderService'
import { useQuery } from 'react-query'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/spin'
import dayjs from 'dayjs'
const DetailsOrderPage = () => {
  const params = useParams()
  const location = useLocation()
  const { state } = location
  const { id } = params

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }

  const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
    enabled: id
  })
  const { isLoading, data } = queryOrder
  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[data])

  return (
   <Loading isLoading={isLoading}>
     <div style={{width: '100%', background: '#f5f5fa', height:"100hv"}}>
      <div style={{ width: '1270px', margin: '0 auto'}}>
        <h2 className='text-lg uppercase font-medium mb-6'>Chi tiết đơn hàng</h2>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLabel>Thông tin người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className='name-info'>{data?.shippingAddress?.fullName}</div>
              <div className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
              <div className='phone-info'><span>Điện thoại: </span> {data?.shippingAddress?.phone}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Thời gian giao hàng</WrapperLabel>
            <WrapperContentInfo>
              <div className='delivery-info'><span className='name-delivery'>{orderContant.deliverytime[data?.shippingTime?.status]} {data?.shippingTime?.status == "later" ? `${data?.shippingTime?.time} ngày ${dayjs(data?.shippingTime?.date).format('DD/MM/YYYY')}`: <span>Đã đặt lúc: {data?.shippingTime?.time}</span>} </span></div>
              <div className='delivery-fee'><span>Phí giao hàng: </span> {data?.shippingPrice}đ</div>
              <span className='status-payment'>{`${data?.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</span>
                    
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
              <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        {data?.note != '' ? <p className='my-5'>Ghi chú của bạn: {data?.note}</p>: null}

        <WrapperStyleContent>
          <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{width: '670px'}}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
          </div>
          
          {data?.orderItems?.map((order) => {
            return (
              <WrapperProduct>
                <WrapperNameProduct>
                  <img src={order?.image} 
                    style={{
                      width: '100px', 
                      height: '100px', 
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
                    marginLeft: '10px',
                    height: '70px',
                  }}>{order.name}</div>
                </WrapperNameProduct>
                <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                <WrapperItem>{order?.amount}</WrapperItem>
                <WrapperItem>{order?.discount ? convertPrice(priceMemo * order?.discount / 100) : '0 VND'}</WrapperItem>
                
                
              </WrapperProduct>
            )
          })}
          
      </WrapperStyleContent>
          <WrapperAllPrice>
            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
            <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
            <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
            <WrapperItem className='font-bold text-lg'>{convertPrice(data?.totalPrice)}</WrapperItem>
          </WrapperAllPrice>
      </div>
    </div>
   </Loading>
  )
}

export default DetailsOrderPage