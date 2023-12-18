import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({ title = 'Modal', isOpen = false, children, zIndex, ...res}) => {
    return (
       
        <Modal title={title} open={isOpen} zIndex={zIndex} {...res}>
            {children}
        </Modal>

       
    )
}

export default ModalComponent