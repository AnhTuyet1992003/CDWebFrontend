import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        console.log("🎯 Header mounted");
        const loadUsername = () => {
            let storedUsername = localStorage.getItem('username');

            if (!storedUsername) {
                const token = Cookies.get('token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        storedUsername = payload.username || payload.sub;
                        localStorage.setItem('username', storedUsername);
                    } catch (e) {
                        console.error('Token parse error', e);
                    }
                }
            }

            console.log("loaded username:", storedUsername);
            setUsername(storedUsername || '');
        };

        loadUsername();

        window.addEventListener('userLogout', loadUsername);
        window.addEventListener('storage', loadUsername);

        return () => {
            window.removeEventListener('userLogout', loadUsername);
            window.removeEventListener('storage', loadUsername);
        };
    }, []);

    const handleLogout = () => {
        console.log("Logout function is called");
        alert('Bạn đã đăng xuất thành công!');

        // Remove the token and username from cookies/localStorage
        Cookies.remove('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');

        // Clear state
        setUsername('');

        // Dispatch custom event (optional)
        window.dispatchEvent(new Event("userLogout"));

        // Navigate to login page
        navigate('/login');
    };

    return (
        <>
            <header className="header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-3 col-lg-2">
                            <div className="header__logo">
                                <Link to="/home"><img src="/img/logo.png" alt="Logo" /></Link>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7">
                            <nav className="header__menu">
                                <ul>
                                    <li className="active"><Link to="/home">Trang chủ</Link></li>
                                    <li><Link to="/shop">Sản phẩm</Link></li>
                                    <li>
                                        <a href="#">Pages</a>
                                        <ul className="dropdown">
                                            <li> <Link to="/login">Đăng nhập</Link></li>
                                            <li><Link to="/product-detail">Chi tiết sản phẩm</Link></li>
                                            <li><Link to="/checkout">Thanh toán</Link></li>
                                            <li><Link to="/blog-detail">Blog Detail</Link></li>
                                        </ul>
                                    </li>
                                    <li><Link to="/blog">Blog</Link></li>
                                    <li><Link to="/contact">Liên hệ</Link></li>
                                    <li><Link to="/admin-index">Admin</Link></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-lg-3">
                            <div className="header__right">
                                <div className="header__right__auth">
                                    {username ? (
                                        <>
                                            <span style={{ marginRight: '10px' }}>👋 Xin chào, {username}</span>
                                            <button
                                                onClick={() => {
                                                    console.log("Button clicked!"); // Add this log to ensure the button is clicked
                                                    handleLogout();
                                                }}
                                                style={{ border: 'none', background: 'none', color: 'blue', cursor: 'pointer' }}
                                            >
                                                Đăng xuất
                                            </button>
                                            <Link to="/user-profile-edit">Sua thong tin</Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login">Đăng nhập</Link>
                                            <Link to="/register">Đăng ký</Link>
                                        </>
                                    )}
                                </div>
                                <ul className="header__right__widget">
                                    <li><span className="icon_search search-switch" /></li>
                                    <li>
                                        <a href="#"><span className="icon_heart_alt" /><div className="tip">2</div></a>
                                    </li>
                                    <li>
                                        <Link to="/cart"><span className="icon_bag_alt" /><div className="tip">2</div></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="canvas__open">
                        <i className="fa fa-bars" />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
