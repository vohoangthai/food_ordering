import React, { Component, useEffect,location } from "react";
import { useNavigate, useLocation } from "react-router";
import Navbar from "../../navbar";
import * as WarehouseService from "../../services/WarehouseService"
import * as UserService from "../../services/UserService"
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Provider, useDispatch, useSelector } from 'react-redux'
import {store} from "../../redux/store"
import { updateUser } from '../../redux/slices/userSlide'
import { jwtDecode } from "jwt-decode";
import { updateAddress } from "../../redux/slices/orderSlide";
import { updateWarehouse } from "../../redux/slices/warehouseSlide";
import Loading from "../../components/spin";
import {  toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import {
    Input,
    Ripple,
    initTE,
} from "tw-elements";
import { message } from "antd";

initTE({ Input, Ripple });
const queryClient = new QueryClient();
function Dangnhap(){
 const location = useLocation()
  const dispatch = useDispatch();
 const user  = useSelector((state) => state.user)
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleOnchangeEmail = (value) => {
    setEmail(value.target.value)
    }
    const handleOnchangePassword = (value) => {
        setPassword (value.target.value)
    }
    const mutation = useMutationHooks(
    data => UserService.loginUser(data)
      )
      const { data, isLoading, isSuccess, isError} = mutation;
      useEffect(() => {
        if(data?.status === 'ERR') return
        else if(data?.status === 'OK') {
          if(location?.state) {
            navigate(location?.state)
          }else {
            message.success("Đăng nhập thành công")
            navigate("/")
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
          }
          
          if (data?.access_token) {
            const decoded = jwtDecode(data?.access_token)
            console.log(decoded)
            if (decoded?.id) {
              handleGetDetailsUser(decoded?.id, data?.access_token)
            }
          }

        }
      }, [isSuccess,isError])
      const handleGetDetailsUser = async (id, token) => {
        const storage = localStorage.getItem('refresh_token')
        const refreshToken = JSON.parse(storage)
        const res = await UserService.getDetailsUser(id, token)
        console.log("test res",res)
        dispatch(updateUser({ ...res?.data, access_token: token,refreshToken }))

        const reswh= await WarehouseService.getAllElement()
        console.log("resApp dang tai diaj chi", reswh.data)
        dispatch(updateWarehouse({elements:reswh.data}))
        dispatch(updateAddress({fullName: res.data.name, address: res.data.address, phone: res.data.phone, city: res.data.city }))
      }



   const handleSignIn=()=>{
    mutation.mutate({
      email,
      password
  })
 
   }
  const  handleSignUp= ()=>{
    
    navigate("/signup")

    }
        return(
         


<Provider store={store}>

            <QueryClientProvider client={queryClient} contextSharing={true}>

                <Navbar/>
            <div className="container max-w-7xl mx-auto">
                <section class="gradient-form h-full bg-neutral-200 dark:bg-neutral-700">
  <div class="container h-full p-10">
    <div
      class="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
      <div class="w-full">
        <div
          class="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
          <div class=" ">
            <div class="px-4 md:px-0">
              <div class="md:mx-6 md:p-12">
                <div class="text-center">
                  <h1 className="text-5xl font-bold text-orange-500">GoFoods</h1>
                  <h4 class="mb-12 mt-1 pb-1 text-xl font-semibold">
                    Đăng nhập
                  </h4>
                </div>

                <form className="w-[50%] mx-auto">
                  <p class="mb-4">Hãy điền thông tin tài khoản của bạn</p>
                  <div class="relative mb-4" >
                  <label
                      for="exampleFormControlInput1"
                      >Email
                    </label>
                    <input onChange={handleOnchangeEmail}
                      type="text"
                      class="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                      id="exampleFormControlInput15"
                      placeholder="email" />
                    
                  </div>

                  <div class="relative mb-4" >
                    <label
                      for="exampleFormControlInput11"
                      >Password
                    </label>
                    <input onChange={handleOnchangePassword}
                      type="password"
                      class="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                      id="exampleFormControlInput151"
                      placeholder="Password" />
                  </div>
                  {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                  <div class="mb-12 pb-1 pt-1 text-center">
                    <Loading isLoading={isLoading}>

                    <button onClick={handleSignIn}
                      class="mb-3 inline-block w-full bg-slate-300 rounded px-6 pb-2 pt-2.5 text-1xl font-medium uppercase leading-normal shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                      type="button"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      >
                      Đăng nhập
                    </button>
                    </Loading>

                  </div>

                  <div class="flex justify-stretch items-center text-center pb-6">
                    <span class="mb-0 mr-2">Bạn chưa có tài khoản?</span>
                    <button onClick={handleSignUp}
                      type="button"
                      class="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-1xl font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                      >
                      Đăng ký
                    </button>
                  </div>
                </form>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
            </div>
        </QueryClientProvider>
        </Provider>


        )
        
        }
        
export default Dangnhap;