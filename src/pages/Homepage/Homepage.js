import Navbar from "../../navbar";
import Main from "../../main";
import Footer from "../../footer";
import HeaderAds from "../../headerads";

function Homepage(){
    return(
        <div>
            <Navbar/>
            {/* <HeaderAds/> */}
            <Main/>
            <Footer/>

        </div>
    )
}
export default Homepage;