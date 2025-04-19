import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './styleAuth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        retypePassword: ''
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            retype_password: formData.retypePassword // giữ camelCase

        };
        console.log("Payload gửi:", payload);


        try {
            const response = await fetch('https://localhost:8443/api/v1/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const text = await response.text(); // <-- Đổi sang text() thay vì json()

            if (response.ok) {
                setMessage('Đăng ký thành công!');
                setTimeout(() => navigate('/login'), 1000);
            } else {
                try {
                    const data = JSON.parse(text); // Nếu backend vẫn trả JSON
                    if (Array.isArray(data)) {
                        setMessage(data.join('\n'));
                    } else {
                        setMessage(data.message || text); // fallback
                    }
                } catch (err) {
                    setMessage(text); // Nếu không phải JSON
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
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faUser}/></label>
                                <input type="text" name="username" placeholder="Tên đăng nhập" value={formData.username}
                                       onChange={handleChange} required/>
                            </div>
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faEnvelope}/></label>
                                <input type="email" name="email" placeholder="Email" value={formData.email}
                                       onChange={handleChange} required/>
                            </div>
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faLock}/></label>
                                <input type="password" name="password" placeholder="Mật khẩu" value={formData.password}
                                       onChange={handleChange} required/>
                            </div>
                            <div className="form-group">
                                <label><FontAwesomeIcon icon={faLock}/></label>
                                <input type="password" name="retypePassword" placeholder="Nhập lại mật khẩu"
                                       value={formData.retypePassword} onChange={handleChange} required/>
                            </div>
                            {/*<div>*/}
                            {/*    <input type="checkbox" id="agree-term" name="agree-term" required/>*/}
                            {/*    <label htmlFor="agree-term">Đồng ý với các điều khoản</label>*/}
                            {/*</div>*/}

                            <div className="form-group form-button">
                                <input type="submit" className="form-submit" value="Đăng ký"/>
                            </div>
                            {message && <p style={{color: 'red', whiteSpace: 'pre-wrap'}}>{message}</p>}
                        </form>
                        <div className="signup-image">
                            <figure>
                                <img width={500} height={500} src="/img/fashion4.png" alt="sign up"/>
                            </figure>
                            <Link to="/login" className="signup-image-link" style={{fontSize: '18px' }}>
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
