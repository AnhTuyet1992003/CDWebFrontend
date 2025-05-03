import React, {  useState, useEffect } from 'react';
import {  useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AddToCart.css'
import CheckoutChooseAddress from './checkout-choose-address';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLocationDot, faTicket} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
const Checkout = () => {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressNotSelected, setAddressNotSelected] = useState(false);
    const [formData, setFormData] = useState({
        receiverName: "",
        receiverPhone: "",
        province: "",
        district: "",
        ward: "",
        addressDetail: ""
    });
    const [note, setNote] = useState("");
    const [paymentId, setPaymentId] = useState("1");

    const [order, setOrder] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            // Khi component unmount (rời khỏi trang /checkout), xóa dữ liệu
            localStorage.removeItem("preparedOrder");
        };
    }, []);

    useEffect(() => {
        // Nếu user vào trang khác không phải /checkout, xóa luôn
        if (location.pathname !== "/checkout") {
            localStorage.removeItem("preparedOrder");
        }
    }, [location.pathname]);

    useEffect(() => {
        const orderData = JSON.parse(localStorage.getItem("preparedOrder"));
        if (orderData) {
            setOrder(orderData); // Set vào state để hiển thị
        }

        // // Cleanup khi component bị unmount (người dùng rời trang)
        // return () => {
        //     // Xóa dữ liệu từ localStorage ngay khi thoát trang checkout
        //     localStorage.removeItem("preparedOrder");
        // };
        const fetchSelectedAddress = async () => {
            try {
                // Lấy token từ cookie
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

                // Gọi API để lấy địa chỉ giao hàng đã chọn
                const response = await axios.get('https://localhost:8443/api/v1/oders/get-selected-shipping-address', {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Gửi token trong header
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    // setAddressNotSelected(true);  // Đánh dấu là chưa có địa chỉ
                    setSelectedAddress(response.data.data);  // Cập nhật địa chỉ giao hàng
                    setAddressNotSelected(false);
                }  else {
                    setAddressNotSelected(true);
                    console.error("Lỗi khi lấy địa chỉ:", response.data.message);
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Lỗi khi thêm địa chỉ!',
                        text: response.data.message
                    });
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setShowAddressForm(true);
                setAddressNotSelected(true);  // Nếu có lỗi, coi như chưa có địa chỉ

            }
        };

        fetchSelectedAddress();
    }, []);

    const toggleAddressForm = () => {
        setShowAddressForm(!showAddressForm);
    };

    const validateForm = () => {
        if (!formData.receiverName || !formData.receiverPhone || !formData.province || !formData.district || !formData.ward || !formData.addressDetail) {
            Swal.fire({
                icon: 'warning',
                title: '⚠️ Vui lòng điền đầy đủ thông tin!',
                confirmButtonText: 'OK',
            });
            return false;
        }
        return true;
    };

    const handleAddShippingAddress = async () => {
        if (!validateForm()) {
            return; // Dừng lại nếu form không hợp lệ
        }

        // Hiển thị hộp thoại xác nhận trước khi lưu địa chỉ
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn lưu địa chỉ này làm địa chỉ mặc định không?',
            icon: 'question',  // Chọn icon dạng câu hỏi
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Hủy'
        });


        if (!result.isConfirmed) {
            return; // Nếu người dùng không bấm "OK", dừng lại
        }
        if (!paymentId) {
            Swal.fire({
                icon: "warning",
                title: "⚠️ Bạn chưa chọn phương thức thanh toán!",
                confirmButtonText: "OK",
            });
            return;
        }


        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

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

            const response = await fetch("https://localhost:8443/api/v1/oders/add-shipping-address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`
                },
                credentials: "include",
                body: new URLSearchParams({
                    receiver_name: formData.receiverName,
                    receiver_phone: formData.receiverPhone,
                    province: formData.province,
                    district: formData.district,
                    ward: formData.ward,
                    address_detail: formData.addressDetail
                }).toString()
            });

            const result = await response.json();
            if (result.status === "success") {
                setSelectedAddress(result.data);  // Cập nhật địa chỉ vừa thêm
                setShowAddressForm(false);        // Ẩn form
                Swal.fire({
                    icon: 'success',
                    title: '✅ Đã lưu địa chỉ mặc định thành công!',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi khi thêm địa chỉ!',
                    text: result.message
                });
            }
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
            Swal.fire({
                icon: 'error',
                title: '❌ Lỗi khi thêm địa chỉ!',
            });
        }
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };


    const handlePlaceOrder = async (event) => {
        event.preventDefault();

        // Kiểm tra nếu order null thì cảnh báo và chuyển hướng
        if (!order || !order.cart_items_choose) {
            Swal.fire({
                icon: "error",
                title: "❌ Đặt hàng không hợp lệ",
                text: "Vui lòng chọn sản phẩm trước khi đặt hàng.",
                confirmButtonText: "Quay lại giỏ hàng"
            }).then(() => {
                navigate("/cart");
            });
            return;
        }

        if (!selectedAddress) {
            Swal.fire({
                icon: "warning",
                title: "⚠️ Bạn chưa chọn địa chỉ giao hàng!",
                confirmButtonText: "OK",
            });
            return;
        }

        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "⚠️ Bạn chưa đăng nhập.",
                confirmButtonText: "OK",
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        const result = await Swal.fire({
            icon: "question",
            title: "🛒 Xác nhận đặt hàng",
            text: "Bạn có chắc chắn muốn đặt hàng với thông tin đã chọn?",
            showCancelButton: true,
            confirmButtonText: "Đặt hàng",
            cancelButtonText: "Huỷ"
        });

        if (!result.isConfirmed) return;

        // Lấy danh sách ID các cart item
        const cartItemIds = order.cart_items_choose.map(item => item.id);

        // Tạo body dạng x-www-form-urlencoded
        const formData = new URLSearchParams();
        cartItemIds.forEach(id => formData.append("cartItemIds", id));
        formData.append("shippingAddressId", selectedAddress.id);
        formData.append("shippingFee", 0);
        formData.append("finalPrice", order.total_price);
        formData.append("totalPrice", order.total_price);
        formData.append("note", note || "");
        formData.append("paymentId", paymentId)

        try {
            const response = await fetch("https://localhost:8443/api/v1/oders/add-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`
                },
                credentials: "include", // nếu backend yêu cầu cookie/session
                body: formData.toString()
            });

            const data = await response.json();

            if (data.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "✅ Đặt hàng thành công!",
                    text: data.message,
                }).then(() => {
                    navigate("/shop");
                    localStorage.removeItem("preparedOrder");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "❌ Đặt hàng thất bại!",
                    text: data.message,
                });
            }
        } catch (error) {
            console.error("Lỗi khi gọi API đặt hàng:", error);
            Swal.fire({
                icon: "error",
                title: "❌ Lỗi hệ thống",
                text: "Đặt hàng thất bại, vui lòng thử lại sau.",
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
                                <span>Thanh toán</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="checkout spad">
                <div className="container">
                    <form action="#" className="checkout__form">
                        <div className="row">
                            <div className="col-lg-6">
                                <h5>Chi tiết thanh toán</h5>
                                <div className="row">
                                    <div>
                                        {selectedAddress ? (
                                            <div className={"checkout_choose_address"}
                                                 onClick={() => setShowAddressModal(true)}>
                                                <div style={{display: "flex", flexDirection: "row"}}>
                                                    <FontAwesomeIcon style={{color: "red"}}
                                                                     className="fa-solid fa-location-dot"
                                                                     icon={faLocationDot}></FontAwesomeIcon>
                                                    <div
                                                        style={{
                                                            paddingLeft: "10px",
                                                            display: "flex",
                                                            flexDirection: "column"
                                                        }}>

                                                        <div className="name">
                                                            <p>
                                                                <b>Tên người
                                                                    nhận: </b> {selectedAddress.receiverName}<br/>
                                                                <b>Số điện thoại: </b> {selectedAddress.receiverPhone}
                                                            </p>
                                                        </div>
                                                        <div className="address">
                                                            <p>
                                                                <b>Địa chỉ: </b><br/>
                                                                {selectedAddress.addressDetails}<br/>
                                                                {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
                                                            </p>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    padding: "10px",
                                                    border: "1px dashed gray",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    marginBottom: "30px",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onClick={toggleAddressForm}
                                                className={"no_address_choose"}
                                            >
                                                <FontAwesomeIcon style={{color: "gray", marginRight: "8px"}}
                                                                 icon={faLocationDot}></FontAwesomeIcon>
                                                <b>Hãy chọn thông tin giao hàng của bạn</b>
                                            </div>
                                        )}

                                        {showAddressModal && (
                                            <CheckoutChooseAddress
                                                onClose={() => setShowAddressModal(false)}
                                                onSelectAddress={(address) => {
                                                    setSelectedAddress(address);
                                                    setAddressNotSelected(false);
                                                }}
                                                toggleAddressForm={toggleAddressForm}
                                            />
                                        )}
                                    </div>


                                    {/*{selectedAddress ? (*/}
                                    {/*    <>*/}
                                    {/*        <div className="name">*/}
                                    {/*            <p>*/}
                                    {/*                <b>Tên người nhận: </b> {selectedAddress.receiverName}<br />*/}
                                    {/*                <b>Số điện thoại: </b> {selectedAddress.receiverPhone}*/}
                                    {/*            </p>*/}
                                    {/*        </div>*/}
                                    {/*        <div className="address">*/}
                                    {/*            <p>*/}
                                    {/*                <b>Địa chỉ: </b><br />*/}
                                    {/*                {selectedAddress.addressDetails}<br />*/}
                                    {/*                {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}*/}
                                    {/*            </p>*/}
                                    {/*        </div>*/}
                                    {/*    </>*/}
                                    {/*) : (*/}
                                    {/*    <p><b>Hãy chọn thông tin giao hàng của bạn ở đây</b></p>*/}
                                    {/*)}*/}

                                    {showAddressForm && (
                                        <>
                                            <div className="col-lg-12">
                                                <div className="checkout__form__input">
                                                    <p>Họ và tên <span>*</span></p>
                                                    <input
                                                        type="text"
                                                        name="receiverName"
                                                        onChange={handleChange}
                                                        value={formData.receiverName} // Đảm bảo value được lấy từ state
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="checkout__form__input">
                                                    <p>Số điện thoại <span>*</span></p>
                                                    <input
                                                        type="text"
                                                        name="receiverPhone"
                                                        onChange={handleChange}
                                                        value={formData.receiverPhone} // Đảm bảo value được lấy từ state
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>Tỉnh/Thành phố <span>*</span></p>
                                                <select
                                                    className={"choose_address_select"}
                                                    name="province"
                                                    onChange={handleChange}
                                                    value={formData.province} // Đảm bảo value được lấy từ state
                                                    required
                                                >
                                                    <option value="">Chọn tỉnh/thành phố</option>
                                                    <option value="Hà Nội">Hà Nội</option>
                                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>Phường/Xã <span>*</span></p>
                                                <select
                                                    className={"choose_address_select"}
                                                    name="district"
                                                    onChange={handleChange}
                                                    value={formData.district} // Đảm bảo value được lấy từ state
                                                    required
                                                >
                                                    <option value="">Chọn phường/xã</option>
                                                    <option value="Phường 12">Phường 12</option>
                                                    <option value="Phường 13">Phường 13</option>
                                                    <option value="Phường 13">Phường 13</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>Quận/Huyện <span>*</span></p>
                                                <select
                                                    className={"choose_address_select"}
                                                    name="ward"
                                                    onChange={handleChange}
                                                    value={formData.ward} // Đảm bảo value được lấy từ state
                                                    required
                                                >
                                                    <option value="">Chọn quận/huyện</option>
                                                    <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                                                    <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>Địa chỉ chi tiết <span>*</span></p>
                                                <input
                                                    type="text"
                                                    placeholder="Số nhà, đường phố,..."
                                                    name="addressDetail"
                                                    onChange={handleChange}
                                                    value={formData.addressDetail} // Đảm bảo value được lấy từ state
                                                    required
                                                />
                                            </div>

                                            <div className={"btn_choose_address_checkout"}>
                                                <div className={"btn_choose_address_checkout_cancel"}
                                                     onClick={toggleAddressForm}>Hủy
                                                </div>
                                                <div className={"btn_choose_address_checkout_ok"}
                                                     onClick={handleAddShippingAddress}>Xác nhận
                                                </div>

                                            </div>
                                        </>
                                    )}

                                    <div className="col-lg-12">
                                        <div className="checkout__form__input">
                                            <p>Ghi chú đơn hàng của bạn</p>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Ghi chú cho shop những lưu ý của bạn nhé!"
                                                style={{
                                                    fontSize: '18px',
                                                    padding: '12px 20px',
                                                    width: '100%',
                                                    height: '100px',  /* Điều chỉnh chiều cao */
                                                    borderRadius: '8px',
                                                    resize: 'none'  /* Không cho phép người dùng thay đổi kích thước */
                                                }}
                                            />
                                        </div>
                                    </div>


                                    <div className="col-lg-12 checkout_coupon_choose">
                                        <p style={{fontSize: "15px", color: "#444444", fontWeight: "500"}}>Mã giảm
                                            giá </p>
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                            <div className={"coupon_choose"}>
                                                <div><FontAwesomeIcon icon={faTicket}></FontAwesomeIcon> Chọn mã giảm
                                                    giá
                                                </div>
                                            </div>
                                            <div className={"coupon_is_choose"}>
                                                <div><img
                                                    src={"https://res.cloudinary.com/dorz7ucva/image/upload/v1746166565/image_074d41706611c0774205b9c9d45a6c25779b265f.png"}/>
                                                    Mã giảm nè
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="checkout__order">
                                    <h5>Đơn hàng của bạn</h5>
                                    <div className="checkout__order__product" style={{border: "none"}}>
                                        <div className={"checkout__order__product_detail"}>
                                            <div className={"checkout__order__product_detail_title"}>
                                                <div>Sản phẩm</div>
                                                <div>Tổng tiền</div>
                                            </div>

                                            {order?.cart_items_choose?.map((item, index) => (
                                                <div key={index} className={"checkout__order__product_detail_content"}>
                                                    <div style={{display: "flex", flexDirection: "column"}}>
                                                        <div
                                                            className={"checkout__order__product_detail_content_product"}>
                                                            <img src={item.productImage} alt="product"/>
                                                            <div className={"name"}>
                                                                {item.productName} (x{item.quantity})
                                                            </div>

                                                        </div>
                                                        <div style={{fontWeight: "100"}}> Size: {item.size},
                                                            Màu: {item.color}</div>
                                                    </div>
                                                    <div style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "flex-end",
                                                        color: "red",
                                                        fontWeight: "bold"
                                                    }}>

                                                        {formatVND((item?.price || 0) * (item?.quantity || 0))}

                                                    </div>
                                                </div>
                                            ))}

                                            <div className={"checkout__order__product_detail_product_total"}>
                                                <div className={"checkout__order__product_detail_total_price"}>
                                                    <div>
                                                        <div>Tổng</div>
                                                        <div>Tiền ship</div>
                                                        <div>Tổng tiền</div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "flex-end",
                                                            color: "red",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        <div>
                                                            {formatVND(order?.total_price || 0)}

                                                        </div>
                                                        <div>{formatVND(0)}</div>
                                                        <div>
                                                            {formatVND(order?.total_price || 0)}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={"checkout__order__product_detail_choose_payment"}>
                                                <div style={{fontWeight: "bold"}} className={"title"}>Phương thức thanh
                                                    toán
                                                </div>
                                                <div className={"choose_payment"}>
                                                    <form>
                                                        <select
                                                            value={paymentId}
                                                            onChange={(e) => setPaymentId(e.target.value)}
                                                        >
                                                            <option value="1">Thanh toán khi nhận</option>
                                                            <option value="2">Thanh toán momo</option>
                                                            <option value="3">VnPay</option>
                                                        </select>
                                                    </form>
                                                </div>

                                            </div>
                                        </div>
                                    </div>


                                    <button type="button" className="site-btn" onClick={handlePlaceOrder}>Đặt hàng
                                    </button>

                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Checkout;
