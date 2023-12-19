import {Form, Input, Radio, DatePicker, TimePicker} from 'antd'
import React, { useEffect, useState } from 'react'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './Paymentstyle';
import ButtonComponent from '../../components/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent';
import InputComponent from '../../components/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as WarehouseService from '../../services/WarehouseService'
import { useQuery , useQueryClient } from 'react-query'

import * as  UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/spin';
import * as message from '../../pages/Adminpage/components/Message'
import { updateUser } from '../../redux/slices/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct, updateAddress } from '../../redux/slices/orderSlide';
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from '../../services/PaymentService'


import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { TextArea } = Input;
var isTomorrow = require('dayjs/plugin/isTomorrow')

dayjs.extend(isTomorrow)
/** Manually entering any of the following formats will perform date parsing */


function PaymentPage(){
  
  const order = useSelector((state) => state.order)
  console.log("order ne",order)
  const user = useSelector((state) => state.user)
  const [timeShipping, settimeShipping] = useState({
    dateship: "",
    timeship: ""
  })
  const [shippingStatus, setShippingStatus] = useState('now')
const [orderNote, setOrderNote] = useState('')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady , setSdkReady] = useState(false)

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })

  const dispatch = useDispatch()
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  
  var objtemp = {
    // statusa: '',
    // timea:'',
    // datea:''
  }
var ingreArr={}
  order.orderItems.forEach((item)=>{
    var currenting=0
    item.ingredients.forEach((element)=>{
    currenting=  element.weight*(item.amount)
    if(Object.keys(ingreArr).length == 0){
           ingreArr[element.name] = currenting;
  
  
    }else{
      
      for (const [key, value] of Object.entries (ingreArr)) { 
        if(key===element.name) {
  
          ingreArr[key]=value+currenting
  
         
        }
          if(!(element.name in ingreArr)){
  
            ingreArr[element.name] = currenting
          }
  
        
    }
    // const nameel = element.name
    }
  
  
    
  })
  
  console.log("ingreArr", ingreArr)
  })




  
 

  const [form] = Form.useForm();

  
  
  
  const mutationUpdateEl = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = WarehouseService.updateElement(
        id,
        token,
        { ...rests })
      return res
    },
  )

  

 

  const getAllElemnts = async () => {
    const res = await WarehouseService.getAllElement()
    return res
  }

 

 

  



  


  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdateEl


  const queryElement = useQuery({ queryKey: ['warehouses'], queryFn: getAllElemnts})

console.log("queryElement", queryElement)





  useEffect(() => {
    if(dayjs().format("HH")<8 || dayjs().format("HH")>22){
      setShippingStatus("later")
    }
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: order?.shippingAddress.city,
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
    
      return 10000
    
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, diliveryPriceMemo])

  const handleAddOrder = () => {
    handleUpdateTime()
    if(user?.access_token && order?.orderItemsSlected && order?.shippingAddress.fullName
      && order?.shippingAddress.address && order?.shippingAddress.phone && order?.shippingAddress.city && priceMemo && user?.id && shippingStatus) {
        // eslint-disable-next-line no-unused-expressions
        
        mutationAddOrder.mutate(
          { 
            token: user?.access_token, 
            orderItems: order?.orderItemsSlected, 
            fullName: order?.shippingAddress.fullName,
            address:order?.shippingAddress.address, 
            phone:order?.shippingAddress.phone,
            city: order?.shippingAddress.city,
            month: objtemp.month,
              status: objtemp.statusa,
              date: objtemp.datea,
              time: objtemp.timea,
            note: orderNote,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            email: user?.email
          }
        )
      }
      if(isError){
        message.error("Thiếu thông tin đơn hàng!")
      }
  }
 
  const  handleUpdateTime=()=>{
    
    if(shippingStatus=='now'){

        objtemp.statusa = shippingStatus
        objtemp.datea = dayjs().format('YYYY-MM-DD')
        objtemp.month = dayjs().format("MM")
        objtemp.timea = dayjs().format('HH:mm')
  
        
    }else{
      objtemp.statusa = shippingStatus
      objtemp.datea = timeShipping.dateship
      objtemp.month = dayjs(timeShipping.dateship).format("MM")
      objtemp.timea =timeShipping.timeship
    }
   }

  const handleUpdateElement= ()=>{
      queryElement.data.data.forEach(async(queryitem)=>{
        if(queryitem.name in ingreArr){
          let res = {
            name: queryitem.name,
            weight: (queryitem.weight - (ingreArr[queryitem.name]/1000)).toFixed(2)
          }

          console.log("obj res", res, (ingreArr[queryitem.name]/1000))
      onUpdateElement(queryitem._id,res )
         
        }
      })
      console.log('queryElement', queryElement)
  }
  


  const onUpdateElement = (id, res) => {
    mutationUpdateEl.mutate({ id: id, token: user?.access_token, ...res }, {
      onSettled: () => {
        queryElement.refetch()
      }
    })
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

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        { ...rests }, token)
      return res
    },
  )

  const {isLoading, data} = mutationUpdate
  const {data: dataAdd,isLoading:isLoadingAddOrder, isSuccess, isError} = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrayOrdered = []
      order?.orderItemsSlected?.forEach(element => {
        arrayOrdered.push(element.product)
      });
      handleUpdateTime()
      handleUpdateElement()
      message.success("Đặt hàng thành công")
      dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
       console.log("objtempppp", objtemp)
      navigate('/orderSuccess', {
        state: {
          objtemp,
          payment,
          orders: order?.orderItemsSlected,
          totalPriceMemo: totalPriceMemo
        }
      })
    } else if (isError) {
      message.error()
    }
  },[isSuccess])

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const onSuccessPaypal = (details, data) => {
    console.log("detailsagag",details)
    handleUpdateTime()
    if(user?.access_token && order?.orderItemsSlected && order?.shippingAddress.fullName
      && order?.shippingAddress.address && order?.shippingAddress.phone && order?.shippingAddress.city && priceMemo && user?.id && shippingStatus) {
    mutationAddOrder.mutate(
      { 
        
          token: user?.access_token, 
          orderItems: order?.orderItemsSlected, 
          fullName: order?.shippingAddress.fullName,
          address:order?.shippingAddress.address, 
          phone:order?.shippingAddress.phone,
          city: order?.shippingAddress.city,
          month: objtemp.month,
            status: objtemp.statusa,
            date: objtemp.datea,
            time: objtemp.timea,
          note: orderNote,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: diliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          email: user?.email,
        isPaid: true,
        paidAt: dayjs(details.update_time).format("YYYY-MM-DD"), 
      }
    )

      }
      if(isError){
        message.error("Thiếu thông tin đơn hàng!")
      }
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
  const handleDilivery = (e) => {
    setShippingStatus(
      e.target.value
    )

  }
useEffect(()=>{
   console.log("timeShipping",shippingStatus, timeShipping)
},[shippingStatus])
  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }
  const onChangeDate = (datea, dateString) => {
    var temp=dateString
    settimeShipping({
      ...timeShipping,
      dateship: dayjs(datea).format("YYYY-MM-DD")
      
    })

  }
  const onChangeTime = (timea, timeString) => {
    var temp=timeString

    settimeShipping({
      ...timeShipping,
      timeship: temp
    })

  }
  const onChangetext = (e) => {
    setOrderNote( e.target.value);
  };
  useEffect(() => {
    if(!window.paypal) {
      addPaypalScript()
    }else {
      setSdkReady(true)
    }
  }, [])
