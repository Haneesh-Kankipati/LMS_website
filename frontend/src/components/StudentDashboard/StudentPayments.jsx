import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";

import {
  fetchStructuresByStudent,
  fetchPaymentsByStudent,
  columns,
  StudentStructureButtons,
} from "../../utils/PaymentHelper";

import { useAuth } from "../../context/authContext";

pdfMake.vfs = pdfFonts.vfs;

const StudentPayments = () => {
  const { user } = useAuth();

  const [structures, setStructures] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState([]);

  /* ---------------- RECEIPT GENERATION (PER STRUCTURE) ---------------- */
  const generateReceiptForStructure = async (structureId) => {
    try {
      const payments = await fetchPaymentsByStudent(studentId);

      const paymentsForStructure = (payments || []).filter(
        (p) =>
          p.feeStructure &&
          String(p.feeStructure._id) === String(structureId)
      );

      if (paymentsForStructure.length === 0) {
        alert("No payments found for this structure");
        return;
      }

      const structure =
        structures.find((s) => s._id === structureId) || {};

      const studentName = structure.student?.std_name || "";
      const courseName =
        structure.student?.std_course?.course_name || "";

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

      const docDefinition = {
        content: [
          { text: "WAVES", style: "header" },
          { text: "Fee Receipt", style: "subHeader" },

          {
            columns: [
              [
                { text: `Student: ${studentName}` },
                { text: `Course: ${courseName}` },
              ],
              [
                {
                  text: `Date: ${new Date().toLocaleDateString()}`,
                  alignment: "right",
                },
              ],
            ],
            margin: [0, 10],
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
                ["Extra", `₹ ${extra}`],
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

  /* ---------------- LOAD STRUCTURES ---------------- */
  const loadStructures = async () => {
    setLoading(true);
    try {
      // First, fetch the student object using the user ID
      const studentResponse = await axios.get(`http://localhost:3000/api/student/user/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (studentResponse.data.success && studentResponse.data.student) {
        const student = studentResponse.data.student;
        setStudentId(student.std_id);

        // Now fetch structures using the student's std_id
        const structs = await fetchStructuresByStudent(student.std_id);
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) loadStructures();
  }, [user]);

  /* ---------------- EXPANDABLE PAYMENTS ---------------- */
  const ExpandPayments = ({ data }) => {
    const [payments, setPayments] = useState([]);

    const load = async () => {
      const all = await fetchPaymentsByStudent(studentId);
      const filtered = (all || []).filter(
        (p) =>
          p.feeStructure &&
          String(p.feeStructure._id) === String(data._id)
      );
      setPayments(filtered);
    };

    useEffect(() => {
      if (studentId) {
        load();
      }
    }, [studentId]);

    return (
      <div className="p-3 bg-gray-50">
        {payments.length === 0 ? (
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
      />
    </div>
  );
};

export default StudentPayments;