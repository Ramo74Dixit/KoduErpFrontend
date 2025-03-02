import React, { useState, useEffect } from 'react';

const SubmitStudentFees = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const token = localStorage.getItem('token'); // Token for authentication

  // Fetch all students when the component mounts
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
          setStudents(data); // Store students in state
        } else {
          alert(data.message || 'Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [token]);

  // Handle fee submission and Razorpay order creation
  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!selectedStudentId || !feeAmount) {
      alert('Please select a student and enter the fee amount');
      setLoading(false);
      return;
    }
  
    try {
      // Convert feeAmount to paise (Razorpay expects the amount in paise)
      const amountInPaise = feeAmount * 100;

      // Call backend to create Razorpay order
      const response = await fetch('https://kodu-erp.onrender.com/api/fees/create-payment-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR', // Default to INR
          studentId: selectedStudentId,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        // Success: Razorpay order created
        setPaymentLink(result.short_url); // Assuming your backend returns a URL
        setQrCode(result.qr_code_url); // Assuming your backend provides a QR code URL
        alert('Order created successfully! Please proceed with the payment.');
  
        // Trigger Razorpay Checkout popup here
        const options = {
          key: 'rzp_test_16AlwZgy97TEw2', // Replace with your Razorpay key
          amount: result.amount, // Amount in paise
          currency: 'INR',
          name: 'Student Fee Payment',
          description: 'Fee payment for student',
          image: 'https://example.com/logo.png', // Optional: Your logo URL
          order_id: result.order_id, // Order ID from backend
          handler: async function (response) {
            // Log paymentId and orderId for debugging
            console.log('Payment ID:', response.razorpay_payment_id);
            console.log('Order ID:', response.razorpay_order_id);
            const paymentId = response.razorpay_payment_id;
            const orderId = response.razorpay_order_id;

            // Call the verifyPayment function with both the paymentId and orderId
            await verifyPayment(paymentId, orderId); 
          },
          prefill: {
            name: 'John Doe', // Optional: Pre-fill name
            email: 'john.doe@example.com', // Optional: Pre-fill email
            contact: '1234567890', // Optional: Pre-fill contact number
          },
          theme: {
            color: '#F37254', // Optional: Customize theme color
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

  // Verify payment after success
  const verifyPayment = async (paymentId, orderId) => {
    try {
      const response = await fetch('https://kodu-erp.onrender.com/api/fees/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentId: paymentId,
          orderId: orderId,  // Send orderId for verification
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
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">Submit Fees for Student</h2>

      {loading && <p>Loading...</p>}

      <form onSubmit={handleFeeSubmit} className="space-y-4">
        <div>
          <label htmlFor="student" className="block text-sm font-medium">Select Student</label>
          <select
            id="student"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="block w-full mt-2 p-2 border border-gray-300 rounded"
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
          <label htmlFor="feeAmount" className="block text-sm font-medium">Fee Amount</label>
          <input
            type="number"
            id="feeAmount"
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            className="block w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="Enter total fee"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Fee'}
        </button>
      </form>

      {paymentLink && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Payment Link:</h3>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Click here to pay
          </a>
        </div>
      )}

      {qrCode && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Scan QR Code:</h3>
          <img src={qrCode} alt="QR Code for payment" className="w-48 h-48" />
        </div>
      )}

      {/* Verify Payment after payment is successful */}
      {paymentLink && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Verify Payment</h3>
          <button
            onClick={() => verifyPayment('payment_test_123588')} // Replace with actual paymentId
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Verify Payment
          </button>
        </div>
      )}

      {paymentStatus && (
        <div className="mt-6">
          <p className="text-lg font-semibold">{paymentStatus}</p>
        </div>
      )}
    </div>
  );
};

export default SubmitStudentFees;
