import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './styleAuth.css'; // giữ lại CSS chính

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
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

        const fullNameRegex = /^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/;
        const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên.';
        } else if (!fullNameRegex.test(formData.fullName.trim())) {
            newErrors.fullName = 'Họ và tên phải viết hoa chữ cái đầu mỗi từ và chỉ bao gồm chữ cái.';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập.';
        } else if (!usernameRegex.test(formData.username)) {
            newErrors.username = 'Tên đăng nhập phải từ 6-20 ký tự, chỉ gồm chữ và số.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email.';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ.';
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu.';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Mật khẩu ít nhất 7 ký tự, bao gồm chữ và số.';
        }

        if (!formData.retypePassword) {
            newErrors.retypePassword = 'Vui lòng nhập lại mật khẩu.';
        } else if (formData.password !== formData.retypePassword) {
            newErrors.retypePassword = 'Mật khẩu không khớp.';
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
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            retype_password: formData.retypePassword
        };

        try {
            const response = await fetch('https://localhost:8443/api/v1/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const text = await response.text();

            if (response.ok) {
                setMessage('Đăng ký thành công!');
                setTimeout(() => navigate('/login'), 1000);
            } else {
                try {
                    const data = JSON.parse(text);
                    if (Array.isArray(data)) {
                        setMessage(data.join('\n'));
                    } else {
                        setMessage(data.message || text);
                    }
                } catch (err) {
                    setMessage(text);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            <section className="signup">
                <div className="container-auth">
                    <div className="signup-content">
                        <form className="signup-form" onSubmit={handleSubmit}>
                            <h2 className="form-title">Đăng ký</h2>

                            {/* Full Name */}
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faUser} /></label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và tên"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.fullName && (
                                <div className="error-container">
                                    <small className="error">{errors.fullName}</small>
                                </div>
                            )}

                            {/* Username */}
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faUser} /></label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Tên đăng nhập"
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
                                    placeholder="Email"
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
                                    placeholder="Mật khẩu"
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
                                    placeholder="Nhập lại mật khẩu"
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
                                <input type="submit" className="form-submit" value="Đăng ký" />
                            </div>

                            {/* Tổng lỗi chung (nếu có) */}
                            {message && (
                                <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{message}</p>
                            )}
                        </form>

                        {/* Hình ảnh + link chuyển login */}
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

export default Register;
