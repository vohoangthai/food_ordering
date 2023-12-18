import {Checkbox,Space,ConfigProvider, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './OrderStyle';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import { WrapperInputNumber } from '../PDcomponentStyles';
import ButtonComponent from '../ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slices/orderSlide';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../ModalComponent';
import InputComponent from '../InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService'
import Loading from '../spin';
import * as message from '../../pages/Adminpage/components/Message'
import { updateAddress } from '../../redux/slices/orderSlide';
import { useNavigate } from 'react-router-dom';

const OrderComponent = () => {
  const order = useSelector((state) => state.order)
  var warehouse = useSelector((state) => state.warehouse)

  console.log("order state", order)
  const user = useSelector((state) => state.user)
var ingreArr = {}


  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone:'',
    address: '',
    city: 'Cần Thơ'
  })
 

  const navigate = useNavigate()
  const [form] = Form.useForm();

  const dispatch = useDispatch()



  const onChange = (e) => {
    if(listChecked.includes(e.target.value)){
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
  };
  var confirm = true;
  const handleChangeCount = (type, idProduct, limited) => {
    if(type === 'increase') {
      if(confirm==true){

        var temp = 0
           order.orderItems.forEach((item)=>{
             if(item.product==idProduct){
     
               item.ingredients.forEach((element)=>{
                
                 
                   temp=  element.weight*(item.amount+1)
                   if(Object.keys(ingreArr).length == 0){
                          ingreArr[element.name] = temp;
                          console.log("1 them khi obj = 0")
     
                   }else{
     
                     for (const [key, value] of Object.entries (ingreArr)) { 
                       if(key===element.name) {
       
                         ingreArr[key]=value+temp
       
                        
                       }
                         if(!(element.name in ingreArr)){
       
                           ingreArr[element.name] = temp
                         }
       
                       
                   }
                   // const nameel = element.name
                   }
     
                   // ingreArr.forEach((current)=>{
                   // for(const key in current){
                   //   if(key==element.name){
                   //     current.element.name = current[key]+temp
                   //   }
                   // }
                   // })
                   
                }
                   
                 
               )
             }
               else{
                 item.ingredients.forEach((element)=>{
                console.log("element", element)
                 
                 temp=  element.weight*(item.amount)
                 if(Object.keys(ingreArr).length == 0){
                        ingreArr[element.name] = temp;
                        console.log("2 them khi obj = 0")
     
     
                 }else{
                   
                   for (const [key, value] of Object.entries (ingreArr)) { 
                     if(key===element.name) {
     
                       ingreArr[key]=value+temp
     
                      
                     }
                       if(!(element.name in ingreArr)){
     
                         ingreArr[element.name] = temp
                       }
     
                     
                 }
                 // const nameel = element.name
                 }
     
                 // ingreArr.forEach((current)=>{
                 // for(const key in current){
                 //   if(key==element.name){
                 //     current.element.name = current[key]+temp
                 //   }
                 // }
                 // })
                 
               })}
             
               
             })
      }
       warehouse.elementItems.forEach((element)=>{
        if(element.name  in ingreArr){

          if(element.weight*1000<ingreArr[element.name]){
            confirm = false;
            return
            
            
          }
        }
       })

        
      if(!limited && confirm) {

        dispatch(increaseAmount({idProduct}))
      }else{
        message.error("Không thể thêm số lượng");

      }
    }else {
      if(!limited) {
        dispatch(decreaseAmount({idProduct}))
      }
    }
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else {
      setListChecked([])
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({listChecked,ingredientsSelected: ingreArr}))
  },[listChecked])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: "Cần Thơ",
        name: order?.shippingAddress.fullName,
        address: order?.shippingAddress.address,
        phone: order?.shippingAddress.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)


   

  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount  * cur.amount) / 100)
    },0)
    if(Number(result)){
      return result
    }
    return 0
  },[order])

  const diliveryPriceMemo = useMemo(() => {
    if(priceMemo >= 20000 && priceMemo < 500000){
      return 10000
    }else if(priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
      return 0
    } else {
      return 20000
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, diliveryPriceMemo])

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1){
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  const handleAddCard = () => {
    if(!order?.orderItemsSlected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    }else if(!order.shippingAddress?.phone || !order.shippingAddress.address || !order.shippingAddress.fullName || !order.shippingAddress.city) {
      setIsOpenModalUpdateInfo(true)

    }else {
      navigate('/payment')
    } 
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const {isLoading, data} = mutationUpdate

  const handleCancleUpdate = () => {
    // setStateUserDetails({
    //   name: '',
    //   email: '',
    //   phone: '',
    //   isAdmin: false,
    // })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
    // temp.style.display="none"

  }
  const handleUpdateInforUser = () => {
    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
     
          dispatch(updateAddress({fullName: name, address,city, phone}))
          setIsOpenModalUpdateInfo(false)

    }
      
    }
  

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  const itemsDelivery = [
    {
      title: '20.000 VND',
      description: 'Dưới 200.000 VND',
    },
    {
      title: '10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VND',
    },
    {
      title: 'Free ship',
      description : 'Trên 500.000 VND',
    },
  ]
  return (
    
    <div style={{background: '#f5f5fa', with: '60%', height: '50%', position: "relative"}}>
      <div style={{height: '100%', width: '100%', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
            {/* <h4>Phí giao hàng</h4> */}
            {/* <WrapperStyleHeaderDilivery>
              <StepComponent items={itemsDelivery} current={diliveryPriceMemo === 10000 
                ? 2 : diliveryPriceMemo === 20000 ? 1 
                : order.orderItemsSlected.length === 0 ? 0:  3}/>
            </WrapperStyleHeaderDilivery> */}
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '200px'}}>
                  <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></CustomCheckbox>
                  <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>Tên món</span>

                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <span>Xoá món</span>
                  </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                <div style={{width: '160px', display: 'flex', alignItems: 'center', gap: 4}}> 
                  <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                  <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                  
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:'60%'}}>
                <div style={{
                  marginLeft:"20px",
                    width: 140,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap'
                  }}>{order?.name}</div>
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424', marginRight:"50px" }}>{convertPrice(order?.price)}</span>
                  </span>
                  <WrapperCountOrder className='mr-12'>
                    <button style={{width: "20px", border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',order?.product, order?.amount === 1)}>
                        <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                    </button>
                    <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInstock} />
                    <button style={{paddingLeft:"5px", border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',order?.product ,order?.amount === order.countInstock, order?.amount === 1)}>
                        <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                    </button>
                  </WrapperCountOrder>
                  <span style={{color: 'rgb(255, 66, 78)', fontSize: '15px', fontWeight: 500, paddingRight:"120px"}}>{convertPrice(order?.price * order?.amount)}</span>
                </div>
                  <DeleteOutlined style={{cursor: 'pointer', marginRight:"20px"}} onClick={() => handleDeleteOrder(order?.product)}/>
              </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width: '100%'}}>
              <WrapperInfo>
      
                 {user?.access_token ? (
                   <div>
                  <span className=' text-[16px] font-bold'>Thông tin người nhận: </span>
                  <span className='font-medium'>{ `${order?.shippingAddress.fullName} - ${order?.shippingAddress.phone} - ${order?.shippingAddress.address}. ${order?.shippingAddress.city}`} </span>

                   <span className='hover:text-orange-500 font-bold cursor-pointer block text-red-500' onClick={handleChangeAddress} >Thay đổi</span>
                </div>
                 ):(<span></span>)
                }
              </WrapperInfo>
              <WrapperInfo>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Tạm tính</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Giảm giá</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(diliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng đơn hàng:</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                </span>
              </WrapperTotal>
                {/* {totalPriceMemo<70000?<p className='text-orange-500'>Vui lòng đặt đơn hàng trên 60.000đ</p>:null} */}

            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                  background: '#fa610f',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px'
              }}
              textbutton={'Đặt món'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>

   
  
    <ModalComponent okText="Cập nhật" cancelText="Huỷ" title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
        <Loading isLoading={isLoading}>
        <Form className='mt-8'
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên người nhận"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item
              label="Tỉnh thành"
              name="city"
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <InputComponent  value='Cần Thơ' name="city" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

     
    </div>
  )
}

export default OrderComponent