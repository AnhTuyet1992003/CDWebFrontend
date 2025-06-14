import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './OrderDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTruckFast, faBox, faCircleXmark, faCircleCheck, faBan, faCreditCard, faRotateLeft, faWarehouse, faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const OrderUser = () => {
    const { t } = useTranslation('translation');
    const [status, setStatus] = useState([]);
    const navigate = useNavigate();
    const [ordersByStatus, setOrdersByStatus] = useState([]);
    const [orderCountsByStatus, setOrderCountsByStatus] = useState({});
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [reasons, setReasons] = useState([]);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedReasonId, setSelectedReasonId] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [actionType, setActionType] = useState(''); // 'cancel', 'request_cancel', 'request_return'

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    const getToken = () => {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];
    };

    useEffect(() => {
        const token = getToken();
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

        axios.get("https://localhost:8443/api/v1/orders/getStatus", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
            .then(res => {
                setStatus(res.data);
                setSelectedStatusId(1);
                fetchOrdersByStatus(1);
                res.data.forEach(statusItem => {
                    fetchCountOrdersByStatus(statusItem.status_id);
                });
            })
            .catch(err => console.error("Lỗi khi lấy category:", err));
    }, [navigate, t]);

    const fetchCountOrdersByStatus = (statusId) => {
        const token = getToken();
        if (!token) return;

        axios.get(`https://localhost:8443/api/v1/orders/getOrder/status?statusId=${statusId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
            .then(res => {
                if (res.data && res.data.orders) {
                    setOrderCountsByStatus(prev => ({
                        ...prev,
                        [statusId]: res.data.orders.length
                    }));
                }
            })
            .catch(err => console.error("Lỗi khi lấy đơn hàng theo trạng thái:", err));
    };

    const fetchOrdersByStatus = (statusId) => {
        const token = getToken();
        if (!token) return;

        axios.get(`https://localhost:8443/api/v1/orders/getOrder/status?statusId=${statusId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
            .then(res => {
                if (res.data && res.data.orders) {
                    setOrdersByStatus(res.data.orders);
                    setOrderCountsByStatus(prev => ({
                        ...prev,
                        [statusId]: res.data.orders.length
                    }));
                }
            })
            .catch(err => console.error("Lỗi khi lấy đơn hàng theo trạng thái:", err));
    };

    const getIconAndColor = (statusId) => {
        switch (statusId) {
            case 1: return { icon: faClock, color: '#f0ad4e', title: t('order_status.order_status_1') };
            case 2: return { icon: faBox, color: '#5bc0de', title: t('order_status.order_status_2') };
            case 3: return { icon: faTruckFast, color: '#0275d8', title: t('order_status.order_status_3') };
            case 4: return { icon: faCircleCheck, color: '#5cb85c', title: t('order_status.order_status_4') };
            case 5: return { icon: faTrashArrowUp, color: '#f86c6b', title: t('order_status.order_status_5') };
            case 6: return { icon: faCircleXmark, color: '#999', title: t('order_status.order_status_6') };
            case 7: return { icon: faCreditCard, color: '#f7a35c', title: t('order_status.order_status_7') };
            case 8: return { icon: faRotateLeft, color: '#ff6666', title: t('order_status.order_status_8') };
            case 9: return { icon: faBan, color: '#9966cc', title: t('order_status.order_status_9') };
            case 10: return { icon: faWarehouse, color: '#6c757d', title: t('order_status.order_status_10') };
            default: return { icon: faClock, color: '#999', title: t('order_status.order_status_11') };
        }
    };

    const handleOrderDetail = (id) => {
        navigate('/order/confirmation', {
            state: { orderId: id }
        });
    };

    const paymentOnline = async (orderId) => {
        const token = getToken();
        if (!token) return;

        try {
            const orderResponse = await axios.get(`https://localhost:8443/api/v1/orders/getOrder`, {
                params: { orderId: orderId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            const orderData = orderResponse.data;
            if (orderData.status === "success") {
                if (!orderData.data.addressDetails) {
                    Swal.fire({
                        icon: "error",
                        title: t('checkout.error_data_address_title'),
                        text: t('checkout.error_data_address_text'),
                    });
                    return;
                }

                let vnpayParams = new URLSearchParams();
                vnpayParams.append("amount", orderData.data.totalPrice?.toString() || "0");
                vnpayParams.append("vnp_OrderInfo", orderData.data.id?.toString() || "");
                vnpayParams.append("ordertype", "billpayment");
                vnpayParams.append("txt_billing_mobile", orderData.data.receiverPhone?.toString() || "");
                vnpayParams.append("txt_billing_email", orderData.data.email || "customer@example.com");
                vnpayParams.append("txt_billing_fullname", orderData.data.receiverName || "");
                vnpayParams.append("txt_inv_addr1", orderData.data.addressDetails || "Unknown Address");
                vnpayParams.append("txt_bill_city", orderData.data.province || "");
                vnpayParams.append("txt_bill_country", "Vietnam");
                vnpayParams.append("txt_inv_mobile", orderData.data.receiverPhone?.toString() || "");
                vnpayParams.append("txt_inv_email", orderData.data.email || "customer@example.com");
                vnpayParams.append("txt_inv_customer", orderData.data.receiverName || "");
                vnpayParams.append("txt_inv_company", "N/A");
                vnpayParams.append("txt_inv_taxcode", "N/A");
                vnpayParams.append("cbo_inv_type", "I");
                vnpayParams.append("language", "vn");

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

                const vnpayData = vnpayResponse.data;
                if (vnpayData.status === "00") {
                    window.location.href = vnpayData.data;
                } else {
                    Swal.fire({
                        icon: "error",
                        title: t('checkout.error_payment_3'),
                        text: vnpayData.message || "Không thể khởi tạo thanh toán.",
                    });
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
            Swal.fire({
                icon: "error",
                title: t('checkout.error_payment'),
                text: t('checkout.error_payment_text'),
            });
        }
    };

    const updateOrderStatus = (orderId, statusId) => {
        const token = getToken();
        return axios.put(`https://localhost:8443/api/v1/orders/update_status?statusId=${statusId}&orderId=${orderId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
    };

    const saveOrderReason = (orderId, reasonId) => {
        const token = getToken();
        return axios.put(`https://localhost:8443/api/v1/orders/update_order_reason?orderId=${orderId}&reasonId=${reasonId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
    };

    const deleteOrderReason = (orderId) => {
        const token = getToken();
        return axios.put(`https://localhost:8443/api/v1/orders/delete_order_reason?orderId=${orderId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
    };

    const handleActionWithReason = (orderId, action) => {
        setSelectedOrderId(orderId);
        setActionType(action);
        setSelectedReasonId('');
        setReasons([]);
        const group = action === 'request_return' ? ['Trả hàng'] : ['Hủy đơn'];
        axios.get(`https://localhost:8443/api/v1/orders/getOrderReason_byGroup?group=${group.join('&group=')}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).then(res => {
            setReasons(res.data);
            setShowReasonModal(true);
        }).catch(err => {
            console.error("Error loading reasons", err);
            Swal.fire({
                icon: 'error',
                title: t('order.error_title'),
                text: t('order.error_reason_load'),
            });
        });
    };

    const handleConfirmReason = () => {
        if (!selectedReasonId) {
            setShowReasonModal(false);
            setReasons([]);
            fetchOrdersByStatus(selectedStatusId);
            status.forEach(statusItem => {
                fetchCountOrdersByStatus(statusItem.status_id);
            });
            Swal.fire({
                icon: 'warning',
                title: t('order.warning_select_reason'),
                confirmButtonText: 'OK',
            });
            return;
        }

        saveOrderReason(selectedOrderId, selectedReasonId).then(() => {
            let targetStatus;
            let successMessage;
            if (actionType === 'cancel') {
                targetStatus = 6;
                successMessage = t('order.cancel_success');
            } else if (actionType === 'request_cancel') {
                targetStatus = 5;
                successMessage = t('order.request_cancel_success');
            } else if (actionType === 'request_return') {
                targetStatus = 8;
                successMessage = t('order.request_return_success');
            }

            updateOrderStatus(selectedOrderId, targetStatus).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: t('order.success_title'),
                    text: successMessage,
                });
                setShowReasonModal(false);
                setReasons([]);
                fetchOrdersByStatus(selectedStatusId);
                status.forEach(statusItem => {
                    fetchCountOrdersByStatus(statusItem.status_id);
                });
            }).catch(err => {
                console.error("Error updating status", err);
                Swal.fire({
                    icon: 'error',
                    title: t('order.error_title'),
                    text: t('order.error_update_status'),
                });
            });
        }).catch(err => {
            console.error("Error saving reason", err);
            Swal.fire({
                icon: 'error',
                title: t('order.error_title'),
                text: t('order.error_save_reason'),
            });
        });
    };

    const handleSimpleAction = (orderId, statusId, successMessage) => {
        Swal.fire({
            title: t('order.confirm_action_title'),
            text: t('order.confirm_action_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('order.confirm'),
            cancelButtonText: t('order.btn_cancel'),
        }).then((result) => {
            if (result.isConfirmed) {
                deleteOrderReason(orderId).then(() => {
                    updateOrderStatus(orderId, statusId).then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: t('order.success_title'),
                            text: successMessage,
                        });
                        fetchOrdersByStatus(selectedStatusId);
                        status.forEach(statusItem => {
                            fetchCountOrdersByStatus(statusItem.status_id);
                        });
                    }).catch(err => {
                        console.error("Error updating status", err);
                        Swal.fire({
                            icon: 'error',
                            title: t('order.error_title'),
                            text: t('order.error_update_status'),
                        });
                    });
                }).catch(err => {
                    console.error("Error deleting reason", err);
                    Swal.fire({
                        icon: 'error',
                        title: t('order.error_title'),
                        text: t('order.error_delete_reason'),
                    });
                });
            }
        });
    };

    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/home" style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-home"></i>{t('order.home')}
                                </Link>
                                <a href="#">{t('order.order')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="order_user">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4">
                            <div className="order_user_containt">
                                <div className="order_status_content">
                                    {status.map((item, index) => {
                                        const { icon, color } = getIconAndColor(item.status_id);
                                        const count = orderCountsByStatus[item.status_id] || 0;
                                        const isActive = selectedStatusId === item.status_id;

                                        return (
                                            <div
                                                key={index}
                                                className={`order_status ${isActive ? 'active' : ''}`}
                                                onClick={() => {
                                                    fetchOrdersByStatus(item.status_id);
                                                    setSelectedStatusId(item.status_id);
                                                }}
                                            >
                                                <div className="title" style={{ color }}>
                                                    <FontAwesomeIcon icon={icon} style={{ marginRight: 8 }} />
                                                    {getIconAndColor(item.status_id).title}
                                                </div>
                                                <div className="title">{count}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-8">
                            <div className="order_user_content">
                                {ordersByStatus.length === 0 ? (
                                    <div style={{ textAlign: "center", fontSize: "16px", color: "gray", marginTop: "20px" }}>
                                        {t('order.empty')}
                                    </div>
                                ) : (
                                    ordersByStatus.map((order, index) => {
                                        const firstItem = order.orderDetails[0];
                                        const totalItems = order.orderDetails.length;

                                        return (
                                            <div className="content" key={order.id}>
                                                <div className="inf_product_order">
                                                    <div className="product_detail_order">
                                                        <div className="img_product_order">
                                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                                <img src={firstItem.image} alt={firstItem.nameProduct} />
                                                                <div className="nameProduct">
                                                                    <div>
                                                                        <b>{firstItem.nameProduct}</b>
                                                                        <span style={{ fontSize: "12px" }}> x {firstItem.quantity}</span>
                                                                    </div>
                                                                    <span style={{ fontSize: "10px" }}>
                                                                        {t('order.size')}: {firstItem.size}, {t('order.color')}: {firstItem.color}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="status_price">
                                                                <div style={{ fontSize: "10px" }}>{order.created}</div>
                                                                <div style={{ color: "red", whiteSpace: "nowrap" }}>
                                                                    {formatVND(firstItem.priceUnit)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr style={{ marginTop: "0", marginBottom: "0" }} />
                                                    <div className="product_price_order">
                                                        <div className="view-detail" onClick={() => handleOrderDetail(order.id)}>
                                                            {t('order.view_detail')} ({totalItems} {t('order.product')})
                                                        </div>
                                                        <div style={{ fontWeight: "bold", color: "red", fontSize: "12px" }}>
                                                            {t('order.total')}: {formatVND(order.finalPrice)}
                                                        </div>
                                                    </div>
                                                    <hr style={{ marginTop: "0", marginBottom: "0" }} />
                                                    <div className="btn_status_order">
                                                        <div className="status_order_detail_container">
                                                            <div
                                                                className="status_order_detail"
                                                                style={{ color: getIconAndColor(order.statusOrderId).color, fontWeight: "bold" }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={getIconAndColor(order.statusOrderId).icon}
                                                                    style={{ marginRight: 8 }}
                                                                />
                                                                {getIconAndColor(order.statusOrderId).title}
                                                            </div>
                                                            {order.orderReason && (
                                                                <div className="reason_cancel" style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                                                                    {t('order.reason')}: {order.orderReason}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="btn_orderDetail">
                                                            {(() => {
                                                                const id = order.statusOrderId;
                                                                const orderId = order.id;
                                                                const buttons = [];

                                                                if (id === 1) {
                                                                    buttons.push(
                                                                        <div
                                                                            className="btn cancel-btn"
                                                                            key="cancel"
                                                                            onClick={() => handleActionWithReason(orderId, 'cancel')}
                                                                        >
                                                                            {t('order.btn_cancel')}
                                                                        </div>
                                                                    );
                                                                }

                                                                if (id === 2) {
                                                                    buttons.push(
                                                                        <div
                                                                            className="btn cancel-btn"
                                                                            key="cancel"
                                                                            onClick={() => handleActionWithReason(orderId, 'request_cancel')}
                                                                        >
                                                                            {t('order.btn_cancel')}
                                                                        </div>
                                                                    );
                                                                }

                                                                if (id === 4) {
                                                                    buttons.push(
                                                                        <div
                                                                            className="btn return-btn"
                                                                            key="return"
                                                                            onClick={() => handleActionWithReason(orderId, 'request_return')}
                                                                        >
                                                                            {t('order.btn_return')}
                                                                        </div>
                                                                    );
                                                                }

                                                                if (id === 5) {
                                                                    buttons.push(
                                                                        <div
                                                                            className="btn undo-btn"
                                                                            key="undo"
                                                                            onClick={() => handleSimpleAction(orderId, 2, t('order.cancel_request_canceled'))}
                                                                        >
                                                                            {t('order.btn_cancel_ask')}
                                                                        </div>
                                                                    );
                                                                }

                                                                if (id === 7) {
                                                                    buttons.push(
                                                                        <div
                                                                            className="btn cancel-btn"
                                                                            key="cancel"
                                                                            onClick={() => handleActionWithReason(orderId, 'cancel')}
                                                                        >
                                                                            {t('order.btn_cancel')}
                                                                        </div>
                                                                    );
                                                                    buttons.push(
                                                                        <div
                                                                            className="btn pay-btn"
                                                                            key="pay"
                                                                            onClick={() => paymentOnline(orderId)}
                                                                        >
                                                                            {t('order.btn_buy')}
                                                                        </div>
                                                                    );
                                                                }

                                                                if (id === 8) {
                                                                    buttons.push(
                                                                        <div
                                                                            className="btn undo-btn"
                                                                            key="undo"
                                                                            onClick={() => handleSimpleAction(orderId, 4, t('order.cancel_request_canceled'))}
                                                                        >
                                                                            {t('order.btn_cancel_ask')}
                                                                        </div>
                                                                    );
                                                                }

                                                                // if ([6, 9].includes(id)) {
                                                                //     buttons.push(
                                                                //         <div className="btn rebuy-btn" key="rebuy">
                                                                //             {t('order.btn_reBuy')}
                                                                //         </div>
                                                                //     );
                                                                // }

                                                                return buttons;
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className={`modal fade ${showReasonModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showReasonModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {actionType === 'request_return' ? t('order.select_return_reason') : t('order.select_cancel_reason')}
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowReasonModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="reasonSelect" className="form-label">{t('order.reason')}</label>
                                <select
                                    id="reasonSelect"
                                    className="form-select"
                                    value={selectedReasonId}
                                    onChange={(e) => setSelectedReasonId(e.target.value)}
                                >
                                    <option value="">{t('order.select_reason')}</option>
                                    {reasons.map((reason) => (
                                        <option key={reason.id} value={reason.id}>
                                            {reason.reason_group}: {reason.reason}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowReasonModal(false)}>
                                {t('order.btn_cancel')}
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleConfirmReason}>
                                {t('order.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderUser;