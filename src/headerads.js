import img from "./img/jade-aucamp-Kj6LgGceZ4M-unsplash(1)_preview_rev_1.png"
import './App.css';
import './navbar.css'
import React from 'react';
function HeaderAds(){
return(

<div className='bg-amber-200 grid grid-cols-2 gap-3 max-w-7xl mx-auto mt-2'>
<div className=' w-full  '>
    <h1 className='ml-10 text-center mt-10 navbar-ads-title  text-rose-950 text-5xl'>NEW COLlECTION THIS autumn</h1>
    <h2 className='mt-10 text-center text-4xl'>sale</h2>
    <h1 className='text-center text-9xl font-medium'>20%</h1>
    <p className='text-neutral-50 text-center text-2xl bg-red-400'>Release date 01/08/2023</p>
    <p className='text-center text-1xl'>Discount for the first 7 days 
        {" (01-07/08/2023)"}
    </p>

</div>
<div className='grid  w-full '>
    <img className='ml-10 w-3/5' src={img}></img>
</div>
</div>
)
}
export default HeaderAds;