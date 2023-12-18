import React, { Component } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct,increaseAmount} from '.././redux/slices/orderSlide'
import { convertPrice} from '.././utils'
import { useEffect, useState } from 'react'
import { useQuery } from "react-query";
import Loading from "./spin";
import * as WarehouseService from '../services/WarehouseService'

import * as message from '../pages/Adminpage/components/Message'
function CardProduct(props){
    const {state,countInStock,ingredients,selled, image, name, price, discount, idpd  } = props
    console.log("ingredientspd", ingredients)
  const user = useSelector((state) => state.user)

  const order = useSelector((state) => state.order)
  var isCanAdd = true;

 const numProduct = 1;
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // const onChange = (value) => { 
  //     setNumProduct(Number(value))
  // }

 

  const fetchAllElement = async ()=>{
    const res = await WarehouseService.getAllElement()
    return res
  }

  const allElement = useQuery({ queryKey: ['warehouses'], queryFn: fetchAllElement })
  const { isLoading} = allElement
  // useEffect(()=>{
  //   allElement.data.data.forEach((element)=>{
  //      if(element.name == ingredients.name){
  //       if((element.weight-ingredients.weight)<0)
  //       setIsCanAdd(false)
  //      }
  //   })
  // },[isCanAdd])

  
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
 
 

//    const handleAddOrderProduct =  (id) => {


//       if(!user?.id) {
//           navigate('/signin', {state: state?.pathname})
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
//                 name: name,
//                 amount: numProduct,
//                 image: image,
//                 price: price,
//                 product: id,
//                 discount: discount,
//                 countInstock: countInStock
//             }
//         }))
//           } 
//       }
    
//const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled : !!idProduct})


    

   
   

    

   

   

    const handleAddOrderProduct = () => {
      console.log("vdvhvvjhd", name,order?.orderItems)
      order?.orderItems.forEach((ell)=>{
      if(name==ell.name)return
      else{
        var arrvalue = 0
        ingredients.forEach((ingredient)=>{
          var arrtemp = allElement.data.data.find(el=>el.name==ingredient.name)
          var arritem = order?.orderItems.filter(el=>el.ingredients.find(el=>el.name==ingredient.name)) 
          if(arritem){
            arritem.forEach((curr)=>{
              var temp = curr.ingredients.find(el=>el.name==ingredient.name)
              if(temp){
                arrvalue+=(temp.weight*curr.amount)
              }
            })
            console.log("arr tem weught:", arritem.weight)
            if(arrtemp.weight*1000<(Number(ingredient.weight)+arrvalue)){
              isCanAdd = false
            }
          }
        })
      }
      
      })
    
     
        if(!user?.id) {
            navigate('/signin', {state: location?.pathname})
        }else if(isCanAdd==false){
          message.error("Hiện không thể chọn món này")

        }else {
            // {
            //     name: { type: String, required: true },
            //     amount: { type: Number, required: true },
            //     image: { type: String, required: true },
            //     price: { type: Number, required: true },
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: 'Product',
            //         required: true,
            //     },
            // },
            const orderRedux = order?.orderItems?.find((item) => item.product === idpd)
            console.log("odredux", orderRedux, idpd)
            if(orderRedux) {

                
                message.error("Món đã tồn tại trong giỏ hàng")
                }
                else {
                    dispatch(addOrderProduct({
                    orderItem: {
                                        name: name,
                                        ingredients: ingredients,
                                        amount: numProduct,
                                        image: image,
                                        price: price,
                                        product: idpd,
                                        discount: discount,
                                        countInstock: countInStock
                                    }})
                )
                message.success("Đã thêm món vào giỏ hàng")

            } 
        }
    }




        return(
          <Loading isLoading={isLoading}>

          <div >

          
                    
        

                  <div key={idpd} className="p-4 justify-center flex flex-col items-center h-4050px] rounded-lg shadow-lg ">
                    <div className="items-center justify-center">
                    <img className="w-full h-[270px]" src={image} />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-center text-orange-500">{name}</p>
                      <span className="block text-center text-xs">Đã bán: {selled}</span>
                      <p className="text-center text-lg mt-4 mb-4">{convertPrice(price)}</p>
                            
                    </div>
                      <button className="border-[1px] hover:bg-orange-500 hover:text-white text-[15px] font-medium border-orange-600 text-orange-600 rounded-md mx-auto w-32 h-12"  onClick={handleAddOrderProduct} >Chọn món</button>

                  </div>
                  
          </div>
          </Loading>

        
        )       
    }


export default CardProduct;