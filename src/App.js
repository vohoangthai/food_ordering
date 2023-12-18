import React, {useEffect, useState} from 'react';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { isJsonString } from './utils'
import { routes } from "./Routers/index"
import { ToastContainer, toast } from 'react-toastify';

import { updateWarehouse } from './redux/slices/warehouseSlide';

import { jwtDecode } from "jwt-decode";

import { resetUser, updateUser } from './redux/slices/userSlide'
import { updateAddress } from './redux/slices/orderSlide';
import * as WarehouseService from './services/WarehouseService'
import * as UserService from './services/UserService'
  import 'react-toastify/dist/ReactToastify.css';
function App(){
    const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)
  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded()

    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsLoading(false)
  }, [])

  const handleDecoded = () => {
    let storageData = user?.access_token || localStorage.getItem('access_token')

    let decoded = {}
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken =  jwtDecode(refreshToken)
    if (decoded?.exp < currentTime.getTime() / 1000) {
      if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        config.headers['token'] = `Bearer ${data?.access_token}`
      }else {
        dispatch(resetUser())
      }
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailsUser(id, token)
    const reswh= await WarehouseService.getAllElement()
    dispatch(updateWarehouse({elements:reswh.data}))
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken}))
    dispatch(updateAddress({fullName: res.data.name, address: res.data.address, phone: res.data.phone, city: res.data.city }))
  }

    return(
        

        <div>
          <Routes>

                {
                    routes.map((route)=>{
                        const Page = route.element;
                        return(

                            <Route key={route.path} path={route.path} element={<Page/>}/>
                        )
                    }

                    )
                }
            
          </Routes>
           
          <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
{/* Same as */}
<ToastContainer />

        </div>
        
        
/* <Provider store={store}>
    <Navbar/>
    <Main/>
    <Footer/>
    <Counter/>
  
</Provider> */
        
    )
}
export default App;