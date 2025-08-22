// components/SmartChatbot.js
import { useState, useEffect, useRef } from 'react';

const SmartChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi! I'm Alex, your shopping assistant. I can help you find products, answer questions about orders, shipping, and more! What can I help you with today? 😊", 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageToAPI = async (userMessage) => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      return {
        response: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our support team directly.",
        error: true
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update conversation history for context
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: inputMessage }
    ];
    setConversationHistory(newHistory);
    
    setInputMessage('');
    setIsTyping(true);

    // Get AI response
    const apiResponse = await sendMessageToAPI(inputMessage);
    
    setIsTyping(false);

    const botMessage = {
      id: Date.now() + 1,
      text: apiResponse.response,
      sender: 'bot',
      timestamp: new Date(),
      products: apiResponse.products || []
    };

    setMessages(prev => [...prev, botMessage]);
    
    // Update conversation history
    setConversationHistory([
      ...newHistory,
      { role: 'assistant', content: apiResponse.response }
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickResponses = [
    "Show me electronics 📱",
    "What's on sale? 💰",
    "Track my order 📦",
    "Return policy ↩️",
    "Need help choosing 🤔"
  ];

  const handleQuickResponse = (response) => {
    setInputMessage(response);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Styles (same as before but with enhancements)
  const chatbotButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const chatWindowStyle = {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    width: '380px',
    height: '600px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    display: isOpen ? 'flex' : 'none',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #e5e7eb'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#fafafa'
  };

  const messageStyle = (sender) => ({
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '18px',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'user' ? '#2563eb' : 'white',
    color: sender === 'user' ? 'white' : '#374151',
    fontSize: '14px',
    lineHeight: '1.5',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    boxShadow: sender === 'bot' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
  });

  const inputContainerStyle = {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '8px',
    backgroundColor: 'white'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '24px',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: '#f9fafb'
  };

  const sendButtonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <>
      {/* Chat Window */}
      <div style={chatWindowStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '16px' }}>Alex - Shopping Assistant</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>🟢 Online • Powered by AI</div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={messagesContainerStyle}>
          {messages.map((message) => (
            <div key={message.id}>
              <div style={messageStyle(message.sender)}>
                {message.text}
              </div>
              
              {/* Show products if any */}
              {message.products && message.products.length > 0 && (
                <div style={{ marginTop: '8px', marginLeft: message.sender === 'bot' ? '0' : 'auto' }}>
                  {message.products.map((product, index) => (
                    <div key={index} style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px',
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      <strong>{product.name}</strong> - ${product.price}
                      <br />
                      <span style={{ color: '#6b7280' }}>{product.stock} in stock</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div style={messageStyle('bot')}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span>Alex is typing</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1s infinite' }}></div>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1s infinite 0.1s' }}></div>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1s infinite 0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Responses */}
        {messages.length <= 2 && (
          <div style={{
            padding: '8px 16px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            backgroundColor: 'white'
          }}>
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                {response}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={inputContainerStyle}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            style={inputStyle}
            disabled={isTyping}
          />
          <button 
            onClick={handleSendMessage} 
            style={sendButtonStyle}
            disabled={isTyping || !inputMessage.trim()}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...chatbotButtonStyle,
          transform: isOpen ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        {isOpen ? '×' : '🤖'}
      </button>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
};

export default SmartChatbot;