import React, { useEffect } from 'react';
import Header from '../admin/header';
import Footer from '../admin/footer';
import { useNavigate,Link  } from 'react-router-dom';
// import '../../assets/admin/css/demo.css'
// import '../../assets/admin/vendor/fonts/boxicons.css'
import '../../assets/admin/vendor/css/core.css'
// import '../../assets/admin/vendor/css/theme-default.css'
import '../../assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.css'
import '../../assets/admin/vendor/libs/apex-charts/apex-charts.css'
import '../../assets/admin/vendor/js/helpers'
import '../../assets/admin/js/config'

// import '../../assets/admin/js/main'
import '../../assets/admin/vendor/libs/jquery/jquery.js';
import '../../assets/admin/vendor/libs/popper/popper.js';
import '../../assets/admin/vendor/js/bootstrap.js';
import '../../assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.js';
import '../../assets/admin/vendor/js/menu.js';
import '../../assets/admin/vendor/libs/apex-charts/apexcharts.js';
import '../../assets/admin/js/main.js';
import '../../assets/admin/js/dashboards-analytics.js';

const AdminLayout = ({ children }) => {
    useEffect(() => {
        import('../../assets/admin/css/demo.css');
        import('../../assets/admin/vendor/css/theme-default.css');
        import('../../assets/admin/vendor/fonts/boxicons.css');
        return () => {
            document.querySelectorAll('link[href*="admin"]').forEach(el => el.remove());
        };
    }, []);
    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <Header/>
                    <div className="layout-page">
                        {/* Navbar */}
                        <nav
                            className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                            id="layout-navbar"
                        >
                            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                                <a
                                    className="nav-item nav-link px-0 me-xl-4"
                                    href="javascript:void(0)"
                                >
                                    <i className="bx bx-menu bx-sm"/>
                                </a>
                            </div>
                            <div
                                className="navbar-nav-right d-flex align-items-center"
                                id="navbar-collapse"
                            >
                                {/* Search */}
                                <div className="navbar-nav align-items-center">
                                    <div className="nav-item d-flex align-items-center">
                                        <i className="bx bx-search fs-4 lh-0"/>
                                        <input
                                            type="text"
                                            className="form-control border-0 shadow-none"
                                            placeholder="Search..."
                                            aria-label="Search..."
                                        />
                                    </div>
                                </div>
                                {/* /Search */}
                                <ul className="navbar-nav flex-row align-items-center ms-auto">
                                    {/* Place this tag where you want the button to render. */}
                                    {/*<li className="nav-item lh-1 me-3">*/}
                                    {/*    <a*/}
                                    {/*        className="github-button"*/}
                                    {/*        href="https://github.com/themeselection/sneat-html-admin-template-free"*/}
                                    {/*        data-icon="octicon-star"*/}
                                    {/*        data-size="large"*/}
                                    {/*        data-show-count="true"*/}
                                    {/*        aria-label="Star themeselection/sneat-html-admin-template-free on GitHub"*/}
                                    {/*    >*/}
                                    {/*        Star*/}
                                    {/*    </a>*/}
                                    {/*</li>*/}
                                    {/* User */}
                                    <li className="nav-item navbar-dropdown dropdown-user dropdown">
                                        <a
                                            className="nav-link dropdown-toggle hide-arrow"
                                            href="javascript:void(0);"
                                            data-bs-toggle="dropdown"
                                        >
                                            <div className="avatar avatar-online">
                                                <img
                                                    src="/img-admin/avatars/1.png"
                                                    alt=""
                                                    className="w-px-40 h-auto rounded-circle"
                                                />
                                            </div>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <div className="d-flex">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="avatar avatar-online">
                                                                <img
                                                                    src="/img-admin/avatars/1.png"
                                                                    alt=""
                                                                    className="w-px-40 h-auto rounded-circle"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <span className="fw-semibold d-block">John Doe</span>
                                                            <small className="text-muted">Admin</small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <div className="dropdown-divider"/>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <i className="bx bx-user me-2"/>
                                                    <span className="align-middle">My Profile</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <i className="bx bx-cog me-2"/>
                                                    <span className="align-middle">Settings</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                      <span className="d-flex align-items-center align-middle">
                        <i className="flex-shrink-0 bx bx-credit-card me-2"/>
                        <span className="flex-grow-1 align-middle">
                          Billing
                        </span>
                        <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
                          4
                        </span>
                      </span>
                                                </a>
                                            </li>
                                            <li>
                                                <div className="dropdown-divider"/>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="auth-login-basic.html">
                                                    <i className="bx bx-power-off me-2"/>
                                                    <span className="align-middle">Log Out</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    {/*/ User */}
                                </ul>
                            </div>
                        </nav>
                        {/* / Navbar */}
                    <div className="content-wrapper">

                        <div className="admin-content" style={{padding: "100px"}}>{children}</div>

                        <Footer/>
                        <div className="content-backdrop fade"/>
                    </div>
                    {/* Content wrapper */}
                </div>
                {/* / Layout page */}
            </div>
            {/* Overlay */
        }
        <div className="layout-overlay layout-menu-toggle"/>
        </div>
    {/* / Layout wrapper */
    }
    <div className="buy-now">
        {/*<a*/}
        {/*    href="https://themeselection.com/products/sneat-bootstrap-html-admin-template/"*/}
        {/*    target="_blank"*/}
        {/*    className="btn btn-danger btn-buy-now"*/}
        {/*>*/}
            <Link className={"btn btn-danger btn-buy-now"} to="/home" style={{cursor: 'pointer'}}>     Trang chủ</Link>

        {/*</a>*/}
    </div>
</>
)
    ;
};

export default AdminLayout;
