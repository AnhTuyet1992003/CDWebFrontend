import React, {  useState, useEffect } from 'react';
import {  useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AddToCart.css'
import CheckoutChooseAddress from './checkout-choose-address';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLocationDot, faTicket, faPenToSquare, faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {useTranslation} from "react-i18next";
const Checkout = () => {
    const { t } = useTranslation('translation');
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

    const [editingAddressId, setEditingAddressId] = useState(null);


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
                        title: t('login.error_login'),
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/login');
                    });
                    return;
                }

                // Gọi API để lấy địa chỉ giao hàng đã chọn
                const response = await axios.get('https://localhost:8443/api/v1/orders/get-selected-shipping-address', {
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
                        title: t('checkout.error_save_new_address'),
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

    // const toggleAddressForm = () => {
    //     setShowAddressForm(!showAddressForm);
    // };

    const validateForm = () => {
        if (!formData.receiverName || !formData.receiverPhone || !formData.province || !formData.district || !formData.ward || !formData.addressDetail) {
            Swal.fire({
                icon: 'warning',
                title: t('checkout.warning_empty_information'),
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
            title: editingAddressId
                ? t('checkout.question_update_address')
                : t('checkout.question_save_new_address_default'),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText:   t('checkout.btn_cancel'),
        });



        if (!result.isConfirmed) {
            return; // Nếu người dùng không bấm "OK", dừng lại
        }

        if (!paymentId) {
            Swal.fire({
                icon: "warning",
                title:t('checkout.warning_choose_payment'),
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
                    title: t('login.error_login'),
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/login');
                });
                return;
            }

            const urlParams = new URLSearchParams({
                receiver_name: formData.receiverName,
                receiver_phone: formData.receiverPhone,
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                address_detail: formData.addressDetail
            });
            let response;
            if (editingAddressId) {
                // 🛠 Gọi API chỉnh sửa
                urlParams.append("id", editingAddressId);
                response = await axios.post("https://localhost:8443/api/v1/orders/edit-shipping-address", urlParams, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
            } else {

                 response = await axios.post(
                    "https://localhost:8443/api/v1/orders/add-shipping-address",
                    urlParams,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );
            }

            const result = response.data;
            if (result.status === "success") {
                setSelectedAddress(result.data);  // Cập nhật địa chỉ vừa thêm
                setShowAddressForm(false);        // Ẩn form
                Swal.fire({
                    icon: 'success',
                    title: editingAddressId ? t('checkout.success_update_address') : t('checkout.success_save_new_address'),
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: editingAddressId ? t('checkout.error_update_address') : t('checkout.error_save_new_address'),
                    text: result.message
                });
            }
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
            Swal.fire({
                icon: 'error',
                title:   t('checkout.error'),
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

    const [isLoading, setIsLoading] = useState(false);

    const handlePlaceOrder = async (event) => {
        event.preventDefault();
        if (isLoading) return;

        if (!order || !order.cart_items_choose) {
            Swal.fire({
                icon: "error",
                title: t('checkout.error_order_title'),
                text: t('checkout.error_order_text'),
                confirmButtonText: t('checkout.btn_return_cart')
            }).then(() => {
                navigate("/cart");
            });
            return;
        }

        if (!selectedAddress) {
            Swal.fire({
                icon: "warning",
                title: t('checkout.warning_choose_address'),
                confirmButtonText: "OK",
            });
            return;
        }

        if (!paymentId) {
            Swal.fire({
                icon: "warning",
                title: t('checkout.warning_choose_payment'),
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
                title: t('login.error_login'),
                confirmButtonText: "OK",
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        const result = await Swal.fire({
            icon: "question",
            title: t('checkout.question_order_title'),
            text: t('checkout.question_order_text'),
            showCancelButton: true,
            confirmButtonText:  t('checkout.btn_buy'),
            cancelButtonText:  t('checkout.btn_cancel'),
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);

        try {
            const cartItemIds = order.cart_items_choose.map(item => item.id);
            const formData = new URLSearchParams();
            cartItemIds.forEach(id => formData.append("cartItemIds", id));
            formData.append("shippingAddressId", selectedAddress.id);
            formData.append("shippingFee", 0);
            formData.append("finalPrice", order.total_price);
            formData.append("totalPrice", order.total_price);
            formData.append("note", note || "");
            formData.append("paymentId", paymentId);

            const orderResponse = await axios.post(
                "https://localhost:8443/api/v1/orders/add-order",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            const orderData = orderResponse.data;

            if (orderData.status !== "success") {
                Swal.fire({
                    icon: "error",
                    title:  t('checkout.error_order'),
                    text: orderData.message,
                });
                return;
            }

            if (paymentId === "3") { // VNPay
                console.log("selectedAddress before VNPay check:", selectedAddress);
                if (!selectedAddress || !selectedAddress.addressDetail) { // Sử dụng addressDetails nhất quán
                    Swal.fire({
                        icon: "error",
                        title:  t('checkout.error_data_address_title'),
                        text:  t('checkout.error_data_address_text'),
                    });
                    setIsLoading(false);
                    return;
                }

                let vnpayParams = new URLSearchParams();
                vnpayParams.append("amount", order.total_price.toString());
                vnpayParams.append("vnp_OrderInfo", `${orderData.data.id}`)
                console.log("order_id la: ------------------"+ orderData.data.id)
                vnpayParams.append("ordertype", "billpayment");
                vnpayParams.append("txt_billing_mobile", selectedAddress.receiverPhone);
                vnpayParams.append("txt_billing_email", selectedAddress.email || "customer@example.com");
                vnpayParams.append("txt_billing_fullname", selectedAddress.receiverName);
                vnpayParams.append("txt_inv_addr1", selectedAddress.addressDetails); // Chỉ append một lần
                vnpayParams.append("txt_bill_city", selectedAddress.province);
                vnpayParams.append("txt_bill_country", "Vietnam");
                vnpayParams.append("txt_inv_mobile", selectedAddress.receiverPhone);
                vnpayParams.append("txt_inv_email", selectedAddress.email || "customer@example.com");
                vnpayParams.append("txt_inv_customer", selectedAddress.receiverName);
                vnpayParams.append("txt_inv_company", "N/A");
                vnpayParams.append("txt_inv_taxcode", "N/A");
                vnpayParams.append("cbo_inv_type", "I");
                vnpayParams.append("language", "vn");

                console.log("VNPay params:", vnpayParams.toString());
                console.log("Token before calling /create-payment:", token);

                // try {
                //     const vnpayResponse = await fetch("https://localhost:8443/api/v1/payments/create-payment", {
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/x-www-form-urlencoded",
                //             Authorization: `Bearer ${token}`,
                //             Accept: "application/json"
                //         },
                //         credentials: "include",
                //         body: vnpayParams.toString()
                //     });

                try {
                    const vnpayResponse = await axios.post(
                        "https://localhost:8443/api/v1/payments/create-payment",
                        vnpayParams,
                        {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                Authorization: `Bearer ${token}`,
                                Accept: "application/json"
                            },
                            withCredentials: true
                        }
                    );

                    console.log("vnpayResponse:  "+vnpayResponse)

                    // Kiểm tra lỗi nếu có
                    if (vnpayResponse.status !== 200) {
                        console.error("VNPay API error:", vnpayResponse);
                        Swal.fire({
                            icon: "error",
                            title:   t('checkout.error_payment'),
                            text: `Status: ${vnpayResponse.status}, Error: ${vnpayResponse.statusText}`,
                        });
                        setIsLoading(false);
                        return;
                    }


                    const vnpayData = vnpayResponse.data;
                    if (vnpayData.status == "00") { // Sử dụng so sánh lỏng để xử lý chuỗi/số
                        console.log("Redirecting to VNPay URL:", vnpayData.data);
                        window.location.href = vnpayData.data; // Chuyển hướng đến URL thanh toán
                    } else {
                        console.error("VNPay error response:", JSON.stringify(vnpayData, null, 2));
                        Swal.fire({
                            icon: "error",
                            title:    t('checkout.error_payment_3'),
                            text: vnpayData.message || "Không thể khởi tạo thanh toán.",
                        });
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                    Swal.fire({
                        icon: "error",
                        title:    t('checkout.error_payment'),
                        text:    t('checkout.error_payment_text'),
                    });
                }
                setIsLoading(false);
            } else {
                Swal.fire({
                    icon: "success",
                    title:    t('checkout.success_order'),
                }).then(() => {
                    navigate('/order/confirmation', {
                        state: { orderId: orderData.data.id }
                    });

                    localStorage.removeItem("preparedOrder");
                });
            }
        } catch (error) {
            console.error("Lỗi khi xử lý đặt hàng:", error);
            Swal.fire({
                icon: "error",
                title:    t('checkout.error_server_title'),
                text:   t('checkout.error_server_text'),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAddressForm = (address = null) => {
        if (address) {
            setFormData({
                receiverName: address.receiverName,
                receiverPhone: address.receiverPhone,
                province: address.province,
                district: address.district,
                ward: address.ward,
                addressDetail: address.addressDetail,
            });
            setEditingAddressId(address.id);
        } else {
            // Reset form khi thêm mới
            setFormData({
                receiverName: "",
                receiverPhone: "",
                province: "",
                district: "",
                ward: "",
                addressDetail: "",
            });
            setEditingAddressId(null);
        }
        setShowAddressForm(true);
    };

    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/home" style={{cursor: 'pointer'}}><i className="fa fa-home"></i>
                                    {t('checkout.home')}</Link>
                                <span>{t('checkout.checkout')}</span>
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
                                <h5>{t('checkout.detail_checkout')}</h5>
                                <div className="row">
                                    <div>
                                        {selectedAddress ? (
                                            <div className={"checkout_choose_address"}
                                                 onClick={() => setShowAddressModal(true)}>
                                                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
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
                                                                <b>{t('checkout_choose_address.name')}: </b> {selectedAddress.receiverName}<br/>
                                                                <b>{t('checkout_choose_address.phone')}: </b> {selectedAddress.receiverPhone}
                                                            </p>
                                                        </div>
                                                        <div className="address">
                                                            <p>
                                                                <b>{t('checkout_choose_address.address')}: </b><br/>
                                                                {selectedAddress.addressDetail}<br/>
                                                                {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <FontAwesomeIcon style={{color: "black"}}
                                                                     className="fa-solid fa-location-dot"
                                                                     icon={faPenToSquare}></FontAwesomeIcon>
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
                                                <b>{t('checkout.choose_info_address')}</b>
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
                                    {showAddressForm && (
                                        <>
                                            <div className="col-lg-12">
                                                <div className="checkout__form__input">
                                                    <p>{t('checkout.name')} <span>*</span></p>
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
                                                    <p>{t('checkout.phone')} <span>*</span></p>
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
                                                <p>{t('checkout.city')} <span>*</span></p>
                                                <select
                                                    className={"choose_address_select"}
                                                    name="province"
                                                    onChange={handleChange}
                                                    value={formData.province} // Đảm bảo value được lấy từ state
                                                    required
                                                >
                                                    <option value="">{t('checkout.choose_city')}</option>
                                                    <option value="Hà Nội">Hà Nội</option>
                                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>{t('checkout.ward')} <span>*</span></p>
                                                <select
                                                    className={"choose_address_select"}
                                                    name="district"
                                                    onChange={handleChange}
                                                    value={formData.district} // Đảm bảo value được lấy từ state
                                                    required
                                                >
                                                    <option value="">{t('checkout.choose_ward')}</option>
                                                    <option value="Phường 12">Phường 12</option>
                                                    <option value="Phường 13">Phường 13</option>
                                                    <option value="Phường 13">Phường 13</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>{t('checkout.district')} <span>*</span></p>
                                                <select
                                                    className={"choose_address_select"}
                                                    name="ward"
                                                    onChange={handleChange}
                                                    value={formData.ward} // Đảm bảo value được lấy từ state
                                                    required
                                                >
                                                    <option value="">{t('checkout.choose_district')}</option>
                                                    <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                                                    <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>{t('checkout.detail_address')}<span>*</span></p>
                                                <input
                                                    type="text"
                                                    placeholder={t('checkout.detail_address_placeholder')}
                                                    name="addressDetail"
                                                    onChange={handleChange}
                                                    value={formData.addressDetail} // Đảm bảo value được lấy từ state
                                                    required
                                                />
                                            </div>

                                            <div className={"btn_choose_address_checkout"}>
                                                <div className={"btn_choose_address_checkout_cancel"}
                                                     onClick={toggleAddressForm}>{t('checkout.btn_cancel')}
                                                </div>
                                                <div className={"btn_choose_address_checkout_ok"}
                                                     onClick={handleAddShippingAddress}>{t('checkout.btn_confirm')}
                                                </div>

                                            </div>
                                        </>
                                    )}

                                    <div className="col-lg-12">
                                        <div className="checkout__form__input">
                                            <p>{t('checkout.note_order')}</p>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder={t('checkout.note_placeholder')}
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
                                        <p style={{fontSize: "15px", color: "#444444", fontWeight: "500"}}>{t('checkout.coupon')}</p>
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                            <div className={"coupon_choose"}>
                                                <div><FontAwesomeIcon icon={faTicket}></FontAwesomeIcon> {t('checkout.choose_coupon')}
                                                </div>
                                            </div>
                                            <div className={"coupon_is_choose"}>
                                                <div><img
                                                    src={"https://res.cloudinary.com/dorz7ucva/image/upload/v1746166565/image_074d41706611c0774205b9c9d45a6c25779b265f.png"}/>
                                                    {t('checkout.is_choose_coupon')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="checkout__order">
                                    <h5>{t('checkout.order_title')}</h5>
                                    <div className="checkout__order__product" style={{border: "none"}}>
                                        <div className={"checkout__order__product_detail"}>
                                            <div className={"checkout__order__product_detail_title"}>
                                                <div>{t('checkout.product')}</div>
                                                <div>{t('checkout.price')}</div>
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
                                                        <div style={{fontWeight: "100"}}> {t('checkout.size')}: {item.size},
                                                            {t('checkout.color')}: {item.color}</div>
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
                                                        <div>{t('checkout.total_price')}</div>
                                                        <div>{t('checkout.ship_price')}</div>
                                                        <div>{t('checkout.total_final')}</div>
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
                                                <div style={{fontWeight: "bold"}} className={"title"}>{t('checkout.payment')}
                                                </div>
                                                <div className={"choose_payment"}>
                                                    <form>
                                                        <select
                                                            value={paymentId}
                                                            onChange={(e) => setPaymentId(e.target.value)}
                                                        >
                                                            <option value="1">{t('checkout.payment_1')}</option>
                                                            <option value="2">{t('checkout.payment_2')}</option>
                                                            <option value="3">{t('checkout.payment_3')}</option>
                                                        </select>
                                                    </form>
                                                </div>

                                            </div>
                                        </div>
                                    </div>


                                    <button
                                        type="button"
                                        className="site-btn"
                                        onClick={handlePlaceOrder}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? t('checkout.btn_pending') : t('checkout.btn_buy')}
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
