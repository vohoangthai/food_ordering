import { Button, Form, Select, Space, Input } from 'antd'
import { PlusOutlined, DeleteOutlined,PlusCircleOutlined, EditOutlined, SearchOutlined,PlusSquareTwoTone } from '@ant-design/icons'
import React, { useRef } from 'react'
import { WrapperHeader, WrapperUploadFile } from './Adproductstyle'
import TableNonDLComponent from '../../../components/TableNonDLComponent'
import { useState } from 'react'
import InputComponent from '../../../components/InputComponent'
// import { getBase64, renderOptions } from '../../../utils'k
import * as WarehouseService from '../../../services/WarehouseService'
import { useMutationHooks } from '../../../hooks/useMutationHook'
import Loading from '../../../components/spin'
import { useEffect } from 'react'
import * as message from './Message'
import { useQuery , useQueryClient } from 'react-query'
import DrawerComponent from '../../../components/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../../../components/ModalComponent'

const AdminWarehouse = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);
  
  const [stateElement, setStateElement] = useState({
    name: '',
    weight: 0,
  })
  const [stateElementDetails, setStateElementDetails] = useState({
    name: '',
    weight: 0,
  })
  const [weightIn, setWeightIn] = useState(0);


  const [form] = Form.useForm();

  const mutation = useMutationHooks(
    (data) => {
      const { name,
        weight: weight } = data
      const res = WarehouseService.createElement({
        name,
        weight
      })
      return res
    }
  )
  
  
  const mutationUpdateEl = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = WarehouseService.updateElement(
        id,
        token,
        { ...rests })
      return res
    },
  )

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = WarehouseService.deleteElement(
        id,
        token)
      return res
    },
  )
 
 

  const getAllElemnts = async () => {
    const res = await WarehouseService.getAllElement()
    return res
  }

  const fetchGetDetailsElement = async (id) => {
    const res = await WarehouseService.getDetailsElement(id)
    if (res?.data) {
      setStateElementDetails({
        name: res?.data?.name,
        weight: res?.data?.weight
        
      
      })
    }
    setIsLoadingUpdate(false)
  }

  useEffect(() => {
    if(!isModalOpen) {
      form.setFieldsValue(stateElementDetails)
    }else {
      form.setFieldsValue({
        name: '',
        weight: '',
      })
    }
  }, [form, stateElementDetails, isModalOpen])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
        
        setIsLoadingUpdate(true)
        fetchGetDetailsElement(rowSelected)
      }
    
  }, [rowSelected, isOpenDrawer])

  const handleDetailsElemnt = () => {
    setIsOpenDrawer(true)
    setWeightIn(0)
  }

//   const handleDelteManyProducts = (ids) => {
//     mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
//       onSettled: () => {
//         queryElement.refetch()
//       }
//     })
//   }

  

  const { data, isLoading, isSuccess, isError } = mutation
  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdateEl
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
//   const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany


  const queryElement = useQuery({ queryKey: ['warehouses'], queryFn: getAllElemnts})
//   const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
  const {isLoading: isLoadingElements, data: elements } = queryElement
  
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <PlusCircleOutlined style={{ color: '#ea8500', fontSize: '30px', cursor: 'pointer', marginLeft:"10px" }} onClick={handleDetailsElemnt} />
      </div>
    )
  }


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    
    {
      title: 'Weight',
      dataIndex: 'weight',
      sorter: (a, b) => a.weight - b.weight,
      filters: [
        {
          text: '>= 100',
          value: '>=',
        },
        {
          text: '<= 100',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return Number(record.weight) >= 100
        }
        return Number(record.weight) <= 100
      },
    },
    {
      title: 'Đơn vị',
      dataIndex: 'donvi',
      
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    }
  ];
  const dataTable = elements?.data?.length && elements?.data?.map((element) => {
    return { ...element, key: element._id , donvi:"KG"}
  })

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])

