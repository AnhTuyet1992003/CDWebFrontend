
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const ValidateOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!otp) {
            setError('Vui lòng nhập mã OTP.');
            setIsLoading(false);
            return;
        }

        try {
            const email = Cookies.get('email'); // Lấy email từ cookie
            if (!email) {
                setError('Phiên xác thực không hợp lệ. Vui lòng thử lại từ đầu.');
                setIsLoading(false);
                navigate('/forgot-password');
                return;
            }

            const response = await axios.post(
                'https://localhost:8443/api/v1/users/validateOtp',
                { otp, email },
                { withCredentials: true }
            );

            setSuccess('OTP hợp lệ!');
            setIsLoading(false);
            setTimeout(() => {
                navigate('/new-password');
            }, 2000);
        } catch (error) {
            console.error('Xác thực OTP thất bại:', error);
            setIsLoading(false);
            if (error.response) {
                const { status, data } = error.response;
                // Xử lý response lỗi là object
                const errorMessage = typeof data === 'string' ? data : data.error || 'OTP hoặc email không hợp lệ.';
                if (status === 401) {
                    setError(errorMessage);
                } else if (status === 400) {
                    setError(errorMessage);
                } else {
                    setError('Lỗi khi xác thực OTP. Vui lòng thử lại.');
                }
            } else {
                setError('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
            }
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{
            height: '110vh',

            backgroundColor: '#81b8ee' // xanh dương nhạt
        }}>
            <div className="row">
                <div className="col-lg-6 col-md-6 form-container">
                    <div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box">
                        <div className="reset-form d-block" style={{
                            width: '70vh',
                            padding: '10px',
                            backgroundColor: '#ffffff', // xanh dương nhạt
                            border: '2px solid #000000', // viền đen
                            borderRadius: '8px' //
                        }}>
                            <form className="reset-password-form" onSubmit={handleInputOtpSubmit} method="post">
                                <h4 className="mb-3">Xác thực OTP</h4>
                                <p>Nhập mã OTP đã được gửi đến email của bạn.</p>
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
                                    <span><i className="fa fa-key"></i></span>
                                    <input
                                        type="text"
                                        name="otp"
                                        id="otp"
                                        placeholder="Mã OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        style={{ fontFamily: 'Courier New' }}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mb-6">
                                    <button type="submit" className="btn" disabled={isLoading}>
                                        {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
                                    </button>
                                    <Link to="/forgot-password" className="signup-image-link">
                                        <i className="fa fa-arrow-left"></i> Quay lại
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

export default ValidateOtp;