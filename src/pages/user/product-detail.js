import React, { useEffect, useState, useRef } from 'react';
import {Link, useLocation, useParams} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import ProductReviews from './StarRating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faAdjust } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
    const { t } = useTranslation('translation');

    const location = useLocation();
    const productId = location.state?.productId;

    // const { productId } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const navigate = useNavigate();
    const thumbnailRef = useRef(null);
    const [reviews, setReviews] = useState({ totalReviews: 0, averageRating: 0 });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
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

    // Lấy thông tin sản phẩm từ API
    useEffect(() => {
        if (productId) {
            axios
                .get(`https://localhost:8443/api/v1/products/getProduct/${productId}`, { withCredentials: true })
                .then(response => {
                    setProduct(response.data);
                    setSelectedImage(response.data.image);

                    const colorImageMap = new Map();
                    response.data.sizeColorVariants.forEach(variant => {
                        if (!colorImageMap.has(variant.color)) {
                            colorImageMap.set(variant.color, variant.image);
                        }
                    });

                    const uniqueColorImages = Array.from(colorImageMap.entries()).map(([color, image]) => ({
                        thumb: image,
                        full: image
                    }));
                    setImageList(uniqueColorImages);
                    setSelectedImage(uniqueColorImages[0]?.full || response.data.image);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
                    Swal.fire(t('add_to_cart.error'), t('add_to_cart.error_get_product'), 'error');
                });
            // Fetch reviews
            axios.get(`https://localhost:8443/api/v1/reviews/rating-summary/${productId}`)
                .then(reviewRes => {
                    setReviews({
                        totalReviews: reviewRes.data.totalReviews,
                        averageRating: reviewRes.data.averageRating
                    });
                })
                .catch(error => {
                    console.error(`Error fetching reviews for product ${productId}:`, error);
                    setReviews({ totalReviews: 0, averageRating: 0 });
                });
        }
    }, [productId, t]);

    const scrollThumbnails = (direction) => {
        if (thumbnailRef.current) {
            const scrollAmount = 60;
            thumbnailRef.current.scrollLeft += direction * scrollAmount;
        }
    };

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + ' ₫';
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = () => {
        setQuantity(prev => Math.max(prev - 1, 1));
    };

    const handleColorSelect = (color) => {
        setSelectedColor(prevColor => {
            const newColor = prevColor === color ? null : color;

            const validSizes = product.sizeColorVariants
                .filter(variant => variant.color === newColor)
                .map(variant => variant.size);

            if (!validSizes.includes(selectedSize)) {
                setSelectedSize(null);
            }

            const colorImage = product.sizeColorVariants.find(variant => variant.color === newColor)?.image;
            setSelectedImage(colorImage || product.image);
            const imageIndex = imageList.findIndex(img => img.full === (colorImage || product.image));
            setActiveIndex(imageIndex >= 0 ? imageIndex : 0);

            return newColor;
        });
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(prev => (prev === size ? null : size));
    };

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
        } else if (selectedColor && selectedSize) {
            const selectedVariant = product.sizeColorVariants.find(
                variant => variant.size === selectedSize && variant.color === selectedColor
            );
            if (selectedVariant) {
                const productSizeColorId = selectedVariant.id;
                const formData = new FormData();
                formData.append('productId', productId);
                formData.append('productSizeColorId', productSizeColorId);
                formData.append('quantity', quantity);

                axios
                    .post('https://localhost:8443/api/v1/carts/add', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        },
                        withCredentials: true
                    })
                    .then(response => {
                        Swal.fire({
                            icon: 'success',
                            title: t('add_to_cart.success_add_to_cart'),
                            showConfirmButton: false,
                            timer: 1500
                        });
                        window.dispatchEvent(new Event('cartUpdated'));
                    })
                    .catch(error => {
                        console.error('Lỗi khi thêm vào giỏ hàng:', error);
                        Swal.fire(t('add_to_cart.error'), t('add_to_cart.error_add_to_cart'), 'error');
                    });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: t('add_to_cart.choose_size_color'),
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'swal2-rounded'
                }
            });
        }
    };

    if (!product) return null;

    const renderStars = (averageRating) => {
        const stars = [];
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`star-${i}`} className="fa fa-star"></i>);
        }
        if (hasHalfStar && stars.length < 5) {
            stars.push(<i key="half-star" className="fa fa-star-half-o"></i>);
        }
        while (stars.length < 5) {
            stars.push(<i key={`empty-star-${stars.length}`} className="fa fa-star-o"></i>);
        }
        return stars;
    };

    const availableSizes = selectedColor
        ? product.sizeColorVariants.filter(variant => variant.color === selectedColor).map(variant => variant.size)
        : product.sizeColorVariants.map(variant => variant.size);

    const availableColors = selectedSize
        ? product.sizeColorVariants.filter(variant => variant.size === selectedSize).map(variant => variant.color)
        : product.sizeColorVariants.map(variant => variant.color);


    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/home" style={{cursor: 'pointer'}}><i className="fa fa-home"></i>Trang
                                    chủ</Link>
                                <a href="#">Chi tiết sản phẩm </a>
                                <span>{product.nameProduct}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <section className="product-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="product__details__pic">
                                <div className="product__details">
                                    <div className="product__details__pic__left product__thumb nice-scroll"
                                         ref={thumbnailRef}>
                                        {imageList.map((img, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                className={`pt ${index === activeIndex ? 'active' : ''}`}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setActiveIndex(index);
                                                    setSelectedImage(img.full);
                                                }}
                                            >
                                                <img src={img.thumb} alt={`thumb-${index}`}/>
                                            </a>
                                        ))}

                                    </div>
                                    <div className="product__details__slider__content">
                                        <div className="product__details__pic__slider">
                                                <img
                                                    src={selectedImage || product.image}
                                                    className="product__big__img"
                                                    alt={product.nameProduct}
                                                />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="product__details__text">
                                <h3>{product.nameProduct} <span>Brand: {product.brandName}</span>
                                </h3>
                                <div className="rating">
                                    <p style={{color: "black"}}>
                                        {product.nameProduct}
                                        <br/>
                                        <span style={{fontSize: "10px"}}>
                                    {renderStars(reviews.averageRating)}
                                </span>
                                        <span style={{color: "#656565", fontSize: "12px"}}>
                                    {" | "}{reviews.totalReviews} đánh giá
                                </span>
                                {/*        <span style={{color: "#656565", fontSize: "12px"}}>*/}
                                {/*    {" | 0 lượt mua"}*/}
                                {/*</span>*/}
                                    </p>
                                </div>
                                <div className="product__details__price">{formatVND(product.price)} <span>$ 83.0</span>
                                </div>
                                <p>{product.description}</p>
                                <div className="product__details__button">
                                    <div className="quantity">
                                        <span>{t('cart.quantity')}:</span>
                                        <div className="pro-qty">
                                                <span
                                                    style={{
                                                        fontSize: '20px',
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                    }}
                                                    className="dec qtybtn"
                                                    onClick={handleDecrease}
                                                >
                                                -
                                            </span>
                                            <input type="text" value={quantity} readOnly/>
                                            <span
                                                style={{
                                                    fontSize: '20px',
                                                    color: 'black',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                }}
                                                className="inc qtybtn"
                                                onClick={handleIncrease}
                                            >
                                                +
                                            </span>
                                        </div>
                                    </div>
                                    <ul>
                                        <li><a href="#"><span className="icon_heart_alt"></span></a></li>
                                        {/*<li><a href="#"><span className="icon_adjust-horiz"></span></a></li>*/}
                                    </ul>
                                </div>
                                <div className="product__details__widget">
                                    <ul>
                                        <li>
                                            <span>{t('cart.color')}:</span>
                                            <div className="color__checkbox"
                                                 style={{display: "flex", flexDirection: "row"}}>
                                                {product.sizeColorVariants
                                                    ?.reduce((acc, variant) => {
                                                        if (!acc.includes(variant.color)) acc.push(variant.color);
                                                        return acc;
                                                    }, [])
                                                    .map(color => {
                                                        const isDisabled = !availableColors.includes(color);
                                                        return (
                                                            <div
                                                                key={color}
                                                                className={`btn_color ${selectedColor === color ? 'active' : ''}`}
                                                                style={{
                                                                    background: colorMap[color] || '#ccc',
                                                                    opacity: isDisabled ? 0.3 : 1,
                                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
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
                                        </li>
                                        <li>
                                            <span>{t('cart.size')}:</span>
                                            <div className="size__btn" style={{display: "flex", flexDirection: "row"}}>
                                                {product.sizeColorVariants
                                                    ?.reduce((acc, variant) => {
                                                        if (!acc.includes(variant.size)) acc.push(variant.size);
                                                        return acc;
                                                    }, [])
                                                    .map(size => {
                                                        const isDisabled = !availableSizes.includes(size);
                                                        return (
                                                            <div
                                                                key={size}
                                                                className={`btn_size ${selectedSize === size ? 'active' : ''}`}
                                                                style={{
                                                                    opacity: isDisabled ? 0.3 : 1,
                                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
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
                                        </li>
                                        <div className="product__details__button" style={{display: "flex", flexDirection: "row"}}>
                                            <a href="#" className="cart-btn"
                                               onClick={e => {
                                                   e.preventDefault();
                                                   handleAddToCart();
                                               }}
                                            ><span className="icon_bag_alt"></span>
                                                Thêm vào giỏ hàng
                                            </a>
                                            <a href="#" className="buy-btn">Mua hàng</a>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="product__details__tab">
                                {/* Danh sách tab */}
                                <ul className="nav nav-tabs" role="tablist">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('description')}
                                        >
                                            {t('add_to_cart.description')}
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('reviews')}
                                        >
                                            Bình luận và đánh giá ({reviews.totalReviews})
                                        </button>
                                    </li>
                                </ul>

                                {/* Nội dung tab */}
                                <div className="tab-content pt-4">
                                    {activeTab === 'description' && (
                                        <div className="tab-pane fade show active">
                                            <h6>{t('add_to_cart.description')}</h6>
                                            <p>{product.description}</p>
                                            <p>
                                                <b>Brand:</b> {product.brandName}
                                            </p>
                                        </div>
                                    )}
                                    {activeTab === 'reviews' && (
                                        <div className="tab-pane fade show active">
                                            <ProductReviews productId={productId} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

export default ProductDetail;
