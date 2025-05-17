
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import {colors} from "@mui/material";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Xóa fragment #_=_ nếu có
        if (window.location.hash === '#_=_') {
            window.history.replaceState(null, null, window.location.href.split('#')[0]);
        }
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleForgotPassSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Kiểm tra định dạng email
        if (!email) {
            setError('Vui lòng nhập email.');
            setIsLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            setError('Email không hợp lệ.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'https://localhost:8443/api/v1/users/forgotPass',
                { email },
                { withCredentials: true }
            );

            console.log('Phản hồi từ server:', response.data);

            // Kiểm tra cookie email từ server
            //const emailCookie = Cookies.get('email');
            const emailCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('email='))
               console.log("email"+ email)
            if (!emailCookie) {
                setError('Không tìm thấy cookie email. Vui lòng thử lại.');
                setIsLoading(false);
                return;
            }

            setSuccess('OTP đã được gửi đến email của bạn!');
            setTimeout(() => {
                console.log('Chuyển hướng đến /validate-otp');
                navigate('/validate-otp');
            }, 2000);
        } catch (error) {
            console.error('Gửi OTP thất bại:', error);
            setIsLoading(false);
            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    setError('Email chưa được đăng ký.');
                } else if (status === 400) {
                    setError(data || 'Dữ liệu không hợp lệ.');
                } else {
                    setError('Lỗi khi gửi OTP. Vui lòng thử lại.');
                }
            } else {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
            }
        }
    };

    return (
        // <div className="container-fluid" >
        <div
            className="container-fluid d-flex justify-content-center align-items-center"
            style={{
                height: '110vh',

                backgroundColor: '#81b8ee' // xanh dương nhạt
            }}
        >
            <div className="row">
                <div className="col-lg-6 col-md-6 form-container">
                    <div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box">
                        <div className="reset-form d-block" style={{
                            width: '70vh',
                            padding: '10px',
                            backgroundColor: '#ffffff', // xanh dương nhạt
                            border: '2px solid #000000', // viền đen
                            borderRadius: '8px' // (tuỳ chọn) bo góc nhẹ cho đẹp
                        }}>
                            <form className="reset-password-form" onSubmit={handleForgotPassSubmit} method="post">
                                <h4 className="mb-3">Cấp lại mật khẩu</h4>
                                <p>Thực hiện việc thay đổi mật khẩu theo 3 bước sau để bảo mật an toàn:</p>
                                <ol className="list-unstyled">
                                    <li><span>1. </span>Nhập địa chỉ email của bạn</li>
                                    <li><span>2. </span>Hệ thống sẽ gửi mã OTP tới email của bạn</li>
                                    <li><span>3. </span>Nhập mã OTP bạn nhận được</li>
                                </ol>
                                {success && (
                                    <div className="alert alert-success" role="alert">
                                        {success}
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <div className="form-input">
                                    <span><i className="fa fa-envelope"></i></span>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Email của bạn"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{fontFamily: 'Courier New'}}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mb-6">
                                    <button type="submit" className="btn" disabled={isLoading}>
                                        {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                                    </button>
                                    <Link to="/login" className="signup-image-link">
                                        <FontAwesomeIcon style={{fontSize: '22px'}} icon={faUser}/> Quay lại
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;