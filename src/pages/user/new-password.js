
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './user-profile-edit.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

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
    };

    const validateForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

        if (!user.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
        } else if (!passwordRegex.test(user.newPassword)) {
            newErrors.newPassword = 'Mật khẩu phải ít nhất 7 ký tự, bao gồm chữ và số.';
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
                setMessage('Phiên xác thực đã hết hạn. Vui lòng thử lại.');
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
                    timer: 1500
                });
                // Xóa cookie sau khi cập nhật thành công
                Cookies.remove('email');
                Cookies.remove('otp');
                navigate('/login');
            } catch (error) {
                console.error(error);
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 401) {
                        Swal.fire('Lỗi!', 'Phiên xác thực không hợp lệ. Vui lòng thử lại.', 'error');
                        //setMessage('.');
                        navigate('/forgot-password');
                    } else if (status === 400) {
                        Swal.fire('Lỗi!', 'Dữ liệu không hợp lệ. Vui lòng thử lại.', 'error');
                    } else {
                        Swal.fire('Lỗi!', 'Lỗi khi cập nhật mật khẩu. Vui lòng thử lại.', 'error');
                    }
                } else {
                    Swal.fire('Lỗi!', 'Không thể kết nối đến server. Vui lòng kiểm tra lại.', 'error');
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
                    popup: 'swal2-rounded'  // nếu muốn bo góc đẹp
                }
            });
            navigate('/forgot-password');
        }
        console.log('email forgot pass: ' + email);
    }, [navigate]);

    return (
        <div className="containerEdit light-style flex-grow-1 container-p-y">
            <section className="signup">
                <div className="container-auth">
                    <div className="signup-content">
                        <form className="signup-form" onSubmit={handleUpdatePassword}>
                            <h2 className="form-title">Đặt lại mật khẩu</h2>
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faLock}/></label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    value={user.newPassword}
                                    onChange={handleChange}
                                    required={true}
                                    className="form-control"
                                />
                            </div>

                            {errors.newPassword && (
                                <div className="error-container">
                                    <small className="error">{errors.newPassword}</small>
                                </div>
                            )}

                            {/* Retype Password */}
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faLock}/></label>
                                <input
                                    type="password"
                                    name="reNewPassword"
                                    value={user.reNewPassword}
                                    onChange={handleChange}
                                    required={true}
                                    className="form-control"
                                />
                            </div>
                            {errors.reNewPassword && (
                                <div className="error-container">
                                    <small className="error">{errors.reNewPassword}</small>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="form-group form-button">
                                <input type="submit" className="form-submit" value="Lưu thay đổi"/>
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    onClick={handleCancel}
                                >
                                    Hủy
                                </button>
                            </div>

                            {/* Tổng lỗi chung (nếu có) */}
                            {message && (
                                <p style={{color: 'red', whiteSpace: 'pre-wrap'}}>{message}</p>
                            )}
                        </form>

                        {/* Hình ảnh + link chuyển login */}
                        <div className="signup-image">
                            <figure>
                                <img width={500} height={500} src="/img/fashion4.png" alt="sign up"/>
                            </figure>
                            <Link to="/login" className="signup-image-link" style={{fontSize: '18px'}}>
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