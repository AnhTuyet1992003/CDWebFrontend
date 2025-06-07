import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddToCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faHeart } from '@fortawesome/free-solid-svg-icons';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import ChooseCoupon from './choose-coupon';

const Cart = () => {
    const { t } = useTranslation('translation');
    const [cart, setCart] = useState({ items: [], totalQuantityProduct: 0 });
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const [openSelectorId, setOpenSelectorId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [productVariants, setProductVariants] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const toggleCouponModal = async () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng chọn sản phẩm trước khi áp dụng mã giảm giá',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (coupons.length === 0) {
            const result = await Swal.fire({
                icon: 'info',
                title: 'Thông báo',
                text: 'Bạn cần lưu mã bên trang mã giảm giá mới có thể chọn mã.',
                showCancelButton: true,
                confirmButtonText: 'OK',
                cancelButtonText: 'Hủy',
            });

            if (result.isConfirmed) {
                navigate('/coupon');
            }
            return; // Không mở modal
        }

        setIsCouponModalOpen(!isCouponModalOpen);
    };


    // Lấy danh sách coupon từ API
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('token='))
                    ?.split('=')[1];

                const response = await axios.get('https://localhost:8443/api/v1/coupons/user/type/1-2', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                setCoupons(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách coupon:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể lấy danh sách mã giảm giá',
                });
            }
        };

        fetchCoupons();
    }, []);

    // Xử lý chọn coupon từ ChooseCoupon
    const handleCouponSelect = (coupon) => {
        setSelectedCoupon(coupon);
    };

    // Tính toán tổng giá và số lượng sản phẩm đã chọn
    const selectedSummary = useMemo(() => {
        const totalQuantityProduct = selectedItems.reduce((sum, id) => {
            const item = cart.items.find((item) => item.id === id);
            return sum + (item ? item.quantity : 0);
        }, 0);

        // Tổng giá ban đầu (trước khi giảm)
        const originalTotalPrice = selectedItems.reduce((sum, id) => {
            const item = cart.items.find((item) => item.id === id);
            return sum + (item ? item.price * item.quantity : 0);
        }, 0);

        // Tổng giá sau khi giảm
        let totalPrice = originalTotalPrice;
        let discountAmount = 0;

        // Áp dụng giảm giá từ coupon
        if (selectedCoupon) {
            if (selectedCoupon.maxUsesPerUser - selectedCoupon.usageCount <= 0)
            {
                Swal.fire({
                    icon: 'warning',
                    title: "Không thõa mãn điều kiện của mã giảm",
                    text: "Hết lượt sử dụng mã này",
                    confirmButtonText: 'OK',
                })
                setSelectedCoupon(null);
            }
            if (totalPrice<selectedCoupon.minOrderValue){
                Swal.fire({
                    icon: 'warning',
                    title: "Không thõa mãn điều kiện của mã giảm",
                    text: "Không đủ tổng tiền tối thiểu",
                    confirmButtonText: 'OK',
                })
                setSelectedCoupon(null);
            }
            if (selectedItems.length<selectedCoupon.minProductQuantity){
                Swal.fire({
                    icon: 'warning',
                    title: "Không thõa mãn điều kiện của mã giảm",
                    text: "Không đủ số lượng sản phẩm tối thiểu",
                    confirmButtonText: 'OK',
                })
                setSelectedCoupon(null);
            }
            if (selectedCoupon.couponType === 'Giảm theo tiền') {
                discountAmount = Math.min(selectedCoupon.discountValue, totalPrice); // Không giảm quá tổng giá
                totalPrice -= discountAmount;

            } else if (selectedCoupon.couponType === 'Giảm theo phần trăm') {
                discountAmount = (originalTotalPrice * selectedCoupon.discountValue) / 100;
                // Kiểm tra giới hạn giảm tối đa (nếu có)
                if (selectedCoupon.maxDiscountAmount) {
                    discountAmount = Math.min(discountAmount, selectedCoupon.maxDiscountAmount);
                }
                totalPrice -= discountAmount;
            }
        }

        return {
            totalQuantityProduct,
            originalTotalPrice,
            totalPrice: Math.max(totalPrice, 0),
            discountAmount,
        };
    }, [selectedItems, cart.items, selectedCoupon]);

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + ' ₫';
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.items.map((item) => item.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleSelectItem = (itemId) => {
        const updatedItems = selectedItems.includes(itemId)
            ? selectedItems.filter((id) => id !== itemId)
            : [...selectedItems, itemId];
        setSelectedItems(updatedItems);
        setIsAllSelected(updatedItems.length === cart.items.length);
    };

    const handleIncrease = async (cartItemId, currentQuantity) => {
        const newQuantity = currentQuantity + 1;
        await updateQuantity(cartItemId, newQuantity);
    };

    const handleDecrease = async (cartItemId, currentQuantity) => {
        const newQuantity = Math.max(currentQuantity - 1, 1);
        await updateQuantity(cartItemId, newQuantity);
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('token='))
                    ?.split('=')[1];
                if (!token) {
                    Swal.fire({
                        icon: 'warning',
                        title: t('login.error_login'),
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/login');
                    });
                    return;
                }
                const response = await axios.get('https://localhost:8443/api/v1/carts', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                const data = response.data.data;

                if (!data.items || data.items.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: t('cart.error_empty_cart'),
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/shop');
                    });
                    return;
                }

                setCart(data);
            } catch (error) {
                console.error('Error fetching cart data: ', error);
            }
        };
        fetchCart();
    }, [navigate, t]);

    const handleRemoveItem = (cartItemId) => {
        Swal.fire({
            icon: 'warning',
            title: t('cart.delete_product_cart'),
            showCancelButton: true,
            confirmButtonText: t('cart.btn_delete'),
            cancelButtonText: t('cart.btn_cancel'),
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('token='))
                        ?.split('=')[1];
                    if (!token) {
                        Swal.fire({
                            icon: 'warning',
                            title: t('login.error_login'),
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/login');
                        });
                        return;
                    }

                    const response = await axios.delete('https://localhost:8443/api/v1/carts/remove-item', {
                        params: { cartItemId },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });

                    const updatedCart = response.data.data;

                    if (!updatedCart.cart_items || updatedCart.cart_items.length === 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: t('cart.error_empty_cart'),
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/shop');
                        });
                        return;
                    }

                    setCart({
                        ...cart,
                        items: updatedCart.cart_items.map((item) => {
                            const oldItem = cart.items.find((ci) => ci.id === item.id);
                            return {
                                ...oldItem,
                                ...item,
                            };
                        }),
                        totalPrice: updatedCart.cart_items.reduce((sum, item) => {
                            const oldItem = cart.items.find((ci) => ci.id === item.id);
                            return sum + (oldItem?.price || 0) * item.quantity;
                        }, 0),
                    });

                    Swal.fire({
                        icon: 'success',
                        title: t('cart.success_delete_product_cart'),
                        confirmButtonText: 'OK',
                    });
                } catch (error) {
                    console.error('Error removing item: ', error);
                    Swal.fire({
                        icon: 'error',
                        title: t('cart.error_delete_product'),
                    });
                }
            }
        });
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))
                ?.split('=')[1];
            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: t('login.error_login'),
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/login');
                });
                return;
            }

            const response = await axios.put(
                'https://localhost:8443/api/v1/carts/update-quantity',
                null,
                {
                    params: {
                        cartItemId,
                        quantity: newQuantity,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            const updatedCart = response.data.data;
            setCart(updatedCart);
        } catch (error) {
            console.error('Error updating quantity: ', error);
            Swal.fire({
                icon: 'error',
                title: t('cart.error_update_quantity_product'),
            });
        }
    };

    const fetchProductById = async (id) => {
        try {
            const response = await axios.get(`https://localhost:8443/api/v1/products/getProduct/${id}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            return null;
        }
    };

    const handleClickColorSizeProduct = async (itemId, productId, color, size) => {
        if (openSelectorId === itemId) {
            setOpenSelectorId(null);
            return;
        }
        setSelectedColor(color);
        setSelectedSize(size);

        if (!productVariants[itemId]) {
            const productData = await fetchProductById(productId);
            if (productData) {
                setProductVariants((prev) => ({
                    ...prev,
                    [itemId]: productData.sizeColorVariants,
                }));
            }
        }

        setOpenSelectorId(itemId);
    };

    const colorMap = {
        Đen: '#000000',
        Trắng: '#FFFFFF',
        Đỏ: '#FF0000',
        Xám: '#606060',
        Vàng: '#ffdd00',
        Nâu: '#854100',
        Tím: '#9900ff',
        Xanh: '#0b77e1',
        'Xanh Demin': '#286fb5',
        Be: '#F5F5DC',
        Hồng: '#ff0099',
    };

    const handleColorSelect = (color, itemId) => {
        setSelectedColor((prevColor) => {
            const newColor = prevColor === color ? null : color;

            const validSizes = productVariants[itemId]
                ?.filter((variant) => variant.color === newColor)
                .map((variant) => variant.size);

            if (validSizes && !validSizes.includes(selectedSize)) {
                setSelectedSize(null);
            }

            return newColor;
        });
    };

    const handleSizeSelect = (size, itemId) => {
        setSelectedSize((prev) => {
            const newSize = prev === size ? null : size;

            const validColors = productVariants[itemId]
                ?.filter((variant) => variant.size === newSize)
                .map((variant) => variant.color);

            if (validColors && !validColors.includes(selectedColor)) {
                setSelectedColor(null);
            }

            return newSize;
        });
    };

    const updateColorAndSize = async (cartItemId, newProductSizeColorId) => {
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))
                ?.split('=')[1];
            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: t('login.error_login'),
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/login');
                });
                return;
            }

            const response = await axios.put(
                'https://localhost:8443/api/v1/carts/update-size-color',
                null,
                {
                    params: {
                        cartItemId,
                        newProductSizeColorId: newProductSizeColorId,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            const updatedSizeAndColor = response.data.data;
            setCart((prevCart) => ({
                ...prevCart,
                items: prevCart.items.map((item) =>
                    item.id === updatedSizeAndColor.id ? updatedSizeAndColor : item
                ),
            }));
        } catch (error) {
            console.error('Error updating quantity: ', error);
            Swal.fire({
                icon: 'error',
                title: t('cart.error_update_size_color_product'),
            });
        }
    };

    const handleConfirmVariantChange = (itemId) => {
        const variant = productVariants[itemId]?.find(
            (v) => v.color === selectedColor && v.size === selectedSize
        );

        if (!variant) {
            setOpenSelectorId(null);
            Swal.fire({
                icon: 'warning',
                title: t('cart.warning_update_size_color_title'),
                text: t('cart.warning_update_size_color_text'),
            });
            return;
        }

        setOpenSelectorId(null);

        Swal.fire({
            title: t('cart.change_size_color_title'),
            text: `${t('cart.change_size_color_text')} ${selectedColor} / ${selectedSize}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: t('cart.btn_change_size_color_confirm'),
            cancelButtonText: t('cart.btn_change_size_color_cancel'),
        }).then((result) => {
            if (result.isConfirmed) {
                updateColorAndSize(itemId, variant.id);
            }
        });
    };

    const handleRemoveSelectedItems = () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                icon: 'info',
                title: t('cart.info_choose_delete_product'),
                confirmButtonText: 'OK',
            });
            return;
        }

        Swal.fire({
            icon: 'warning',
            title: t('cart.warning_delete_select_product'),
            showCancelButton: true,
            confirmButtonText: t('cart.btn_delete'),
            cancelButtonText: t('cart.btn_cancel'),
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('token='))
                        ?.split('=')[1];

                    if (!token) {
                        Swal.fire({
                            icon: 'warning',
                            title: t('login.error_login'),
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/login');
                        });
                        return;
                    }

                    const query = selectedItems.map((id) => `cartItemId=${id}`).join('&');
                    const url = `https://localhost:8443/api/v1/carts/remove-items?${query}`;

                    const response = await axios.delete(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });

                    const updatedCart = response.data.data;

                    if (!updatedCart.items || updatedCart.items.length === 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: t('cart.error_empty_cart'),
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/shop');
                        });
                        return;
                    }

                    setCart(updatedCart);
                    setSelectedItems([]);
                    setIsAllSelected(false);

                    Swal.fire({
                        icon: 'success',
                        title: t('cart.success_delete_select_product'),
                        confirmButtonText: 'OK',
                    });
                } catch (error) {
                    console.error('Error removing selected items: ', error);
                    Swal.fire({
                        icon: 'error',
                        title: t('cart.error_delete_product'),
                    });
                }
            }
        });
    };

    const handleCheckout = async () => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: t('login.error_login'),
                confirmButtonText: 'OK',
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        if (selectedItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: t('cart.warning_choose_product_buy_title'),
                text: t('cart.warning_choose_product_buy_text'),
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const query = selectedItems.map((id) => `cart_item_id=${id}`).join('&');
            const url = `https://localhost:8443/api/v1/orders/prepare?${query}${
                selectedCoupon ? `&couponCode=${encodeURIComponent(selectedCoupon.code)}` : ''
            }`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const result = await response.json();
            if (result.status === 'success') {
                localStorage.setItem('preparedOrder', JSON.stringify(result.data));
                navigate('/checkout');
            } else {
                Swal.fire({ icon: 'error', title: t('cart.error'), text: result.message });
            }
        } catch (error) {
            console.error('Lỗi khi chuẩn bị đơn hàng:', error);
            Swal.fire({ icon: 'error', title: 'Lỗi server' });
        }
    };

    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/home" style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-home"></i> Trang chủ
                                </Link>
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
                                        <th>
                                            <input
                                                className="check_product"
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={isAllSelected}
                                            />
                                        </th>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng giá</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cart.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <input
                                                    className="check_product"
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => handleSelectItem(item.id)}
                                                />
                                            </td>
                                            <td
                                                className="cart__product__item"
                                                style={{ position: 'relative', overflow: 'visible' }}
                                            >
                                                <img
                                                    style={{ height: '90px', width: '90px' }}
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                />
                                                <div
                                                    className="cart__product__item__title"
                                                    style={{ overflow: 'visible' }}
                                                >
                                                    <h6>{item.productName}</h6>
                                                    <div style={{ position: 'relative' }}>
                                                        <div
                                                            className="choose_size_color"
                                                            onClick={() =>
                                                                handleClickColorSizeProduct(
                                                                    item.id,
                                                                    item.productId,
                                                                    item.color,
                                                                    item.size
                                                                )
                                                            }
                                                        >
                                                                <span>
                                                                    Màu: {item.color} | Kích cỡ: {item.size}
                                                                    <ExpandMoreIcon
                                                                        style={{ fontSize: '16px', marginLeft: '5px' }}
                                                                    />
                                                                </span>
                                                        </div>
                                                        {openSelectorId === item.id && (
                                                            <div className="open_choose_size_color">
                                                                <div className="choose_color">
                                                                    <div className="color_title">
                                                                        <p>Màu</p>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            gap: '5px',
                                                                            flexWrap: 'wrap',
                                                                        }}
                                                                    >
                                                                        {[
                                                                            ...new Set(
                                                                                productVariants[item.id]?.map((v) => v.color)
                                                                            ),
                                                                        ].map((color, idx) => {
                                                                            const isCompatibleWithSize =
                                                                                !selectedSize ||
                                                                                productVariants[item.id]?.some(
                                                                                    (v) =>
                                                                                        v.color === color &&
                                                                                        v.size === selectedSize
                                                                                );
                                                                            return (
                                                                                <div
                                                                                    key={`color-${idx}`}
                                                                                    className={`btn_color_cart ${
                                                                                        color === selectedColor ? 'active' : ''
                                                                                    }`}
                                                                                    style={{
                                                                                        background: colorMap[color] || '#ccc',
                                                                                        opacity: isCompatibleWithSize ? 1 : 0.3,
                                                                                    }}
                                                                                    title={color}
                                                                                    onClick={() =>
                                                                                        handleColorSelect(color, item.id)
                                                                                    }
                                                                                ></div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="choose_size"
                                                                    style={{ marginTop: '10px' }}
                                                                >
                                                                    <div className="size_title">
                                                                        <p>Kích cỡ</p>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            gap: '5px',
                                                                            flexWrap: 'wrap',
                                                                        }}
                                                                    >
                                                                        {[
                                                                            ...new Set(
                                                                                productVariants[item.id]?.map((v) => v.size)
                                                                            ),
                                                                        ].map((size, idx) => {
                                                                            const isCompatibleWithColor =
                                                                                !selectedColor ||
                                                                                productVariants[item.id]?.some(
                                                                                    (v) =>
                                                                                        v.size === size &&
                                                                                        v.color === selectedColor
                                                                                );
                                                                            return (
                                                                                <div
                                                                                    key={`size-${idx}`}
                                                                                    className={`btn_size_cart ${
                                                                                        size === selectedSize ? 'active' : ''
                                                                                    }`}
                                                                                    style={{
                                                                                        opacity: isCompatibleWithColor ? 1 : 0.3,
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        handleSizeSelect(size, item.id)
                                                                                    }
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
                                                                    Xác nhận
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
                    <div className="checkout_product">
                        <div className="information_cart">
                            <div className="choose_product">
                                <input
                                    className="check_product"
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={isAllSelected}
                                />
                                <span style={{ paddingLeft: '15px' }}>
                                    Chọn tất cả ({cart.totalQuantityProduct})
                                </span>
                                <button
                                    style={{ paddingLeft: '15px' }}
                                    className="delete_all_product"
                                    onClick={handleRemoveSelectedItems}
                                >
                                    Xóa
                                </button>
                            </div>
                            <div className="coupon_product">
                                <div className="coupon_product_btn" onClick={toggleCouponModal}>
                                    <FontAwesomeIcon className="ticket" icon={faTicket} /> Mã giảm giá
                                </div>
                                <div style={{ paddingLeft: '10px', color: '#ff0000', fontWeight: 'bold' }}>
                                    {selectedCoupon && selectedSummary.discountAmount > 0
                                        ? `Giảm: ${formatVND(selectedSummary.discountAmount)}`
                                        : ''}
                                </div>
                            </div>
                            <ChooseCoupon
                                visible={isCouponModalOpen}
                                onClose={toggleCouponModal}
                                formatVND={formatVND}
                                coupons={coupons}
                                onCouponSelect={handleCouponSelect}
                            />
                            <div className="product_total_price">
                                <div className="total_price">
                                    Tổng tiền{' '}
                                    <span style={{ fontSize: '12px' }}>
                                        ({selectedSummary.totalQuantityProduct} sản phẩm)
                                    </span>
                                    <p className="total">{formatVND(selectedSummary.totalPrice)}</p>
                                </div>
                            </div>
                            <div className="btn_checkout_order" onClick={handleCheckout}>
                                Thanh toán
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Cart;