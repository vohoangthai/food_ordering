import { axiosJWT } from "./UserService"
import axios from "axios"


// export const createProduct = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
//   return res.data
// // }
// http://localhost:3001/api/order/get-order-details/639724669c6dda4fa11edcde
export const createOrder = async (data,access_token) => {
  const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create/${data.user}`, data, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getOrderByUserId = async (id,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}
export const getMonthRevenue = async (month,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-revenue/${month}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getDetailsOrder = async (id,access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}
export const updateOrder = async (id, access_token, data) => {
  const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update/${id}`, data, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}


export const cancelOrder = async (id, access_token, orderItems, userId ) => {
  const data = {orderItems, orderId: id}
  const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${userId}`, {data}, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getAllDateOrder = async () => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-date-order`)
  return res.data
}

export const getAllOrder = async (access_token) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
      headers: {
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}