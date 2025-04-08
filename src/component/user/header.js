import React from 'react';
import { useNavigate,Link  } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();


    return (
        <>
        {/*<div id="preloder">*/}
        {/*    <div className="loader" />*/}
        {/*</div>*/}
        {/* Offcanvas Menu Begin */}
        <div className="offcanvas-menu-overlay"/>
        <div className="offcanvas-menu-wrapper">
            <div className="offcanvas__close">+</div>
            <ul className="offcanvas__widget">
                <li>
                    <span className="icon_search search-switch"/>
                </li>
                <li>
                    <a href="#">
                        <span className="icon_heart_alt"/>
                        <div className="tip">2</div>
                    </a>
                </li>
                <li>
                    <Link to="/cart" style={{cursor: 'pointer'}}>
                        <span className="icon_bag_alt"/>
                        <div className="tip">2</div>
                    </Link>
                </li>
            </ul>
            <div className="offcanvas__logo">
                <Link to="/home" style={{cursor: 'pointer'}}>
                    <img src="/img/logo1.png" alt="Logo"/>
                </Link>
            </div>
            <div id="mobile-menu-wrap"/>
            <div className="offcanvas__auth">
                <a href="#">Login</a>
                <a href="#">Register</a>
            </div>
        </div>
        {/* Offcanvas Menu End */}
        {/* Header Section Begin */}
        <header className="header">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-3 col-lg-2">
                        <div className="header__logo">
                            <Link to="/home" style={{cursor: 'pointer'}}>
                                <img
                                    src="/img/logo.png"
                                    alt="Logo"
                                    // style={{width: '78px', height: '31px'}}
                                />

                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-7">
                        <nav className="header__menu">
                            <ul>
                                <li className="active">
                                    <Link to="/home" style={{cursor: 'pointer'}}>Trang chủ</Link>
                                </li>
                                <li>
                                    <Link to="/shop" style={{cursor: 'pointer'}}>Sản phẩm</Link>
                                </li>
                                <li>
                                    <a href="#">Pages</a>
                                    <ul className="dropdown">
                                        <li>
                                            <Link to="/product-detail" style={{cursor: 'pointer'}}>Chi tiết sản
                                                phẩm</Link>
                                        </li>
                                        <li>
                                            <Link to="/checkout" style={{cursor: 'pointer'}}>Thanh toán</Link>
                                        </li>
                                        <li>
                                            <Link to="/blog-detail" style={{cursor: 'pointer'}}>Blog Detail</Link>
                                        </li>

                                    </ul>
                                </li>
                                <li>
                                    <Link to="/blog" style={{cursor: 'pointer'}}>Blog</Link>
                                </li>
                                <li>
                                    <Link to="/contact" style={{cursor: 'pointer'}}>Liên hệ</Link>
                                </li>
                                <li>
                                    <Link to="/admin-index" style={{cursor: 'pointer'}}>Admin</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="col-lg-3">
                        <div className="header__right">
                            <div className="header__right__auth">
                                <Link to="/login" style={{cursor: 'pointer'}}>Đăng nhập</Link>
                                <Link to="/register" style={{cursor: 'pointer'}}>Đăng ký</Link>
                            </div>
                            <ul className="header__right__widget">
                                <li>
                                    <span className="icon_search search-switch"/>
                                </li>
                                <li>
                                    <a href="#">
                                        <span className="icon_heart_alt"/>
                                        <div className="tip">2</div>
                                    </a>
                                </li>
                                <li>
                                    <Link to="/cart" style={{cursor: 'pointer'}}>
                                        <span className="icon_bag_alt"/>
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
}

export default Header;
