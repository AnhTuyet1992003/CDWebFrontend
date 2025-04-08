import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash,faEnvelope  } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './styleAuth.css';

const Login = () => {
    return (
        <body>
        <div>
            <section className="signup">
                <div className="container-auth">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title">Đăng ký</h2>

                            <div className="form-group">
                                <label htmlFor="name">
                                    <FontAwesomeIcon icon={faUser}/>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Nhập username"

                                    //khi giá trị của trường nhập thay đổi thì nó sẽ cập nhật trạng thái của username
                                    required //đánh dấu trường bắt buộc
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">
                                    <FontAwesomeIcon icon={faEnvelope}/>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Nhập email"

                                    //khi giá trị của trường nhập thay đổi thì nó sẽ cập nhật trạng thái của username
                                    required //đánh dấu trường bắt buộc
                                />
                            </div>
                            <div className="form-group" style={{marginBottom: '10px'}}>
                                <label htmlFor="pass">
                                    <FontAwesomeIcon icon={faLock}/>
                                </label>
                                <input

                                    name="pass"
                                    id="pass"
                                    placeholder="Nhập mật khẩu"
                                    required
                                />
                                <FontAwesomeIcon
                                    className="password-icon"
                                    style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: '50%',
                                        right: '10px',
                                        transform: 'translateY(-50%)'
                                    }}
                                />
                            </div>
                            <div className="form-group" style={{marginBottom: '10px'}}>
                                <label htmlFor="pass">
                                    <FontAwesomeIcon icon={faLock}/>
                                </label>
                                <input

                                    name="pass"
                                    id="pass"
                                    placeholder="Nhập lại mật khẩu"
                                    required
                                />
                                <FontAwesomeIcon
                                    className="password-icon"
                                    style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: '50%',
                                        right: '10px',
                                        transform: 'translateY(-50%)'
                                    }}
                                />
                            </div>
                            <div className="form-group" style={{marginBottom: '1px'}}>
                                <input
                                    type="checkbox"
                                    name="agree-term"
                                    id="agree-term"
                                    className="agree-term"

                                />
                                <label htmlFor="agree-term" className="label-agree-term" style={{fontSize: '15px'}}>
                                    <span><span></span></span> Đồng ý với các điều khoản
                                </label>
                            </div>
                            <div className="form-group form-button" style={{marginTop: '-20px'}}>
                                <input type="submit" name="signup" id="signup" className="form-submit"
                                       value="Đăng ký"/>
                            </div>
                        </div>
                        <div className="signup-image">
                            <figure>
                                <img width={500} height={500} src="/img/fashion4.png" alt="sing up image"/>
                            </figure>
                            <Link to="/login" className="signup-image-link" style={{fontSize: '18px'}}>
                                Đã có tài khoản? Đăng nhập!
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </body>
    );
};

export default Login;