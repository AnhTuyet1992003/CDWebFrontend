import React, { useEffect, useState } from "react";
import './AddToCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const AddToCart = ({ productId, onClose }) => {
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

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
        setQuantity(prev => Math.max(prev - 1, 0));
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    if (!product) return null; // chưa load xong thì không render gì

    return (
        <div className="AddToCart">
            <div className="content">
                <div className="information_product">
                    <div className="img_product">
                        <img src={product.image} alt={product.nameProduct} />
                    </div>
                    <div className="content_product">
                        <div className="row row_name">
                            <p style={{color: "black"}}>{product.nameProduct}
                                <br/>
                                <span style={{fontSize: "10px"}}>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i>
                                    <i className="fa fa-star"></i> 31 đánh giá
                                </span>
                            </p>
                        </div>
                        <div className="row row_price">
                            <p style={{color: "red"}}>{formatVND(product.price)}</p>
                        </div>
                        <div className="row row_color">
                            <div className="color_title">
                                <p>Màu sắc</p>
                            </div>
                            {product.sizeColorVariants?.map(variant => (
                                <div
                                    key={variant.color}
                                    className={`btn_color ${selectedColor === variant.color ? 'active' : ''}`}
                                    style={{background: variant.color === 'Trắng' ? '#ffffff' : '#000000'}}
                                    onClick={() => setSelectedColor(selectedColor === variant.color ? null : variant.color)}
                                ></div>
                            ))}
                        </div>
                        <div className="row row_size">
                            <div className="size_title">
                                <p>Kích cỡ</p>
                            </div>
                            {product.sizeColorVariants?.map(variant => (
                                <div
                                    key={variant.size}
                                    className={`btn_size ${selectedSize === variant.size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(selectedSize === variant.size ? null : variant.size)}

                                >
                                    {variant.size}
                                </div>
                            ))}
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
                            <div className="button_addToCart">
                                <span><FontAwesomeIcon icon={faCartShopping}/> Thêm vào giỏ hàng</span>
                            </div>
                            <div className="button_buy">
                                Mua
                            </div>
                        </div>
                    </div>
                </div>
                <div className="description_product">
                    <p id="descriptionText"><b>* Mô Tả</b> {product.description}</p>
                </div>
                <div className="close_addToCart" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark}/>
                </div>
            </div>
        </div>
    );
}

export default AddToCart;
