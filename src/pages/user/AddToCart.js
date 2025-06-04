import React, { useEffect, useState, useRef } from "react";
import './AddToCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {useTranslation} from "react-i18next";

const AddToCart = ({ productId, onClose }) => {
    const { t } = useTranslation('translation');
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Giả sử mặc định chọn ảnh đầu tiên

    const thumbnailRef = useRef(null);

    const scrollThumbnails = (direction) => {
        if (thumbnailRef.current) {
            const scrollAmount = 60; // mỗi lần cuộn khoảng 60px
            thumbnailRef.current.scrollLeft += direction * scrollAmount;
        }
    };

    // const token = Cookies.get('token');
    const token = localStorage.getItem('accessToken');
    useEffect(() => {
        if (productId) {
            axios.get(`https://localhost:8443/api/v1/products/getProduct/${productId}`, { withCredentials: true })
                .then(response => {
                    setProduct(response.data);
                    setSelectedImage(response.data.image);

                    const colorImageMap = new Map();

// Duyệt qua các biến thể, lưu ảnh đầu tiên của mỗi màu
                    response.data.sizeColorVariants.forEach(variant => {
                        if (!colorImageMap.has(variant.color)) {
                            colorImageMap.set(variant.color, variant.image);
                        }
                    });

                    const uniqueColorImages = Array.from(colorImageMap.values());

                    setImageList(uniqueColorImages);
                    setSelectedImage(uniqueColorImages[0]);
                    console.log("image", uniqueColorImages);

                })
                .catch(error => {
                    console.error("Lỗi khi lấy thông tin sản phẩm:", error);
                    Swal.fire(t('add_to_cart.error'), t('add_to_cart.error_get_product'), 'error');
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

            // Cập nhật ảnh theo màu
            const colorImage = product.sizeColorVariants.find(variant => variant.color === newColor)?.image;
            setSelectedImage(colorImage || product.image); // fallback ảnh chính nếu không có ảnh màu




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
                title: t('login.error_login'),
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
                    Swal.fire({
                        icon: 'success',
                        title: t('add_to_cart.success_add_to_cart'),
                        showConfirmButton: false,
                        timer: 1500
                    });
                    window.dispatchEvent(new Event("cartUpdated"));
                    onClose();
                })
                .catch(error => {
                    console.error("Lỗi khi thêm vào giỏ hàng:", error);
                    // toast.error('❌ Lỗi khi thêm vào giỏ hàng!');
                    Swal.fire(t('add_to_cart.error'), t('add_to_cart.error_add_to_cart'), 'error');
                });
        } else {
            // toast.warning('⚠️ Vui lòng chọn kích cỡ và màu sắc!');
            Swal.fire({
                icon: 'warning',
                title: t('add_to_cart.choose_size_color'),
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
        "Hồng": "#ff0099"
    };

    return (
        <div className="AddToCart">
            <div className="content">
                <div className="information_product">
                    {/*<div className="img_product">*/}
                    {/*    <img src={selectedImage || product.image} alt={product.nameProduct}/>*/}
                    {/*</div>*/}
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div className="img_product">
                            <img src={selectedImage || product.image} alt={product.nameProduct}/>
                        </div>
                        <div style={{position: 'relative', width: 'max-content'}}>
                            {/* Nút điều hướng trái */}
                            <button className={"btn_left_img"}
                                onClick={() => scrollThumbnails(-1)}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    background: 'rgba(46,46,46,0.3)',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                }}
                            >
                                &lt;
                            </button>

                            {/* Khung cuộn ảnh */}
                            <div
                                ref={thumbnailRef}
                                style={{
                                    display: 'flex',
                                    overflowX: 'hidden', // Ẩn thanh cuộn
                                    maxWidth: '220px',
                                    scrollBehavior: 'smooth',
                                }}
                            >
                                {imageList.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Variant ${index}`}
                                        onClick={() => {
                                            setSelectedImage(image);
                                            setSelectedImageIndex(index);
                                        }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            cursor: 'pointer',
                                            marginRight: '5px',
                                            flexShrink: 0,
                                            border: selectedImageIndex === index ? '2px solid blue' : '1px solid #ccc',
                                            borderRadius: '4px',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Nút điều hướng phải */}
                            <button
                                className={"btn_right_img"}
                                onClick={() => scrollThumbnails(1)}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 10,
                                    background: 'rgba(46,46,46,0.3)',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                }}
                            >
                                &gt;
                            </button>
                        </div>

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
                                <p>{t('cart.color')}</p>
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
                                        title={color}
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
                                <p>{t('cart.size')}</p>
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
                                <p>{t('cart.quantity')}</p>
                            </div>
                            <div className="btn_quantity">
                                <div className="btn_quantity_de" onClick={handleDecrease}>-</div>
                                <div className="btn_quantity_number">{quantity}</div>
                                <div className="btn_quantity_in" onClick={handleIncrease}>+</div>
                            </div>
                        </div>
                        <div className="row row_button">
                            <div className="button_addToCart" onClick={handleAddToCart}>
                                <span><FontAwesomeIcon icon={faCartShopping}/>
                                    {t('add_to_cart.btn_add_to_cart')}
                                    </span>
                            </div>
                            <div className="button_buy">
                                { t('cart.btn_buy')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="description_product">
                    <p id="descriptionText"><b>* {t('add_to_cart.description')}</b> {product.description}
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
