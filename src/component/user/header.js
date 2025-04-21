import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [user, setUser] = useState({

        avatar: ''
    });
    const [userId, setUserId] = useState(null);
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
    // Load user info from token

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        console.log("token"+ token)
        if (!token) {
            console.log("⛔ Không có token, không gọi API user details");
            return; // Không làm gì nếu chưa đăng nhập
        }

        const decoded = jwtDecode(token);
        const username = decoded.sub;

        axios.post(`https://localhost:8443/api/v1/users/details`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                const userData = res.data;
                setUser({
                    avatar: userData.avatar || 'https://res.cloudinary.com/dorz7ucva/image/upload/v1745202292/image_2820bc603a47efcf17a0806b81ca92bff7ea2905.png'
                });
                setUserId(userData.id);
            })
            .catch(err => {
                console.error(err);
                alert('Lỗi khi tải thông tin người dùng');
            });
    }, []);
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
                                            <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                                                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                                                    <a
                                                        className="nav-link dropdown-toggle hide-arrow p-0"
                                                        href="#"
                                                        data-bs-toggle="dropdown">
                                                        <div className="avatar avatar-online"
                                                             style={{
                                                                 width: "40px",
                                                                 height: "40px",
                                                                 borderRadius: "50%",
                                                                 // overflow: "hidden"
                                                             }}>
                                                            <img
                                                                src={user.avatar}
                                                                alt=""
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                        </div>

                                                    </a>
                                                    <ul className="dropdown-menu dropdown-menu-end">
                                                        <li>
                                                            <a className="dropdown-item" href="#">
                                                            <div className="d-flex">
                                                                    <div className="flex-shrink-0 me-3">
                                                                        <div className="avatar avatar-online"
                                                                             style={{
                                                                                 width: "40px",
                                                                                 height: "40px",
                                                                                 borderRadius: "50%",
                                                                                 // overflow: "hidden"
                                                                             }}>
                                                                            <img
                                                                                src={user.avatar}
                                                                                alt=""
                                                                                style={{
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    objectFit: "cover" // Quan trọng để ảnh fill mà không méo
                                                                                }}
                                                                            />
                                                                        </div>

                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <h6 className="mb-0">{username}</h6>
                                                                        {/*<small*/}
                                                                        {/*    className="text-body-secondary">Admin</small>*/}
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <div className="dropdown-divider my-1"></div>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to="/user-profile-edit"><i
                                                                className="icon-base bx bx-user icon-md me-3"></i><span>Thông tin của tôi</span></Link>
                                                        </li>
                                                        <li>

                                                            <a className="dropdown-item" href="#">
                                                                <i className="icon-base bx bx-cog icon-md me-3"></i><span>Settings</span>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a className="dropdown-item" href="#">
                        <span className="d-flex align-items-center align-middle">
                          <i className="flex-shrink-0 icon-base bx bx-credit-card icon-md me-3"></i
                          ><span className="flex-grow-1 align-middle">Billing Plan</span>
                          <span className="flex-shrink-0 badge rounded-pill bg-danger">4</span>
                        </span>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <div className="dropdown-divider my-1"></div>
                                                        </li>
                                                        <li>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault(); // Ngăn không cho reload trang
                                                                    handleLogout();     // Gọi hàm logout
                                                                }}
                                                            >
                                                                <i className="icon-base bx bx-power-off icon-md me-3"></i>
                                                                <span>Đăng xuất</span>
                                                            </a>

                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                            {/*<span style={{marginRight: '10px'}}>👋 Xin chào, {username}</span>*/}
                                            {/*<button*/}
                                            {/*    onClick={() => {*/}
                                            {/*        console.log("Button clicked!"); // Add this log to ensure the button is clicked*/}
                                            {/*        handleLogout();*/}
                                            {/*    }}*/}
                                            {/*    style={{*/}
                                            {/*        border: 'none',*/}
                                            {/*        background: 'none',*/}
                                            {/*        color: 'blue',*/}
                                            {/*        cursor: 'pointer'*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            {/*    Đăng xuất*/}
                                            {/*</button>*/}
                                            {/*<Link to="/user-profile-edit">Sua thong tin</Link>*/}
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login">Đăng nhập</Link>
                                            <Link to="/register">Đăng ký</Link>
                                        </>
                                    )}
                                </div>
                                <ul className="header__right__widget">

                                    <li><span className="icon_search search-switch"/></li>
                                    <li>
                                        <a href="#"><span className="icon_heart_alt"/>
                                            <div className="tip">2</div>
                                        </a>
                                    </li>
                                    <li>
                                        <Link to="/cart"><span className="icon_bag_alt"/>
                                            <div className="tip">2</div>
                                        </Link>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                    <div className="canvas__open">
                        <i className="fa fa-bars"/>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
