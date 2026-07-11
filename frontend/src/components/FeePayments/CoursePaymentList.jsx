import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/apiConfig";

const CoursePaymentList = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [payments, setPayments] = useState([]);
  const [structureSummaries, setStructureSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "paymentDate", direction: "desc" });

  useEffect(() => {
    const loadPayments = async () => {
      if (!courseId) {
        setCourse(null);
        setPayments([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [courseResponse, paymentResponse] = await Promise.all([
          axios.get(`/api/course/${courseId}`),
          axios.get(`/api/feepayment/course/${courseId}`),
        ]);

        if (courseResponse.data.success) {
          setCourse(courseResponse.data.course);
        } else {
          setCourse(null);
        }

        if (paymentResponse.data.success) {
          setPayments(paymentResponse.data.payments || []);
          setStructureSummaries(paymentResponse.data.structureSummaries || []);
        } else {
          setPayments([]);
          setStructureSummaries([]);
        }
      } catch (err) {
        console.error("Error loading course payments:", err);
        setError("Unable to load course payments. Please try again.");
        setPayments([]);
        setStructureSummaries([]);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [courseId]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortValue = (payment, key) => {
    if (key === "studentName") {
      return (payment.feeStructure?.student?.user_id?.name || "").toLowerCase();
    }

    if (key === "paymentDate") {
      return new Date(payment.payDate || 0).getTime();
    }

    return Number(payment.amountPaid || 0);
  };

  const sortedPayments = [...payments].sort((a, b) => {
    const valueA = getSortValue(a, sortConfig.key);
    const valueB = getSortValue(b, sortConfig.key);

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  const hasSelectedCourse = Boolean(courseId);

  const groupedPayments = sortedPayments.reduce((groups, payment) => {
    const structureName = payment.feeStructure?.year || "Unknown Structure";
    if (!groups[structureName]) {
      groups[structureName] = [];
    }
    groups[structureName].push(payment);
    return groups;
  }, {});

  const structureSummaryMap = structureSummaries.reduce((map, summary) => {
    map[summary.structureName] = summary;
    return map;
  }, {});

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">List Payments</h1>
          <p className="text-sm text-gray-600">
            {courseId
              ? `Showing payments for "${course?.course_name || "selected course"}."`
              : "Select a course from the sidebar to view student payments."
            }
          </p>
        </div>
        {course && (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-right text-sm text-gray-700">
            <div className="font-semibold">Selected course</div>
            <div>{course.course_name}</div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {hasSelectedCourse ? null : (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          Choose a course from the sidebar to see payments for that course.
        </div>
      )}

      {hasSelectedCourse && loading ? (
        <div className="mt-8 text-gray-600">Loading payments...</div>
      ) : null}

      {hasSelectedCourse && !loading && payments.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          No payments found for this course.
        </div>
      ) : null}

      {hasSelectedCourse && !loading && payments.length > 0 ? (
        <div>
          <div className="space-y-6">
            {Object.entries(groupedPayments).map(([structureName, structurePayments]) => {
              const firstPayment = structurePayments[0];
              const year = firstPayment?.feeStructure?.year || "N/A";
              const summary = structureSummaryMap[structureName] || {
                courseStudentCount: 0,
                uniqueStudentCount: 0,
                studentsWithoutPayment: [],
              };

              const aggregatedRows = Object.values(
                structurePayments.reduce((groups, payment) => {
                  const studentName = payment.feeStructure?.student?.user_id?.name || "Unknown Student";
                  if (!groups[studentName]) {
                    groups[studentName] = {
                      studentName,
                      paymentCount: 0,
                      totalAmount: 0,
                      latestPaymentTime: 0,
                      paymentEntries: [],
                    };
                  }

                  groups[studentName].paymentCount += 1;
                  groups[studentName].totalAmount += Number(payment.amountPaid || 0);
                  groups[studentName].latestPaymentTime = Math.max(
                    groups[studentName].latestPaymentTime,
                    new Date(payment.payDate || 0).getTime()
                  );
                  if (payment.payDate) {
                    groups[studentName].paymentEntries.push({
                      payDate: payment.payDate,
                      formattedDate: new Date(payment.payDate).toLocaleDateString(),
                      amountPaid: Number(payment.amountPaid || 0),
                    });
                  }

                  return groups;
                }, {})
              ).sort((a, b) => {
                let valueA;
                let valueB;

                if (sortConfig.key === "studentName") {
                  valueA = a.studentName.toLowerCase();
                  valueB = b.studentName.toLowerCase();
                } else if (sortConfig.key === "paymentDate") {
                  valueA = a.latestPaymentTime;
                  valueB = b.latestPaymentTime;
                } else {
                  valueA = a.totalAmount;
                  valueB = b.totalAmount;
                }

                if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
              });

              return (
                <div key={structureName} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                    <div className="text-sm font-semibold text-gray-800">
                      {structureName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Year {year}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3">
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Total students:</span> {summary.courseStudentCount}
                      <span className="ml-3 font-semibold">Paid:</span> {summary.uniqueStudentCount}
                      <span className="ml-3 font-semibold">Not paid:</span> {summary.studentsWithoutPayment.length}
                    </div>
                    <div className="min-w-[220px] max-w-sm">
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Students without payment</div>
                      <div className="mt-1 max-h-24 overflow-y-auto rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                        {summary.studentsWithoutPayment.length > 0 ? (
                          <ul className="space-y-1">
                            {summary.studentsWithoutPayment.map((studentName) => (
                              <li key={studentName}>{studentName}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-gray-500">None</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            S. No
                          </th>
                          <th
                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            onClick={() => handleSort("studentName")}
                          >
                            <div className="flex items-center gap-1">Student Name{getSortIndicator("studentName")}</div>
                          </th>
                          <th
                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            onClick={() => handleSort("paymentDate")}
                          >
                            <div className="flex items-center gap-1">Payment Date{getSortIndicator("paymentDate")}</div>
                          </th>
                          <th
                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            onClick={() => handleSort("amountPaid")}
                          >
                            <div className="flex items-center gap-1">Amount Paid{getSortIndicator("amountPaid")}</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {aggregatedRows.map((row, index) => (
                          <tr key={row.studentName}>
                            <td className="px-6 py-4 align-top text-sm text-gray-700">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 align-top text-sm text-gray-700">
                              {row.studentName}
                            </td>
                            <td className="px-6 py-4 align-top text-sm text-gray-700">
                              <div className="flex flex-col gap-1">
                                {row.paymentEntries.length > 0 ? (
                                  row.paymentEntries.map((entry) => (
                                    <div key={`${row.studentName}-${entry.payDate}-${entry.amountPaid}`}>
                                      {entry.formattedDate}
                                    </div>
                                  ))
                                ) : (
                                  <div>-</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top text-sm text-gray-700">
                              <div className="flex flex-col gap-1">
                                {row.paymentEntries.length > 0 ? (
                                  row.paymentEntries.map((entry) => (
                                    <div key={`${row.studentName}-${entry.payDate}-${entry.amountPaid}-amount`}>
                                      ₹{entry.amountPaid.toFixed(2)}
                                    </div>
                                  ))
                                ) : (
                                  <div>₹0.00</div>
                                )}
                                <div className="mt-2 border-t border-gray-200 pt-2 font-semibold">
                                  Total: ₹{row.totalAmount.toFixed(2)}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CoursePaymentList;
