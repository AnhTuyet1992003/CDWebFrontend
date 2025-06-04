import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './user-profile-edit.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const NewPassword = () => {
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
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
        } else if (user.newPassword.length < 7 || user.newPassword.length > 100) {
            newErrors.newPassword = 'Mật khẩu mới phải từ 7 ký tự, bao gồm chữ và số .';
        }

        if (!user.reNewPassword) {
            newErrors.reNewPassword = 'Vui lòng nhập lại mật khẩu.';
        } else if (user.newPassword !== user.reNewPassword) {
            newErrors.reNewPassword = 'Mật khẩu không khớp.';
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
                    title: 'Lỗi!',
                    text: 'Phiên xác thực đã hết hạn. Vui lòng thử lại.',
                    confirmButtonText: 'OK',
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
                    title: '✅ Cập nhật mật khẩu thành công!',
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
                            title: 'Lỗi!',
                            text: 'Phiên xác thực không hợp lệ. Vui lòng thử lại.',
                            confirmButtonText: 'OK',
                        });
                        navigate('/forgot-password');
                    } else if (status === 400) {
                        // Xử lý lỗi validation từ BE
                        setErrors(data); // Giả sử BE trả về { "email": "...", "newPassword": "..." }
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
                            confirmButtonText: 'OK',
                        });
                    } else if (status === 404) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Người dùng không tồn tại.',
                            confirmButtonText: 'OK',
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Lỗi khi cập nhật mật khẩu. Vui lòng thử lại.',
                            confirmButtonText: 'OK',
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Không thể kết nối đến server. Vui lòng kiểm tra lại.',
                        confirmButtonText: 'OK',
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
                title: '⚠️ Vui lòng xác thực OTP trước!',
                confirmButtonText: 'OK',
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
                            <h2 className="form-title">Đặt lại mật khẩu</h2>
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
                                    placeholder="Nhập mật khẩu mới"
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
                                    placeholder="Nhập lại mật khẩu mới"
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
                                <input type="submit" className="form-submit" value="Lưu thay đổi" />
                                <button type="button" className="btn btn-default" onClick={handleCancel}>
                                    Hủy
                                </button>
                            </div>

                            {message && (
                                <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{message}</p>
                            )}
                        </form>

                        <div className="signup-image">
                            <figure>
                                <img width={500} height={500} src="/img/fashion4.png" alt="sign up" />
                            </figure>
                            <Link to="/login" className="signup-image-link" style={{ fontSize: '18px' }}>
                                Đã có tài khoản? Đăng nhập!
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewPassword;