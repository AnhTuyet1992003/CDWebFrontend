import React, { useEffect, useState } from 'react';
import axios, {post} from 'axios';
import { jwtDecode } from 'jwt-decode';
import Chatbox from './Chatbox';

import Cookies from 'js-cookie';


import './user-profile-edit.css'
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// jQuery (nếu cần dùng)
import $ from 'jquery';

// Bootstrap JS (bundle includes popper.js)
import 'bootstrap/dist/js/bootstrap.bundle.min';


const UserPasswordEdit = () => {
    const [user2, setUser2] = useState({
        password: '',
        newPassword: '',
        reNewPassword: ''
    });

    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setUser2({ ...user2, [e.target.name]: e.target.value });
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

        // if (!user2.password) {
        //     newErrors.password = 'Vui lòng nhập mật khẩu.';
        // } else if (!passwordRegex.test(user2.password)) {
        //     newErrors.password = 'Mật khẩu ít nhất 7 ký tự, bao gồm chữ và số.';
        // }
        //
        // if (!user2.newPassword) {
        //     newErrors.newPassword = 'Vui lòng nhập mật khẩu.';
        // } else if (!passwordRegex.test(user2.passnewPasswordword)) {
        //     newErrors.newPassword = 'Mật khẩu ít nhất 7 ký tự, bao gồm chữ và số.';
        // }

        if (!user2.reNewPassword) {
            newErrors.retypePassword = 'Vui lòng nhập lại mật khẩu.';
        } else if (user2.newPassword !== user2.reNewPassword) {
            newErrors.retypePassword = 'Mật khẩu không khớp.';
        }
        return newErrors;
    };
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        // const token = document.cookie
        //     .split('; ')
        //     .find(row => row.startsWith('token='))
        //     ?.split('=')[1];
        const token = localStorage.getItem('accessToken');
        console.log("accessToken" + token)


        try {
            const res = await axios.put(
                `https://localhost:8443/api/v1/users/changePassword/${userId}`,
                user2,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            setMessage('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);

            // Kiểm tra lỗi từ response
            if (error.response && error.response.data) {
                // Nếu có lỗi từ backend, lấy thông điệp từ response và hiển thị
                setMessage(error.response.data);  // Hiển thị thông điệp lỗi từ backend
            } else {
                // Nếu không có lỗi response, hiển thị thông báo chung
                setMessage('Lỗi khi cập nhật thông tin');
            }
        }
    };

    useEffect(() => {
        // const token = document.cookie
        //     .split('; ')
        //     .find(row => row.startsWith('token='))
        //     ?.split('=')[1];
        const token = localStorage.getItem('accessToken');
        // Cookies.get('token');

        console.log("token profile: "+token)


        if (!token) {
            setMessage('Bạn chưa đăng nhập');
            return;
        }

        const decoded = jwtDecode(token);

        axios.post(`https://localhost:8443/api/v1/users/details`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        })
            .then(res => {
                const userData = res.data;
                setUserId(userData.id);
            })
            .catch(err => {
                console.error(err);
                setMessage('Lỗi khi tải thông tin người dùng');
            });
    }, []);

    return (
        <>

            <div className="containerEdit light-style flex-grow-1 container-p-y">

                <h4 className="font-weight-bold py-3 mb-4">
                    Chỉnh sửa thông tin cá nhân
                </h4>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="card2-body pb-2">

                        {errors.password && (
                            <div className="error-container">
                                <small className="error">{errors.password}</small>
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">Current password</label>
                            <input type="password" name="password" value={user2.password} onChange={handleChange}
                                   required={true} className="form-control"/>
                        </div>
                        {errors.newPassword && (
                            <div className="error-container">
                                <small className="error">{errors.newPassword}</small>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">New password</label>
                            <input type="password" name="newPassword" value={user2.newPassword} onChange={handleChange}
                                   required={true} className="form-control"/>
                        </div>
                        {errors.reNewPassword && (
                            <div className="error-container">
                                <small className="error">{errors.reNewPassword}</small>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Repeat new password</label>
                            <input type="password" name="reNewPassword" value={user2.reNewPassword}
                                   onChange={handleChange} required={true} className="form-control"/>
                        </div>
                        {errors.password && (
                            <div className="error-container">
                                <small className="error">{errors.password}</small>
                            </div>
                        )}

                        <div className="text-right mt-3">
                            <button type="submit" className="btn btn-primary">Save changes</button>
                            &nbsp;
                            <button type="button" className="btn btn-default">Cancel</button>
                        </div>

                    </div>
                </form>
            </div>

        </>
    );
};
export default UserPasswordEdit
