import Homepage from "../pages/Homepage/Homepage"
import Productpage from "../pages/Productpage/Productpage"
import Dangky from "../pages/Dangky/Dangky"
import Dangnhap from "../pages/Dangnhap/Dangnhap"
import AdminPage  from  '../pages/Adminpage/Adpage'
import NotFoundPage from "../pages/NotfoundPage/NotFoundPage"
import ProfilePage from "../pages/Profilepage/ProfilePage"
import PaymentPage from "../pages/PaymentPage/PaymentPage"
import OrderSucess from "../pages/OrderSuccess/OrderSuccess"
import MyOrderPage from "../pages/MyOrder/MyOrder"
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage"
import ManagerPage from "../pages/Adminpage/Managerpage"
import EmployeePage from "../pages/Adminpage/Employeepage"
import AboutPage from "../pages/About/Abount"
export const routes = [
    {
        path: "/product/:type",
        element: Productpage
    },
    {
        path: "/",
        element: Homepage
    },
    {
        path: "/signin",
        element: Dangnhap
    },
    {
        path: "/signup",
        element: Dangky
    },
    {
        path: "/system/admin",
        element: AdminPage,
        isPrivated: true
    },
    {
        path: "/abount",
        element: AboutPage,
    },
    {
        path: "/system/manager",
        element: ManagerPage,
        isPrivated: true
    },{
        path: "/system/employee",
        element: EmployeePage,
        isPrivated: true
    },
    {
        path: '/profile-user',
        element: ProfilePage
    },
    {
        path: '*',
        element: NotFoundPage
    },
    {
        path: '/payment',
        element: PaymentPage
    }, 
    {
        path: "/orderSuccess",
        element: OrderSucess
    },
    {
        path: '/my-order',
        element: MyOrderPage
    },
    {
        path: '/details-order/:id',
        element: DetailsOrderPage,
    }

]
