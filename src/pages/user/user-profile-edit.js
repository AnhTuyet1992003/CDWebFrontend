import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserProfileEdit = () => {
    const [user, setUser] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        birthday: '',
    });

    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    // Load user info from token
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            setMessage('Bạn chưa đăng nhập');
            return;
        }

        const decoded = jwtDecode(token);
        const username = decoded.sub;

        axios.post(`http://localhost:8080/api/v1/users/details`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                const userData = res.data;
                const formattedBirthday = userData.birthday + "T00:00:00"; // ghép thêm giờ phút giây
                setUser({
                    fullname: userData.fullname || '',
                    username: userData.username || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    birthday: userData.formattedBirthday || '',
                });
                setUserId(userData.id);
            })
            .catch(err => {
                console.error(err);
                setMessage('Lỗi khi tải thông tin người dùng');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        try {
            const res = await axios.put(
                `http://localhost:8080/api/v1/users/details/${userId}`,
                user,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);
            setMessage('Lỗi khi cập nhật thông tin');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Cập nhật thông tin người dùng</h2>
            {message && <div className="mb-4 text-red-500">{message}</div>}
            <form onSubmit={handleUpdate} className="space-y-4">
                <input type="text" name="fullname" value={user.fullname} onChange={handleChange} placeholder="Họ tên" className="w-full p-2 border rounded" />
                <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Tên đăng nhập" className="w-full p-2 border rounded" />
                <input type="text" name="phone" value={user.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full p-2 border rounded" />
                <input type="text" name="address" value={user.address} onChange={handleChange} placeholder="Địa chỉ" className="w-full p-2 border rounded" />
                <input type="date" name="birthday" value={user.birthday} onChange={handleChange} className="w-full p-2 border rounded" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Lưu thay đổi</button>
            </form>
        </div>
    );
};

export default UserProfileEdit;
