import React from "react";
import ClockCountdown from "./clock-countdown";
import "./sale-event.css" 
class SaleEvent extends React.Component{


render(){
    return(
        <div>
                <span className="text-2xl font-medium mt-4 block">SỰ KIỆN VÀ KHUYẾN MÃI</span>
                <div className="w-full grid grid-cols-2 gap-4 h-80">
                    <div>
                        <h1 className="uppercase  text-2xl py-2">title</h1>
                        <div className=" w-full h-full hours-discount relative overflow-hidden">
                            <div className="uppercase h-24 text-6xl font-bold mt-10 text-white text-center p-6">ƯU ĐÃI GIỜ VÀNG</div>
                            <div className= "h-full">
                                <p className="text-white text-3xl text-center font-medium">Các sản phẩm giảm giá lên đến 50%</p>
                                <div className="mt-10">

                                <ClockCountdown/>
                                </div>

                            </div>
                                <div className="bg-red-500 text-white font-bold text-3xl absolute sale-label">sale</div>
                        </div>
                    </div>
                    <div className="">
                        <h1 className="uppercase text-2xl py-2">title</h1>
                        <div className="open-event w-full h-full relative">
                            <h1 className=" text-3xl  uppercase text-center font-medium pt-4 text-white">Khai truong chi nhanh tai can tho</h1>
                            <h3 className="text-4xl mt-2 text-center text-blue-800 font-bold">Giam den</h3>
                            <h3 className="text-9xl text-center text-blue-800 font-bold">30%</h3>
                            <p className="text-3xl text-white font-medium bg-blue-600 text-center uppercase pt-1 ">uu dai tu 15 - 20/10/2023</p>
                        </div>

                    </div>

                </div>


        </div>
    )
}    
}

export default SaleEvent;