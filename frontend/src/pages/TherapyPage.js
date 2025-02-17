import React, { useState } from 'react';
import Chatbot from '../components/Chatbot';
import { initiateSession, proceedToPayment, completePayment } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const TherapyPage = () => {
    const [sessionId, setSessionId] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const userId = sessionStorage.getItem('userId');
    const navigate = useNavigate();

    const startSession = async () => {
        if (!userId) {
            alert('User not logged in. Please log in to start a session.');
            return;
        }
        try {
            const response = await initiateSession({ userId, sessionType: 'therapy' });
            if (response.redirectToPayment) {
                setShowPayment(true);
                setPaymentDetails({
                    sessionId: response.sessionId,
                    amount: 50,
                    phoneNumber: '',
                    userId,
                });
            } else {
                setSessionId(response.sessionId);
            }
        } catch (error) {
            console.error('Error starting session:', error);
        }
    };

    const handlePhoneChange = (e) => {
        const phone = e.target.value;
        setPhoneNumber(phone);
        const phoneRegex = /^254\d{9}$/;
        setIsPhoneValid(phoneRegex.test(phone));
    };

    const handlePayment = async () => {
        if (!isPhoneValid) {
            alert('Please enter a valid phone number.');
            return;
        }
        try {
            const updatedPaymentDetails = { ...paymentDetails, phoneNumber };
            const response = await proceedToPayment(updatedPaymentDetails);
            if (response.success) {
                const response2 = await completePayment(updatedPaymentDetails);
                if (response2.success) {
                    alert('Payment Successful! You can continue chatting.');
                    setShowPayment(false);
                    setSessionId(paymentDetails.sessionId);
                } else {
                    alert('Payment failed, please try again.');
                }
            } else {
                alert('Payment not started, please try again.');
            }
        } catch (error) {
            alert('Error processing payment:', error);
        }
    };

    return (
        <div className="container-fluid home-page">
            <h1 className="text-center">Therapy Session</h1>
            <div className="text-center">
                <button className="rounded-pill auth-button " onClick={startSession}>
                    Start Therapy Session
                </button>
            </div>
            {sessionId && <Chatbot sessionId={sessionId} />}
            {showPayment && (
                <div className="payment-section">
                    <h2>Payment Required</h2>
                    <p>You have exceeded your 50 free sessions. Please pay KSH 50 to continue.</p>
                    <div>
                        <label htmlFor="phoneNumber">Enter your phone number (Kenya):</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="2547XXXXXXXX"
                            className="form-control"
                        />
                        {!isPhoneValid && phoneNumber && (
                            <p style={{ color: 'red' }}>Please enter a valid phone number.</p>
                        )}
                    </div>
                    <button
                        className="btn btn-info"
                        onClick={handlePayment}
                        disabled={!isPhoneValid}
                    >
                        Pay Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default TherapyPage;
