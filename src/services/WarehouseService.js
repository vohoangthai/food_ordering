import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllElement = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/warehouse/get-all-element?filter=name&filter=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/warehouse/get-all-element?limit=${limit}`)
    }
    return res.data
}



export const createElement = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/warehouse/create-element`, data)
    return res.data
}

export const getDetailsElement = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/warehouse/get-details-element/${id}`)
    return res.data
}

export const updateElement = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/warehouse/update-element/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteElement = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/warehouse/delete-element/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

// export const deleteManyElement = async (data, access_token,) => {
//     const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, data, {
//         headers: {
//             token: `Bearer ${access_token}`,
//         }
//     })
//     return res.data
// }

// export const getAllTypeElement = async () => {
//     const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`)
//     return res.data
// }