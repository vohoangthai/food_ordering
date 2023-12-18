import React, { Component } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import CardProduct from "../../components/cardProduct";
import "./Productpage.css"
import Navbar from "../../navbar";
import * as ProductService from '../../services/ProductService'
import { useEffect } from 'react'
import { useState } from 'react'
import Loading from "../../components/spin";
import { useQuery } from 'react-query'
import {QueryClient, QueryClientProvider} from 'react-query';
import { Provider } from 'react-redux';
import { addOrderProduct,resetOrder } from '../../redux/slices/orderSlide'
import { convertPrice} from '../../utils'
import * as message from '../Adminpage/components/Message'

import { useMemo } from 'react'
import { current } from "@reduxjs/toolkit";
function Productpage(){
  const { state}  = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

 const numProduct = 1;
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // const onChange = (value) => { 
  //     setNumProduct(Number(value))
  // }

 



  

  // useEffect(() => {
  //     if(order.isSucessOrder) {
  //         message.success('Đã thêm vào giỏ hàng')
  //     }
  //     return () => {
  //         dispatch(resetOrder())
  //     }
  // }, [order.isSucessOrder])

  // const handleChangeCount = (type, limited) => {
  //     if(type === 'increase') {
  //         if(!limited) {
  //             setNumProduct(numProduct + 1)
  //         }
  //     }else {
  //         if(!limited) {
  //             setNumProduct(numProduct - 1)
  //         }
  //     }
  // }
 
 

//    const handleAddOrderProduct =  (idpd) => {
// //     console.log(temp)
// // console.log("testorder", typeof(idPd), typeof(products[0]._id))
// //     // products.forEach((current)=>{
// //     //   if(current._id === idPd){

// //     //     setCurrentPd(current)
// //     //   }
//       products.forEach((current)=>{
//       if(current._id === idpd){
//         setCurrentPd(current)
//       }
//     })

//       if(!user?.id) {
//           navigate('/signin', {state: location?.pathname})
//       }else {
//           // {
//           //     name: { type: String, required: true },
//           //     amount: { type: Number, required: true },
//           //     image: { type: String, required: true },
//           //     price: { type: Number, required: true },
//           //     product: {
//           //         type: mongoose.Schema.Types.ObjectId,
//           //         ref: 'Product',
//           //         required: true,
//           //     },
//           // },
//           // const orderRedux = order?.orderItems?.find((item) => item.product === currentPd?._id)
//           // if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && currentPd?.countInStock > 0)) {
//           //     dispatch(addOrderProduct({
//           //         orderItem: {
//           //             name: currentPd?.name,
//           //             amount: numProduct,
//           //             image: currentPd?.image,
//           //             price: currentPd?.price,
//           //             product: currentPd?._id,
//           //             discount: currentPd?.discount,
//           //             countInstock: currentPd?.countInStock
//           //         }
//           //     }))
//           // } else {
//           //     setErrorLimitOrder(true)
//           // }
//           dispatch(addOrderProduct({
//             orderItem: {
//                 name: currentPd.name,
//                 amount: numProduct,
//                 image: currentPd.image,
//                 price: currentPd.price,
//                 product: currentPd._id,
//                 discount: currentPd.discount,
//                 countInstock: currentPd.countInStock
//             }
//         }))
//           } 
//       }
    
//const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled : !!idProduct})



  const fetchProductType = async (type) => {
    setLoading(true)
    const res = await ProductService.getProductType(type)
    if(res?.status == 'OK') {
      setLoading(false)
      console.log("resssss", res)
        setProducts(res?.data)
    }else {
      setLoading(false)
  }
  }
  
  useEffect(() => {
    
        fetchProductType(state)
    
  }, [state])

        return(
          <div >

          <Navbar></Navbar>
          <Loading isLoading={loading}>

            <div className="container max-w-7xl mx-auto">
              <div id="productheaderall">

             <div id="productheader1"></div> <div id="productheader"  className=" bg-orange-400 font-bold text-4xl text-white w-[40%] text-center">{state}</div><div id="productheader2"></div>
              </div>
                <div className="py-4 mt-12 px-4 grid grid-cols-3  gap-x-8 gap-y-10">
                  {products?.map((product)=>{
                    
                   return(
                          <CardProduct
                          key={product._id}
                          selled={product.selled}
                          ingredients={product.ingredients}
                          idpd={product._id}
                          name={product.name}
                          image={product.image}
                          price={product.price}
                          discount={product.discount}
                          countInStock={product.countInStock}
                          state={location}


                          ></CardProduct>
                
                   )
                  })
                  }

                 
                  </div>
                </div>
                 
    
            
          </Loading>
          
          </div>

        
        )       
    }


export default Productpage;