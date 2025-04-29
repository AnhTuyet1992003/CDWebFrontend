import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddToCart.css'
const Cart = () => {
    const [cart, setCart] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const handleIncrease = async (cartItemId, currentQuantity) => {
        const newQuantity = currentQuantity + 1;
        await updateQuantity(cartItemId, newQuantity);
    };

    const handleDecrease = async (cartItemId, currentQuantity) => {
        const newQuantity = Math.max(currentQuantity - 1, 1);
        await updateQuantity(cartItemId, newQuantity);
    };

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];
                if (!token) {
                    Swal.fire({
                        icon: 'warning',
                        title: '⚠️ Bạn chưa đăng nhập.',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/login');
                    });
                    return;
                }
                const response = await axios.get("https://localhost:8443/api/v1/carts", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
                const data = response.data.data;

                if (!data.items || data.items.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: '⚠️ Giỏ hàng của bạn đang trống.',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/home');
                    });
                    return;
                }

                setCart(data);
            } catch (error) {
                console.error("Error fetching cart data: ", error);
            }
        };
        fetchCart();
    }, []);
    if (!cart) {
        return <div>Loading...</div>;
    }

    const handleRemoveItem = (cartItemId) => {
        Swal.fire({
            icon: 'warning',
            title: 'Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?',
            showCancelButton: true,
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('token='))
                        ?.split('=')[1];
                    if (!token) {
                        Swal.fire({
                            icon: 'warning',
                            title: '⚠️ Bạn chưa đăng nhập.',
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/login');
                        });
                        return;
                    }

                    const response = await axios.delete('https://localhost:8443/api/v1/carts/remove-item', {
                        params: { cartItemId },
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
                    });

                    const updatedCart = response.data.data;

                    if (!updatedCart.cart_items || updatedCart.cart_items.length === 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: '⚠️ Giỏ hàng của bạn đang trống.',
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/home');
                        });
                        return;
                    }

                    setCart({
                        ...cart,
                        items: updatedCart.cart_items.map(item => {
                            const oldItem = cart.items.find(ci => ci.id === item.id);
                            return {
                                ...oldItem,
                                ...item
                            };
                        }),
                        totalPrice: updatedCart.cart_items.reduce((sum, item) => {
                            const oldItem = cart.items.find(ci => ci.id === item.id);
                            return sum + (oldItem?.price || 0) * item.quantity;
                        }, 0)
                    });

                    Swal.fire({
                        icon: 'success',
                        title: '✅ Đã xóa sản phẩm khỏi giỏ hàng!',
                        confirmButtonText: 'OK',
                    });
                } catch (error) {
                    console.error("Error removing item: ", error);
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Xảy ra lỗi khi xóa!',
                        text: error.response?.data?.message || error.message,
                    });
                }
            }
        });
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];
            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: '⚠️ Bạn chưa đăng nhập.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/login');
                });
                return;
            }

            const response = await axios.put("https://localhost:8443/api/v1/carts/update-quantity", null, {
                params: {
                    cartItemId,
                    quantity: newQuantity
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            const updatedCart = response.data.data;
            setCart(updatedCart);
        } catch (error) {
            console.error("Error updating quantity: ", error);
            Swal.fire({
                icon: 'error',
                title: '❌ Cập nhật thất bại!',
                text: error.response?.data?.message || error.message,
            });
        }
    };


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
                                    {cart.items.map(item => (
                                    <tr>
                                        <td className="cart__product__item" key={item.id}>
                                            <img style={{height: "90px", width:"90px"}} src={item.productImage} alt={item.productName}/>
                                            <div className="cart__product__item__title">
                                                <h6>{item.productName}</h6>
                                                <div className="rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="cart__price">{formatVND(item.price)}</td>
                                        <td className="cart__quantity">
                                            <div className="pro-qty">
                                                <span className="dec qtybtn"
                                                      onClick={() => handleDecrease(item.id, item.quantity)}>-</span>
                                                <input type="text" value={item.quantity} readOnly/>
                                                <span className="inc qtybtn"
                                                      onClick={() => handleIncrease(item.id, item.quantity)}>+</span>

                                            </div>
                                        </td>
                                        <td className="cart__total">{formatVND(item.price * item.quantity)}</td>
                                        <td className="cart__close"><span className="icon_close"  onClick={() => handleRemoveItem(item.id)} style={{ cursor: 'pointer' }}></span></td>
                                    </tr>
                                    ))}
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
                                    <li>Tổng phụ <span>{formatVND(cart.totalPrice)}</span></li>
                                    <li>Tổng tiền <span>{formatVND(cart.totalPrice)}</span></li>
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