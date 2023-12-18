import React from 'react'
import Navbar from '../../navbar'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../components/ButtonComponent'
import InputForm from '../../components/InputForm'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/spin'
import * as message from '../../pages/Adminpage/components/Message'
import { updateUser } from '../../redux/slices/userSlide'
import { Button, Upload } from 'antd'
import { UploadOutlined} from '@ant-design/icons'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )

    const dispatch = useDispatch()
    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })

    }
    return (
        <div>

        <Navbar></Navbar>
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader className='text-orange-500 text-xl'>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor="name">Tên</WrapperLabel>
                        <InputForm style={{ width: '400px' }} id="name" value={name} onChange={handleOnchangeName} />
                      
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm style={{ width: '400px' }} id="email" value={email} onChange={handleOnchangeEmail} />
                      
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="phone">Số điện thoại</WrapperLabel>
                        <InputForm style={{ width: '400px' }} id="email" value={phone} onChange={handleOnchangePhone} />
                        
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="avatar">Ảnh đại diện</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar"/>
                        )}
                        {/* <InputForm style={{ width: '300px' }} id="avatar" value={avatar} onChange={handleOnchangeAvatar} /> */}
                      
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
                        <InputForm style={{ width: '400px' }} id="address" value={address} onChange={handleOnchangeAddress} />
                      
                    </WrapperInput>
                    <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px',
                                margin:"auto"
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: '#fa610f', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                </WrapperContentProfile>
            </Loading>

        </div>
        
        </div>
    )
}

export default ProfilePage