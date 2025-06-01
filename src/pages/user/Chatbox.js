import React, { useState } from 'react';
import axios from 'axios';

const Chatbox = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isChatVisible, setIsChatVisible] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);

        setInput('');

        try {
            const token = localStorage.getItem('accessToken');
            console.log("Token trong chatbox: " + token);

            const response = await axios.post(
                'https://localhost:8443/api/v1/chat/send',
                { userMessage: input },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data);

            const botReply = { sender: 'bot', text: response.data };
            setMessages(prev => [...prev, botReply]);
        } catch (error) {
            console.error(error);
            alert('Lỗi khi gửi tin nhắn!');
        }
    };

    return (
        <>
            {!isChatVisible && (
                <div
                    style={{
                        width: 50,
                        height: 50,
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        background: '#007bff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        cursor: 'pointer',
                        boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                    }}
                    onClick={() => setIsChatVisible(true)}
                >
                    ✉
                </div>
            )}
            {isChatVisible && (
                <div style={{
                    width: 370,
                    height: 500,
                    position: 'fixed',
                    bottom: 30,
                    right: 20,
                    background: 'linear-gradient(to bottom, #ffafcc, #a2d2ff)',
                    borderRadius: 10,
                    padding: 10,
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#fff', padding: '10px 0' }}>
                            <span role="img" aria-label="robot">🤖</span> Chat Bot
                        </div>
                        <button
                            onClick={() => setIsChatVisible(false)}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontSize: '18px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '10px',
                        marginBottom: '10px'
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                textAlign: msg.sender === 'user' ? 'right' : 'left',
                                margin: '5px 0',
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                {msg.sender === 'bot' && (
                                    <span role="img" aria-label="robot" style={{ marginRight: '5px' }}>🤖</span>
                                )}
                                <div style={{
                                    display: 'inline-block',
                                    background: msg.sender === 'user' ? '#fff' : '#e0e0e0',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    maxWidth: '70%'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: 'none',
                                borderRadius: '20px',
                                outline: 'none'
                            }}
                            placeholder="Nhập tin nhắn..."
                        />
                        <span role="img" aria-label="emoji" style={{ marginLeft: '10px', cursor: 'pointer' }}>😊</span>
                        <span role="img" aria-label="mic" style={{ marginLeft: '10px', cursor: 'pointer' }}>🎤</span>
                        <button
                            onClick={sendMessage}
                            style={{
                                padding: '8px 15px',
                                border: 'none',
                                borderRadius: '20px',
                                background: '#007bff',
                                color: '#fff',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbox;