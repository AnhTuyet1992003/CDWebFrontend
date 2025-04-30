import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddToCart.css'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // ^
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // v

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const [openSelectorId, setOpenSelectorId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [productVariants, setProductVariants] = useState({});

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

    const fetchProductById = async (id) => {
        try {
            const response = await axios.get(`https://localhost:8443/api/v1/products/getProduct/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error);
            return null;
        }
    };
    const handleClickColorSizeProduct = async (itemId, productId, color, size) => {
        // toggle hiện/ẩn
        if (openSelectorId === itemId) {
            setOpenSelectorId(null);
            return;
        }
        setSelectedColor(color);
        setSelectedSize(size)

        if (!productVariants[itemId]) {
            const productData = await fetchProductById(productId);
            if (productData) {
                setProductVariants(prev => ({
                    ...prev,
                    [itemId]: productData.sizeColorVariants
                }));
            }
        }

        setOpenSelectorId(itemId);
    };

    const colorMap = {
        "Đen": "#000000",
        "Trắng": "#FFFFFF",
        "Đỏ": "#FF0000",
        "Xám": "#606060",
        "Vàng": "#ffdd00",
        "Nâu": "#854100",
        "Tím": "#9900ff",
        "Xanh": "#0b77e1",
        "Xanh Demin": "#286fb5",
        "Be": "#F5F5DC",
    };
    const handleColorSelect = (color, itemId) => {
        setSelectedColor(prevColor => {
            const newColor = prevColor === color ? null : color;

            // Kiểm tra kích thước hợp lệ với màu mới
            const validSizes = productVariants[itemId]?.filter(variant => variant.color === newColor).map(variant => variant.size);

            if (validSizes && !validSizes.includes(selectedSize)) {
                setSelectedSize(null); // Reset size nếu không còn hợp lệ
            }

            return newColor;
        });
    };

    const handleSizeSelect = (size, itemId) => {
        setSelectedSize(prev => {
            const newSize = prev === size ? null : size;

            // Kiểm tra màu sắc hợp lệ với kích thước mới
            const validColors = productVariants[itemId]?.filter(variant => variant.size === newSize).map(variant => variant.color);

            if (validColors && !validColors.includes(selectedColor)) {
                setSelectedColor(null); // Reset color nếu không còn hợp lệ
            }

            return newSize;
        });
    };

    const updateColorAndSize = async (cartItemId, newProductSizeColorId) => {
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

            const response = await axios.put("https://localhost:8443/api/v1/carts/update-size-color", null, {
                params: {
                    cartItemId,
                    newProductSizeColorId: newProductSizeColorId
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            const updatedSizeAndColor = response.data.data;
            setCart(prevCart => ({
                ...prevCart,
                items: prevCart.items.map(item =>
                    item.id === updatedSizeAndColor.id ? updatedSizeAndColor : item
                )
            }));

        } catch (error) {
            console.error("Error updating quantity: ", error);
            Swal.fire({
                icon: 'error',
                title: '❌ Cập nhật thất bại!',
                text: error.response?.data?.message || error.message,
            });
        }
    };

    const handleConfirmVariantChange = (itemId) => {
        const variant = productVariants[itemId]?.find(
            v => v.color === selectedColor && v.size === selectedSize
        );

        if (!variant) {
            setOpenSelectorId(null);
            Swal.fire({
                icon: 'warning',
                title: '⚠️ Không hợp lệ!',
                text: 'Vui lòng chọn lại đầy đủ màu và kích cỡ.',
            });
            return;
        }

        // Đóng phần chọn ngay khi hỏi
        setOpenSelectorId(null);

        Swal.fire({
            title: 'Xác nhận thay đổi?',
            text: `Bạn có chắc muốn đổi sang ${selectedColor} / ${selectedSize}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        }).then(result => {
            if (result.isConfirmed) {
                updateColorAndSize(itemId, variant.id); // Gọi API
            }
        });
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
                                        <tr key={item.id}>
                                            <td className="cart__product__item" style={{ position: "relative", overflow: "visible" }}>
                                                <img
                                                    style={{ height: "90px", width: "90px" }}
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                />
                                                <div className="cart__product__item__title" style={{ overflow: "visible" }}>
                                                    <h6>{item.productName}</h6>
                                                    <div style={{ position: 'relative' }}>
                                                        <div
                                                            className="choose_size_color"
                                                            onClick={() => handleClickColorSizeProduct(item.id, item.productId, item.color, item.size)}
                                                        >
                                                        <span>
                                                            Màu sắc: {item.color} | Kích thước: {item.size}
                                                            <ExpandMoreIcon style={{ fontSize: '16px', marginLeft: '5px' }} />
                                                        </span>
                                                        </div>

                                                        {openSelectorId === item.id && (
                                                            <div className="open_choose_size_color">
                                                                <div className="choose_color">
                                                                    <div className="color_title">
                                                                        <p>Màu sắc</p>
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                                        {[...new Set(productVariants[item.id]?.map(v => v.color))].map((color, idx) => {
                                                                            // tìm variant có cùng color và size (nếu có) để lấy độ mờ
                                                                            const isCompatibleWithSize = !selectedSize || productVariants[item.id]?.some(v => v.color === color && v.size === selectedSize);
                                                                            return (
                                                                                <div
                                                                                    key={`color-${idx}`}
                                                                                    className={`btn_color_cart ${color === selectedColor ? 'active' : ''}`}
                                                                                    style={{
                                                                                        background: colorMap[color] || "#ccc",
                                                                                        opacity: isCompatibleWithSize ? 1 : 0.3
                                                                                    }}
                                                                                    title={color}
                                                                                    onClick={() => handleColorSelect(color, item.id)}
                                                                                ></div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div className="choose_size" style={{ marginTop: '10px' }}>
                                                                    <div className="size_title">
                                                                        <p>Kích cỡ</p>
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                                        {[...new Set(productVariants[item.id]?.map(v => v.size))].map((size, idx) => {
                                                                            const isCompatibleWithColor = !selectedColor || productVariants[item.id]?.some(v => v.size === size && v.color === selectedColor);
                                                                            return (
                                                                                <div
                                                                                    key={`size-${idx}`}
                                                                                    className={`btn_size_cart ${size === selectedSize ? 'active' : ''}`}
                                                                                    style={{
                                                                                        opacity: isCompatibleWithColor ? 1 : 0.3
                                                                                    }}
                                                                                    onClick={() => handleSizeSelect(size, item.id)}
                                                                                >
                                                                                    {size}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="btn_choose_color_size"
                                                                    onClick={() => handleConfirmVariantChange(item.id)}
                                                                >
                                                                    Xác Nhận
                                                                </div>


                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                            </td>

                                            <td className="cart__price">{formatVND(item.price)}</td>
                                            <td className="cart__quantity">
                                                <div className="cart_btn_quantity">
                                                    <div
                                                        className="cart_btn_quantity_de"
                                                        onClick={() => handleDecrease(item.id, item.quantity)}
                                                    >
                                                        -
                                                    </div>
                                                    <div className="cart_btn_quantity_number">{item.quantity}</div>
                                                    <div
                                                        className="cart_btn_quantity_in"
                                                        onClick={() => handleIncrease(item.id, item.quantity)}
                                                    >
                                                        +
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="cart__total">{formatVND(item.price * item.quantity)}</td>
                                            <td className="cart__close">
            <span
                className="icon_close"
                onClick={() => handleRemoveItem(item.id)}
                style={{ cursor: 'pointer' }}
            ></span>
                                            </td>
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
                                <Link to="/cart" style={{cursor: 'pointer'}}><span className="icon_loading"></span>Cập
                                    nhật giỏ hàng</Link>
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