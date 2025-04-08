import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './styleAuth.css';

const Login = () => {
    return (
        <body>
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
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title" style={{fontSize: '40px'}}>Đăng nhập</h2>

                            <form className="register-form" id="login-form">
                                <div className="form-group">
                                    <label htmlFor="your_username">
                                        <FontAwesomeIcon style={{fontSize: '22px'}} icon={faUser}/>
                                    </label>
                                    <input
                                        type="text"
                                        name="your_username"
                                        id="your_username"
                                        placeholder="Username của bạn"
                                        style={{fontFamily: 'Courier New'}}
                                    />
                                </div>
                                <div className="form-group" style={{marginBottom: '1px'}}>
                                    <label htmlFor="your_pass">
                                        <FontAwesomeIcon style={{fontSize: '22px'}} icon={faLock}/>
                                    </label>
                                    <input
                                        type="password"
                                        name="your_pass"
                                        id="your_pass"
                                        placeholder="Mật khẩu"
                                        style={{fontFamily: 'Courier New'}}
                                    />
                                </div>
                                <div className="form-group" style={{marginBottom: '1px'}}>
                                    <input type="checkbox" name="remember-me" id="remember-me"
                                           className="agree-term visually-hidden"/>
                                    <label htmlFor="remember-me" className="label-agree-term">
                                        <span><span></span></span>Ghi nhớ tài khoản
                                    </label>
                                </div>
                                <div className="form-group form-button" style={{marginBottom: '1px'}}>
                                    <input type="submit" name="signin" id="signin" className="form-submit"
                                           value="Đăng nhập"/>
                                </div>
                                <div className="social-login" style={{marginTop: '30px'}}>
                                    <span className="social-label" style={{fontSize: '15px'}}>Đăng nhập với</span>
                                    <ul className="socials">
                                        <li>
                                            <a href="#" style={{
                                                backgroundColor: '#1877F2', // Màu xanh Facebook
                                                color: '#ffffff',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: '50%',
                                                textDecoration: 'none'
                                            }}>
                                                <FontAwesomeIcon icon={faFacebookF} style={{fontSize: '18px'}}/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" style={{
                                                backgroundColor: '#1DA1F2', // Màu xanh Twitter
                                                color: '#ffffff',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: '50%',
                                                textDecoration: 'none'
                                            }}>
                                                <FontAwesomeIcon icon={faTwitter} style={{fontSize: '18px'}}/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" style={{
                                                backgroundColor: '#DB4437', // Màu đỏ Google
                                                color: '#ffffff',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: '50%',
                                                textDecoration: 'none'
                                            }}>
                                                <FontAwesomeIcon icon={faGoogle} style={{fontSize: '18px'}}/>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </section>
        </div>
        </body>
    );
};

export default Login;