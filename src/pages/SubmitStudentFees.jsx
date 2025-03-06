import React, { useState, useEffect } from 'react';

const SubmitStudentFees = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://kodu-erp.onrender.com/api/students/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setStudents(data);
        } else {
          alert(data.message || 'Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [token]);

  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedStudentId || !feeAmount) {
      alert('Please select a student and enter the fee amount');
      setLoading(false);
      return;
    }

    try {
      const amountInPaise = feeAmount * 100;
      const response = await fetch('https://kodu-erp.onrender.com/api/fees/create-payment-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          studentId: selectedStudentId,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setPaymentLink(result.short_url);
        setQrCode(result.qr_code_url);
        alert('Order created successfully! Please proceed with the payment.');

        const options = {
          key: 'rzp_test_16AlwZgy97TEw2',
          amount: result.amount,
          currency: 'INR',
          name: 'Student Fee Payment',
          description: 'Fee payment for student',
          image: 'https://example.com/logo.png',
          order_id: result.order_id,
          handler: async function (response) {
            console.log('Payment ID:', response.razorpay_payment_id);
            console.log('Order ID:', response.razorpay_order_id);
            await verifyPayment(response.razorpay_payment_id, response.razorpay_order_id);
          },
          prefill: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            contact: '1234567890',
          },
          theme: {
            color: '#F37254',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        alert(result.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Error creating payment order:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId, orderId) => {
    try {
      const response = await fetch('https://kodu-erp.onrender.com/api/fees/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentId,
          orderId,
          studentId: selectedStudentId,
          totalFee: feeAmount,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setPaymentStatus('Payment Verified');
        alert('Payment successfully verified!');
      } else {
        setPaymentStatus('Payment Verification Failed');
        alert(result.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentStatus('Payment Verification Failed');
      alert('Payment verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Submit Student Fee
        </h2>

        {loading && <div className="text-center text-indigo-600">Loading...</div>}

        <form onSubmit={handleFeeSubmit} className="space-y-6">
          <div>
            <label htmlFor="student" className="block text-sm font-medium text-gray-700">
              Select Student
            </label>
            <select
              id="student"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="feeAmount" className="block text-sm font-medium text-gray-700">
              Fee Amount
            </label>
            <input
              type="number"
              id="feeAmount"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter total fee"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Fee'}
          </button>
        </form>

        {paymentLink && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="text-lg font-semibold text-green-700">Payment Link:</h3>
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Click here to pay
            </a>
          </div>
        )}

        {qrCode && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Scan QR Code:</h3>
            <img src={qrCode} alt="QR Code for payment" className="w-48 h-48" />
          </div>
        )}

        {paymentLink && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Verify Payment</h3>
            <button
              onClick={() => verifyPayment('payment_test_123588')}
              className="mt-3 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Verify Payment
            </button>
          </div>
        )}

        {paymentStatus && (
          <div className="mt-6 text-center">
            <p
              className={`text-lg font-semibold ${
                paymentStatus === 'Payment Verified' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {paymentStatus}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitStudentFees;
