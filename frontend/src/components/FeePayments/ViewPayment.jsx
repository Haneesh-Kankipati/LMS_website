import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPayments,columns,PaymentButtons } from '../../utils/PaymentHelper'
import DataTable from 'react-data-table-component'

const ViewPayment = () => {
    const {id}=useParams()
    const[payments,setPayments]=useState([])
    const[paymentLoading,setPaymentLoading]=useState(false)
    const loadPayments=async()=>{
      setPaymentLoading(true)
      const loadingpayments=await fetchPayments(id)
      //console.log(loadingpayments)
      let sno=1
      const data = loadingpayments.map((payment) => (
                {
                  _id:payment._id,
                  sno: sno++,
                  student: payment.student?.std_name || "", // <-- FIXED
                  course: payment.student.std_course?.course_name || "",
                  fee: payment.fee,
                  discount: payment.discount,
                  extra: payment.extra,
                  total:payment.total,
                  payDate:payment.payDate,
                  action: (<PaymentButtons std_id={id}_id={payment._id} onPaymentDelete={onPaymentDelete}/>)
                }
              ));
                setPayments(data);
      setPaymentLoading(false)
    }
    useEffect(()=>{
      loadPayments()
    },[])
    const onPaymentDelete=()=>{
      loadPayments()
    }
  return (
    <>{paymentLoading?<div>Loading...</div>:
      <div>
        <div>
        <DataTable
          columns={columns}
          data={payments}
          pagination
        />
      </div>
      </div>
}</>
  )
}

export default ViewPayment