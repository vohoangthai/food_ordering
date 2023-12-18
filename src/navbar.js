import OrderComponent from './components/OrderPage/OrderComponent';
import { Badge, Button, Col, Popover,ConfigProvider } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from './services/UserService'
import { resetUser} from './redux/slices/userSlide'
import { resetUserinfor, resetOrderItem} from './redux/slices/orderSlide'
import { PhoneTwoTone } from '@ant-design/icons'

import { useEffect,useState} from 'react';
import './App.css';
import './navbar.css'
import React from 'react';
import Loading from './components/spin';
import { useNavigate } from 'react-router';
import Logo from '../src/img/logo.png';
import TypeProduct from './components/TypeProduct';
import * as ProductService from './services/ProductService'
import { click } from '@testing-library/user-event/dist/click';

function Navbar(props) {
  const [userAvatar, setUserAvatar] = useState('')
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const headingStyles = { 
      zIndex: 10, 
  }; 
  
    const dispatch = useDispatch()
    // const [userName, setUserName] = useState('')
    // const [userAvatar, setUserAvatar] = useState('')
    // const [search,setSearch] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const order = useSelector((state) => state.order)
    const [loading, setLoading] = useState(false)
    const handleSignIn = () => {
      navigate('/signin')
    }

const handleGohome = ()=>{
  navigate("/")
}

const handleAbount = ()=>{
  navigate("/abount")
}

    const [typeProducts, setTypeProducts] = useState([])
    console.log("sgyyggy", typeProducts)
    const handleNavigatetype = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
      }
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK') {
      setTypeProducts(res?.data)
    }
  }

  useEffect(() => {
    setLoading(true)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.email, user?.avatar])
  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    dispatch(resetOrderItem())

    dispatch(resetUserinfor())
    localStorage.removeItem("access_token")

    setLoading(false)
  }

 

  const content = (
    <div>
      <div className='hover:text-orange-500 cursor-pointer my-2 mx-auto' onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</div>
      {user?.isAdmin && (

        <div className='hover:text-orange-500 cursor-pointer my-2 mx-auto' onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</div>
      )}
      {user?.isManager===true && (

<div className='hover:text-orange-500 cursor-pointer my-2 mx-auto' onClick={() => handleClickNavigate('manager')}>Quản lí cửa hàng</div>
)}
{user?.isEmployee===true && (

  <div className='hover:text-orange-500 cursor-pointer my-2 mx-auto' onClick={() => handleClickNavigate('employee')}>Quản lí đơn hàng</div>
  )}
      <div className='hover:text-orange-500 cursor-pointer my-2 mx-auto' onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</div>
      <div className='hover:text-orange-500 cursor-pointer my-2 mx-auto' onClick={() => handleClickNavigate()}>Đăng xuất</div>
    </div>
  );

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      navigate('/profile-user')
    }else if(type === 'admin') {
      navigate('/system/admin')
    }else if(type === 'my-order') {
      navigate('/my-order',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else if(type === 'manager') {
      navigate('/system/manager',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else if(type === 'employee') {
      navigate('/system/employee',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

//   const { isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  // const odercontent = (
  //     <div>
  //         <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
  //     <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
  //       <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
  //       <div style={{ display: 'flex', justifyContent: 'center'}}>
  //         <WrapperLeft>
  //           <h4>Phí giao hàng</h4>
  //           <WrapperStyleHeaderDilivery>
  //             <StepComponent items={itemsDelivery} current={diliveryPriceMemo === 10000 
  //               ? 2 : diliveryPriceMemo === 20000 ? 1 
  //               : order.orderItemsSlected.length === 0 ? 0:  3}/>
  //           </WrapperStyleHeaderDilivery>
  //           <WrapperStyleHeader>
  //               <span style={{display: 'inline-block', width: '390px'}}>
  //                 <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></CustomCheckbox>
  //                 <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
  //               </span>
  //               <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  //                 <span>Đơn giá</span>
  //                 <span>Số lượng</span>
  //                 <span>Thành tiền</span>
  //                 <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder}/>
  //               </div>
  //           </WrapperStyleHeader>
  //           <WrapperListOrder>
  //             {order?.orderItems?.map((order) => {
  //               return (
  //                 <WrapperItemOrder key={order?.product}>
  //               <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}> 
  //                 <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
  //                 <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
  //                 <div style={{
  //                   width: 260,
  //                   overflow: 'hidden',
  //                   textOverflow:'ellipsis',
  //                   whiteSpace:'nowrap'
  //                 }}>{order?.name}</div>
  //               </div>
  //               <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  //                 <span>
  //                   <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
  //                 </span>
  //                 <WrapperCountOrder>
  //                   <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',order?.product, order?.amount === 1)}>
  //                       <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
  //                   </button>
  //                   <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInstock} />
  //                   <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',order?.product ,order?.amount === order.countInstock, order?.amount === 1)}>
  //                       <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
  //                   </button>
  //                 </WrapperCountOrder>
  //                 <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(order?.price * order?.amount)}</span>
  //                 <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product)}/>
  //               </div>
  //             </WrapperItemOrder>
  //               )
  //             })}
  //           </WrapperListOrder>
  //         </WrapperLeft>
  //         <WrapperRight>
  //           <div style={{width: '100%'}}>
  //             <WrapperInfo>
  //               <div>
  //                 <span>Địa chỉ: </span>
  //                 <span style={{fontWeight: 'bold'}}>{ `${user?.address} ${user?.city}`} </span>
  //                 <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
  //               </div>
  //             </WrapperInfo>
  //             <WrapperInfo>
  //               <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  //                 <span>Tạm tính</span>
  //                 <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
  //               </div>
  //               <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  //                 <span>Giảm giá</span>
  //                 <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
  //               </div>
  //               <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  //                 <span>Phí giao hàng</span>
  //                 <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(diliveryPriceMemo)}</span>
  //               </div>
  //             </WrapperInfo>
  //             <WrapperTotal>
  //               <span>Tổng tiền</span>
  //               <span style={{display:'flex', flexDirection: 'column'}}>
  //                 <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
  //                 <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
  //               </span>
  //             </WrapperTotal>
  //           </div>
  //           <ButtonComponent
  //             onClick={() => handleAddCard()}
  //             size={40}
  //             styleButton={{
  //                 background: 'rgb(255, 57, 69)',
  //                 height: '48px',
  //                 width: '320px',
  //                 border: 'none',
  //                 borderRadius: '4px'
  //             }}
  //             textbutton={'Mua hàng'}
  //             styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
  //         ></ButtonComponent>
  //         </WrapperRight>
  //       </div>
  //     </div>
  //     <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
  //       <Loading isLoading={isLoading}>
  //       <Form
  //           name="basic"
  //           labelCol={{ span: 4 }}
  //           wrapperCol={{ span: 20 }}
  //           // onFinish={onUpdateUser}
  //           autoComplete="on"
  //           form={form}
  //         >
  //           <Form.Item
  //             label="Name"
  //             name="name"
  //             rules={[{ required: true, message: 'Please input your name!' }]}
  //           >
  //             <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
  //           </Form.Item>
  //           <Form.Item
  //             label="City"
  //             name="city"
  //             rules={[{ required: true, message: 'Please input your city!' }]}
  //           >
  //             <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
  //           </Form.Item>
  //           <Form.Item
  //             label="Phone"
  //             name="phone"
  //             rules={[{ required: true, message: 'Please input your  phone!' }]}
  //           >
  //             <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
  //           </Form.Item>

  //           <Form.Item
  //             label="Adress"
  //             name="address"
  //             rules={[{ required: true, message: 'Please input your  address!' }]}
  //           >
  //             <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
  //           </Form.Item>
  //         </Form>
  //       </Loading>
  //     </ModalComponent>
  //   </div>
  


  //     </div>
  // )
   
  
   
  return (
<div>


<div>
    <nav class="bg-white dark:bg-gray-800  shadow py-4 border-x-transparent border-x-8">
        <div class=" mx-auto max-w-7xl">
            <div class="flex items-center justify-between h-16">
                <div class=" flex items-center">
                <a class="cursor-pointer px-3 py-2 rounded-md text-3xl font-medium" onClick={handleGohome} >
                               <img src={Logo} className='w-9 inline' alt="logo" /> <span className='text-orange-600'> GoFoods</span>
                            </a>
                    <div class="hidden md:block">
                        <div class="flex items-baseline ml-10 space-x-4">
                            <a href='/#' class="text-gray-600 cursor-pointer hover:text-orange-500  dark:hover:text-white px-3 py-2 rounded-md text-md font-medium" >
      
                                Trang chủ
                            </a>
                           <div className='inline menu relative group h-10  rounded-t-lg'>
                           <a onClick={() => handleNavigatetype(typeProducts[0])} class="cursor-pointer text-gray-800 dark:text-white  group-hover:text-orange-500 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium" >
                                Thực đơn
                            </a>
                            <div id="product-link"  className='px-6 py-4 w-[900px] h-20 rounded-b-[50%] hidden group-hover:block top-16 bg-orange-300  -left-40  absolute z-10'>
                                <ul className='flex justify-around '>
                                {typeProducts.map((item) => {
            return (
              
              <TypeProduct name={item} key={item}/>
            )
          })}
                                </ul>
                            </div>
                            </div> 
                            <a onClick={handleAbount} class="text-gray-600  hover:text-orange-500 dark:hover:text-white px-3 py-2 rounded-md text-md font-medium" >
                                Về TFoods
                            </a>
                            {/* <a class="text-gray-600 text-orange-500 px-3 py-2 rounded-md text-md font-medium" >
                            <PhoneTwoTone /> 0931746413
                            </a> */}
                        </div>
                    </div>
                </div>
                <div class=" flex">
  <div class="relative flex  w-full flex-wrap items-stretch">
   
    <div className='flex'>
        <Loading isLoading={loading}>

               {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click">
                  {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <div style={{ cursor: 'pointer',maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => setIsOpenPopup((prev) => !prev)}><svg
    class="cursor-pointer mt-1 ml-4 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 18">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/>
  </svg></div>
              )}
                    
                  </Popover>
                </>
              ):(
                <svg onClick={handleSignIn}
    class="cursor-pointer mt-1 ml-4 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 18">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"/>
  </svg>
              ) 
              
              }
    </Loading>

    
        <Badge count={order?.orderItems?.length} size="default" style={{ backgroundColor: 'orange'}} offset={[0, 5]}>

        <ConfigProvider
  theme={{
    components: {
      Popover: {
        zIndexPopup: 999,
      },
    },
  }}
>
  
<Popover 

 trigger="click"
 content={<OrderComponent ></OrderComponent>}
>
<button>
    <svg  class="cursor-pointer ml-4 mt-1 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z"/>
  </svg>

</button>
</Popover>

</ConfigProvider>



              </Badge>


    </div>

  </div>
</div>
                </div>
            </div>
            {/* <div class="md:hidden">
                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                        Home
                    </a>
                    <a class="text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                        Gallery
                    </a>
                    <a class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                        Content
                    </a>
                    <a class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                        Contact
                    </a>
                </div>
                </div> */}
            </nav>
        </div>
       
</div>

  );
}

export default Navbar;
