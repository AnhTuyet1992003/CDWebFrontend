import React from 'react';
import { useNavigate,Link  } from 'react-router-dom';
const Header = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Menu */}
            <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
                <div className="app-brand demo">
                    <a href="index.html" className="app-brand-link">
              <span className="app-brand-logo demo">
                <span className="text-primary">
                  <svg
                      width="25"
                      viewBox="0 0 25 42"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <defs>
                      <path
                          d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z"
                          id="path-1"></path>
                      <path
                          d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z"
                          id="path-3"></path>
                      <path
                          d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z"
                          id="path-4"></path>
                      <path
                          d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z"
                          id="path-5"></path>
                    </defs>
                    <g id="g-app-brand" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
                        <g id="Icon" transform="translate(27.000000, 15.000000)">
                          <g id="Mask" transform="translate(0.000000, 8.000000)">
                            <mask id="mask-2" fill="white">
                              <use xlinkHref="#path-1"></use>
                            </mask>
                            <use fill="currentColor" xlinkHref="#path-1"></use>
                            <g id="Path-3" mask="url(#mask-2)">
                              <use fill="currentColor" xlinkHref="#path-3"></use>
                              <use fill-opacity="0.2" fill="#FFFFFF" xlinkHref="#path-3"></use>
                            </g>
                            <g id="Path-4" mask="url(#mask-2)">
                              <use fill="currentColor" xlinkHref="#path-4"></use>
                              <use fill-opacity="0.2" fill="#FFFFFF" xlinkHref="#path-4"></use>
                            </g>
                          </g>
                          <g
                              id="Triangle"
                              transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) ">
                            <use fill="currentColor" xlinkHref="#path-5"></use>
                            <use fill-opacity="0.2" fill="#FFFFFF" xlinkHref="#path-5"></use>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
              </span>
                        <span className="app-brand-text demo menu-text fw-bold ms-2">Sneat</span>
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()}
                       className="layout-menu-toggle menu-link text-large ms-auto">><i
                        className="bx bx-chevron-left d-block d-xl-none align-middle"></i>
                    </a>

                    {/*<a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">*/}
                    {/*    <i class="bx bx-chevron-left d-block d-xl-none align-middle"></i>*/}
                    {/*</a>*/}
                </div>

                <div className="menu-divider mt-0"></div>

                <div className="menu-inner-shadow"></div>

                <ul className="menu-inner py-1">
                    <li className="menu-item active open">
                        <a href="#" onClick={(e) => e.preventDefault()} className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-home-smile"></i>
                            <div className="text-truncate" data-i18n="Dashboards">Dashboards</div>
                            <span className="badge rounded-pill bg-danger ms-auto">5</span>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item active">
                                <a href="index.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Analytics">Analytics</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/dashboards-crm.html"
                                    target="_blank"
                                    className="menu-link">
                                    <div className="text-truncate" data-i18n="CRM">CRM</div>
                                    <div
                                        className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-ecommerce-dashboard.html"
                                    target="_blank"
                                    className="menu-link">
                                    <div className="text-truncate" data-i18n="eCommerce">eCommerce</div>
                                    <div
                                        className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-logistics-dashboard.html"
                                    target="_blank"
                                    className="menu-link">
                                    <div className="text-truncate" data-i18n="Logistics">Logistics</div>
                                    <div
                                        className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-academy-dashboard.html"
                                    target="_blank"
                                    className="menu-link">
                                    <div className="text-truncate" data-i18n="Academy">Academy</div>
                                    <div
                                        className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <a href="#" onClick={(e) => e.preventDefault()} className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-layout"></i>
                            <div className="text-truncate" data-i18n="Layouts">Layouts</div>
                        </a>

                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a href="layouts-without-menu.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Without menu">Without menu</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="layouts-without-navbar.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Without navbar">Without navbar</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="layouts-fluid.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Fluid">Fluid</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="layouts-container.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Container">Container</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="layouts-blank.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Blank">Blank</div>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <a href="#" onClick={(e) => e.preventDefault()} className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-store"></i>
                            <div className="text-truncate" data-i18n="Front Pages">Front Pages</div>
                            <div
                                className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                            </div>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/landing-page.html"
                                    className="menu-link"
                                    target="_blank">
                                    <div className="text-truncate" data-i18n="Landing">Landing</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/pricing-page.html"
                                    className="menu-link"
                                    target="_blank">
                                    <div className="text-truncate" data-i18n="Pricing">Pricing</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/payment-page.html"
                                    className="menu-link"
                                    target="_blank">
                                    <div className="text-truncate" data-i18n="Payment">Payment</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/checkout-page.html"
                                    className="menu-link"
                                    target="_blank">
                                    <div className="text-truncate" data-i18n="Checkout">Checkout</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a
                                    href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/help-center-landing.html"
                                    className="menu-link"
                                    target="_blank">
                                    <div className="text-truncate" data-i18n="Help Center">Help Center</div>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-header small text-uppercase">
                        <span className="menu-header-text">Apps &amp; Pages</span>
                    </li>


                    <li className="menu-item">
                        <Link to="/admin-list-user" style={{cursor: 'pointer'}} className="menu-link"><i
                            className="menu-icon tf-icons bx bx-chat"></i>
                            <div className="text-truncate" data-i18n="Chat">Danh sách User</div>
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to="/btntest" style={{cursor: 'pointer'}} className="menu-link"><i
                            className="menu-icon tf-icons bx bx-chat"></i>
                            <div className="text-truncate" data-i18n="Chat">Button á</div>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/admin-add-product" style={{cursor: 'pointer'}} className="menu-link"><i
                            className="menu-icon tf-icons bx bx-chat"></i>
                            <div className="text-truncate" data-i18n="Chat">Thêm sản phẩm</div>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/admin-list-product" style={{cursor: 'pointer'}} className="menu-link"><i
                            className="menu-icon tf-icons bx bx-chat"></i>
                            <div className="text-truncate" data-i18n="Chat">Danh sách sản phẩm</div>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/list-product-need-import" style={{cursor: 'pointer'}} className="menu-link"><i
                            className="menu-icon tf-icons bx bx-chat"></i>
                            <div className="text-truncate" data-i18n="Chat">Danh sách sản phẩm cần nhập</div>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/import-order" style={{cursor: 'pointer'}} className="menu-link"><i
                            className="menu-icon tf-icons bx bx-chat"></i>
                            <div className="text-truncate" data-i18n="Chat">Nhập hàng</div>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/list-import-order" style={{cursor: 'pointer'}} className="menu-link"><i
                            className="menu-icon tf-icons bx bx-chat"></i>
                            <div className="text-truncate" data-i18n="Chat">Danh sách đơn nhập hàng</div>
                        </Link>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-email.html"
                            target="_blank"
                            className="menu-link">
                            <i className="menu-icon tf-icons bx bx-envelope"></i>
                            <div className="text-truncate" data-i18n="Email">Email</div>
                            <div
                                className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                            </div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-chat.html"
                            target="_blank"
                            className="menu-link">
                            <i className="menu-icon tf-icons bx bx-chat"></i>
                            <div className="text-truncate" data-i18n="Chat">Chat</div>
                            <div
                                className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                            </div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-calendar.html"
                            target="_blank"
                            className="menu-link">
                            <i className="menu-icon tf-icons bx bx-calendar"></i>
                            <div className="text-truncate" data-i18n="Calendar">Calendar</div>
                            <div
                                className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                            </div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/app-kanban.html"
                            target="_blank"
                            className="menu-link">
                            <i className="menu-icon tf-icons bx bx-grid"></i>
                            <div className="text-truncate" data-i18n="Kanban">Kanban</div>
                            <div
                                className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                            </div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="javascript:void(0);" className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-dock-top"></i>
                            <div className="text-truncate" data-i18n="Account Settings">Account Settings</div>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a href="pages-account-settings-account.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Account">Account</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="pages-account-settings-notifications.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Notifications">Notifications</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="pages-account-settings-connections.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Connections">Connections</div>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="menu-item">
                        <a href="javascript:void(0);" className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>
                            <div className="text-truncate" data-i18n="Authentications">Authentications</div>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a href="auth-login-basic.html" className="menu-link" target="_blank">
                                    <div className="text-truncate" data-i18n="Basic">Login</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="auth-register-basic.html" className="menu-link" target="_blank">
                                    <div className="text-truncate" data-i18n="Basic">Register</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="auth-forgot-password-basic.html" className="menu-link" target="_blank">
                                    <div className="text-truncate" data-i18n="Basic">Forgot Password</div>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="menu-item">
                        <a href="javascript:void(0);" className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-cube-alt"></i>
                            <div className="text-truncate" data-i18n="Misc">Misc</div>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a href="pages-misc-error.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Error">Error</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="pages-misc-under-maintenance.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Under Maintenance">Under Maintenance
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="menu-header small text-uppercase"><span
                        className="menu-header-text">Components</span></li>
                    <li className="menu-item">
                        <a href="cards-basic.html" className="menu-link">
                            <i className="menu-icon tf-icons bx bx-collection"></i>
                            <div className="text-truncate" data-i18n="Basic">Cards</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="javascript:void(0)" className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-box"></i>
                            <div className="text-truncate" data-i18n="User interface">User interface</div>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a href="ui-accordion.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Accordion">Accordion</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-alerts.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Alerts">Alerts</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-badges.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Badges">Badges</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-buttons.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Buttons">Buttons</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-carousel.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Carousel">Carousel</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-collapse.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Collapse">Collapse</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-dropdowns.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Dropdowns">Dropdowns</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-footer.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Footer">Footer</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-list-groups.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="List Groups">List groups</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-modals.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Modals">Modals</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-navbar.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Navbar">Navbar</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-offcanvas.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Offcanvas">Offcanvas</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-pagination-breadcrumbs.html" className="menu-link">
                                    <div className="text-truncate"
                                         data-i18n="Pagination & Breadcrumbs">Pagination &amp; Breadcrumbs
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-progress.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Progress">Progress</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-spinners.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Spinners">Spinners</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-tabs-pills.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Tabs & Pills">Tabs &amp; Pills</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-toasts.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Toasts">Toasts</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-tooltips-popovers.html" className="menu-link">
                                    <div className="text-truncate"
                                         data-i18n="Tooltips & Popovers">Tooltips &amp; Popovers
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="ui-typography.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Typography">Typography</div>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <a href="javascript:void(0)" className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-copy"></i>
                            <div className="text-truncate" data-i18n="Extended UI">Extended UI</div>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a href="extended-ui-perfect-scrollbar.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Perfect Scrollbar">Perfect Scrollbar
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="extended-ui-text-divider.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Text Divider">Text Divider</div>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li className="menu-item">
                        <a href="icons-boxicons.html" className="menu-link">
                            <i className="menu-icon tf-icons bx bx-crown"></i>
                            <div className="text-truncate" data-i18n="Boxicons">Boxicons</div>
                        </a>
                    </li>

                    <li className="menu-header small text-uppercase"><span
                        className="menu-header-text">Forms &amp; Tables</span></li>
                    <li className="menu-item">
                        <a href="javascript:void(0);" className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-detail"></i>
                            <div className="text-truncate" data-i18n="Form Elements">Form Elements</div>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a href="forms-basic-inputs.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Basic Inputs">Basic Inputs</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="forms-input-groups.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Input groups">Input groups</div>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="menu-item">
                        <a href="javascript:void(0);" className="menu-link menu-toggle">
                            <i className="menu-icon tf-icons bx bx-detail"></i>
                            <div className="text-truncate" data-i18n="Form Layouts">Form Layouts</div>
                        </a>
                        <ul className="menu-sub">
                            <li className="menu-item">
                                <a href="form-layouts-vertical.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Vertical Form">Vertical Form</div>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a href="form-layouts-horizontal.html" className="menu-link">
                                    <div className="text-truncate" data-i18n="Horizontal Form">Horizontal Form</div>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/form-validation.html"
                            target="_blank"
                            className="menu-link">
                            <i className="menu-icon tf-icons bx bx-list-check"></i>
                            <div className="text-truncate" data-i18n="Form Validation">Form Validation</div>
                            <div
                                className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                            </div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="tables-basic.html" className="menu-link">
                            <i className="menu-icon tf-icons bx bx-table"></i>
                            <div className="text-truncate" data-i18n="Tables">Tables</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/tables-datatables-basic.html"
                            target="_blank"
                            className="menu-link">
                            <i className="menu-icon tf-icons bx bx-grid"></i>
                            <div className="text-truncate" data-i18n="Datatables">Datatables</div>
                            <div
                                className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                            </div>
                        </a>
                    </li>
                    <li className="menu-header small text-uppercase"><span className="menu-header-text">Misc</span></li>
                    <li className="menu-item">
                        <a
                            href="https://github.com/themeselection/sneat-bootstrap-html-admin-template-free/issues"
                            target="_blank"
                            className="menu-link">
                            <i className="menu-icon tf-icons bx bx-support"></i>
                            <div className="text-truncate" data-i18n="Support">Support</div>
                        </a>
                    </li>
                    <li className="menu-item">
                        <a
                            href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                            target="_blank"
                            className="menu-link">
                            <i className="menu-icon tf-icons bx bx-file"></i>
                            <div className="text-truncate" data-i18n="Documentation">Documentation</div>
                        </a>
                    </li>
                </ul>
            </aside>
            {/* / Menu */}

        </>
    );
}

export default Header;
