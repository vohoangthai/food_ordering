import React from "react";
import Category from "./category";
import TopAds from "./components/topads";
import MainHotproduct from "./main-hotproduct";
function Main(){
    return(
        <main className="container max-w-7xl mx-auto">
            {/* <Category></Category> */}
            <TopAds></TopAds>
            {/* <MainHotproduct/> */}
        </main>
    )
}


export default Main;