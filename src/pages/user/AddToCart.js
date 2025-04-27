import React, { useEffect, useState  } from "react";
import './AddToCart.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faXmark } from '@fortawesome/free-solid-svg-icons';

const AddToCart = () => {
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    useEffect(() => {
        const p = document.getElementById('descriptionText');
        const container = p.parentElement;

        let fontSize = 18; // bắt đầu từ 18px
        p.style.fontSize = fontSize + "px";

        while (p.scrollHeight > container.clientHeight && fontSize > 12) {
            fontSize -= 1;
            p.style.fontSize = fontSize + "px";
        }
    }, []);
    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    }
    const handleDecrease = () => {
        setQuantity(prev => Math.max(prev - 1, 0)); // Không cho nhỏ hơn 0
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };
    return (
        <>
            <div className={"AddToCart"}>
                <div className={"content"}>
                    <div className={"information_product"}>
                        <div className={"img_product"}>
                            <img
                                src={"https://res.cloudinary.com/dorz7ucva/image/upload/v1745220781/image_588fc2a455b678cc935eb7ebfdb1df2d21853fe2.webp"}/>
                        </div>
                        <div className={"content_product"}>
                            <div className={"row row_name"}>
                                <p style={{color: "black"}}><b>Áo khoác gió nam nữ phong cách hàn quốc Bảo Đăng </b>
                                    <br/>
                                    <span style={{fontSize: "10px"}}>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i> 31 đánh giá</span>
                                </p>
                            </div>
                            <div className={"row row_price"}>
                                <p style={{color: "red"}}><b>{formatVND(100000)}</b>
                                </p>
                            </div>
                            <div className={"row row_color"}>
                                <div className={"color_title"}>
                                    <p>Màu sắc</p>
                                </div>
                                <div
                                    className={`btn_color ${selectedColor === 'black' ? 'active' : ''}`}
                                    style={{background: "#000000"}}
                                    onClick={() => setSelectedColor('black')}
                                ></div>
                                <div
                                    className={`btn_color ${selectedColor === 'red' ? 'active' : ''}`}
                                    style={{background: "#ffffff"}}
                                    onClick={() => setSelectedColor('red')}
                                ></div>
                                <div
                                    className={`btn_color ${selectedColor === 'blue' ? 'active' : ''}`}
                                    style={{background: "#0000ff"}}
                                    onClick={() => setSelectedColor('blue')}
                                ></div>
                            </div>
                            <div className="row row_size">
                                <div className="size_title">
                                    <p>Kích cỡ</p>
                                </div>

                                <div
                                    className={`btn_size ${selectedSize === 'S' ? 'active' : ''}`}
                                    onClick={() => setSelectedSize('S')}
                                >
                                    S
                                </div>

                                <div
                                    className={`btn_size ${selectedSize === 'M' ? 'active' : ''}`}
                                    onClick={() => setSelectedSize('M')}
                                >
                                    M
                                </div>

                                <div
                                    className={`btn_size ${selectedSize === 'L' ? 'active' : ''}`}
                                    onClick={() => setSelectedSize('L')}
                                >
                                    L
                                </div>

                                <div
                                    className={`btn_size ${selectedSize === 'XL' ? 'active' : ''}`}
                                    onClick={() => setSelectedSize('XL')}
                                >
                                    XL
                                </div>
                            </div>

                            <div className={"row row_quantity"}>
                                <div className="quantity_title">
                                    <p>Số lượng</p>
                                </div>
                                <div className={"btn_quantity"}>
                                    <div className={"btn_quantity_de"} onClick={handleDecrease}>-</div>
                                    <div className={"btn_quantity_number"}>{quantity}</div>
                                    <div className={"btn_quantity_in"} onClick={handleIncrease}>+</div>
                                </div>
                            </div>
                            <div className={"row row_button"}>
                                <div className={"button_addToCart"}>
                                    <span><FontAwesomeIcon icon={faCartShopping}/> Thêm vào giỏ hàng</span>
                                </div>
                                <div className={"button_buy"}>
                                    Mua
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={"description_product"}>
                        <p id="descriptionText"><b>* Mô Tả</b> Ai cũng mong muốn tìm cho mình một chiếc "ÁO KHOÁC" thật
                            đẹp và phù hợp với mình.</p>
                    </div>

                    <div className={"close_addToCart"}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddToCart;
