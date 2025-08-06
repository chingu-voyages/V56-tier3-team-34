'use client';
import React, { useState, useRef, useEffect } from 'react';
import './chat.css';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'waiting', 'success', 'error'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    setStatus('waiting');

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.status === 'successful') {
        setMessages(prev => [...prev, { text: data.message, sender: 'bot' }]);
        setStatus('success');
      } else {
        // Handle backend error message
        setMessages(prev => [...prev, { text: data.message, sender: 'bot', isError: true }]);
        setStatus('error');
      }
    } catch (error) {
      // Handle network or unexpected errors
      setMessages(prev => [...prev, { text: 'Something went wrong.', sender: 'bot', isError: true }]);
      setStatus('error');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}
          >
            {msg.text}
          </div>
        ))}
        {status === 'waiting' && (
          <div className="message bot">
            <div className="pulsating-dot"></div>
            <div className="pulsating-dot"></div>
            <div className="pulsating-dot"></div>
          </div>
        )}
        {status === 'error' && (
          <div className="error-message">Error occurred, please try again.</div>
        )}
        {/* You could also display a success message if needed */}
        {status === 'success' && (
          <div className="success-message">Message received!</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}