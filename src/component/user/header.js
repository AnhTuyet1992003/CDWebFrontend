import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import '../../pages/user/AddToCart.css'
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
const Header = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    // đa ngôn ngữ
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        console.log('Changing language to:', lng);
        i18n.changeLanguage(lng);
    };



    // Danh sách ngôn ngữ
    const languages = [
        { code: 'vi', name: t('translation.vi') },
        { code: 'en', name: t('translation.en') },
        { code: 'fr', name: t('translation.fr') },      // Tiếng pháp
        { code: 'es', name: t('translation.es') },       // Tiếng Tây Ban Nha
        { code: 'ja', name: t('translation.ja')},         // Tiếng Nhật
        { code: 'ko', name: t('translation.ko') },         // Tiếng Hàn
        { code: 'zh', name: t('translation.zh') }        // Tiếng Trung (Giản thể)
    ];

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [user, setUser] = useState({

        avatar: ''
    });

    const [userId, setUserId] = useState(null);




    const [cartQuantity, setCartQuantity] = useState(0);

    const fetchCart = async () => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) return;

        try {
            const res = await axios.get('https://localhost:8443/api/v1/carts', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setCartQuantity(res.data.data.totalQuantityProduct || 0);
        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err);
        }
    };

    useEffect(() => {
        fetchCart();

        const handleCartUpdated = () => {
            fetchCart(); // gọi lại API khi có sự kiện "cartUpdated"
        };

        window.addEventListener("cartUpdated", handleCartUpdated);
        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdated);
        };
    }, []);




    useEffect(() => {
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
                }else{
                    navigate('/login');
                }
            }
            setUsername(storedUsername || '');
        };

        loadUsername();

        window.addEventListener('userLogout', loadUsername);
        window.addEventListener('storage', loadUsername);

        return () => {
            window.removeEventListener('userLogout', loadUsername);
            window.removeEventListener('storage', loadUsername);
        };

        const script = document.createElement('script');
        script.src = 'https://app.tudongchat.com/js/chatbox.js';
        script.async = true;

        script.onload = () => {
            console.log('Script loaded');
            if (window.TuDongChat) {
                const tudong_chatbox = new window.TuDongChat('GEKBdJuf_t2KzMXWnR9hH');
                tudong_chatbox.initial();
            } else {
                console.error('TuDongChat not found on window.');
            }
        };

        script.onerror = () => {
            console.error('Failed to load chatbox.js');
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleLogout = () => {
        Swal.fire({
            icon: 'success',
            title: t('header.success_logout'),
            confirmButtonText: 'OK',
        })

        // Remove the token and username from cookies/localStorage
        Cookies.remove('token');
        Cookies.remove('token', { path: '/' }); // thêm path để chắc chắn xóa đúng cookie

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
            navigate('/login');
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
                Swal.fire({
                    icon: 'error',
                    title: t('header.error_information_user'),
                })
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
                                    <li className={isActive('/home') ? 'active' : ''}>
                                        <Link to="/home">{t('header.home')}</Link>
                                    </li>
                                    <li className={isActive('/shop') ? 'active' : ''}>
                                        <Link to="/shop">{t('header.products')}</Link>
                                    </li>
                                    <li className={isActive('/coupon') ? 'active' : ''}>
                                        <Link to="/coupon">Mã giảm giá</Link>
                                    </li>
                                    <li className={isActive('/choose-coupon') ? 'active' : ''}>
                                        <Link to="/choose-coupon">chọn giảm giá</Link>
                                    </li>
                                    <li>
                                        <a href="#">Pages</a>
                                        <ul className="dropdown">
                                            <li><Link to="/import-order">Nhap hang</Link></li>
                                            <li><Link to="/list-import-order">List Nhap hang</Link></li>
                                            <li><Link to="/user-password-edit">ddoi pass</Link></li>
                                            <li><Link to="/product-detail">Chi tiết sản phẩm</Link></li>
                                            <li><Link to="/checkout">Thanh toán</Link></li>
                                            <li><Link to="/blog-detail">Blog Detail</Link></li>
                                        </ul>
                                    </li>
                                    <li className={isActive('/blog') ? 'active' : ''}>
                                        <Link to="/blog">{t('header.about')}</Link>
                                    </li>
                                    <li className={isActive('/contact') ? 'active' : ''}>
                                        <Link to="/contact">{t('header.contact')}</Link>
                                    </li>
                                    <li className={isActive('/admin-index') ? 'active' : ''}>
                                        <Link to="/admin-index">Admin</Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-lg-3">
                            <div className="header__right">
                            <div className="header__right__auth">
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row", justifyItems: "center", alignItems: "center"}}>
                                    <a
                                        className="nav-link dropdown-toggle hide-arrow"
                                        href="#"
                                        data-bs-toggle="dropdown"
                                        style={{fontsize: "15px",
                                            textAlign: "center",
                                            border: "1px solid rgba(0, 0, 0, 0.97)",
                                            padding: "3px",
                                            borderRadius: "5px",
                                            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)"
                                        }}
                                    >
                                                      <span style={{fontsize: "15px"}}>
                                                        {languages.find((lang) => lang.code === i18n.language)?.name ||
                                                            'Tiếng Việt'}
                                                      </span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        {languages.map((lang) => (
                                            <li key={lang.code}>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => changeLanguage(lang.code)}
                                                >
                                                    {lang.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

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
                                                                 overflow: "hidden"
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
                                                                                    borderRadius: "50%",
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
                                                                className="icon-base bx bx-user icon-md me-3"></i><span>{t('header.information')}</span></Link>
                                                        </li>
                                                        <li>

                                                            <a className="dropdown-item" href="#">
                                                                <i className="icon-base bx bx-cog icon-md me-3"></i><span>{t('header.setting')}</span>
                                                            </a>
                                                        </li>
                                                        <li>

                                                            <Link className="dropdown-item" to="/order"> <span
                                                                className="d-flex align-items-center align-middle">
                          <i className="flex-shrink-0 icon-base bx bx-credit-card icon-md me-3"></i
                          ><span className="flex-grow-1 align-middle">{t('header.order')}</span>
                          <span className="flex-shrink-0 badge rounded-pill bg-danger">4</span>
                        </span>
                                                            </Link>

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
                                                                <span>{t('header.logout')}</span>
                                                            </a>

                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login">{t('header.login')}</Link>
                                            <Link to="/register">{t('header.register')}</Link>
                                            <Link to="/forgot-password">{t('header.forget_password')}</Link>
                                        </>
                                    )}
                                    </div>
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
                                            <div className="tip">{cartQuantity}</div>
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
