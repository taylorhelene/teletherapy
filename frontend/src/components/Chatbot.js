import React, { useState } from 'react';
import { getChatbotResponse } from '../services/apiService';
import '../App.css';

const Chatbot = ({ sessionId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);

        try {
            const botResponse = await getChatbotResponse(input);
            setMessages((prevMessages) => [...prevMessages, { role: 'bot', content: botResponse }]);
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
        }

        setInput('');
    };

    return (
        <div className="chat-page">
            <div className="msg-inbox">
                <div className="chats">
                    <div className="msg-page">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.role === 'user' ? 'outgoing-chats' : 'received-chats'}>
                                <div className={msg.role === 'user' ? 'outgoing-msg' : 'received-msg'}>
                                    <div className={msg.role === 'user' ? 'outgoing-chats-msg' : 'received-msg-inbox'}>
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="form-control"
                    />
                    <button className="custom-btn btn-primary" onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
