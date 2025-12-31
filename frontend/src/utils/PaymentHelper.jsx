import axios from "axios";
import { useNavigate } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
export const columns = [
  {
    name: "S No",
    selector: row => row.sno,
    width: "60px" // fixed small width
  },
  {
    name: "Student",
    selector: row => row.student,
    sortable: true,
    grow: 2 // take more space
  },
  {
    name: "Course",
    selector: row => row.course,
    sortable: true,
    grow: 2
  },
  {
    name: "Fee",
    selector: row => row.fee,
    sortable: true,
    width: "80px"
  },
  {
    name: "Discount",
    selector: row => row.discount,
    sortable: true,
    width: "100px"
  },
  {
    name: "Extra",
    selector: row => row.extra,
    sortable: true,
    width: "80px"
  },
  {
    name: "Total",
    selector: row => row.total,
    sortable: true,
    width: "80px"
  },
  {
    name: "Pay Date",
    selector: row => {
      if (!row.payDate) return "";
      const date = new Date(row.payDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    sortable: true,
    width: "120px"
  },
  {
    name: "Amount Paid",
    selector: row => row.amountPaid,
    sortable: true,
    width: "120px"
  },
  {
    name: "Action",
    selector: row => row.action,
    ignoreRowClick: true,
    button: "true",
    width: "100px"
  }
];

export const fetchPayments=async(id)=>{
    try {
    const response = await axios.get('http://localhost:3000/api/feepayment', {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    //console.log(response.data.payments)
    if (response.data.success) {
      const loadpayments = response.data.payments;
      const filteredPayments = loadpayments.filter(p => p.student.std_id.toString() === id);
      //console.log(loadpayments)
      return filteredPayments;
    } 
    return [];
    } catch (error) {
        if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    } 
    return [];
    }
}
export const fetchStudentPayments=async(id)=>{
  try {
    const response = await axios.get(`http://localhost:3000/api/feepayment/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    if(response.data.success){
      const loadPayment=response.data.payments;
      return loadPayment;
    }
    return [];
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
    return[];
  }
}
export const fetchPayment=async(id)=>{
  try {
    const response = await axios.get(`http://localhost:3000/api/feepayment/payment/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    if(response.data.success){
      const loadPayment=response.data.payment;
      return loadPayment;
    }
    return [];
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
    return null;
  }
}
export const deletePayment=async(id,onPaymentDelete)=>{
  try {
    const response = await axios.delete(`http://localhost:3000/api/feepayment/payment/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      }
    });
    if(response.data.success){
      onPaymentDelete()
    }
    
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
}
export const PaymentButtons = ({std_id, _id,onPaymentDelete }) => {
  //const navigate = useNavigate();
  const handleDelete=async()=>{
    const confirm = window.confirm("Do you want to delete?")
    try {
      if(confirm){
        await deletePayment(_id,onPaymentDelete)
      }
      
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment!");
    }
  } 
  return (
    <div className="flex space-x-3"> 
      <button className="px-3 py-1 bg-red-600 text-white rounded-full"
              onClick={handleDelete}
      >Delete</button> 
    </div>
  );
};
export const StudentPaymentButtons = ({_id }) => {

  return (
    <div className="flex space-x-3">
      N/A
    </div>
  );
};