import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import './user-profile-edit.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const UserPasswordEdit = () => {
    const { t, i18n } = useTranslation();
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

        if (!user2.password) {
            newErrors.password = t('validation.password_notBlank');
        } else if (!passwordRegex.test(user2.password)) {
            newErrors.password = t('validation.newPassword_pattern');
        }

        if (!user2.newPassword) {
            newErrors.newPassword = t('validation.newPassword_notBlank');
        } else if (!passwordRegex.test(user2.newPassword)) {
            newErrors.newPassword = t('validation.newPassword_pattern');
        }

        if (!user2.reNewPassword) {
            newErrors.retypePassword = t('validation.retypePassword_notBlank');
        } else if (user2.newPassword !== user2.reNewPassword) {
            newErrors.retypePassword = t('validation.retypePassword_notMatch');
        }
        return newErrors;
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const token = localStorage.getItem('accessToken');
            console.log("accessToken: " + token);

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
                    title: t('profile.success_password_update'),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/home');
                });
            } catch (error) {
                console.error(error);

                if (error.response) {
                    if (error.response.status === 403) {
                        Swal.fire(t('profile.error_password_update'), t('profile.error_password_update_text'), 'error');
                    } else if (error.response.data) {
                        setMessage(error.response.data);
                    } else {
                        Swal.fire(t('profile.error_update'), t('profile.error_update_text'), 'error');
                    }
                } else {
                    Swal.fire(t('profile.error_server'), t('profile.error_server_text'), 'error');
                }
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log("token profile: " + token);

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: t('profile.error_not_logged_in'),
                confirmButtonText: t('login'),
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
                Swal.fire(t('profile.error_information_user'), t('profile.error_load_user'), 'error');
            });
    }, []);

    return (
        <>
            <div className="containerEdit light-style flex-grow-1 container-p-y">
                <section className="signup">
                    <div className="container-auth">
                        <div className="signup-content">
                            <form className="signup-form" onSubmit={handleUpdatePassword}>
                                <h2 className="form-title">{t('profile.change_password')}</h2>

                                <div className="form-group">
                                    <label><FontAwesomeIcon icon={faLock} /></label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={user2.password}
                                        onChange={handleChange}
                                        required={true}
                                        className="form-control"
                                        placeholder={t('profile.current_password')}
                                    />
                                </div>
                                {errors.password && (
                                    <div className="error-container">
                                        <small className="error">{errors.password}</small>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label><FontAwesomeIcon icon={faLock} /></label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={user2.newPassword}
                                        onChange={handleChange}
                                        required={true}
                                        className="form-control"
                                        placeholder={t('profile.new_password')}
                                    />
                                </div>
                                {errors.newPassword && (
                                    <div className="error-container">
                                        <small className="error">{errors.newPassword}</small>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label><FontAwesomeIcon icon={faLock} /></label>
                                    <input
                                        type="password"
                                        name="reNewPassword"
                                        value={user2.reNewPassword}
                                        onChange={handleChange}
                                        required={true}
                                        className="form-control"
                                        placeholder={t('profile.repeat_new_password')}
                                    />
                                </div>
                                {errors.retypePassword && (
                                    <div className="error-container">
                                        <small className="error">{errors.retypePassword}</small>
                                    </div>
                                )}

                                <div className="form-group form-button">
                                    <button type="submit" className="btn btn-primary">{t('profile.save_changes')}</button>
                                    <button type="button" className="btn btn-default">{t('profile.cancel')}</button>
                                </div>

                                {message && (
                                    <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{message}</p>
                                )}
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default UserPasswordEdit;