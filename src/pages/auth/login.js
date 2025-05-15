import React, {useState} from 'react';
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

import { useEffect } from 'react';


const Login = () => {

    useEffect(() => {
        if (window.location.hash === '#_=_') {
            window.history.replaceState(null, null, window.location.href.split('#')[0]);
        }
    }, []);

    const navigate = useNavigate();
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
            },{ withCredentials: true }).catch(error => {
                console.error("Login failed: ", error); // In toàn bộ lỗi
            });;

            const accessToken= response.data.accessToken;
            console.log("Access token nhận được:", accessToken);

            // Lưu token vào cookie
            Cookies.set('token', accessToken, {
                expires: 1,
                secure: true,
                sameSite: 'None',
            });
            // expires là số ngày, bạn có thể điều chỉnh

            localStorage.setItem('accessToken', accessToken);
            // Cookies.set('testToken', accessToken, { secure: false });
            // console.log(Cookies.get('testToken'));
            // Decode token để lấy thông tin người dùng
            const decoded = jwtDecode(accessToken);
            console.log("usename nhận được:", decoded.sub);
            localStorage.setItem('username', decoded.sub);

            window.dispatchEvent(new Event("storage"));
            alert('Đăng nhập thành công!');
            console.log('Login success, token:', Cookies.get('token'));
            // Chuyển hướng đến trang chủ
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Sai username hoặc password!');
        }
    }
    const handleSocialLogin = async (provider) => {
        try {
            const baseUrl = 'https://localhost:8443/oauth2/authorization';

            if (!provider) throw new Error('Thiếu provider');

            const redirectUrl = `${baseUrl}/${provider}`;
            console.log("Đang đăng nhập bằng:", provider);

            //alert('Đăng nhập thành công!');
            // Chuyển hướng đến trang chủ
            //navigate('/home');

            //navigate('/home');
            // Tùy backend, nếu HEAD bị CORS chặn, có thể bỏ đoạn kiểm tra này
            window.location.href = redirectUrl;
            // Cập nhật URL đăng nhập với Facebook
            //window.location.href = "https://localhost:8443/oauth2/authorization/facebook";

        } catch (error) {
            console.error('Lỗi:', error.message);
            alert(`Không thể kết nối đến dịch vụ ${provider}.`);
        }
    };

    return (
        <div>
            <section className="sign-in">
                <div className="container-auth">
                    <div className="signin-content">
                        <div className="signin-image">
                            <figure>
                                <img src="/img/fashion11.png" alt="sign up" width={400} height={500} />
                            </figure>
                            <Link to="/register" className="signup-image-link">
                                <FontAwesomeIcon style={{ fontSize: '22px' }} icon={faUser} /> Tạo tài khoản
                            </Link>
                            <Link to="/forgot-password" className="signup-image-link">
                                <FontAwesomeIcon style={{ fontSize: '22px' }} icon={faUser} /> Quên mật khẩu
                            </Link>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title" style={{ fontSize: '40px' }}>Đăng nhập</h2>

                            <form className="register-form" id="login-form" onSubmit={handleLoginSubmit}>
                                <div className="form-group">
                                    <label htmlFor="your_username">
                                        <FontAwesomeIcon style={{ fontSize: '22px' }} icon={faUser} />
                                    </label>
                                    <input
                                        type="text"
                                        name="your_username"
                                        id="your_username"
                                        placeholder="Username của bạn"
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
                                        placeholder="Mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ fontFamily: 'Courier New' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <input type="checkbox" name="remember-me" id="remember-me" className="agree-term visually-hidden" />
                                    <label htmlFor="remember-me" className="label-agree-term">
                                        <span><span></span></span>Ghi nhớ tài khoản
                                    </label>
                                </div>
                                <div className="form-group form-button">
                                    <input type="submit" name="signin" id="signin" className="form-submit" value="Đăng nhập" />
                                </div>

                                {/* Social Login Buttons */}
                                <div className="social-login">
                                    <button type="button" className="social-button google" onClick={() => handleSocialLogin('google')}>
                                        <img
                                            src="https://developers.google.com/identity/images/g-logo.png"
                                            alt="Google"
                                            style={{ width: '20px', marginRight: '8px' }}
                                        />
                                        Đăng nhập với Google
                                    </button>

                                    <button type="button" className="social-button facebook" onClick={() => handleSocialLogin('facebook')}>
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                                            alt="Facebook"
                                            style={{ width: '20px', marginRight: '8px' }}
                                        />
                                        Đăng nhập với Facebook
                                    </button>
                                </div>

                                {/* Icon-based Social Login */}
                                <div className="social-login" style={{ marginTop: '30px' }}>
                                    <span className="social-label" style={{ fontSize: '15px' }}>Đăng nhập với</span>
                                    <ul className="socials">
                                        <li>
                                            <button type="button" className="social-icon" onClick={() => handleSocialLogin('facebook')}>
                                                <FontAwesomeIcon icon={faFacebookF} style={{ fontSize: '18px' }} />
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="social-icon" onClick={() => alert('Twitter chưa hỗ trợ')}>
                                                <FontAwesomeIcon icon={faTwitter} style={{ fontSize: '18px' }} />
                                            </button>
                                        </li>
                                        <li>
                                            <button type="button" className="social-icon" onClick={() => handleSocialLogin('google')}>
                                                <FontAwesomeIcon icon={faGoogle} style={{ fontSize: '18px' }} />
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;