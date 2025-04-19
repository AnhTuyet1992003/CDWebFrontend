import React, { useEffect } from 'react';
import Header from '../admin/header';
import Footer from '../admin/footer';
import { useNavigate,Link  } from 'react-router-dom';


import '../../assets/admin/vendor/fonts/iconify-icons.css'

import '../../assets/admin/vendor/css/core.css'
import '../../assets/admin/css/demo.css'
import '../../assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.css'
import '../../assets/admin/vendor/libs/apex-charts/apex-charts.css'
import '../../assets/admin/vendor/js/helpers'
import '../../assets/admin/js/config'

// js
import '../../assets/admin/vendor/libs/jquery/jquery'
import '../../assets/admin/vendor/libs/popper/popper'
import '../../assets/admin/vendor/js/bootstrap'
import '../../assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar'
import '../../assets/admin/vendor/js/menu'
import '../../assets/admin/vendor/libs/apex-charts/apexcharts'
import '../../assets/admin/js/main'
import '../../assets/admin/js/dashboards-analytics'


const AdminLayout = ({ children }) => {
    // useEffect(() => {
    //     import('../../assets/admin2/css/demo.css');
    //     import('../../assets/admin2/vendor/css/theme-default.css');
    //     import('../../assets/admin2/vendor/fonts/boxicons.css');
    //     return () => {
    //         document.querySelectorAll('link[href*="admin"]').forEach(el => el.remove());
    //     };
    // }, []);
    return (
        <>
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Header/>
                <div className="layout-page">
                    {/* Navbar */}
                    <nav
                        className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
                        id="layout-navbar">
                        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
                            <a className="nav-item nav-link px-0 me-xl-6" href="#">
                                <i className="icon-base bx bx-menu icon-md"></i>
                            </a>
                        </div>

                        <div className="navbar-nav-right d-flex align-items-center justify-content-end"
                             id="navbar-collapse">
                            <div className="navbar-nav align-items-center me-auto">
                                <div className="nav-item d-flex align-items-center">
                                        <span className="w-px-22 h-px-22"><i
                                            className="icon-base bx bx-search icon-md"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none ps-1 ps-sm-2 d-md-block d-none"
                                        placeholder="Search..."
                                        aria-label="Search..."/>
                                </div>
                            </div>

                            <ul className="navbar-nav flex-row align-items-center ms-md-auto">
                                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                                    <a
                                        className="nav-link dropdown-toggle hide-arrow p-0"
                                        href="#"
                                        data-bs-toggle="dropdown">
                                        <div className="avatar avatar-online">
                                            <img src="/img-admin/avatars/1.png" alt
                                                 className="w-px-40 h-auto rounded-circle"/>
                                        </div>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 me-3">
                                                        <div className="avatar avatar-online">
                                                            <img src="/img-admin/avatars/1.png" alt
                                                                 className="w-px-40 h-auto rounded-circle"/>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-0">John Doe</h6>
                                                        <small className="text-body-secondary">Admin</small>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <div className="dropdown-divider my-1"></div>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                <i className="icon-base bx bx-user icon-md me-3"></i><span>My Profile</span>
                                            </a>
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
                                            <a className="dropdown-item" href="#">
                                                <i className="icon-base bx bx-power-off icon-md me-3"></i><span>Log Out</span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    {/* / Navbar */}

                        <div className="content-wrapper">{children}</div>

                </div>
            </div>

            <div class="layout-overlay layout-menu-toggle"></div>
        </div>
        <div className="buy-now">
            <Link className={"btn btn-danger btn-buy-now"} to="/home" style={{cursor: 'pointer'}}> Trang chủ</Link>
        </div>
        </>
    )
        ;
};

export default AdminLayout;
