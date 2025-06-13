import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
    const { t, i18n } = useTranslation();
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
            setError(t('validation.email_notBlank'));
            setIsLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            setError(t('validation.email_invalid'));
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

            const emailCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('email='));
            console.log("email" + email);
            if (!emailCookie) {
                setError(t('forgotPassword.no_email_cookie'));
                setIsLoading(false);
                return;
            }

            setSuccess(t('forgotPassword.otp_sent'));
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
                    setError(t('forgotPassword.unregistered_email'));
                } else if (status === 400) {
                    setError(data || t('forgotPassword.invalid_data'));
                } else {
                    setError(t('forgotPassword.otp_error'));
                }
            } else {
                setError(t('forgotPassword.server_error'));
            }
        }
    };

    return (
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
                            backgroundColor: '#ffffff',
                            border: '2px solid #000000',
                            borderRadius: '8px'
                        }}>
                            <form className="reset-password-form" onSubmit={handleForgotPassSubmit} method="post">
                                <h4 className="mb-3">{t('forgotPassword.title')}</h4>
                                <p>{t('forgotPassword.instructions')}</p>
                                <ol className="list-unstyled">
                                    <li><span>1. </span>{t('forgotPassword.step1')}</li>
                                    <li><span>2. </span>{t('forgotPassword.step2')}</li>
                                    <li><span>3. </span>{t('forgotPassword.step3')}</li>
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
                                        placeholder={t('forgotPassword.email_placeholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ fontFamily: 'Courier New' }}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mb-6">
                                    <button type="submit" className="btn" disabled={isLoading}>
                                        {isLoading ? t('forgotPassword.sending') : t('forgotPassword.send_otp')}
                                    </button>
                                    <Link to="/login" className="signup-image-link">
                                        <FontAwesomeIcon style={{ fontSize: '22px' }} icon={faUser} /> {t('forgotPassword.back')}
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