import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './styleAuth.css';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        retypePassword: ''
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullname.trim()) {
            newErrors.fullname = t('validation.fullname_notBlank');
        } else if (formData.fullname.length < 2 || formData.fullname.length > 100) {
            newErrors.fullname = t('validation.fullname_size');
        }

        if (!formData.username.trim()) {
            newErrors.username = t('validation.username_notBlank');
        } else if (formData.username.length < 3 || formData.username.length > 50) {
            newErrors.username = t('validation.username_size');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('validation.email_notBlank');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('validation.email_invalid');
        }

        if (!formData.password) {
            newErrors.password = t('validation.password_notBlank');
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/.test(formData.password)) {
            newErrors.password = t('validation.password_pattern');
        }

        if (!formData.retypePassword) {
            newErrors.retypePassword = t('validation.retypePassword_notBlank');
        } else if (formData.password !== formData.retypePassword) {
            newErrors.retypePassword = t('validation.reNewPassword_mismatch');
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const payload = {
            fullname: formData.fullname,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            retype_password: formData.retypePassword
        };

        try {
            const response = await axios.post('https://localhost:8443/api/v1/users/register', payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            setMessage(t('register.success'));
            setErrors({});
            setTimeout(() => navigate('/login'), 1000);
        } catch (error) {
            console.log('Phản hồi lỗi từ backend:', error.response?.data);
            console.error('Error:', error);
            if (error.response?.data) {
                if (typeof error.response.data === 'object' && !Array.isArray(error.response.data)) {
                    setErrors(error.response.data);
                    setMessage('');
                } else {
                    setErrors({});
                    setMessage(error.response.data.error || error.response.data.join('\n') || t('register.error'));
                }
            } else {
                setErrors({});
                setMessage(t('register.server_error'));
            }
        }
    };

    return (
        <div>
            <section className="signup">
                <div className="container-auth">
                    <div className="signup-content">
                        <form className="signup-form" onSubmit={handleSubmit}>
                            <h2 className="form-title">{t('register.title')}</h2>

                            {/* Full Name */}
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faUser} /></label>
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder={t('register.fullname_placeholder')}
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.fullname && (
                                <div className="error-container">
                                    <small className="error">{errors.fullname}</small>
                                </div>
                            )}

                            {/* Username */}
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faUser} /></label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder={t('register.username_placeholder')}
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.username && (
                                <div className="error-container">
                                    <small className="error">{errors.username}</small>
                                </div>
                            )}

                            {/* Email */}
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faEnvelope} /></label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder={t('register.email_placeholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <div className="error-container">
                                    <small className="error">{errors.email}</small>
                                </div>
                            )}

                            {/* Password */}
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faLock} /></label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder={t('register.password_placeholder')}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.password && (
                                <div className="error-container">
                                    <small className="error">{errors.password}</small>
                                </div>
                            )}

                            {/* Retype Password */}
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faLock} /></label>
                                <input
                                    type="password"
                                    name="retypePassword"
                                    placeholder={t('register.retype_password_placeholder')}
                                    value={formData.retypePassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.retypePassword && (
                                <div className="error-container">
                                    <small className="error">{errors.retypePassword}</small>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="form-group form-button">
                                <input type="submit" className="form-submit" value={t('register.submit')} />
                            </div>

                            {/* Tổng lỗi chung (nếu có) */}
                            {message && (
                                <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{message}</p>
                            )}
                        </form>

                        <div className="signup-image">
                            <figure>
                                <img width={500} height={500} src="/img/fashion4.png" alt={t('register.image_alt')} />
                            </figure>
                            <Link to="/login" className="signup-image-link" style={{ fontSize: '18px' }}>
                                {t('register.login_link')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;