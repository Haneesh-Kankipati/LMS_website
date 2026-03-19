import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";

import {
  fetchStructuresByStudent,
  fetchPaymentsByStudent,
  columns,
  StudentStructureButtons,
  generateUnifiedFeeReceipt,
} from "../../utils/PaymentHelper";

import { useAuth } from "../../context/authContext";

pdfMake.vfs = pdfFonts.vfs;

const StudentPayments = () => {
  const { user } = useAuth();

  const [structures, setStructures] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("");

  // 🔥 Ref to avoid async state delay issues
  const studentIdRef = useRef("");

  /* ---------------- RECEIPT GENERATION ---------------- */
  const generateReceiptForStructure = async (structureId) => {
    if (!studentIdRef.current) {
      alert("Student ID not ready yet. Please wait.");
      return;
    }
    await generateUnifiedFeeReceipt(studentIdRef.current, structureId);
  };

  /* ---------------- LOAD STRUCTURES ---------------- */
  const loadStructures = async () => {
    setLoading(true);
    try {
      const studentResponse = await axios.get(
        `http://localhost:3000/api/student/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (studentResponse.data.success && studentResponse.data.student) {
        const student = studentResponse.data.student;
        const resolvedStudentId = student.std_id || student._id;

        if (!resolvedStudentId) {
          alert("Student ID not found. Please contact admin.");
          return;
        }

        // ✅ Store in both ref and state
        studentIdRef.current = resolvedStudentId;
        setStudentId(resolvedStudentId);

        // Fetch structures
        const structs = await fetchStructuresByStudent(resolvedStudentId);
        setStructures(structs || []);

        let sno = 1;

        const tableRows = (structs || []).map((s) => ({
          _id: s._id,
          sno: sno++,
          year: s.year,
          student: s.student?.std_name || "",
          course: s.student?.std_course?.course_name || "",
          fee: s.fee,
          discount: s.discount,
          extra: s.extra,
          total: s.total,
          action: (
            <StudentStructureButtons
              onDownload={() => generateReceiptForStructure(s._id)}
            />
          ),
        }));

        setRows(tableRows);
      } else {
        alert("Failed to load student data.");
      }
    } catch (err) {
      console.error("Error loading student:", err);
      alert("Error loading student data. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      loadStructures();
    }
  }, [user]);

  /* ---------------- EXPANDABLE PAYMENTS ---------------- */
  const ExpandPayments = ({ data }) => {
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);

    const load = async () => {
      if (!studentIdRef.current) return;

      setLoadingPayments(true);

      try {
        const all = await fetchPaymentsByStudent(studentIdRef.current);

        const filtered = (all || []).filter(
          (p) =>
            p.feeStructure &&
            String(p.feeStructure._id) === String(data._id)
        );

        setPayments(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPayments(false);
      }
    };

    useEffect(() => {
      load();
    }, []);

    return (
      <div className="p-3 bg-gray-50">
        {loadingPayments ? (
          <div>Loading payments...</div>
        ) : payments.length === 0 ? (
          <div>No payments</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white">
                <th className="p-1">S.No</th>
                <th className="p-1">Date</th>
                <th className="p-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p._id} className="border-t">
                  <td className="p-1">{i + 1}</td>
                  <td className="p-1">
                    {new Date(p.payDate).toLocaleDateString()}
                  </td>
                  <td className="p-1">₹ {p.amountPaid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4">
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

export default StudentPayments;