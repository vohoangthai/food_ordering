import React from "react";
import { useNavigate } from "react-router";
import Navbar from "../../navbar";
import { useState, useEffect } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService"
import {  toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import Loading from "../../components/spin";
// Initialization for ES Users
import {
    Input,
    Ripple,
    initTE,
  } from "tw-elements";
import { message } from "antd";
  
  initTE({ Input, Ripple });
function Dangky(){

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassWord] = useState("");
  const handleOnchangeEmail = (value) => {
    setEmail(value.target.value)
    }
    const handleOnchangePassword = (value) => {
        setPassword (value.target.value)
    }
    const handleOnchangeConfirrmPassword = (value) => {
      setconfirmPassWord (value.target.value)
    }
    const mutation = useMutationHooks(
      data => UserService.signupUser(data)
      )
      const { data, isLoading, isSuccess, isError} = mutation;
      console.log("data", data)
      const handleSignUp = () => {
        mutation.mutate({
          email,
          password,
          confirmPassword
        })
    
      }
      useEffect(()=>{
        if(data?.status === 'ERR') return
        else if(data?.status === 'OK'){
          message.success("Tạo tài khoản thành công!");
         navigate("/signin");

        }
        
      },[isSuccess, isError])
      const navigate = useNavigate();
  const handleSignIn = ()=>{
    navigate("/signin")
  }
    
        return(
          <div>

          <Navbar></Navbar>
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
                    Đăng ký
                  </h4>
                </div>

                <form className="w-[50%] mx-auto">
                  <p class="mb-4">Hãy tạo thông tin tài khoản của bạn</p>
                  <div class="relative mb-4" >
                  <label
                      for="exampleFormControlInput1"
                      >Email
                    </label>
                    <input onChange={handleOnchangeEmail}
                      type="email"
                      class="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                      id="exampleFormControlInput1"
                      placeholder="Username" />
                    
                  </div>

                  <div class="relative mb-4" >
                    <label
                      for="exampleFormControlInput11"
                      >Password
                    </label>
                    <input onChange={handleOnchangePassword} required
                      type="password"
                      class="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                      id="exampleFormControlInput11"
                      placeholder="Password" />
                  </div>
                  <div class="relative mb-4" >
                    <label
                      for="exampleFormControlInput12"
                      >Confirm password
                    </label>
                    <input onChange={handleOnchangeConfirrmPassword} required
                      type="password"
                      class="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                      id="exampleFormControlInput12"
                      placeholder="Confirm password" />
                  </div>
                  {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                  <div class="mb-12 pb-1 pt-1 text-center">
               <Loading isLoading={isLoading}>
                    <button onClick={handleSignUp}
                      class="mb-3 inline-block w-full bg-slate-300 rounded px-6 pb-2 pt-2.5 text-1xl font-medium uppercase leading-normal shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                      type="button"
                      >
                      Đăng ký
                    </button>

               </Loading>


                  </div>

                  <div class="flex justify-stretch items-center text-center pb-6">
                    <span class="mb-0 mr-2">Bạn đã có tài khoản?</span>
                    <button onClick={handleSignIn}
                      type="button"
                      class="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-1xl font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                      data-te-ripple-init
                      data-te-ripple-color="light">
                      Đăng nhập
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
          </div>
        )
    }

export default Dangky;