import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './user-profile-edit.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const NewPassword = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        newPassword: '',
        reNewPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        // Xóa lỗi của trường khi người dùng nhập lại
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!user.newPassword) {
            newErrors.newPassword = t('validation.newPassword_notBlank');
        } else if (user.newPassword.length < 7 || user.newPassword.length > 100) {
            newErrors.newPassword = t('validation.newPassword_size');
        }

        if (!user.reNewPassword) {
            newErrors.reNewPassword = t('validation.retypePassword_notBlank');
        } else if (user.newPassword !== user.reNewPassword) {
            newErrors.reNewPassword = t('validation.reNewPassword_mismatch');
        }

        return newErrors;
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const email = Cookies.get('email');
            if (!email) {
                Swal.fire({
                    icon: 'error',
                    title: t('newPassword.error'),
                    text: t('newPassword.session_expired'),
                    confirmButtonText: t('newPassword.ok'),
                });
                navigate('/forgot-password');
                return;
            }

            try {
                const res = await axios.put(
                    'https://localhost:8443/api/v1/users/newPassword',
                    { email, newPassword: user.newPassword },
                    { withCredentials: true }
                );
                Swal.fire({
                    icon: 'success',
                    title: t('newPassword.success'),
                    showConfirmButton: false,
                    timer: 1500,
                });
                Cookies.remove('email');
                Cookies.remove('otp');
                navigate('/login');
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 401) {
                        Swal.fire({
                            icon: 'error',
                            title: t('newPassword.error'),
                            text: t('newPassword.invalid_session'),
                            confirmButtonText: t('newPassword.ok'),
                        });
                        navigate('/forgot-password');
                    } else if (status === 400) {
                        setErrors(data);
                        Swal.fire({
                            icon: 'error',
                            title: t('newPassword.error'),
                            text: t('newPassword.invalid_data'),
                            confirmButtonText: t('newPassword.ok'),
                        });
                    } else if (status === 404) {
                        Swal.fire({
                            icon: 'error',
                            title: t('newPassword.error'),
                            text: t('newPassword.user_not_found'),
                            confirmButtonText: t('newPassword.ok'),
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: t('newPassword.error'),
                            text: t('newPassword.update_error'),
                            confirmButtonText: t('newPassword.ok'),
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: t('newPassword.error'),
                        text: t('newPassword.server_error'),
                        confirmButtonText: t('newPassword.ok'),
                    });
                }
            }
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };

    useEffect(() => {
        const email = Cookies.get('email');
        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: t('newPassword.warning'),
                text: t('newPassword.verify_otp'),
                confirmButtonText: t('newPassword.ok'),
                customClass: {
                    popup: 'swal2-rounded',
                },
            });
            navigate('/forgot-password');
        }
    }, [navigate]);

    return (
        <div className="containerEdit light-style flex-grow-1 container-p-y">
            <section className="signup">
                <div className="container-auth">
                    <div className="signup-content">
                        <form className="signup-form" onSubmit={handleUpdatePassword}>
                            <h2 className="form-title">{t('newPassword.title')}</h2>
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faLock} />
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={user.newPassword}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                    placeholder={t('newPassword.new_password_placeholder')}
                                />
                            </div>
                            {errors.newPassword && (
                                <div className="error-container">
                                    <small className="error">{errors.newPassword}</small>
                                </div>
                            )}

                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faLock} />
                                </label>
                                <input
                                    type="password"
                                    name="reNewPassword"
                                    value={user.reNewPassword}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                    placeholder={t('newPassword.retype_password_placeholder')}
                                />
                            </div>
                            {errors.reNewPassword && (
                                <div className="error-container">
                                    <small className="error">{errors.reNewPassword}</small>
                                </div>
                            )}

                            {errors.email && (
                                <div className="error-container">
                                    <small className="error">{errors.email}</small>
                                </div>
                            )}

                            <div className="form-group form-button">
                                <input type="submit" className="form-submit" value={t('newPassword.save')} />
                                <button type="button" className="btn btn-default" onClick={handleCancel}>
                                    {t('newPassword.cancel')}
                                </button>
                            </div>

                            {message && (
                                <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{message}</p>
                            )}
                        </form>

                        <div className="signup-image">
                            <figure>
                                <img width={500} height={500} src="/img/fashion4.png" alt={t('newPassword.image_alt')} />
                            </figure>
                            <Link to="/login" className="signup-image-link" style={{ fontSize: '18px' }}>
                                {t('newPassword.login_link')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewPassword;