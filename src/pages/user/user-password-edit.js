import React, { useEffect, useState } from 'react';
import axios, {post} from 'axios';
import { jwtDecode } from 'jwt-decode';
import Chatbox from './Chatbox';
import Swal from 'sweetalert2';
import {Link, useNavigate} from 'react-router-dom';

import Cookies from 'js-cookie';


import './user-profile-edit.css'
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// jQuery (nếu cần dùng)
import $ from 'jquery';

// Bootstrap JS (bundle includes popper.js)
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock, faUser} from "@fortawesome/free-solid-svg-icons";


const UserPasswordEdit = () => {
    const navigate = useNavigate();
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
            Swal.fire({
                icon: 'success',
                title: '✅ Đã cập nhật mật khẩu thành công!',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate('/home');
            });
        } catch (error) {
            console.error(error);

            if (error.response) {
                if (error.response.status === 403) {
                    Swal.fire('Lỗi!', 'Mật khẩu bạn nhập vào không đúng.', 'error');
                } else if (error.response.data) {
                    setMessage(error.response.data);  // hoặc hiển thị alert tùy bạn
                } else {
                    Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật mật khẩu.', 'error');
                }
            } else {
                Swal.fire('Lỗi!', 'Không thể kết nối đến máy chủ.', 'error');
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
                Swal.fire({
                    icon: 'warning',
                    title: '⚠️ Bạn chưa đăng nhập.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/login');
                });
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
                Swal.fire('Lỗi!', 'Lỗi khi tải thông tin người dùng.', 'error');
                // setMessage('Lỗi khi tải thông tin người dùng');
            });
    }, []);

    return (
        <>

            <div className="containerEdit light-style flex-grow-1 container-p-y">
                <section className="signup">
                    <div className="container-auth">
                        <div className="signup-content">
                            <form className="signup-form" onSubmit={handleUpdatePassword}>
                                <h2 className="form-title">Chỉnh sửa mật khẩu </h2>

                                <div className="form-group">
                                    {/*<label><FontAwesomeIcon icon={faLock}/></label>*/}
                                    <input type="password" name="password" value={user2.password}
                                           onChange={handleChange}
                                           required={true} className="form-control"
                                           placeholder="Mật khẩu"/>
                                </div>
                                {errors.password && (
                                    <div className="error-container">
                                        <small className="error">{errors.password}</small>
                                    </div>
                                )}

                                <div className="form-group">
                                    {/*<label><FontAwesomeIcon icon={faLock}/></label>*/}
                                    <input type="password" name="newPassword" value={user2.newPassword}
                                           onChange={handleChange}
                                           required={true} className="form-control"
                                           placeholder="Mật khẩu mới"/>
                                </div>
                                {errors.newPassword && (
                                    <div className="error-container">
                                        <small className="error">{errors.newPassword}</small>
                                    </div>
                                )}


                                {/* Retype Password */}
                                <div className="form-group">
                                    {/*<label><FontAwesomeIcon icon={faLock}/></label>*/}
                                    <input type="password" name="reNewPassword" value={user2.reNewPassword}
                                           onChange={handleChange} required={true} className="form-control"
                                           placeholder="Nhập lại mật khẩu mới"/>
                                </div>
                                {errors.reNewPassword && (
                                    <div className="error-container">
                                        <small className="error">{errors.reNewPassword}</small>
                                    </div>
                                )}


                                {/* Submit Button */}
                                <div className="form-group form-button">
                                    <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                                    <button type="button" className="btn btn-default">Hủy</button>
                                </div>

                                {/* Tổng lỗi chung (nếu có) */}
                                {message && (
                                    <p style={{color: 'red', whiteSpace: 'pre-wrap'}}>{message}</p>
                                )}
                            </form>

                        </div>
                    </div>
                </section>

            </div>

        </>
    );
};
export default UserPasswordEdit
