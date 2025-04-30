import React, { useEffect, useState } from "react";
import './AddToCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AddToCart = ({ productId, onClose }) => {
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    // const token = Cookies.get('token');
    const token = localStorage.getItem('accessToken');
    useEffect(() => {
        if (productId) {
            axios.get(`https://localhost:8443/api/v1/products/getProduct/${productId}`, { withCredentials: true })
                .then(response => {
                    setProduct(response.data);
                })
                .catch(error => {
                    console.error("Lỗi khi lấy thông tin sản phẩm:", error);
                });
        }
    }, [productId]);

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };

    const handleDecrease = () => {
        setQuantity(prev => Math.max(prev - 1, 1));
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(prevColor => {
            const newColor = prevColor === color ? null : color;

            // Nếu size hiện tại không còn hợp lệ với màu mới thì reset size
            const validSizes = product.sizeColorVariants
                .filter(variant => variant.color === newColor)
                .map(variant => variant.size);

            if (!validSizes.includes(selectedSize)) {
                setSelectedSize(null);
            }

            return newColor;
        });
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(prev => prev === size ? null : size);
    };


    if (!product) return null;

    const availableSizes = selectedColor
        ? product.sizeColorVariants
            .filter(variant => variant.color === selectedColor)
            .map(variant => variant.size)
        : product.sizeColorVariants.map(variant => variant.size);

    const availableColors = selectedSize
        ? product.sizeColorVariants
            .filter(variant => variant.size === selectedSize)
            .map(variant => variant.color)
        : product.sizeColorVariants.map(variant => variant.color);

    const selectedVariant = product.sizeColorVariants.find(variant =>
        variant.size === selectedSize && variant.color === selectedColor
    );

    const handleAddToCart = () => {
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
        } else if (selectedVariant) {
            const productSizeColorId = selectedVariant.id;
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('productSizeColorId', productSizeColorId);
            formData.append('quantity', quantity);

            axios.post('https://localhost:8443/api/v1/carts/add', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true // nếu backend yêu cầu cookie session
            })
                .then(response => {
                    // toast.success('✅ Sản phẩm đã được thêm vào giỏ hàng', {
                    //     position: 'top-right',
                    //     autoClose: 2000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    //     theme: 'light'
                    // });
                    Swal.fire({
                        icon: 'success',
                        title: '✅ Đã thêm vào giỏ hàng!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    onClose();
                })
                .catch(error => {
                    console.error("Lỗi khi thêm vào giỏ hàng:", error);
                    // toast.error('❌ Lỗi khi thêm vào giỏ hàng!');
                    Swal.fire('Lỗi!', 'Không thể thêm vào giỏ hàng.', 'error');
                });
        } else {
            // toast.warning('⚠️ Vui lòng chọn kích cỡ và màu sắc!');
            Swal.fire({
                icon: 'warning',
                title: '⚠️ Vui lòng chọn kích cỡ và màu sắc!',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'swal2-rounded'  // nếu muốn bo góc đẹp
                }
            });
        }
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

    return (
        <div className="AddToCart">
            <div className="content">
                <div className="information_product">
                    <div className="img_product">
                        <img src={product.image} alt={product.nameProduct}/>
                    </div>
                    <div className="content_product">
                        <div className="row row_name">
                            <p style={{color: "black"}}>
                                {product.nameProduct}
                                <br/>
                                <span style={{fontSize: "10px"}}>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                </span>
                                <span style={{color: "#656565", fontSize: "12px"}}> | 31 đánh giá </span>
                                <span style={{color: "#656565", fontSize: "12px"}}> | 0 lượt mua</span>
                            </p>
                        </div>
                        <div className="row row_price">
                            <p style={{color: "red"}}>{formatVND(product.price)}</p>
                        </div>
                        <div className="row row_color">
                            <div className="color_title">
                                <p>Màu sắc</p>
                            </div>
                            {product.sizeColorVariants?.reduce((acc, variant) => {
                                if (!acc.includes(variant.color)) acc.push(variant.color);
                                return acc;
                            }, []).map(color => {
                                const isDisabled = !availableColors.includes(color);
                                return (
                                    <div
                                        key={color}
                                        className={`btn_color ${selectedColor === color ? 'active' : ''}`}
                                        style={{
                                            // background: color === 'Trắng' ? '#ffffff' : '#000000',
                                            background: colorMap[color] || "#ccc",
                                            opacity: isDisabled ? 0.3 : 1,
                                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                                        }}
                                        onClick={() => {
                                            if (!isDisabled) {
                                                handleColorSelect(color);
                                            }
                                        }}
                                    ></div>
                                );
                            })}
                        </div>

                        <div className="row row_size">
                            <div className="size_title">
                                <p>Kích cỡ</p>
                            </div>
                            {product.sizeColorVariants?.reduce((acc, variant) => {
                                if (!acc.includes(variant.size)) acc.push(variant.size);
                                return acc;
                            }, []).map(size => {
                                const isDisabled = !availableSizes.includes(size);
                                return (
                                    <div
                                        key={size}
                                        className={`btn_size ${selectedSize === size ? 'active' : ''}`}
                                        style={{
                                            opacity: isDisabled ? 0.3 : 1,
                                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                                        }}
                                        onClick={() => {
                                            if (!isDisabled) {
                                                handleSizeSelect(size);
                                            }
                                        }}
                                    >
                                        {size}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="row row_quantity">
                            <div className="quantity_title">
                                <p>Số lượng</p>
                            </div>
                            <div className="btn_quantity">
                                <div className="btn_quantity_de" onClick={handleDecrease}>-</div>
                                <div className="btn_quantity_number">{quantity}</div>
                                <div className="btn_quantity_in" onClick={handleIncrease}>+</div>
                            </div>
                        </div>
                        <div className="row row_button">
                            <div className="button_addToCart" onClick={handleAddToCart}>
                                <span><FontAwesomeIcon icon={faCartShopping}/> Thêm vào giỏ hàng</span>
                            </div>
                            <div className="button_buy">
                                Mua
                            </div>
                        </div>
                    </div>
                </div>
                <div className="description_product">
                    <p id="descriptionText"><b>* Mô Tả</b> {product.description}
                        <br/>
                        <b>* Brand</b> {product.brandName}
                    </p>
                </div>
                <div className="close_addToCart" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark}/>
                </div>
            </div>
        </div>
    );
};

export default AddToCart;
