import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import {
  fetchPayments,
  columns,
  PaymentButtons,
} from "../../utils/PaymentHelper";

//pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ViewPayment = () => {
  const { id } = useParams();

  const [payments, setPayments] = useState([]);
  const [rawPayments, setRawPayments] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);

  /* ------------------ ACADEMIC YEAR CALC ------------------ */
  const getAcademicYear = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0 = Jan

    // Academic Year: June → April
    return month >= 5 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  };

  /* ------------------ LOAD PAYMENTS ------------------ */
  const loadPayments = async () => {
    setPaymentLoading(true);

    const loadedPayments = await fetchPayments(id);
    setRawPayments(loadedPayments || []);

    let sno = 1;
    const tableData = loadedPayments.map((payment) => ({
      _id: payment._id,
      sno: sno++,
      student: payment.student?.std_name || "",
      course: payment.student?.std_course?.course_name || "",
      fee: payment.fee,
      discount: payment.discount,
      extra: payment.extra,
      total: payment.total,
      payDate: new Date(payment.payDate).toLocaleDateString(),
      amountPaid: payment.amountPaid,
      academicYear: getAcademicYear(payment.payDate),
      action: (
        <PaymentButtons
          std_id={id}
          _id={payment._id}
          onPaymentDelete={onPaymentDelete}
        />
      ),
    }));

    setPayments(tableData);

    // Extract unique academic years
    const years = [
      ...new Set(tableData.map((p) => p.academicYear)),
    ];
    setAcademicYears(years);

    setPaymentLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const onPaymentDelete = () => {
    loadPayments();
  };

  /* ------------------ PDF GENERATION ------------------ */
  const generateUnifiedReceipt = (year) => {
  const yearPayments = rawPayments.filter(
    (p) => getAcademicYear(p.payDate) === year
  );

  if (yearPayments.length === 0) {
    alert("No payments found for this academic year");
    return;
  }

  const firstPayment = yearPayments[0];

  const studentName = firstPayment.student?.std_name || "";
  const courseName =
    firstPayment.student?.std_course?.course_name || "";

  // Fee structure from FIRST payment
  const fee = Number(firstPayment.fee) || 0;
  const discount = Number(firstPayment.discount) || 0;
  const extra = Number(firstPayment.extra) || 0;
  const totalFee = Number(firstPayment.total) || 0;

  const totalPaid = yearPayments.reduce(
    (sum, p) => sum + (Number(p.amountPaid) || 0),
    0
  );

  const pending = totalFee - totalPaid;

  /* ---------------- Payment History Table ---------------- */
  const paymentTableBody = [
    [
      { text: "S.No", bold: true },
      { text: "Payment Date", bold: true },
      { text: "Amount Paid", bold: true },
    ],
  ];

  yearPayments.forEach((p, i) => {
    paymentTableBody.push([
      i + 1,
      new Date(p.payDate).toLocaleDateString(),
      `₹ ${p.amountPaid}`,
    ]);
  });

  /* ---------------- Fee Structure Table ---------------- */
  const feeStructureTable = {
    table: {
      widths: ["*", "auto"],
      body: [
        [{ text: "Fee Structure", colSpan: 2, bold: true }, {}],
        ["Base Fee", `₹ ${fee}`],
        ["Discount", `₹ ${discount}`],
        ["Extra Charges", `₹ ${extra}`],
        [
          { text: "Total Fee", bold: true },
          { text: `₹ ${totalFee}`, bold: true },
        ],
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 10],
  };

  const docDefinition = {
    content: [
      { text: "WAVES", style: "header" },
      { text: "PRESCHOOL | ACTIVITIES", style: "subHeader" },
      { text: "Unified Fee Receipt", style: "subHeader" },

      {
        columns: [
          [
            { text: `Student: ${studentName}` },
            { text: `Course: ${courseName}` },
            { text: `Academic Year: ${year}` },
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

      /* -------- Fee Structure Section -------- */
      feeStructureTable,

      /* -------- Payment History Section -------- */
      {
        text: "Payment History",
        style: "section",
      },
      {
        table: {
          widths: ["auto", "*", "auto"],
          body: paymentTableBody,
        },
        layout: "lightHorizontalLines",
      },

      { text: "\nSummary", style: "section" },

      {
        table: {
          widths: ["*", "auto"],
          body: [
            ["Total Fee (Academic Year)", `₹ ${totalFee}`],
            ["Total Paid", `₹ ${totalPaid}`],
            [
              { text: "Pending Amount", bold: true },
              {
                text: `₹ ${pending}`,
                bold: true,
                color: pending > 0 ? "red" : "green",
              },
            ],
          ],
        },
        layout: "lightHorizontalLines",
      },

      {
        text: "\nThis is a system generated receipt.",
        italics: true,
        alignment: "center",
        fontSize: 9,
        margin: [0, 20],
      },
    ],

    styles: {
      header: {
        fontSize: 20,
        bold: true,
        alignment: "center",
      },
      subHeader: {
        fontSize: 14,
        alignment: "center",
        margin: [0, 5],
      },
      section: {
        fontSize: 14,
        bold: true,
        margin: [0, 10],
      },
    },
  };

  pdfMake.createPdf(docDefinition).open();
};


  /* ------------------ UI ------------------ */
  return (
    <>
      {paymentLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-4">
          {/* Academic Year Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            {academicYears.map((year) => (
              <button
                key={year}
                onClick={() => generateUnifiedReceipt(year)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Generate Receipt ({year})
              </button>
            ))}
          </div>

          {/* Payments Table */}
          <DataTable
            columns={columns}
            data={payments}
            pagination
          />
        </div>
      )}
    </>
  );
};

export default ViewPayment;
