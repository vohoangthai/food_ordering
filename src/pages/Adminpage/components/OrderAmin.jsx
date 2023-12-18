import { Button, Form, Space, Select, Input, Popconfirm, Table, Typography } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperUploadFile } from './Adproductstyle'
import InputComponent from '../../../components/InputComponent'
import Loading from '../../../components/spin'
import { convertPrice, getBase64,renderOptions } from '../../../utils'
import { useEffect, useState } from 'react'
import * as message from './Message'
import { useLocation} from 'react-router-dom';
import ModalComponent from '../../../components/ModalComponent'
import TableNonDLComponent from '../../../components/TableNonDLComponent'
import * as OrderService from '../../../services/OrderService'
import { useQuery } from 'react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined,FormOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../../contant'
import dayjs from 'dayjs'
import { useMutationHooks } from '../../../hooks/useMutationHook';
import { isCancel } from 'axios'



const OrderAdmin = () => {
  const [rowSelected, setRowSelected] = useState('')

  const location = useLocation()
  const { state } = location
  const handleChange = (value) => {
    console.log(`selected ${value}`, typeof(value));
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateElement, setStateElement] = useState({id:'',
  reasion: '',
  status: false,
  ispaid: false
  })
 

  useEffect(() => {
    if (rowSelected && isModalOpen) {
       var temp= orders?.data.find(el=>el._id==rowSelected)
console.log("bien nayneyyyyyyyyyyyyyyyyy",temp)
if(temp.isCancel===1){
  setStateElement(
    {id: temp._id,
    reasion: '',
    status : temp.isCancel,
  ispaid: temp.isPaid}
  
  )
}else if(temp.isCancel===0){
  setStateElement(
    {id: temp._id,
    reasion: "",
    status : temp.isDelivered,
    ispaid: temp.isPaid}
  
  )
console.log(stateElement)

}
        
      }
    
  }, [rowSelected, isModalOpen])

const handleCancel = () => {
  setIsModalOpen(false);
  setStateElement({
    id:'',
    reasion: '',
    status: false,
    ispaid: false
    
  })
  form.resetFields()
};
const changstatus = (value)=>{
  console.log(value)
  setStateElement({
    ...stateElement,
    status: value
  })
}
const handleOnchange = (e) => {
    setStateElement({
      ...stateElement,
      [e.target.name]: e.target.value
    })
  
}

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = 
      // <Input onChange={handleChange}></Input>
   <Select 
    name={dataIndex}
    style={{ width: 150 }}
    onChange={handleChange}
  defaultValue={{
  label: "Chua giao",
      value: " Chua giao "
  }}
    options={[{
      label: "Chua giao",
      value: " Chua giao "
    },{
      label: "Da giao",
      value: " Da giao "
    }
  ]}
  

    /> 
  
  ;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };


  const user = useSelector((state) => state?.user)
  console.log("Check USER",user)

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }
  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isLoading: isLoadingOrders, data: orders } = queryOrder
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = OrderService.updateOrder(
        id,
        token,
        { ...rests })
      return res
    },
  )
  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  // const onUpdateOrder = (id) => {
  //   mutationUpdate.mutate({ id: id, token: user?.access_token, isDelivered: true, isPaid: true }, {
  //     onSettled: () => {
  //       queryOrder.refetch()
  //     }
  //   })
  // }
 
 const finishUpdate = ()=>{
  console.log("stateElement", stateElement)

  
  mutationUpdate.mutate({ id: stateElement.id, token: user?.access_token, isDelivered: stateElement.status===1 ? false:true , isPaid: stateElement.status===1 ? stateElement.ispaid : true , isCancel: stateElement.status===1? 1 : 0, cancelReason: stateElement.status===1 ? stateElement.reasion : ''}, {
    onSettled: () => {
      queryOrder.refetch()
    }
  })
  setIsModalOpen(false)
 }
 const handleOrderinfor = (items, price, note)=>{
  return <div>
  <ul>

  { items.map((crr)=>{
    return <li>
{crr.name} x {crr.amount} = {convertPrice(crr.amount*crr.price)}
    </li>

  
 })}
  </ul>
  
     Tổng: <span className='text-orange-600'>{convertPrice(price)}</span>
     {note!=''? <p>Ghi chú: {note}</p>:null}
   </div>
  
 }
  const originData = orders?.data?.length && orders?.data?.map((order) => {
    console.log(order)
    
    return {_id:order._id, isDelivered: order.isDelivered, day: order.shippingTime.date, key: order._id, time:order.shippingTime.time ,customer: `${order.shippingAddress.fullName} - ${order.shippingAddress.phone} - ${order.shippingAddress.address}`,
    status: <div><div id={order._id}>{order.isCancel===1? <p className='text-red-600'>Đơn hàng đã bị hủy</p>: <p name="status">{order.isDelivered? "Đã giao hàng":"Chưa giao hàng"}</p>}{order?.cancelReason?.length>1 ?<p>*{order.cancelReason}</p>:null}</div></div>     ,orderinfor: handleOrderinfor(order.orderItems, order.totalPrice, order.note)  , payment: <div><p>{orderContant.payment[order?.paymentMethod]}</p><p className='text-orange-500'>{order.isPaid ? "Đã thanh toán":'Chưa thanh toán'}</p></div>}
  })
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  useEffect(()=>{
     setData(originData)
  },[isLoadingOrders])
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      time: '',
      customer: '',
      payment:'',
      status: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  // const save = async (key) => {
  //   try {
  //     const row = await form.validateFields();
  //     console.log("keyyyy", typeof(key))
  //     onUpdateOrder(key)
  //     const newData = [...data];
  //     const index = newData.findIndex((item) => key === item.key);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, {
  //         ...item,
  //         ...row,
  //       });
  //       setData(newData);
  //       setEditingKey('');
  //     } else {
  //       newData.push(row);
  //       setData(newData);
  //       setEditingKey('');
  //     }
  //   } catch (errInfo) {
  //     console.log('Validate Failed:', errInfo);
  //   }
  // };
  const renderAction = () => {
    return (
      <div>

        <FormOutlined  style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpen(true)} />
      </div>
    )
  }
  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      width: '8%',
      sorter: (a, b) => Number(a.time.split(/[:]/)[0]) - Number(b.time.split(/[:]/)[0]),
    },
    {
      title: 'Thông tin khách hàng',
      dataIndex: 'customer',
      width: '22%'
    },
    {
      title: 'Thông tin đơn hàng',
      dataIndex: 'orderinfor',
      width: '25%',

    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment',
      width: '22%',
    },
    {
      title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        filters: [
          {
            text: 'Đã giao',
            value: true,
          },
          {
            text: "Chưa giao",
            value: false,
          }
        ],
        onFilter: (value, record) => {
          
          return record.isDelivered ===value
        },
    },
    {
      
        title: 'Cập nhật',
        dataIndex: 'action',
        render: renderAction,
     

    },
    
    // {
    //   title: 'operation',
    //   dataIndex: 'operation',
    //   render: (_, record) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <span>
    //         <Typography.Link
    //           onClick={() => save(record.key)}
    //           style={{
    //             marginRight: 8,
    //           }}
    //         >
    //           Save
    //         </Typography.Link>
    //         <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
    //           <a>Cancel</a>
    //         </Popconfirm>
    //       </span>
    //     ) : (
    //       <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
    //         Update Status
    //       </Typography.Link>
    //     );
    //   },
    // },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:  'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const fetchAllDateOrder = async () => {
    const res = await OrderService.getAllDateOrder()
    return res
  }
  const dateOrder = useQuery({ queryKey: ['date-orders'], queryFn: fetchAllDateOrder })
  
  

  
 
console.log("datedate", dateOrder)
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
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
        // setTimeout(() => searchInput.current?.select(), 100);
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

  

  const handleChangeDay = (value)=>{
    setData(originData.filter(el => el.day === value))

  }
  
  const renderDates = (arr) => {
    let results = []
    let curr = '' 
    if(arr) {
        arr?.forEach((opt) => {
          if(opt==dayjs().format('YYYY-MM-DD')){
            
                curr = opt

              
              }else{

            results.push({
                value: opt,
                label: dayjs(opt).format('DD/MM/YYYY')
            })
          }
        })
        if(curr){

          results.unshift(
  
            {label: 'Hôm nay',
            value: dayjs(curr).format("YYYY-MM-DD")}
          )
        }
    }
    
    return results
}

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      
      
      <div style={{ marginTop: '20px' }}>
      <Select 
                onChange={handleChangeDay}
                name="date"
                style={{ width: 200 }}
                options={renderDates(dateOrder?.data?.data)}

    
                />
                
          <Loading isLoading={isLoadingOrders}>
        <Form form={form} component={false}>
        <TableNonDLComponent  columns={mergedColumns} isLoading={isLoadingOrders} data={data} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
     
    </Form>
    <ModalComponent forceRender title="Cập nhật thông tin đơn hàng" open={isModalOpen} onCancel={handleCancel} footer={null}>
        

          <Form
            name="updatestatus"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={finishUpdate}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Trạng thái"
              name="status"
            >
              
              <Select 
    name='status'
    style={{ width: 150 }}
    onChange={changstatus}
    options={[{
      label: "Đã giao",
      value: true
    },{
      label: "Hủy đơn",
      value: 1
    }
  ]}
  

    /> 
            </Form.Item>

           
           {stateElement?.status===1 ? <Form.Item
              label="Lý do"
              name="reasion"
              rules={[{ required: true, message: 'Please input weight!' }]}
            >
              <Input
              value={stateElement?.reasion}
              name='reasion'
              onChange={handleOnchange}
              />
            </Form.Item>:null} 
           
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
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
      </ModalComponent>
          </Loading>
      </div>
    </div>
  )
}

export default OrderAdmin