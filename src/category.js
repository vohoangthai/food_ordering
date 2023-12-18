import React from "react";

function Category(){
    return(
        <ul className="py-5 flex justify-between mx-auto">
            <li className="w-[32%] h-20 text-center bg-teal-100 pt-2 text-2xl">
            <a href="#" className=" w-full h-full block  ">
                Men's
            </a>
            </li >
            <li className="w-[32%]  text-center bg-pink-200 pt-2 text-2xl">
            <a href="#" className=" w-full h-full block ">
                Women's
                <img src=""></img>
            </a>
            </li>
            <li className="w-[32%] text-center bg-lime-200 pt-2 text-2xl">
            <a href="#" className=" w-full h-full block ">
                Accessories
            </a>
            </li>
            
        </ul>
    )
}

export default Category;