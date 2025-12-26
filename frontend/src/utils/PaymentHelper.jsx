import axios from "axios";
import { useNavigate } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
export const columns = [
  {
    name: "S No",
    selector: row => row.sno,
    width: "70px" // fixed small width
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
    width: "100px"
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
    width: "100px"
  },
  {
    name: "Total Paid",
    selector: row => row.total,
    sortable: true,
    width: "120px"
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
    name: "Action",
    selector: row => row.action,
    ignoreRowClick: true,
    button: "true",
    width: "180px"
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
  const handleDownload=async()=>{
    try {
      const payment = await fetchPayment(_id);
      if (!payment) {
        alert("Payment details not found!");
        return;
      }
      console.log(payment)
      const studentName = payment.student?.user_id?.name || "N/A";
    const courseName = payment.student?.std_course?.course_name || "N/A";
    const payDate = new Date(payment.payDate).toLocaleDateString();

    // Build the PDF content
    const docDefinition = {
      content: [
        { text: "Fee Payment Receipt", style: "header", alignment: "center" },
        { text: "WAVES - Preschool | Activities", style: "subheader", alignment: "center" },
        { text: "Kranti Nagar,Bachupally", alignment: "center" },
        { text: "Contact: +91 9849197635", alignment: "center", margin: [0, 0, 0, 15] },

        { text: "Student Details", style: "sectionHeader" },
        {
          columns: [
            { text: `Student Name: ${studentName}` },
            { text: `Course: ${courseName}` },
          ],
        },
        {
          columns: [
            { text: `Payment ID: ${payment._id}` },
            { text: `Payment Date: ${payDate}` },
          ],
        },
        { text: "\n" },

        {
          table: {
            headerRows: 1,
            widths: ["*", "auto"],
            body: [
              ["Particulars", "Amount (₹)"],
              ["Course Fee", payment.fee || 0],
              ["Discount", payment.discount || 0],
              ["Extra Charges", payment.extra || 0],
              ["Total Paid", { text: payment.total || 0, bold: true }],
            ],
          },
          layout: "lightHorizontalLines",
        },

        { text: "\n" },
        { text: "Authorized Signature: ___________________", alignment: "right", margin: [0, 30, 0, 0] },
      ],

      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, margin: [0, 0, 0, 5] },
        sectionHeader: { fontSize: 13, bold: true, margin: [0, 10, 0, 5] },
      },
    };

    pdfMake.createPdf(docDefinition).download(`Fee_Receipt_${studentName}.pdf`);
      

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate receipt!");
    }
  }
  return (
    <div className="flex space-x-3">
      <button className="px-3 py-1 bg-blue-600 text-white rounded-full"
              onClick={handleDownload}
      >Download</button> 
      <button className="px-3 py-1 bg-red-600 text-white rounded-full"
              onClick={handleDelete}
      >Delete</button> 
    </div>
  );
};
export const StudentPaymentButtons = ({_id }) => {
  const handleDownload=async()=>{
    try {
      const payment = await fetchPayment(_id);
      if (!payment) {
        alert("Payment details not found!");
        return;
      }
      console.log(payment)
      const studentName = payment.student?.user_id?.name || "N/A";
    const courseName = payment.student?.std_course?.course_name || "N/A";
    const payDate = new Date(payment.payDate).toLocaleDateString();

    // Build the PDF content
    const docDefinition = {
      content: [
        { text: "Fee Payment Receipt", style: "header", alignment: "center" },
        { text: "WAVES - Preschool | Activities", style: "subheader", alignment: "center" },
        { text: "Kranti Nagar,Bachupally", alignment: "center" },
        { text: "Contact: +91 9849197635", alignment: "center", margin: [0, 0, 0, 15] },

        { text: "Student Details", style: "sectionHeader" },
        {
          columns: [
            { text: `Student Name: ${studentName}` },
            { text: `Course: ${courseName}` },
          ],
        },
        {
          columns: [
            { text: `Payment ID: ${payment._id}` },
            { text: `Payment Date: ${payDate}` },
          ],
        },
        { text: "\n" },

        {
          table: {
            headerRows: 1,
            widths: ["*", "auto"],
            body: [
              ["Particulars", "Amount (₹)"],
              ["Course Fee", payment.fee || 0],
              ["Discount", payment.discount || 0],
              ["Extra Charges", payment.extra || 0],
              ["Total Paid", { text: payment.total || 0, bold: true }],
            ],
          },
          layout: "lightHorizontalLines",
        },

        { text: "\n" },
        { text: "Authorized Signature: ___________________", alignment: "right", margin: [0, 30, 0, 0] },
      ],

      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, margin: [0, 0, 0, 5] },
        sectionHeader: { fontSize: 13, bold: true, margin: [0, 10, 0, 5] },
      },
    };

    pdfMake.createPdf(docDefinition).download(`Fee_Receipt_${studentName}.pdf`);
      

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate receipt!");
    }
  }
  return (
    <div className="flex space-x-3">
      <button className="px-3 py-1 bg-blue-600 text-white rounded-full"
              onClick={handleDownload}
      >Download</button>
    </div>
  );
};