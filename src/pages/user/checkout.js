import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AddToCart.css';
import CheckoutChooseAddress from './checkout-choose-address';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faTicket, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import ChooseCoupon from './choose-coupon';

const Checkout = () => {
    const { t } = useTranslation('translation');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressNotSelected, setAddressNotSelected] = useState(false);
    const [formData, setFormData] = useState({
        receiverName: '',
        receiverPhone: '',
        province: '',
        district: '',
        ward: '',
        addressDetail: '',
    });
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [note, setNote] = useState('');
    const [paymentId, setPaymentId] = useState('1');
    const [order, setOrder] = useState(null);
    const [coupons, setCoupons] = useState([]); // Thêm state coupons
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

    const toggleCouponModal = () => {
        setIsCouponModalOpen(!isCouponModalOpen);
    };

    // Lấy danh sách mã giảm giá từ API
    useEffect(() => {
        const fetchCoupons = async () => {
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

                const response = await axios.get('https://localhost:8443/api/v1/coupons/user/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                setCoupons(response.data || []); // Đảm bảo coupons là mảng
                console.log(coupons)
            } catch (error) {
                console.error('Lỗi khi lấy danh sách coupon:', error);
                Swal.fire({
                    icon: 'error',
                    title: t('coupon.error'),
                    text: t('coupon.fetch_error'),
                });
                setCoupons([]); // Đặt coupons là mảng rỗng nếu có lỗi
            }
        };

        fetchCoupons();
    }, [t, navigate]);

    useEffect(() => {
        return () => {
            localStorage.removeItem('preparedOrder');
        };
    }, []);

    useEffect(() => {
        if (location.pathname !== '/checkout') {
            localStorage.removeItem('preparedOrder');
        }
    }, [location.pathname]);

    useEffect(() => {
        const orderData = JSON.parse(localStorage.getItem('preparedOrder'));
        if (orderData) {
            console.log('Prepared Order:', orderData); // Kiểm tra dữ liệu
            setOrder(orderData);
        }

        const fetchSelectedAddress = async () => {
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

                const response = await axios.get('https://localhost:8443/api/v1/orders/get-selected-shipping-address', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (response.data.status === 'success') {
                    setSelectedAddress(response.data.data);
                    setAddressNotSelected(false);
                } else {
                    setAddressNotSelected(true);
                    console.error('Lỗi khi lấy địa chỉ:', response.data.message);
                    Swal.fire({
                        icon: 'error',
                        title: t('checkout.error_save_new_address'),
                        text: response.data.message,
                    });
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                setShowAddressForm(true);
                setAddressNotSelected(true);
            }
        };

        fetchSelectedAddress();
    }, [t, navigate]);

    const validateForm = () => {
        if (
            !formData.receiverName ||
            !formData.receiverPhone ||
            !formData.province ||
            !formData.district ||
            !formData.ward ||
            !formData.addressDetail
        ) {
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
            return;
        }

        const result = await Swal.fire({
            title: editingAddressId ? t('checkout.question_update_address') : t('checkout.question_save_new_address_default'),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: t('checkout.btn_cancel'),
        });

        if (!result.isConfirmed) {
            return;
        }

        if (!paymentId) {
            Swal.fire({
                icon: 'warning',
                title: t('checkout.warning_choose_payment'),
                confirmButtonText: 'OK',
            });
            return;
        }

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

            const urlParams = new URLSearchParams({
                receiver_name: formData.receiverName,
                receiver_phone: formData.receiverPhone,
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                address_detail: formData.addressDetail,
            });
            let response;
            if (editingAddressId) {
                urlParams.append('id', editingAddressId);
                response = await axios.post('https://localhost:8443/api/v1/orders/edit-shipping-address', urlParams, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
            } else {
                response = await axios.post('https://localhost:8443/api/v1/orders/add-shipping-address', urlParams, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
            }

            const result = response.data;
            if (result.status === 'success') {
                setSelectedAddress(result.data);
                setShowAddressForm(false);
                Swal.fire({
                    icon: 'success',
                    title: editingAddressId ? t('checkout.success_update_address') : t('checkout.success_save_new_address'),
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: editingAddressId ? t('checkout.error_update_address') : t('checkout.error_save_new_address'),
                    text: result.message,
                });
            }
        } catch (error) {
            console.error('Lỗi khi thêm địa chỉ:', error);
            Swal.fire({
                icon: 'error',
                title: t('checkout.error'),
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + ' ₫';
    };

    const calculateDiscount = (coupon, totalPrice, freeShip, order) => {
        if (!coupon) return 0;
        let discount = 0;
        if (coupon.maxUsesPerUser - coupon.usageCount <= 0)
        {
            Swal.fire({
                icon: 'warning',
                title: "Không thõa mãn điều kiện của mã giảm",
                text: "Hết lượt sử dụng mã này",
                confirmButtonText: 'OK',
            })
            return 0;
        }
        if (totalPrice<coupon.minOrderValue){
            Swal.fire({
                icon: 'warning',
                title: "Không thõa mãn điều kiện của mã giảm",
                text: "Không đủ tổng tiền tối thiểu",
                confirmButtonText: 'OK',
            })
            return 0;
        }
        const productCount = order?.cart_items_choose?.length || 0;
        if (productCount < coupon.minProductQuantity) {
            Swal.fire({
                icon: 'warning',
                title: "Không thỏa mãn điều kiện của mã giảm",
                text: `Cần tối thiểu ${coupon.minProductQuantity} sản phẩm để áp dụng mã giảm.`,
                confirmButtonText: 'OK',
            });
            return 0;
        }

        if (coupon.couponType === 'Giảm theo tiền') {
            discount = Math.min(coupon.discountValue, totalPrice);
        } else if (coupon.couponType === 'Giảm theo phần trăm') {
            discount = (totalPrice * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discount = Math.min(discount, coupon.maxDiscountAmount);
            }
        } else if (coupon.couponType === 'Miễn phí vận chuyển') {
            discount = Math.min(freeShip, coupon.discountValue, totalPrice);
        }
        return discount;
    };

    const handlePlaceOrder = async (event) => {
        event.preventDefault();
        if (isLoading) return;

        if (!order || !order.cart_items_choose) {
            Swal.fire({
                icon: 'error',
                title: t('checkout.error_order_title'),
                text: t('checkout.error_order_text'),
                confirmButtonText: t('checkout.btn_return_cart'),
            }).then(() => {
                navigate('/cart');
            });
            return;
        }

        if (!selectedAddress) {
            Swal.fire({
                icon: 'warning',
                title: t('checkout.warning_choose_address'),
                confirmButtonText: 'OK',
            });
            return;
        }

        if (!paymentId) {
            Swal.fire({
                icon: 'warning',
                title: t('checkout.warning_choose_payment'),
                confirmButtonText: 'OK',
            });
            return;
        }

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

        // // Kiểm tra coupon nếu có
        // if (order.coupon_code) {
        //     const coupon = coupons.find(c => c.code === order.coupon_code);
        //     if (!coupon) {
        //         Swal.fire({
        //             icon: 'error',
        //             title: t('coupon.invalid'),
        //             text: t('coupon.not_found'),
        //             confirmButtonText: 'OK',
        //         });
        //         return;
        //     }
        //     const discount = calculateDiscount(coupon, order.total_price, order.shipping_fee, order.cart_items_choose);
        //     if (discount === 0) {
        //         Swal.fire({
        //             icon: 'error',
        //             title: t('coupon.invalid'),
        //             text: t('coupon.invalid_conditions'),
        //             confirmButtonText: 'OK',
        //         });
        //         return;
        //     }
        //     if (discount !== order.discount_value) {
        //         setOrder(prev => ({
        //             ...prev,
        //             discount_value: discount,
        //             final_price: prev.total_price - discount + (prev.shipping_fee || 0),
        //         }));
        //     }
        // }

        const result = await Swal.fire({
            icon: 'question',
            title: t('checkout.question_order_title'),
            text: t('checkout.question_order_text'),
            showCancelButton: true,
            confirmButtonText: t('checkout.btn_buy'),
            cancelButtonText: t('checkout.btn_cancel'),
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);

        try {
            const cartItemIds = order.cart_items_choose.map((item) => item.id);
            const formData = new URLSearchParams();
            cartItemIds.forEach((id) => formData.append('cartItemIds', id));
            formData.append('shippingAddressId', selectedAddress.id);
            formData.append('shippingFee', order.shipping_fee);
            formData.append('finalPrice', order.final_price);
            formData.append('totalPrice', order.total_price);
            formData.append('discountValue', order.discount_value);
            formData.append('couponCode', order.coupon_code || '');
            formData.append('note', note || '');
            formData.append('paymentId', paymentId);

            const orderResponse = await axios.post('https://localhost:8443/api/v1/orders/add-order', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const orderData = orderResponse.data;

            if (orderData.status !== 'success') {
                Swal.fire({
                    icon: 'error',
                    title: t('checkout.error_order'),
                    text: orderData.message,
                });
                return;
            }

            if (paymentId === '3') {
                if (!selectedAddress || !selectedAddress.addressDetail) {
                    Swal.fire({
                        icon: 'error',
                        title: t('checkout.error_data_address_title'),
                        text: t('checkout.error_data_address_text'),
                    });
                    setIsLoading(false);
                    return;
                }

                let vnpayParams = new URLSearchParams();
                vnpayParams.append('amount', order.final_price.toString());
                vnpayParams.append('vnp_OrderInfo', `${orderData.data.id}`);
                vnpayParams.append('ordertype', 'billpayment');
                vnpayParams.append('txt_billing_mobile', selectedAddress.receiverPhone);
                vnpayParams.append('txt_billing_email', selectedAddress.email || 'customer@example.com');
                vnpayParams.append('txt_billing_fullname', selectedAddress.receiverName);
                vnpayParams.append('txt_inv_addr1', selectedAddress.addressDetail); // Sửa addressDetails thành addressDetail
                vnpayParams.append('txt_bill_city', selectedAddress.province);
                vnpayParams.append('txt_bill_country', 'Vietnam');
                vnpayParams.append('txt_inv_mobile', selectedAddress.receiverPhone);
                vnpayParams.append('txt_inv_email', selectedAddress.email || 'customer@example.com');
                vnpayParams.append('txt_inv_customer', selectedAddress.receiverName);
                vnpayParams.append('txt_inv_company', 'N/A');
                vnpayParams.append('txt_inv_taxcode', 'N/A');
                vnpayParams.append('cbo_inv_type', 'I');
                vnpayParams.append('language', 'vn');

                try {
                    const vnpayResponse = await axios.post(
                        'https://localhost:8443/api/v1/payments/create-payment',
                        vnpayParams,
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                Authorization: `Bearer ${token}`,
                                Accept: 'application/json',
                            },
                            withCredentials: true,
                        }
                    );

                    const vnpayData = vnpayResponse.data;
                    if (vnpayData.status === '00') {
                        window.location.href = vnpayData.data;
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: t('checkout.error_payment_3'),
                            text: vnpayData.message || t('checkout.error_payment_3_text'),
                        });
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: t('checkout.error_payment'),
                        text: t('checkout.error_payment_text'),
                    });
                }
                setIsLoading(false);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: t('checkout.success_order'),
                }).then(() => {
                    navigate('/order/confirmation', {
                        state: { orderId: orderData.data.id },
                    });
                    localStorage.removeItem('preparedOrder');
                });
            }
        } catch (error) {
            console.error('Lỗi khi xử lý đặt hàng:', error);
            Swal.fire({
                icon: 'error',
                title: t('checkout.error_server_title'),
                text: t('checkout.error_server_text'),
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
            setFormData({
                receiverName: '',
                receiverPhone: '',
                province: '',
                district: '',
                ward: '',
                addressDetail: '',
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
                                <Link to="/home" style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-home"></i> {t('checkout.home')}
                                </Link>
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
                                            <div className="checkout_choose_address" onClick={() => setShowAddressModal(true)}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                        <FontAwesomeIcon style={{ color: 'red' }} className="fa-solid fa-location-dot" icon={faLocationDot} />
                                                        <div
                                                            style={{
                                                                paddingLeft: '10px',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <div className="name">
                                                                <p>
                                                                    <b>{t('checkout_choose_address.name')}: </b> {selectedAddress.receiverName}
                                                                    <br />
                                                                    <b>{t('checkout_choose_address.phone')}: </b> {selectedAddress.receiverPhone}
                                                                </p>
                                                            </div>
                                                            <div className="address">
                                                                <p>
                                                                    <b>{t('checkout_choose_address.address')}: </b>
                                                                    <br />
                                                                    {selectedAddress.addressDetail}
                                                                    <br />
                                                                    {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <FontAwesomeIcon style={{ color: 'black' }} className="fa-solid fa-pen-to-square" icon={faPenToSquare} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    padding: '10px',
                                                    border: '1px dashed gray',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    marginBottom: '30px',
                                                    transition: 'all 0.3s ease',
                                                }}
                                                onClick={toggleAddressForm}
                                                className="no_address_choose"
                                            >
                                                <FontAwesomeIcon style={{ color: 'gray', marginRight: '8px' }} icon={faLocationDot} />
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
                                                    <p>
                                                        {t('checkout.name')} <span>*</span>
                                                    </p>
                                                    <input type="text" name="receiverName" onChange={handleChange} value={formData.receiverName} required />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="checkout__form__input">
                                                    <p>
                                                        {t('checkout.phone')} <span>*</span>
                                                    </p>
                                                    <input type="text" name="receiverPhone" onChange={handleChange} value={formData.receiverPhone} required />
                                                </div>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>
                                                    {t('checkout.city')} <span>*</span>
                                                </p>
                                                <select className="choose_address_select" name="province" onChange={handleChange} value={formData.province} required>
                                                    <option value="">{t('checkout.choose_city')}</option>
                                                    <option value="Hà Nội">Hà Nội</option>
                                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>
                                                    {t('checkout.ward')} <span>*</span>
                                                </p>
                                                <select className="choose_address_select" name="district" onChange={handleChange} value={formData.district} required>
                                                    <option value="">{t('checkout.choose_ward')}</option>
                                                    <option value="Phường 12">Phường 12</option>
                                                    <option value="Phường 13">Phường 13</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>
                                                    {t('checkout.district')} <span>*</span>
                                                </p>
                                                <select className="choose_address_select" name="ward" onChange={handleChange} value={formData.ward} required>
                                                    <option value="">{t('checkout.choose_district')}</option>
                                                    <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                                                </select>
                                            </div>
                                            <div className="checkout__form__input">
                                                <p>
                                                    {t('checkout.detail_address')}
                                                    <span>*</span>
                                                </p>
                                                <input
                                                    type="text"
                                                    placeholder={t('checkout.detail_address_placeholder')}
                                                    name="addressDetail"
                                                    onChange={handleChange}
                                                    value={formData.addressDetail}
                                                    required
                                                />
                                            </div>

                                            <div className="btn_choose_address_checkout">
                                                <div className="btn_choose_address_checkout_cancel" onClick={toggleAddressForm}>
                                                    {t('checkout.btn_cancel')}
                                                </div>
                                                <div className="btn_choose_address_checkout_ok" onClick={handleAddShippingAddress}>
                                                    {t('checkout.btn_confirm')}
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
                                                    height: '100px',
                                                    borderRadius: '8px',
                                                    resize: 'none',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12 checkout_coupon_choose">
                                        <p style={{ fontSize: '15px', color: '#444444', fontWeight: '500' }}>{t('checkout.coupon')}</p>
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div className="coupon_choose" onClick={toggleCouponModal}>
                                                <div>
                                                    <FontAwesomeIcon icon={faTicket} /> {t('checkout.choose_coupon')}
                                                </div>
                                            </div>
                                            <ChooseCoupon
                                                visible={isCouponModalOpen}
                                                onClose={toggleCouponModal}
                                                formatVND={formatVND}
                                                coupons={coupons} // Truyền coupons vào ChooseCoupon
                                                selectedCouponCode={order?.coupon_code}
                                                onCouponSelect={(coupon) => {
                                                    const discount = coupon ? calculateDiscount(coupon, order.total_price, order.shipping_fee, order) : 0;

                                                    if (discount === 0 && coupon) {
                                                        // Không thỏa mãn điều kiện -> Không cập nhật coupon
                                                        return;
                                                    }
                                                    setOrder((prevOrder) => ({
                                                        ...prevOrder,
                                                        coupon_code: coupon?.code || '',
                                                        discount_value: coupon ? calculateDiscount(coupon, prevOrder.total_price, prevOrder.shipping_fee, order) : 0,
                                                        final_price: coupon
                                                            ? prevOrder.total_price - calculateDiscount(coupon, prevOrder.total_price, prevOrder.shipping_fee, order) + (prevOrder.shipping_fee || 0)
                                                            : prevOrder.total_price + (prevOrder.shipping_fee || 0),

                                                    }));
                                                }}
                                            />
                                            {order?.coupon_code ? (
                                                <div className="coupon_is_choose">
                                                    <div>
                                                        <img
                                                            src="https://res.cloudinary.com/dorz7ucva/image/upload/v1746166565/image_074d41706611c0774205b9c9d45a6c25779b265f.png"
                                                            alt="coupon"
                                                        />
                                                        <strong>{order.coupon_code}</strong>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                </>
                                                // <div className="coupon_is_choose">
                                                //     <div>
                                                //         <img
                                                //             src="https://res.cloudinary.com/dorz7ucva/image/upload/v1746166565/image_074d41706611c0774205b9c9d45a6c25779b265f.png"
                                                //             alt="coupon"
                                                //         />
                                                //         {t('checkout.no_coupon_selected')}
                                                //     </div>
                                                // </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="checkout__order">
                                    <h5>{t('checkout.order_title')}</h5>
                                    <div className="checkout__order__product" style={{ border: 'none' }}>
                                        <div className="checkout__order__product_detail">
                                            <div className="checkout__order__product_detail_title">
                                                <div>{t('checkout.product')}</div>
                                                <div>{t('checkout.price')}</div>
                                            </div>

                                            {order?.cart_items_choose?.map((item, index) => (
                                                <div key={index} className="checkout__order__product_detail_content">
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <div className="checkout__order__product_detail_content_product">
                                                            <img src={item.productImage} alt="product" />
                                                            <div className="name">
                                                                {item.productName} (x{item.quantity})
                                                            </div>
                                                        </div>
                                                        <div style={{ fontWeight: '100' }}>
                                                            {t('checkout.size')}: {item.size}, {t('checkout.color')}: {item.color}
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-end',
                                                            color: 'red',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {formatVND((item?.price || 0) * (item?.quantity || 0))}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="checkout__order__product_detail_product_total">
                                                <div className="checkout__order__product_detail_total_price">
                                                    <div>
                                                        <div>{t('checkout.total_price')}</div>
                                                        <div>{t('checkout.ship_price')}</div>
                                                        <div>{t('checkout.discount_value')}</div>
                                                        <div>{t('checkout.total_final')}</div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-end',
                                                            color: 'red',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        <div>{formatVND(order?.total_price || 0)}</div>
                                                        <div>{formatVND(order?.shipping_fee || 0)}</div>
                                                        <div>- {formatVND(order?.discount_value || 0)}</div>
                                                        <div>{formatVND(order?.final_price || 0)}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="checkout__order__product_detail_choose_payment">
                                                <div style={{ fontWeight: 'bold' }} className="title">
                                                    {t('checkout.payment')}
                                                </div>
                                                <div className="choose_payment">
                                                    <form>
                                                        <select value={paymentId} onChange={(e) => setPaymentId(e.target.value)}>
                                                            <option value="1">{t('checkout.payment_1')}</option>
                                                            {/*<option value="2">{t('checkout.payment_2')}</option>*/}
                                                            <option value="3">{t('checkout.payment_3')}</option>
                                                        </select>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="button" className="site-btn" onClick={handlePlaceOrder} disabled={isLoading}>
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
};

export default Checkout;