//   useEffect(() => {
//     if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
//       message.success()
//     } else if (isErrorDeletedMany) {
//       message.error()
//     }
//   }, [isSuccessDelectedMany])

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateElementDetails({
      name: '',
      weight: 0
     
    })
    form.resetFields()
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }


  const handleDeleteElement = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryElement.refetch()
      }
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateElement({
      name: '',
      weight: ''
      
    })
    form.resetFields()
  };

  const finishAdd = () => {
    const params = {
      name: stateElement.name,
      weight: stateElement.weight

      
    }
    console.log("params",params)

    mutation.mutate(params, {
      onSettled: () => {
        queryElement.refetch()
      }
    })
  }

  const handleOnchange = (e) => {
    console.log("value", e.target.value)
    setStateElement({
      ...stateElement,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetails = (e) => {
    
    setWeightIn(Number(e.target.value) + stateElementDetails.weight)
    console.log("valuesss", typeof(weightIn))
  }
  

//   const handleOnchangeAvatar = async ({ fileList }) => {
//     const file = fileList[0]
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setStateElement({
//       ...stateElement,
//       image: file.preview
//     })
//   }

//   const handleOnchangeAvatarDetails = async ({ fileList }) => {
//     const file = fileList[0]
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setStateElementDetails({
//       ...stateElementDetails,
//       image: file.preview
//     })
//   }
  const onUpdateElement = () => {
    if(weightIn==0 || typeof(weightIn)==String){
      
      return;
    }
console.log("sau khi setweight",weightIn)
    mutationUpdateEl.mutate({ id: rowSelected, token: user?.access_token, name:stateElementDetails.name, weight: weightIn}, {
      onSettled: () => {
        queryElement.refetch()
      }
    })
  }

//   const handleChangeSelect = (value) => {
//       setStateElement({
//         ...stateElement,
//         type: value
//       })
//   }

  return (
    <div>
      <WrapperHeader>Quản lý Kho</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusSquareTwoTone className='text-6xl text-orange-600' twoToneColor="#f57505" /></Button>
      </div>
      <div style={{ marginTop: '20px' }}>
         <TableNonDLComponent  columns={columns} isLoading={isLoadingElements}  data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <ModalComponent forceRender title="Thêm nguyên liệu" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Loading isLoading={isLoading}>

          <Form
            name="addElement"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 18 }}
            onFinish={finishAdd}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên nguyên liệu"
              name="name"
              rules={[{ required: true, message: 'Please input name!' }]}
            >
              <InputComponent value={stateElement.name} onChange={handleOnchange} name="name" />
            </Form.Item>

           
            <Form.Item
              label="Trọng lượng"
              name="weight"
              rules={[{ required: true, message: 'Please input weight!' }]}
            >
              <InputComponent value={stateElement.weight} onChange={handleOnchange} addonAfter="Kg" name="weight" />
            </Form.Item>
           
            {/* <Form.Item
              label="Image"
              name="image"
              
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button >Select File</Button>
                {stateElement?.image && (
                  <img src={stateElement?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item> */}
            <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Thêm nguyên liệu
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent title='Nhập thêm nguyên liệu' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="60%">

          <Form
            name="nguyenlieu"
            labelCol={{ span: 6}}
            wrapperCol={{ span: 10 }}
            onFinish={onUpdateElement}
            form={form}          >
            <Form.Item>

            <h2 className='text-lg font-medium'>Tên nguyên liệu: <span className='text-orange-600'>{stateElementDetails.name}</span></h2>
            <h2 className='text-lg font-medium'>Trọng lượng hiện tại: {stateElementDetails.weight}Kg</h2>
            </Form.Item>

            <Form.Item
              name="weightnl"
              

            >
              <p className='text-lg'>Trọng lượng nhập thêm:</p>
              <InputComponent type='number' addonAfter="Kg" onChange={handleOnchangeDetails} name="weightnl" />
            </Form.Item>
           
            {/* <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your count image!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button >Select File</Button>
                {stateElementDetails?.image && (
                  <img src={stateElementDetails?.image} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item> */}
            <Form.Item>
              <button className='w-36 border-orange-600 border-[1px] rounded-md text-lg hover:text-white h-8 text-orange-500  hover:bg-orange-500' loading={isLoadingUpdated}  type="submit">
             Thêm
              </button>
            </Form.Item>
          </Form>
      </DrawerComponent>
      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteElement}>
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa nguyên liệu này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminWarehouse