import React, { useEffect, useState, useRef,forwardRef   } from 'react'
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { convertPrice } from '../../../utils';
import * as WarehouseService from "../../../services/WarehouseService"
import * as OrderService from '../../../services/OrderService'
import * as ProductService from '../../../services/ProductService'
import * as UserService from '../../../services/UserService'
import {QueryClient, QueryClientProvider} from 'react-query';
import CustomizedContent from './CustomizedContent';
import { useSelector } from 'react-redux';
import { useQueries } from 'react-query';
import { useMemo } from 'react';
import { useMutationHooks } from '../../../hooks/useMutationHook'
import { useQuery , useQueryClient } from 'react-query'
import { Button, Drawer,Table, Radio, Space } from 'antd';
import Loading from '../../../components/spin';
import { Line, getDatasetAtEvent, getElementAtEvent } from "react-chartjs-2";
import dayjs from 'dayjs';
Chart.register(CategoryScale);
const queryClient = new QueryClient();
const AdminDashboard = () => {
  var indexSelected = 0
  var dataTable = []
  const [open, setOpen] = useState(false);
  const chartRef = useRef();
  const onClose = () => {
    setOpen(false);
  };
  const onClick = (event) => {
    setOpen(true)
    console.log(getElementAtEvent(chartRef.current, event)[0].index)
   if(getElementAtEvent(chartRef.current, event)[0].index){

     indexSelected= getElementAtEvent(chartRef.current, event)[0].index
     dataTable = arritemrevenue[indexSelected]?.arritem.length && arritemrevenue[indexSelected]?.arritem.map((item) => {
      console.log(indexSelected,item)
      return { name: item.name, amount: item.amount }
    })
   }
   
    
  }
  
   
  const user = useSelector((state) => state?.user)

  const mutationGetRevenue = useMutationHooks(
    (data) => {
      const { month,
        token,
        ...rests } = data
      const res = OrderService.getMonthRevenue(
        month,
        token,
        { ...rests })
      return res
    },
  )
  const mounth = dayjs().format('MM')
  const getMonthRevenue = async () => {
    const res = await OrderService.getMonthRevenue(mounth, user?.access_token)
    return res
  }
  const queryRevenue = useQuery({ queryKey: ['revenue'], queryFn: getMonthRevenue})

  const { isLoading: isLoadingRevenue, data: dataRevenue } = queryRevenue
  // const { data: dataRevenue, isLoading: isLoadingRevenue, isSuccess: isSuccessRevenue, isError: isErrorRevenue } = mutationGetRevenue
  var arritemrevenue = []
  dataRevenue?.data.items.forEach((item)=>{
      var temp = {}
      var date = dayjs(item.date).format("DD")
      var itemarr = []
    var itemobj ={}
      item.arriem.forEach((iem)=>{
        itemobj.name= iem.name
        itemobj.amount= iem.amount
        itemarr.push(
          itemobj
        )
      })
      var tempindex = 0
      var found = arritemrevenue.find((currentValue, index, arr)=>{
        tempindex = index
       return currentValue.day == date
      })
      // console.log("indextemp",tempindex, arritemrevenue[tempindex])
      if(!found){
        temp.arritem = itemarr
        temp.day = date
        temp.dayrevenue = item.dayPrice
        arritemrevenue.push(temp)
      }else{
        arritemrevenue[tempindex].dayrevenue = arritemrevenue[tempindex].dayrevenue + item.dayPrice;
        itemarr.forEach((curr)=>{
         var itemindex = 0
         var arrtemp = arritemrevenue[tempindex].arritem.find((currentValue, index, arr)=>{
          itemindex = index
           return currentValue.name == curr.name
          })
          if(arrtemp){
            arritemrevenue[tempindex].arritem[itemindex].amount = arritemrevenue[tempindex].arritem[itemindex].amount + curr.amount
          }else{
            arritemrevenue[tempindex].arritem.push(curr)
          }
        })
      }
   })
  var datachart = arritemrevenue
  
  const chartData={
    labels: arritemrevenue.map((data) => data.day), 
    datasets: [
      {
        pointStyle: 'rectRot',
      pointRadius: 5,
      pointBorderColor: 'rgb(0, 0, 0)',
        label: "Doanh thu:",
        data: arritemrevenue.map((data) => data.dayrevenue),
        borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 2
      }

    ]
  }
 


  const [keySelected, setKeySelected] = useState('');
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return {data: res?.data, key: 'orders'}
  }
  const getAllElements = async () => {
    const res = await WarehouseService.getAllElement()
    return {data: res?.data, key: 'warehouse'}
  }
  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    return {data: res?.data, key: 'products'}
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    return {data: res?.data, key: 'users'}
  }

  const queries = useQueries(
    [
      {queryKey: ['products'], queryFn: getAllProducts, staleTime: 1000 * 60},
      {queryKey: ['warehouse'], queryFn: getAllElements, staleTime: 1000 * 60},

      {queryKey: ['users'], queryFn: getAllUsers, staleTime: 1000 * 60},
      {queryKey: ['orders'], queryFn: getAllOrder, staleTime: 1000 * 60},
    ]
  )
  const memoCount = useMemo(() => {
    const result = {}
    try {
      if(queries) {
        queries.forEach((query) => {
          result[query?.data?.key] = query?.data?.data?.length
        })
      }
    return result
    } catch (error) {
      return result
    }
  },[queries])

  const COLORS = {
    users: ['#e66465', '#9198e5'],
    products: ['#a8c0ff', '#3f2b96'],
    orders: ['#11998e', '#38ef7d'],
   };
  
  

  

     var options={
        //   onClick: (e) => {
        //     const canvasPosition = Chart.helpers.getRelativePosition(e, myRadar);

        //     // Substitute the appropriate scale IDs
        //     const dataX = myRadar.scales.x.getValueForPixel(canvasPosition.x);
        //     const dataY = myRadar.scales.y.getValueForPixel(canvasPosition.y);
        // },
            plugins:{
            title: {
              display: true,
              text: `Danh thu GoFoods tháng ${dayjs().format("MM")}: ${convertPrice(dataRevenue?.data.count)}`,
              color: "#f55905",
              font:{size: 20}
            },
            legend: {
              display: false
            }
          }
          
        }


        const handleLabel = ()=>{
          var stringgg = `Số lượng món bán ra trong ngày ${arritemrevenue[indexSelected]?.day}`;
          return stringgg
          }

