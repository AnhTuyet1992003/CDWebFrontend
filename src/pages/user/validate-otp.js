import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const ValidateOtp = () => {
    const { t, i18n } = useTranslation();
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
            setError(t('validateOtp.no_otp'));
            setIsLoading(false);
            return;
        }

        try {
            const email = Cookies.get('email'); // Lấy email từ cookie
            if (!email) {
                setError(t('validateOtp.invalid_session'));
                setIsLoading(false);
                navigate('/forgot-password');
                return;
            }

            const response = await axios.post(
                'https://localhost:8443/api/v1/users/validateOtp',
                { otp, email },
                { withCredentials: true }
            );

            setSuccess(t('validateOtp.valid_otp'));
            setIsLoading(false);
            setTimeout(() => {
                navigate('/new-password');
            }, 2000);
        } catch (error) {
            console.error('Xác thực OTP thất bại:', error);
            setIsLoading(false);
            if (error.response) {
                const { status, data } = error.response;
                const errorMessage = typeof data === 'string' ? data : data.error || t('validateOtp.invalid_otp_email');
                if (status === 401) {
                    setError(errorMessage);
                } else if (status === 400) {
                    setError(errorMessage);
                } else {
                    setError(t('validateOtp.otp_error'));
                }
            } else {
                setError(t('validateOtp.server_error'));
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
                            backgroundColor: '#ffffff',
                            border: '2px solid #000000',
                            borderRadius: '8px'
                        }}>
                            <form className="reset-password-form" onSubmit={handleInputOtpSubmit} method="post">
                                <h4 className="mb-3">{t('validateOtp.title')}</h4>
                                <p>{t('validateOtp.instructions')}</p>
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
                                        placeholder={t('validateOtp.otp_placeholder')}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        style={{ fontFamily: 'Courier New' }}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mb-6">
                                    <button type="submit" className="btn" disabled={isLoading}>
                                        {isLoading ? t('validateOtp.verifying') : t('validateOtp.verify')}
                                    </button>
                                    <Link to="/forgot-password" className="signup-image-link">
                                        <i className="fa fa-arrow-left"></i> {t('validateOtp.back')}
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