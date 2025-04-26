import React, { useState } from 'react';
import axios from 'axios';

const Chatbox = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    // const sendMessage = async () => {
    //     if (!input.trim()) return;
    //
    //     const userMessage = { sender: 'user', text: input };
    //     setMessages(prev => [...prev, userMessage]);
    //
    //     setInput('');
    //
    //     try {
    //         const token = localStorage.getItem('accessToken');
    //         console.log("token trong chatbox: " + token);
    //
    //         const response = await axios.post(
    //             'https://localhost:8443/api/v1/chat/send',
    //             { userMessage: input }, // gửi đúng dạng JSON
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json', // THÊM dòng này
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );
    //
    //         const botReply = {
    //             sender: 'bot',
    //             text: JSON.parse(response.data).choices[0].message.content
    //         };
    //         setMessages(prev => [...prev, botReply]);
    //     } catch (error) {
    //         console.error(error);
    //         alert('Lỗi khi gửi tin nhắn!');
    //     }
    // };
    // const sendMessage = async () => {
    //     if (!input.trim()) return;
    //
    //     const userMessage = { sender: 'user', text: input };
    //     setMessages(prev => [...prev, userMessage]);
    //
    //     setInput('');
    //
    //     try {
    //         const token = localStorage.getItem('accessToken');
    //         console.log("Token trong chatbox: " + token);
    //
    //         const response = await axios.post(
    //             'https://localhost:8443/api/v1/chat/send',
    //             {
    //                 userMessage: input // Gửi đúng data là { userMessage: 'text' }
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json', // Cài đặt content-type đúng
    //                     Authorization: `Bearer ${token}`,  // Đảm bảo token có sẵn
    //                 },
    //             }
    //         );
    //
    //         // Xử lý phản hồi từ backend
    //         // const botReply = {
    //         //     sender: 'bot',
    //         //     text: response.data.choices[0].message.content,
    //         // };
    //         console.log(response.data);
    //         const botReply = {
    //             sender: 'bot',
    //             text: response.data.message.content,  // Lấy thẳng từ message.content
    //         };
    //         // Kiểm tra cấu trúc dữ liệu trả về
    //
    //
    //         setMessages(prev => [...prev, botReply]);
    //     } catch (error) {
    //         console.error(error);
    //         alert('Lỗi khi gửi tin nhắn!');
    //     }
    // };
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
                {
                    userMessage: input // Gửi đúng data là { userMessage: 'text' }
                },
                {
                    headers: {
                        'Content-Type': 'application/json', // Cài đặt content-type đúng
                        Authorization: `Bearer ${token}`,  // Đảm bảo token có sẵn
                    },
                }
            );

            // Xử lý phản hồi từ backend
            console.log(response.data); // Kiểm tra dữ liệu trả về

            const botReply = {
                sender: 'bot',
                text: response.data,  // Gán phản hồi trực tiếp vào text
            };

            setMessages(prev => [...prev, botReply]);
        } catch (error) {
            console.error(error);
            alert('Lỗi khi gửi tin nhắn!');
        }
    };




    return (
        <div style={{ width: 300, position: 'fixed', bottom: 20, right: 20, background: '#fff', border: '1px solid #ddd', borderRadius: 10, padding: 10, boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
            <div style={{ height: 200, overflowY: 'auto', marginBottom: 10 }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        <b>{msg.sender === 'user' ? 'Bạn' : 'Bot'}:</b> {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ width: '70%' }}
                placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage} style={{ width: '28%', marginLeft: '2%' }}>Gửi</button>
        </div>
    );
};

export default Chatbox;
