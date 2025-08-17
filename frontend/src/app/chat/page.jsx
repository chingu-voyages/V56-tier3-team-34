'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import './chat.css';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'waiting', 'success', 'error'
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    setStatus('waiting');
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          user_role: user?.role || 'guest'
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = { text: '', sender: 'bot' };

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setStatus('success');
              setIsLoading(false);
              return;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n\n').filter(line => line.startsWith('data:'));

            for (const line of lines) {
              try {
                const data = JSON.parse(line.replace('data: ', ''));
                
                if (data.status === 'waiting') {
                  setStatus('waiting');
                } else if (data.status === 'success') {
                  botMessage.text = data.message;
                  setMessages(prev => [...prev.slice(0, -1), botMessage]);
                  setStatus('success');
                } else if (data.status === 'error') {
                  setMessages(prev => [...prev, { text: data.message, sender: 'bot', isError: true }]);
                  setStatus('error');
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        } catch (error) {
          console.error('Stream reading error:', error);
          setMessages(prev => [...prev, { text: 'Error receiving response.', sender: 'bot', isError: true }]);
          setStatus('error');
          setIsLoading(false);
        }
      };

      // Add empty bot message as placeholder
      setMessages(prev => [...prev, botMessage]);
      processStream();
    } catch (error) {
      console.error('Fetch error:', error);
      setMessages(prev => [...prev, { text: 'Failed to send message.', sender: 'bot', isError: true }]);
      setStatus('error');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="chat-container">
        <div className="chat-history">
          {messages.length === 0 && !isLoading && (
            <div className="no-messages">
              <img src="/doc.webp" alt="Doctor" className="doctor-image" />
              <p>Welcome! Ask me anything about the Surgence app.</p>
            </div>
          )}
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
              <div className="typing-indicator">
                <div className="pulsating-dot"></div>
                <div className="pulsating-dot"></div>
                <div className="pulsating-dot"></div>
              </div>
            </div>
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
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
