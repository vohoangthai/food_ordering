import React, {useRef} from 'react';
import BikeDelivery from '../img/delivery.png'
import HeroBg from '../img/heroBg.png'
import F1 from '../img/r2.png'
import F2 from '../img/i1.png'
import F3 from '../img/c3.png'
import F4 from '../img/cu2.png'
import '../main-hotproduct.css'
import { useNavigate } from 'react-router';

const TopAds = ()=> {
     var type = ["Cơm Trưa", "Combo Bán Chạy", "Gà Ngon GoFoods", "Tráng Miệng"]
    const ref = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const navigate = useNavigate()

    const handleNavigatetype = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
      }

   const mouseOutProduct=()=>{
    ref.current.style.animation = "hidebutton 0.6s alternate both";
          
    
    
      }
    const mouseInProduct=()=>{
    
        ref.current.style.animation = "showbutton 0.6s alternate both";
        ref.current.style.display = "block"
    
    
    
      }
      const mouseOutProduct2=()=>{
        ref2.current.style.animation = "hidebutton 0.6s alternate both";
              
        
        
          }
        const mouseInProduct2=()=>{
        
            ref2.current.style.animation = "showbutton 0.6s alternate both";
            ref2.current.style.display = "block"
        
        
        
          }
          const mouseOutProduct3=()=>{
            ref3.current.style.animation = "hidebutton 0.6s alternate both";
                  
            
            
              }
            const mouseInProduct3=()=>{
            
                ref3.current.style.animation = "showbutton 0.6s alternate both";
                ref3.current.style.display = "block"
            
            
            
              }

              const mouseOutProduct4=()=>{
                ref4.current.style.animation = "hidebutton 0.6s alternate both";
                      
                
                
                  }
                const mouseInProduct4=()=>{
                
                    ref4.current.style.animation = "showbutton 0.6s alternate both";
                    ref4.current.style.display = "block"
                
                
                
                  }
        return(

        
        <div className='grid border-x-transparent border-x-8 my-6 grid-cols-2 gap-2 w-100%'>
            <div className=' flex-1 flex flex-col items-start '>
                <div className='flex items-center gap-2 justify-center bg-orange-100 px-3 py-2 rounded-full'>
                    <p className=' text-orange-400 font-medium text-[1.2rem]'>
                        Giao hàng tận nơi
                    </p>
                    <div className='w-10 h-10 bg-white rounded-full overflow-hidden'>
                        <img src={BikeDelivery} className='w-full h-full object-contain' alt="bike" />
                    </div>
                    
                </div>
                <p className='tracking-wide lg:text-[4rem] text-[3rem] font-bold'>Giao đồ ăn nhanh nhất hiện nay <br></br><span className='text-orange-500'>tại Cần Thơ</span></p>
                <p className='text-base my-6 '>Hệ thống cửa hàng cung cấp thức ăn trên nền tảng trực tuyến với dịch vụ giao hàng nhanh nhất đã có mặt tại Cần Thơ
            . Thời gian của bạn là quý báu, hãy để chúng tôi phục vụ bạn nhanh chóng và chu đáo nhất.</p>
                <a onClick={() => handleNavigatetype(type[0])}   className='p-3 text-xl cursor-pointer rounded-lg hover:text-2xl transition-all bg-orange-500 text-white font-medium'>Đặt món ngay!</a>
            <h1 className='mt-5 text-lg font-medium'>Hoặc gọi vào số 0931746413 để được hỗ trợ nhanh nhất!</h1>

            </div>
            <div className=' flex-1 flex relative'>
                <img className='w-full h-[420px] ml-auto lg:h-[650px] lg:w-auto'
                 src={HeroBg} alt="bg" />
                 <div className=' px-28 py-8 absolute h-full w-full top-0 left-0 grid grid-cols-2 gap-10 '>
                    <div onClick={() => handleNavigatetype(type[0])} onMouseOver={mouseInProduct} onMouseLeave={mouseOutProduct} className='overflow-hidden w-[190px] h-[190px] p-4 relative flex-1  rounded-3xl shadow-xl backdrop-blur-md flex cursor-pointer flex-col justify-center items-center'>
                        <img src={F1} alt="" className='w-40 '/>
                         <p className='mt-auto font-bold mb-4'>Cơm trưa</p>
                            <div ref={ref} className='bg-orange-400 rounded-md items-center p-4 text-center text-white font-bold w-[190px] h-[60px] absolute -bottom-10 hidden left-0 ' id='f1'>THỬ NGAY</div>
                                  </div>
                    <div onClick={() => handleNavigatetype(type[3])}  onMouseOver={mouseInProduct2} onMouseLeave={mouseOutProduct2} className='overflow-hidden w-[190px] h-[190px] p-4 relative flex-1  rounded-3xl shadow-xl backdrop-blur-md flex cursor-pointer flex-col justify-center items-center'>
                        <img src={F2} alt="" className='w-40 '/>
                         <p className='mt-auto font-bold mb-4'>Tráng miệng</p>
                            <div ref={ref2} className='bg-orange-400 rounded-md items-center p-4 text-center text-white font-bold w-[190px] h-[60px]  absolute -bottom-10 hidden left-0 ' id='f2'>THỬ NGAY</div>
                                 </div>
                    <div onClick={() => handleNavigatetype(type[1])} onMouseOver={mouseInProduct3} onMouseLeave={mouseOutProduct3} className='overflow-hidden w-[190px] h-[190px] p-4 relative flex-1  rounded-3xl shadow-xl backdrop-blur-md flex cursor-pointer flex-col justify-center items-center'>
                        <img src={F3} alt="" className='w-40 '/>
                         <p className='mt-auto font-bold mb-4'>Combo bán chạy</p>
                            <div ref={ref3} className='bg-orange-400 rounded-md items-center p-4 text-center text-white font-bold w-[190px] h-[60px]  absolute -bottom-10 hidden left-0 ' id='f3'>THỬ NGAY</div>
                                    </div>
                    <div onClick={() => handleNavigatetype(type[2])} onMouseOver={mouseInProduct4} onMouseLeave={mouseOutProduct4} className='overflow-hidden w-[190px] h-[190px] p-4 relative flex-1  rounded-3xl shadow-xl backdrop-blur-md flex cursor-pointer flex-col justify-center items-center'>
                        <img src={F4} alt="" className='w-40 '/>
                         <p className='mt-auto font-bold mb-4'>Gà ngon Gofoods</p>
                            <div ref={ref4} className='bg-orange-400 rounded-md items-center p-4 text-center text-white font-bold w-[190px] h-[60px]  absolute -bottom-10 hidden left-0 ' id='f4'>THỬ NGAY</div>
                                    </div>
                 </div>

            </div>
        </div>)
    
}
export default TopAds;