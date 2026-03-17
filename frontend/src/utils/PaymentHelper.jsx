import axios from "axios";
import { useNavigate } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
export const paymentcolumns=[
  {
    name: "S No",
    selector: row => row.sno,
    width: "60px" // fixed small width
  },
  {
    name: "Pay Date",
    selector: row => row.payDate,
    sortable: true,
    width: "80px"
  },
  {
    name: "Amount Paid",
    selector: row => row.amountPaid,
    sortable: true,
    width: "80px"
  },
  {
    name: "Action",
    selector: row => row.action,
    ignoreRowClick: true,
    button: "true",
    width: "120px"
  }
]
export const columns = [
  {
    name: "S No",
    selector: row => row.sno,
    width: "80px" // fixed small width
  },
  {
    name: "Year",
    selector: row => row.year,
    sortable: true,
    width: "100px"
  },
  {
    name: "Fee",
    selector: row => row.fee,
    sortable: true,
    width: "100px"
  },
  {
    name: "Discount",
    selector: row => row.discount,
    sortable: true,
    width: "100px"
  },
  {
    name: "Kit",
    selector: row => row.extra,
    sortable: true,
    width: "100px"
  },
  {
    name: "Total",
    selector: row => row.total,
    sortable: true,
    width: "100px"
  },
  {
    name: "Action",
    selector: row => row.action,
    ignoreRowClick: true,
    button: "true",
    width: "300px"
  }
];

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

// New helpers for feeStructure oriented UI
export const fetchStructuresByStudent = async (std_id) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/feestructure/${std_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    console.log(res);
    return res.data.success ? res.data.structures || res.data.structures || res.data.structures : [];
  } catch (error) {
    if (error.response && error.response.data && !error.response.data.success) {
      alert(error.response.data.error);
    }
    return [];
  }
};

export const fetchPaymentsByStudent = async (studentId) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/feepayment/${studentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.data.success ? res.data.payments || [] : [];
  } catch (error) {
    if (error.response && error.response.data && !error.response.data.success) {
      alert(error.response.data.error);
    }
    return [];
  }
};

export const addPaymentForStructure = async (structureId, payDate, amountPaid) => {
  try {
    const payload = { feeStructure: structureId, payDate, amountPaid };
    const res = await axios.post('http://localhost:3000/api/feepayment/add', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && !error.response.data.success) {
      alert(error.response.data.error);
    }
    throw error;
  }
};

export const deleteStructure = async (structureId, onDelete) => {
  try {
    const res = await axios.delete(`http://localhost:3000/api/feestructure/${structureId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (res.data.success && onDelete) onDelete();
  } catch (error) {
    if (error.response && error.response.data && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
};
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
export const StructureButtons = ({ onAdd, onDownload, onDelete }) => {
  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded-full"
        onClick={() => { if (onAdd) onAdd(); }}
      >
        Add Payment
      </button>
      <button
        className="px-3 py-1 bg-green-600 text-white rounded-full"
        onClick={() => { if (onDownload) onDownload(); }}
      >
        Download
      </button>
      <button
        className="px-3 py-1 bg-red-600 text-white rounded-full"
        onClick={() => { if (onDelete) onDelete(); }}
      >
        Delete
      </button>
    </div>
  );
};
export const StudentStructureButtons=()=>{
  return(
    <div className="flex space-x-3"> 
      <button className="px-3 py-1 bg-green-600 text-white rounded-full"
      >Download</button> 
    </div>
  );
}
export const StudentPaymentButtons = ({_id }) => {

  return (
    <div className="flex space-x-3">
      N/A
    </div>
  );
};