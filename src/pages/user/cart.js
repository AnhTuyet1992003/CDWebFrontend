import React, {useMemo ,  useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddToCart.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faHeart } from '@fortawesome/free-solid-svg-icons';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // ^
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useTranslation} from "react-i18next"; // v

const Cart = () => {
    const { t } = useTranslation('translation');
    const [cart, setCart] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const [openSelectorId, setOpenSelectorId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [productVariants, setProductVariants] = useState({});

    const [selectedItems, setSelectedItems] = useState([]);

    const [isAllSelected, setIsAllSelected] = useState(false);



    const selectedSummary = useMemo(() => {
        if (!cart || !cart.items) return { totalPrice: 0, totalQuantity: 0 };

        const selected = cart.items.filter(item => selectedItems.includes(item.id));

        const totalPrice = selected.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalQuantity = selected.reduce((sum, item) => sum + item.quantity, 0);
        const totalQuantityProduct = selected.reduce((sum, item) => sum + 1, 0);
        return { totalPrice, totalQuantity, totalQuantityProduct };
    }, [cart, selectedItems]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.items.map(item => item.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleSelectItem = (itemId) => {
        const updatedItems = selectedItems.includes(itemId)
            ? selectedItems.filter(id => id !== itemId)
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
                        title: t('login.error_login'),
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
                        title: t('cart.error_empty_cart'),
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/shop');
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
            title:t('cart.delete_product_cart'),
            showCancelButton: true,
            confirmButtonText:t('cart.btn_delete'),
            cancelButtonText:t('cart.btn_cancel'),
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
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
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
                        title: t('cart.success_delete_product_cart'),
                        confirmButtonText: 'OK',
                    });
                } catch (error) {
                    console.error("Error removing item: ", error);
                    Swal.fire({
                        icon: 'error',
                        title: t('cart.error_delete_product'),
                        // text: error.response?.data?.message || error.message,
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
                    title: t('login.error_login'),
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
                title: t('cart.error_update_quantity_product'),
                // text: error.response?.data?.message || error.message,
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
        "Hồng": "#ff0099"
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
                    title: t('login.error_login'),
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
                title: t('cart.error_update_size_color_product'),
                // text: error.response?.data?.message || error.message,
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
                title: t('cart.warning_update_size_color_title'),
                text: t('cart.warning_update_size_color_text'),
            });
            return;
        }

        // Đóng phần chọn ngay khi hỏi
        setOpenSelectorId(null);

        Swal.fire({
            title: t('cart.change_size_color_title'),
            text: `${t('cart.change_size_color_text')} ${selectedColor} / ${selectedSize}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: t('cart.btn_change_size_color_confirm'),
            cancelButtonText: t('cart.btn_change_size_color_cancel'),
        }).then(result => {
            if (result.isConfirmed) {
                updateColorAndSize(itemId, variant.id); // Gọi API
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
                        .find(row => row.startsWith('token='))
                        ?.split('=')[1];

                    if (!token) {
                        Swal.fire({
                            icon: 'warning',
                            title:  t('login.error_login'),
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/login');
                        });
                        return;
                    }

                    // Tạo URL query string
                    const query = selectedItems.map(id => `cartItemId=${id}`).join('&');
                    const url = `https://localhost:8443/api/v1/carts/remove-items?${query}`;

                    const response = await axios.delete(url, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        withCredentials: true
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
                    console.error("Error removing selected items: ", error);
                    Swal.fire({
                        icon: 'error',
                        title: t('cart.error_delete_product'),
                        // text: error.response?.data?.message || error.message,
                    });
                }
            }
        });
    };


    const handleCheckout = async () => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

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
            const query = selectedItems.map(id => `cart_item_id=${id}`).join('&');
            const url = `https://localhost:8443/api/v1/orders/prepare?${query}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });

            const result = await response.json();
            if (result.status === "success") {
                localStorage.setItem("preparedOrder", JSON.stringify(result.data));

                const preparedOrder = JSON.parse(localStorage.getItem("preparedOrder"));

                navigate('/checkout');
            } else {
                Swal.fire({ icon: 'error', title:  t('cart.error'), text: result.message });
            }
        } catch (error) {
            console.error("Lỗi khi chuẩn bị đơn hàng:", error);
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
                                <Link to="/home" style={{cursor: 'pointer'}}><i className="fa fa-home"></i>{ t('cart.home')}</Link>

                                <span>{ t('cart.title')}</span>
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
                                            <input className={"check_product"} type={"checkbox"}
                                                   onChange={handleSelectAll}
                                                   checked={isAllSelected}/>
                                        </th>
                                        <th>{ t('cart.product')}</th>
                                        <th>{ t('cart.price')}</th>
                                        <th>{ t('cart.quantity')}</th>
                                        <th>{ t('cart.total_price')}</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cart.items.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <input className={"check_product"} type={"checkbox"}
                                                       checked={selectedItems.includes(item.id)}
                                                       onChange={() => handleSelectItem(item.id)}/>
                                            </td>
                                            <td className="cart__product__item"
                                                style={{position: "relative", overflow: "visible"}}>
                                                <img
                                                    style={{height: "90px", width: "90px"}}
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                />
                                                <div className="cart__product__item__title"
                                                     style={{overflow: "visible"}}>
                                                    <h6>{item.productName}</h6>
                                                    <div style={{position: 'relative'}}>
                                                        <div
                                                            className="choose_size_color"
                                                            onClick={() => handleClickColorSizeProduct(item.id, item.productId, item.color, item.size)}
                                                        >
                                                        <span>
                                                            { t('cart.color')}: {item.color} | { t('cart.size')}: {item.size}
                                                            <ExpandMoreIcon
                                                                style={{fontSize: '16px', marginLeft: '5px'}}/>
                                                        </span>
                                                        </div>

                                                        {openSelectorId === item.id && (
                                                            <div className="open_choose_size_color">
                                                                <div className="choose_color">
                                                                    <div className="color_title">
                                                                        <p>{ t('cart.color')}</p>
                                                                    </div>
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        gap: '5px',
                                                                        flexWrap: 'wrap'
                                                                    }}>
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
                                                                <div className="choose_size"
                                                                     style={{marginTop: '10px'}}>
                                                                    <div className="size_title">
                                                                        <p>{ t('cart.size')}</p>
                                                                    </div>
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        gap: '5px',
                                                                        flexWrap: 'wrap'
                                                                    }}>
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
                                                                    { t('cart.btn_confirm')}
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
                                                    style={{cursor: 'pointer'}}
                                                ></span>
                                            </td>
                                        </tr>
                                    ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className={"checkout_product"}>
                        {/*<div className={"coupon_product"}>*/}
                        {/*    <div className={"coupon_product_btn"}>*/}
                        {/*    <FontAwesomeIcon className={"ticket"} icon={faTicket} />  Mã giảm giá*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<hr/>*/}
                        <div className={"information_cart"}>
                            <div className={"choose_product"}>
                                <input className={"check_product"} type={"checkbox"}
                                       onChange={handleSelectAll}
                                       checked={isAllSelected}/>
                                <span
                                    style={{paddingLeft: "15px"}}>   { t('cart.choose_product_all')} ({cart.totalQuantityProduct})  </span>
                                <button
                                    style={{paddingLeft: "15px"}}
                                    className="delete_all_product"
                                    onClick={handleRemoveSelectedItems}
                                >
                                    { t('cart.btn_delete')}
                                </button>

                            </div>
                            {/*<div className={"wish_list_product"}><FontAwesomeIcon className={"tym"} icon={faHeart}/> Lưu*/}
                            {/*    vào danh sách yêu thích*/}
                            {/*</div>*/}
                            <div className={"coupon_product"}>
                                <div className={"coupon_product_btn"}>
                                    <FontAwesomeIcon className={"ticket"} icon={faTicket}/> { t('cart.choose_coupon')}
                                </div>
                                <div style={{paddingLeft: "10px"}} className={"coupon_is_choose"}>{ t('cart.is_coupon_price')} {formatVND(10000)}
                                </div>
                            </div>
                            <div className={"product_total_price"}>
                                <div className={"total_price"}>{ t('cart.total_price')} <span style={{fontSize: "12px"}}>( {selectedSummary.totalQuantityProduct} { t('cart.product')})</span><p
                                    className={"total"}>  {formatVND(selectedSummary.totalPrice)}</p></div>
                            </div>
                            <div className={"btn_checkout_order"} onClick={handleCheckout}>{ t('cart.btn_buy')}</div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    );
}

export default Cart;