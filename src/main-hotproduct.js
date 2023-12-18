import ReactDOM, { render } from "react-dom";
import React, { Component } from "react";
import "./main-hotproduct.css"
class MainHotproduct extends React.Component{
    ar = new Array(
    { pdimg: "https://preview.colorlib.com/theme/ashion/img/product/product-2.jpg",
        name: "Cotton jacket",
        price: "350000",
        star: '4.5'},
        { pdimg: "https://preview.colorlib.com/theme/ashion/img/product/product-2.jpg",
        name: "Cotton jacket",
        price: "350000",
        star: '4.5'},
        { pdimg: "https://preview.colorlib.com/theme/ashion/img/product/product-2.jpg",
        name: "Cotton jacket",
        price: "350000",
        star: '4.5'},
        { pdimg: "https://preview.colorlib.com/theme/ashion/img/product/product-2.jpg",
        name: "Cotton jacket",
        price: "350000",
        star: '4.5'},
        { pdimg: "https://preview.colorlib.com/theme/ashion/img/product/product-2.jpg",
        name: "Cotton jacket",
        price: "350000",
        star: '4.5'},
        { pdimg: "https://preview.colorlib.com/theme/ashion/img/product/product-2.jpg",
        name: "Cotton jacket",
        price: "350000",
        star: '4.5'},
  );
    mouseOutProduct=(index)=>{
      console.log(index)
        var check = document.getElementById(`check-${index}`);
        var add = document.getElementById(`add-${index}`);

       check.style.animation = "hidebutton 0.6s alternate both";
        
        add.style.animation = "hidebutton 0.6s alternate both 0.3s";


    }
    mouseInProduct=(index)=>{

        var check = document.getElementById(`check-${index}`);
        var add = document.getElementById(`add-${index}`);
        check.style.animation = "showbutton 0.6s alternate both";
        check.style.display = "block"

        add.style.animation = "showbutton 0.6s alternate both 0.3s";
        add.style.display = "block"


    }

    render(){

        return(
            <div>
                <span className="text-2xl font-medium">HOT PRODUCT</span>
                <div className="grid md:grid-cols-5 grid-flow-cols gap-4 sm:grid-cols-3 ">
                   {
                    this.ar.map((value,index) =>(

                           <div key={index+1} onMouseOver={()=> this.mouseInProduct(index+1)} onMouseLeave={()=> this.mouseOutProduct(index+1)}  className="md:w-full h-82 overflow-hidden text-center product-container ">
                            <a href="#">

                            <img className="object-cover w-full h-64 " src={value.pdimg}/>
                            <h3 className="font-thin">{value.name}</h3>
                            <span className="font-thin text-[0.8rem]">{value.star}</span>
                            <h3 className="font-medium text-red-600">{value.price}đ</h3>
                            </a>
                            <div className="product-check "  id={`check-${index+1}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    class="h-5 w-5">
                                    <path
                                    fill-rule="evenodd"
                                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                    clip-rule="evenodd" />
                                </svg>
                            </div>
                                 <div className="product-add" id={`add-${index+1}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                                    </svg>
                                </div>
                        </div>
                        ))
                   }





                </div>
            </div>
        )
    }
}

export default MainHotproduct;