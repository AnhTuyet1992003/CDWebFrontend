import React from 'react';
import { useNavigate,Link  } from 'react-router-dom';


const Cart = () => {
    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/home" style={{cursor: 'pointer'}}><i className="fa fa-home"></i>Trang
                                    chủ</Link>

                                <span>Giỏ hàng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="shop-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="shop__cart__table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng tiền</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="cart__product__item">
                                            <img src="/img/shop-cart/cp-1.jpg" alt=""/>
                                            <div className="cart__product__item__title">
                                                <h6>Chain bucket bag</h6>
                                                <div className="rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="cart__price">$ 150.0</td>
                                        <td className="cart__quantity">
                                            <div className="pro-qty">
                                                <span className="dec qtybtn">-</span>
                                                <input type="text" value="1"/>
                                                <span className="inc qtybtn">+</span>
                                            </div>
                                        </td>
                                        <td className="cart__total">$ 300.0</td>
                                        <td className="cart__close"><span className="icon_close"></span></td>
                                    </tr>
                                    <tr>
                                        <td className="cart__product__item">
                                            <img src="/img/shop-cart/cp-2.jpg" alt=""/>
                                            <div className="cart__product__item__title">
                                                <h6>Zip-pockets pebbled tote briefcase</h6>
                                                <div className="rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="cart__price">$ 170.0</td>
                                        <td className="cart__quantity">
                                            <div className="pro-qty">
                                                <span className="dec qtybtn">-</span>
                                                <input type="text" value="1"/>
                                                <span className="inc qtybtn">+</span>
                                            </div>
                                        </td>
                                        <td className="cart__total">$ 170.0</td>
                                        <td className="cart__close"><span className="icon_close"></span></td>
                                    </tr>
                                    <tr>
                                        <td className="cart__product__item">
                                            <img src="/img/shop-cart/cp-3.jpg" alt=""/>
                                            <div className="cart__product__item__title">
                                                <h6>Black jean</h6>
                                                <div className="rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="cart__price">$ 85.0</td>
                                        <td className="cart__quantity">
                                            <div className="pro-qty">
                                                <span className="dec qtybtn">-</span>
                                                <input type="text" value="1"/>
                                                <span className="inc qtybtn">+</span>
                                            </div>
                                        </td>
                                        <td className="cart__total">$ 170.0</td>
                                        <td className="cart__close"><span className="icon_close"></span></td>
                                    </tr>
                                    <tr>
                                        <td className="cart__product__item">
                                            <img src="/img/shop-cart/cp-4.jpg" alt=""/>
                                            <div className="cart__product__item__title">
                                                <h6>Cotton Shirt</h6>
                                                <div className="rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="cart__price">$ 55.0</td>
                                        <td className="cart__quantity">
                                            <div className="pro-qty">
                                                <span className="dec qtybtn">-</span>
                                                <input type="text" value="1"/>
                                                <span className="inc qtybtn">+</span>
                                            </div>
                                        </td>
                                        <td className="cart__total">$ 110.0</td>
                                        <td className="cart__close"><span className="icon_close"></span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="cart__btn">
                                <Link to="/home" style={{cursor: 'pointer'}}>Tiếp tục mua hàng</Link>

                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="cart__btn update__btn">
                                <Link to="/cart" style={{cursor: 'pointer'}}><span className="icon_loading"></span>Cập nhật giỏ hàng</Link>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="discount__content">
                                <h6>Mã khuyến mãi</h6>
                                <form action="#">
                                    <input type="text" placeholder="Nhập mã khuyến mãi"/>
                                    <button type="submit" className="site-btn">Áp dụng mã</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-4 offset-lg-2">
                            <div className="cart__total__procced">
                                <h6>TỔng tiền giỏ hàng</h6>
                                <ul>
                                    <li>Tổng phụ <span>$ 750.0</span></li>
                                    <li>Tổng tiền <span>$ 750.0</span></li>
                                </ul>
                                <a href="#" className="primary-btn">Tiến hành thanh toán</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Cart;