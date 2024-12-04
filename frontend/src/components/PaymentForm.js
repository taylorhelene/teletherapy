import React, { useState } from 'react';
import { processPayment } from '../services/apiService';

const PaymentForm = ({ sessionId }) => {
  const [amount, setAmount] = useState(0);

  const handlePayment = async () => {
    try {
      const response = await processPayment({ sessionId, amount });
      console.log('Payment processed:', response);
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <div>
      <h1>Payment for Session {sessionId}</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <button onClick={handlePayment}>Pay via M-Pesa</button>
    </div>
  );
};

export default PaymentForm;