// if(mychart)
// {
//   mychart.destroy();
// }
// var ctx = document.getElementsByName('myChart').getContext('2d');
//  mychart = new Chart(ctx, config);

// //  myRadar.oncl = function (evt) {
// // var activePoint = myRadar.lastActive[0];
// // if (activePoint !== undefined) {
// //         var datasetIndex = activePoint._datasetIndex;
// //                 var index = activePoint._index;
// //                 var datasetName = config.data.datasets[datasetIndex].label;
// //                 var title = config.data.labels[index];
// //                 var dataValue = config.data.datasets[datasetIndex].data[index];
// //                 alert("Dataset Name: [" + datasetName + "] title: [" + title + "] value: [" + dataValue + "]");
// //             }
// //         };
const columns = [
  {
    title: 'Tên món',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Số lượng',
    dataIndex: 'amount',
    width: 150,
  }
];


  return (

<QueryClientProvider client={queryClient}>
    
      

      
        <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>
          <Loading isLoading={memoCount && Object.keys(memoCount) &&  Object.keys(memoCount).length !== 4}>
            {!keySelected && (
              <CustomizedContent data={memoCount} colors={COLORS} setKeySelected={setKeySelected} />
            )}
          </Loading>
        </div>
        <Loading isLoading={isLoadingRevenue}>

          <div className='mt-10 w-[90%] mx-auto'>
          
         <Line  ref={chartRef}
      onClick={onClick} data={chartData}  options={options}></Line>
     
    </div>
        </Loading>
        <Drawer
        title = {handleLabel()}
        placement={'bottom'}
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
       <Table columns={columns} dataSource={dataTable} scroll={{ y: 400 }} />
      </Drawer>
</QueryClientProvider>
    
  )
}

export default AdminDashboard