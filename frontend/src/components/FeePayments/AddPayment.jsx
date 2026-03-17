import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addPaymentForStructure, fetchStructuresByStudent, fetchPaymentsByStudent } from '../../utils/PaymentHelper';

const AddPayment = () => {
  const { id: studentId, structureId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState(null);
  const [totalPaid, setTotalPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [formData, setFormData] = useState({
    payDate: new Date().toISOString().split('T')[0],
    amountPaid: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Load structure details and calculate balance
    const loadStructure = async () => {
      try {
        setLoading(true);
        const structures = await fetchStructuresByStudent(studentId);
        const found = structures.find(s => s._id === structureId);
        if (found) {
          setStructure(found);
          
          // Fetch all payments for this student and calculate total paid
          const allPayments = await fetchPaymentsByStudent(studentId);
          const paymentsForStructure = (allPayments || []).filter(
            (p) => p.feeStructure && String(p.feeStructure._id) === String(structureId)
          );
          
          const sum = paymentsForStructure.reduce((acc, p) => acc + (Number(p.amountPaid) || 0), 0);
          setTotalPaid(sum);
          setBalance(found.total - sum);
        } else {
          setError('Structure not found');
        }
      } catch (err) {
        console.error('Error loading structure:', err);
        setError('Failed to load structure details');
      } finally {
        setLoading(false);
      }
    };

    if (structureId && studentId) {
      loadStructure();
    }
  }, [structureId, studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.payDate || !formData.amountPaid) {
      setError('Please fill all fields');
      return;
    }

    if (isNaN(formData.amountPaid) || Number(formData.amountPaid) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const amount = Number(formData.amountPaid);
    if (amount > balance) {
      setError(`Amount cannot exceed remaining balance of ₹ ${balance.toFixed(2)}`);
      return;
    }

    try {
      setLoading(true);
      await addPaymentForStructure(structureId, formData.payDate, amount);
      
      // Navigate back to ViewPayment page for this student
      navigate(`/admin-dashboard/student/feepayment/${studentId}`);
    } catch (err) {
      console.error('Error adding payment:', err);
      setError(err.response?.data?.error || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin-dashboard/student/feepayment/${studentId}`);
  };

  if (loading && !structure) {
    return (
      <div className="p-4">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Payment</h1>
      
      {structure && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="mb-2"><strong>Student:</strong> {structure.student?.std_name || 'N/A'}</p>
          <p className="mb-2"><strong>Course:</strong> {structure.student?.std_course?.course_name || 'N/A'}</p>
          <p className="mb-2"><strong>Total Fee:</strong> ₹ {structure.total || 'N/A'}</p>
          <p className="mb-2"><strong>Amount Already Paid:</strong> ₹ {totalPaid.toFixed(2)}</p>
          <p className={`font-semibold ${balance <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
            <strong>Remaining Balance:</strong> ₹ {balance.toFixed(2)}
          </p>
          {balance <= 0 && <p className="text-green-600 text-sm mt-1">✓ All fees have been paid</p>}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Payment Date</label>
          <input
            type="date"
            name="payDate"
            value={formData.payDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Amount Paid (₹)</label>
          <input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            step="0.01"
            min="0"
            max={balance}
            required
          />
          {balance > 0 && (
            <p className="text-sm text-gray-600 mt-1">Maximum amount: ₹ {balance.toFixed(2)}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || balance <= 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Payment'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayment;