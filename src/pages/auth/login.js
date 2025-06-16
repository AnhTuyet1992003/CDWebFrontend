import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './styleAuth.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import Swal from "sweetalert2";

const Login = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.hash === '#_=_') {
            window.history.replaceState(null, null, window.location.href.split('#')[0]);
        }
    }, []);

    useEffect(() => {
        const token = Cookies.get('token');
        console.log('Token:', token);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Token còn hợp lệ -> chuyển về /home
                navigate('/home');
            } catch (err) {
                console.error("Token không hợp lệ");
            }
        }
    }, []);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:8443/api/v1/users/login', {
                username,
                password
            }, { withCredentials: true }).catch(error => {
                console.error("Login failed: ", error); // In toàn bộ lỗi
            });
            const roles = response.data.role;
            Cookies.set('roles', roles, {
                expires: 1,
                secure: true,
                sameSite: 'None',
            });
            const accessToken = response.data.accessToken;
            console.log("Access token nhận được:", accessToken);

            // Lưu token vào cookie
            Cookies.set('token', accessToken, {
                expires: 1,
                secure: true,
                sameSite: 'None',
            });

            localStorage.setItem('accessToken', accessToken);
            // Decode token để lấy thông tin người dùng
            const decoded = jwtDecode(accessToken);
            console.log("usename nhận được:", decoded.sub);
            localStorage.setItem('username', decoded.sub);

            window.dispatchEvent(new Event("storage"));
            Swal.fire({
                icon: 'success',
                title: '✅ Đăng nhập thành công!',
                timer: 1500,
                showConfirmButton: false,
            });
            console.log('Login success, token:', Cookies.get('token'));
            // Chuyển hướng đến trang chủ
            // Điều hướng dựa trên role
            if (roles.includes('admin')) {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error('Login failed:', error);
            Swal.fire(t('login.error_alert'), t(''), 'error');
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const baseUrl = 'https://localhost:8443/oauth2/authorization';

            if (!provider) throw new Error('Thiếu provider');

            const redirectUrl = `${baseUrl}/${provider}`;
            console.log("Đang đăng nhập bằng:", provider);

            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Lỗi:', error.message);
            alert(t('login.social_error', { provider }));
        }
    };

    return (
        <div>
            <section className="sign-in">
                <div className="container-auth">
                    <div className="signin-content">
                        <div className="signin-image">
                            <figure>
                                <img src="/img/fashion11.png" alt={t('login.image_alt')} width={400} height={500} />
                            </figure>
                            <Link to="/register" className="signup-image-link">
                                <FontAwesomeIcon style={{ fontSize: '22px' }} icon={faUser} /> {t('login.register_link')}
                            </Link>
                            <Link to="/forgot-password" className="signup-image-link">
                                <FontAwesomeIcon style={{ fontSize: '22px' }} icon={faUser} /> {t('login.forgot_link')}
                            </Link>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title" style={{ fontSize: '40px' }}>{t('login.title')}</h2>

                            <form className="register-form" id="login-form" onSubmit={handleLoginSubmit}>
                                <div className="form-group">
                                    <label htmlFor="your_username">
                                        <FontAwesomeIcon style={{ fontSize: '22px' }} icon={faUser} />
                                    </label>
                                    <input
                                        type="text"
                                        name="your_username"
                                        id="your_username"
                                        placeholder={t('login.username_placeholder')}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={{ fontFamily: 'Courier New' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="your_pass">
                                        <FontAwesomeIcon style={{ fontSize: '22px' }} icon={faLock} />
                                    </label>
                                    <input
                                        type="password"
                                        name="your_pass"
                                        id="your_pass"
                                        placeholder={t('login.password_placeholder')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ fontFamily: 'Courier New' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <input type="checkbox" name="remember-me" id="remember-me" className="agree-term visually-hidden" />
                                    <label htmlFor="remember-me" className="label-agree-term">
                                        <span><span></span></span>{t('login.remember_me')}
                                    </label>
                                </div>
                                <div className="form-group form-button">
                                    <input type="submit" name="signin" id="signin" className="form-submit" value={t('login.login_button')} />
                                </div>

                                {/* Social Login Buttons */}
                                <div className="social-login">
                                    <button type="button" className="social-button google" onClick={() => handleSocialLogin('google')}>
                                        <img
                                            src="https://developers.google.com/identity/images/g-logo.png"
                                            alt="Google"
                                            style={{ width: '20px', marginRight: '8px' }}
                                        />
                                        {t('login.google_login')}
                                    </button>

                                    <button type="button" className="social-button facebook" onClick={() => handleSocialLogin('facebook')}>
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                                            alt="Facebook"
                                            style={{ width: '20px', marginRight: '8px' }}
                                        />
                                        {t('login.facebook_login')}
                                    </button>
                                </div>

                                {/* Icon-based Social Login */}
                                {/*<div className="social-login" style={{ marginTop: '30px' }}>*/}
                                {/*    <span className="social-label" style={{ fontSize: '15px' }}>{t('login.social_label')}</span>*/}
                                {/*    <ul className="socials">*/}
                                {/*        <li>*/}
                                {/*            <button type="button" className="social-icon" onClick={() => handleSocialLogin('facebook')}>*/}
                                {/*                <FontAwesomeIcon icon={faFacebookF} style={{ fontSize: '18px' }} />*/}
                                {/*            </button>*/}
                                {/*        </li>*/}
                                {/*        <li>*/}
                                {/*            <button type="button" className="social-icon" onClick={() => alert(t('login.twitter_not_supported'))}>*/}
                                {/*                <FontAwesomeIcon icon={faTwitter} style={{ fontSize: '18px' }} />*/}
                                {/*            </button>*/}
                                {/*        </li>*/}
                                {/*        <li>*/}
                                {/*            <button type="button" className="social-icon" onClick={() => handleSocialLogin('google')}>*/}
                                {/*                <FontAwesomeIcon icon={faGoogle} style={{ fontSize: '18px' }} />*/}
                                {/*            </button>*/}
                                {/*        </li>*/}
                                {/*    </ul>*/}
                                {/*</div>*/}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;