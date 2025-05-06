
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './user-profile-edit.css';

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
                alert('Cập nhật mật khẩu thành công!');
                // Xóa cookie sau khi cập nhật thành công
                Cookies.remove('email');
                Cookies.remove('otp');
                navigate('/login');
            } catch (error) {
                console.error(error);
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 401) {
                        setMessage('Phiên xác thực không hợp lệ. Vui lòng thử lại.');
                        navigate('/forgot-password');
                    } else if (status === 400) {
                        setMessage(data || 'Dữ liệu không hợp lệ.');
                    } else {
                        setMessage('Lỗi khi cập nhật mật khẩu. Vui lòng thử lại.');
                    }
                } else {
                    setMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
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
            setMessage('Vui lòng xác thực OTP trước.');
            navigate('/forgot-password');
        }
        console.log('email forgot pass: ' + email);
    }, [navigate]);

    return (
        <div className="containerEdit light-style flex-grow-1 container-p-y">
            <h4 className="font-weight-bold py-3 mb-4">Đặt lại mật khẩu</h4>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="card2-body pb-2">
                    {message && (
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    )}

                    {errors.newPassword && (
                        <div className="error-container">
                            <small className="error">{errors.newPassword}</small>
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Mật khẩu mới</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={user.newPassword}
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
                    <div className="form-group">
                        <label className="form-label">Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            name="reNewPassword"
                            value={user.reNewPassword}
                            onChange={handleChange}
                            required={true}
                            className="form-control"
                        />
                    </div>

                    <div className="text-right mt-3">
                        <button type="submit" className="btn btn-primary">
                            Lưu thay đổi
                        </button>{' '}
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={handleCancel}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewPassword;