import React from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperCountOrder, WrapperItemOrder, WrapperItemOrderInfo } from './OdscStyle';
import Loading from '../../components/spin';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';
import dayjs from 'dayjs';
import { LeftCircleTwoTone} from '@ant-design/icons'
import { useNavigate } from 'react-router';

const OrderSucess = () => {
const navigate = useNavigate()
 
  const handleGoHome = ()=>{
    navigate("/")
  }
  const location = useLocation()
  const {state} = location
  console.log("objtemp", state?.objtemp)
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
        <button onClick={handleGoHome}><LeftCircleTwoTone  className='text-3xl text-orange-600' twoToneColor="#f57505" /></button>

      <Loading isLoading={false}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3 className='text-lg text-orange-500'>Đơn hàng đặt thành công</h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable>Thời gian giao hàng</Lable>
                    <WrapperValue>
                      <span style={{color: '#ea8500', fontWeight: 'bold'}}>{orderContant.deliverytime[state?.objtemp?.statusa]} {state?.objtemp?.statusa == 'later'? `${state?.objtemp.timea} ngày ${dayjs(state?.objtemp.datea).format("DD/MM/YYYY")}`: null} </span> 
                    </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức thanh toán</Lable>
                
                  <WrapperValue>
                    {orderContant.payment[state?.payment]}
                  </WrapperValue>
                  {state?.payment == 'paypal' ? <span className=' text-[#ea8500] px-2'> Đã thanh toán</span>:null}
                </div>
              </WrapperInfo>
              
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      <div style={{width: '300px', display: 'flex', alignItems: 'center', gap: 4}}> 
                        <img src={order.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                        <div style={{
                          width: 200,
                          overflow: 'hidden',
                          textOverflow:'ellipsis',
                          whiteSpace:'nowrap'
                        }}>{order?.name}</div>
                      </div>
                      <div style={{flex: 1, display: 'flex', justifyContent: "flex-start"}}>
                        <span>
                          <span style={{ fontSize: '15px', color: '#242424' }}>Giá tiền: {convertPrice(order?.price)}</span>
                        </span>
                        <span className='ml-20'>
                          <span style={{ fontSize: '15px', color: '#242424' }}>Số lượng: {order?.amount}</span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  )
                })}
              </WrapperItemOrderInfo>
              <WrapperInfo>
              <div>
              <span className='text-[15px] block'>Phí giao hàng: {convertPrice(10000)}</span>

                <span className='text-[15px] font-medium text-red-600'>Tổng đơn hàng: {convertPrice(state?.totalPriceMemo)}</span>
              </div>

              </WrapperInfo>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSucess