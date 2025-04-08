import React from 'react';
import {Link} from "react-router-dom";

const Checkout = () => {
    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/home" style={{cursor: 'pointer'}}><i className="fa fa-home"></i>Trang
                                    chủ</Link>
                                <span>Thanh toán</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="checkout spad">
                <div className="container">
                    <form action="#" className="checkout__form">
                        <div className="row">
                            <div className="col-lg-7">
                                <h5>Chi tiết thanh toán</h5>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="checkout__form__input">
                                            <p>Họ và tên <span>*</span></p>
                                            <input type="text"/>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="checkout__form__input">
                                            <p>Thành phố <span>*</span></p>
                                            <input type="text"/>
                                        </div>
                                        <div className="checkout__form__input">
                                            <p>Địa chỉ <span>*</span></p>
                                            <input type="text" placeholder="Street Address"/>
                                            <input type="text" placeholder="Apartment. suite, unite ect ( optinal )"/>
                                        </div>
                                        <div className="checkout__form__input">
                                            <p>Town/City <span>*</span></p>
                                            <input type="text"/>
                                        </div>
                                        <div className="checkout__form__input">
                                            <p>Country/State <span>*</span></p>
                                            <input type="text"/>
                                        </div>
                                        <div className="checkout__form__input">
                                            <p>Postcode/Zip <span>*</span></p>
                                            <input type="text"/>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Số điện thoại <span>*</span></p>
                                            <input type="text"/>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Email <span>*</span></p>
                                            <input type="text"/>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="checkout__form__input">
                                            <p>Ghi chú đơn hàng của bạn <span>*</span></p>
                                            <input type="text"
                                                   placeholder="Note about your order, e.g, special noe for delivery"/>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-lg-5">
                                <div className="checkout__order">
                                    <h5>Đơn hàng của bạn</h5>
                                    <div className="checkout__order__product">
                                        <ul>
                                        <li>
                                                <span className="top__text">Sản phẩm</span>
                                                <span className="top__text__right">Tổng tiền</span>
                                            </li>
                                            <li>01. Chain buck bag <span>$ 300.0</span></li>
                                            <li>02. Zip-pockets pebbled<br/> tote briefcase <span>$ 170.0</span></li>
                                            <li>03. Black jean <span>$ 170.0</span></li>
                                            <li>04. Cotton shirt <span>$ 110.0</span></li>
                                        </ul>
                                    </div>
                                    <div className="checkout__order__total">
                                        <ul>
                                            <li>Tổng phụ <span>$ 750.0</span></li>
                                            <li>Tổng tiền <span>$ 750.0</span></li>
                                        </ul>
                                    </div>
                                    <div className="checkout__order__widget">
                                        <label htmlFor="check-payment">
                                            Cheque payment
                                            <input type="checkbox" id="check-payment"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="paypal">
                                            PayPal
                                            <input type="checkbox" id="paypal"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                    <button type="submit" className="site-btn">Place oder</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Checkout;