const handleHour = ()=>{
  var arr =[0, 1, 2, 3, 4, 5, 6, 7, 23]

  if(timeShipping.dateship==dayjs().format('YYYY-MM-DD')){

    var temp = dayjs().format("HH")
    for(let i = 0; i <= temp; i++){
      arr.push(i)
    }
    return arr
  }else{
    return arr
  }
}
  return (
    <div style={{background: '#f5f5fa', with: '100%'}}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3 className='text-xl text-orange-500'>Thông tin đơn hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperLeft className='mb-5'>
              <WrapperInfo>
                <div>
                  <Lable>Chọn thời gian giao hàng</Lable>
                  <WrapperRadio onChange={handleDilivery} value={shippingStatus}> 
                    <Radio disabled={dayjs().format("HH")<8 || dayjs().format("HH")>22 ? true:false}  value="now"><span style={{color: '#ea8500', fontWeight: 'bold'}}>Giao ngay</span></Radio>
                    <Radio  value="later" ><span style={{color: '#ea8500', fontWeight: 'bold'}} >Giao sau </span>{shippingStatus === 'later' ? <> : <DatePicker disabledDate={(current) => {
              var temp = -1
              if(dayjs().format('HH')>='22'){
                temp=0
              }
              return  current < dayjs().add(temp,'day');
            }} onChange={onChangeDate} bordered={false} placeholder='Chọn ngày' format={'DD/MM/YYYY'} /> 
                    <TimePicker disabledHours={()=>
                     {return handleHour()} 
                    } onChange={onChangeTime} bordered={false} hideDisabledOptions minuteStep={5}   placeholder='Chọn giờ' format={"HH:mm"} /></> : null}</Radio>
                    
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}> 
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
              <Lable>Thêm ghi chú</Lable>
                
              <TextArea placeholder="Ghi chú của bạn về đơn hàng" allowClear onChange={onChangetext} />
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{width: '100%'}}>
                <WrapperInfo>
                <div>
                  <span className=' text-[16px] font-bold'>Thông tin người nhận: </span>
                  <span className='font-medium'>{ `${order?.shippingAddress.fullName} - ${order?.shippingAddress.phone} - ${order?.shippingAddress.address}. ${order?.shippingAddress.city}`} </span>

                   <span className='hover:text-orange-500 font-bold cursor-pointer block text-red-500' onClick={handleChangeAddress} >Thay đổi</span>
                </div>
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
              </div>
              {payment === 'paypal' && sdkReady ? (
                <div style={{width: '320px'}}>
                  <PayPalButton
                    amount={(totalPriceMemo/24230).toFixed(2)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert('Erroe')
                    }}
                  />
                </div>
              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                      background: '#fa610f',
                      height: '48px',
                      width: '320px',
                      border: 'none',
                      borderRadius: '4px'
                  }}
                  textbutton={'Đặt hàng'}
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              ></ButtonComponent>
              )}
            </WrapperRight>
          </div>
        </div>
        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
          <Loading isLoading={isLoading}>
          <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your  phone!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>

              <Form.Item
                label="Adress"
                name="address"
                rules={[{ required: true, message: 'Please input your  address!' }]}
              >
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage