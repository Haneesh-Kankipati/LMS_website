import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import {
  fetchStructuresByStudent,
  deleteStructure,
  fetchPaymentsByStudent,
  deletePayment,
  PaymentButtons,
  columns,
  StructureButtons,
  generateUnifiedFeeReceipt,
} from "../../utils/PaymentHelper";

pdfMake.vfs = pdfFonts.vfs;

const ViewPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [structures, setStructures] = useState([]);
  const [rows, setRows] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateUnifiedReceiptForStructure = async (structureId) => {
    //console.log(id);
    await generateUnifiedFeeReceipt(id, structureId);
  };

  const loadStructures = async () => {
    setLoading(true);
    try {
      const structs = await fetchStructuresByStudent(id);
      setStructures(structs || []);

      // Set student info from first structure
      if (structs && structs.length > 0) {
        setStudentInfo({
          name: structs[0].student?.std_name || "",
          course: structs[0].student?.std_course?.course_name || ""
        });
      }

      let sno = 1;
      const tableRows = (structs || []).map((s) => ({
        _id: s._id,
        sno: sno++,
        year: s.year || "",
        fee: s.fee,
        discount: s.discount,
        extra: s.extra,
        total: s.total,
        action: (
          <StructureButtons
            onAdd={() => {
              navigate(`/admin-dashboard/student/feepayment/${id}/add/${s._id}`);
            }}
            onDownload={() => generateUnifiedReceiptForStructure(s._id)}
            onDelete={async () => {
              const ok = window.confirm('Delete this fee structure and its payments?');
              if (!ok) return;
              await deleteStructure(s._id, () => loadStructures());
            }}
          />
        ),
      }));

      setRows(tableRows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadStructures();
  }, [id]);

  const ExpandPayments = ({ data }) => {
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);

    const load = async () => {
      setLoadingPayments(true);
      try {
        const all = await fetchPaymentsByStudent(id);
        const filtered = (all || []).filter((p) => p.feeStructure && String(p.feeStructure._id) === String(data._id));
        setPayments(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPayments(false);
      }
    };

    useEffect(() => { load(); }, []);

    return (
      <div className="p-3 bg-gray-50">
        {loadingPayments ? (
          <div>Loading payments...</div>
        ) : payments.length === 0 ? (
          <div>No payments for this structure.</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white">
                <th className="p-1">S.No</th>
                <th className="p-1">Payment Date</th>
                <th className="p-1">Amount Paid</th>
                <th className="p-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p._id} className="border-t">
                  <td className="p-1 align-top">{i + 1}</td>
                  <td className="p-1 align-top">{new Date(p.payDate).toLocaleDateString()}</td>
                  <td className="p-1 align-top">₹ {p.amountPaid}</td>
                  <td className="p-1 align-top">
                    <PaymentButtons std_id={id} _id={p._id} onPaymentDelete={async () => { await load(); }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      {studentInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Student Information</h2>
          <p className="mb-2"><strong>Name:</strong> {studentInfo.name}</p>
          <p><strong>Course:</strong> {studentInfo.course}</p>
        </div>
      )}
      <DataTable
        columns={columns}
        data={rows}
        progressPending={loading}
        pagination
        expandableRows
        expandableRowsComponent={ExpandPayments}
        expandableRowExpanded={(row) => true}
      />
    </div>
  );
};

export default ViewPayment;