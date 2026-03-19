import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const imageCache = {};

const fetchImageDataUrl = async (url) => {
  if (imageCache[url]) return imageCache[url];

  const response = await fetch(url);
  const blob = await response.blob();

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  imageCache[url] = dataUrl;
  return dataUrl;
};
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
export const StudentStructureButtons=({ onDownload })=>{
  return(
    <div className="flex space-x-3"> 
      <button 
        className="px-3 py-1 bg-green-600 text-white rounded-full"
        onClick={() => { if (onDownload) onDownload(); }}
      >
        Download
      </button> 
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

export const generateUnifiedFeeReceipt = async (studentId, structureId) => {
  if (!studentId) {
    alert("Student ID not found. Please refresh the page.");
    return;
  }

  try {
    // Fetch all payments for the student
    const payments = await fetchPaymentsByStudent(studentId);
    
    // Filter payments for this structure
    const paymentsForStructure = (payments || []).filter(
      (p) => p.feeStructure && String(p.feeStructure._id) === String(structureId)
    );

    if (paymentsForStructure.length === 0) {
      alert("No payments found for this structure");
      return;
    }

    // Fetch all structures for the student
    const structures = await fetchStructuresByStudent(studentId);
    const structure = structures.find((s) => s._id === structureId) || {};

    if (!structure || !structure._id) {
      alert("Structure not found");
      return;
    }

    const studentName = structure.student?.std_name || "";
    const courseName = structure.student?.std_course?.course_name || "";
    const parentName=structure.student?.parent_name || "";
    const year = structure.year || "";
    const fee = Number(structure.fee) || 0;
    const discount = Number(structure.discount) || 0;
    const extra = Number(structure.extra) || 0;
    const totalFee = Number(structure.total) || 0;

    let totalPaid = 0;

    const paymentTableBody = [
      [
        { text: "S.No", bold: true },
        { text: "Payment Date", bold: true },
        { text: "Amount Paid", bold: true },
      ],
    ];

    paymentsForStructure.forEach((p, i) => {
      paymentTableBody.push([
        i + 1,
        new Date(p.payDate).toLocaleDateString(),
        `₹ ${p.amountPaid}`,
      ]);
      totalPaid += Number(p.amountPaid) || 0;
    });

    const pending = totalFee - totalPaid;
    
    const [logoDataUrl, signatureDataUrl] = await Promise.all([
      fetchImageDataUrl("http://localhost:3000/receipt/waveslogo-removebg-preview.png"),
      fetchImageDataUrl("http://localhost:3000/receipt/signature.jpeg"),
    ]);

    const docDefinition = {
      images: {
        logo: logoDataUrl,
        signature: signatureDataUrl,
      },
      content: [
        {
          columns: [
            [
              {
                image: 'logo',
                width: 80,
                height: 80,
                alignment: "center",
                margin: [0, 0, 0, 10],
              },
            ],
            [
              { text: "WAVES", style: "header" },
              { text: "Fee Receipt", style: "subHeader" },
            ],
          ],
        },

        {
          columns: [
            [
              { text: `Student: ${studentName}` },
              { text: `Academic Year: ${year}` },
              { text: `Course: ${courseName}` },
              { text: `Parent Name: ${parentName}` },
            ],
            [
              {
                text: `Date: ${new Date().toLocaleDateString()}`,
                alignment: "right",
              },
            ],
          ],
          margin: [0, 15],
        },

        {
          text: "Fee Structure",
          style: "section",
        },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              ["Base Fee", `₹ ${fee}`],
              ["Discount", `₹ ${discount}`],
              ["Kit", `₹ ${extra}`],
              [{ text: "Total", bold: true }, `₹ ${totalFee}`],
            ],
          },
        },

        {
          text: "\nPayment History",
          style: "section",
        },
        {
          table: {
            widths: ["auto", "*", "auto"],
            body: paymentTableBody,
          },
          layout: "lightHorizontalLines",
        },

        {
          text: "\nSummary",
          style: "section",
        },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              ["Total Fee", `₹ ${totalFee}`],
              ["Total Paid", `₹ ${totalPaid}`],
              [
                { text: "Pending", bold: true },
                {
                  text: `₹ ${pending}`,
                  bold: true,
                  color: pending > 0 ? "red" : "green",
                },
              ],
            ],
          },
        },

        {
          columns: [
            [
              {
                image: 'signature',
                width: 120,
                height: 60,
                alignment:"right",
                margin: [0, 20, 0, 0],
              },
              { text: "Director", alignment: "right", margin: [0, 5, 0, 0] },
            ],
          ],
          margin: [0, 40, 0, 0],
        },
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
        },
        subHeader: {
          fontSize: 14,
          alignment: "center",
        },
        section: {
          fontSize: 14,
          bold: true,
          margin: [0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  } catch (err) {
    console.error(err);
    alert("Failed to generate receipt");
  }
};