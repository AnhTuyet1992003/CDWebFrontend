
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, useLocation } from 'react-router-dom';
import {Link} from "react-router-dom";
import './OrderDetail.css'

import axios from 'axios';
import Swal from 'sweetalert2';
import {useTranslation} from "react-i18next";
const OrderDetail = () => {
    const { t } = useTranslation('translation');

    const location = useLocation();
    const orderId = location.state?.orderId;
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchOrder = async () => {
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

            if (!orderId) {
                Swal.fire( t('order_detail.error_empty_order')).then(() => navigate("/home"));
                return;
            }

            try {
                const response = await axios.get(`https://localhost:8443/api/v1/orders/getOrder`, {
                    params: { orderId },
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Gửi token trong header
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                setOrder(response.data.data);
                console.log("id nè: " + response.data.data.id);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title:  t('order_detail.error'),
                    text:  t('order_detail.error_order'),
                });
            }
        };
        fetchOrder();
    }, [orderId]);
    if (!order) return <p>  {t('order_detail.order_empty')}</p>;


    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };
    return (
        <div className={"Order_Detail"}>
            <div className={"content"}>
                <div style={{paddingBottom: "20px"}}><h3>{t('order_detail.title')}</h3></div>
                <div className="row">
                    <div className="col-lg-8">
                        {/* Details */}
                        <div className="card mb-5">
                            <div className="card-body" style={{width: "100%"}}>
                                <div className="mb-3 d-flex justify-content-between">
                                    <div>
                                        <span className="me-3">{order.created}</span>
                                        <span className="me-3">ID:MDH{order.id}</span>
                                        <span className="me-3">
                                                {order.paymentId === 1
                                                ? t('payment.payment_1')
                                                : order.paymentId === 2
                                                ? t('payment.payment_2')
                                                : order.paymentId === 3
                                                ? t('payment.payment_3')
                                                : t('payment.payment_4')}
                                        </span>
                                        <span className="badge rounded-pill bg-info">
                                            {order.statusOrderId === 1
                                                    ? t('order_status.order_status_1')
                                                    : order.statusOrderId === 2
                                                    ? t('order_status.order_status_2')
                                                    : order.statusOrderId === 3
                                                    ? t('order_status.order_status_3')
                                                    : order.statusOrderId === 4
                                                    ? t('order_status.order_status_4')
                                                    : order.statusOrderId === 5
                                                    ? t('order_status.order_status_5')
                                                    : order.statusOrderId === 6
                                                    ? t('order_status.order_status_6')
                                                    : order.statusOrderId === 7
                                                    ? t('order_status.order_status_7')
                                                    : order.statusOrderId === 8
                                                    ? t('order_status.order_status_8')
                                                    : order.statusOrderId === 9
                                                    ? t('order_status.order_status_9')
                                                    : order.statusOrderId === 10
                                                    ? t('order_status.order_status_10')
                                                    : t('order_status.order_status_11')}
                                        </span>
                                    </div>
                                    <div className="d-flex">
                                        <button className="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text"><i
                                            className="bi bi-download"/> <span className="text">Invoice</span></button>
                                        <div className="dropdown">
                                            <button className="btn btn-link p-0 text-muted" type="button"
                                                    data-bs-toggle="dropdown">
                                                <i className="bi bi-three-dots-vertical"/>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li><a className="dropdown-item" href="#"><i
                                                    className="bi bi-pencil"/> Edit</a></li>
                                                <li><a className="dropdown-item" href="#"><i
                                                    className="bi bi-printer"/> Print</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <table className="table_checkout table-borderless" style={{width: "100%", fontSize: "15px"}}>
                                    <tbody>
                                    {order.orderDetails.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="d-flex mb-2">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt=""
                                                            width={35}
                                                            className="img-fluid"
                                                        />
                                                    </div>
                                                    <div className="flex-lg-grow-1 ms-3">
                                                        <h6 className="small mb-0">
                                                            <a href="#" className="text-reset">

                                                               <b> {item.nameProduct}</b>
                                                            </a>
                                                        </h6>
                                                        <span className="small">{t('order_detail.size')}: {item.size}</span><br />
                                                        <span className="small">{t('order_detail.color')}: {item.color}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td className="text-end" style={{color: "red", fontWeight: "bold"}}>{formatVND(item.priceUnit * item.quantity)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colSpan={2}>{t('order_detail.price_total')}</td>
                                        <td className="text-end">{formatVND(order.totalPrice)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>{t('order_detail.price_ship')}</td>
                                        <td className="text-end">{formatVND(order.shippingFee)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>{t('order_detail.price_coupon')} (Code: NEWYEAR)</td>
                                        <td className="text-danger text-end">{formatVND(0)}</td>
                                    </tr>
                                    <tr className="fw-bold">
                                        <td colSpan={2}>{t('order_detail.price_final')}</td>
                                        <td className="text-end">{formatVND(order.finalPrice)}</td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        {/* Payment */}
                        <div className="card mb-5">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <h3 className="h6">{t('order_detail.size')}</h3>
                                        {order.paymentId === 1 ? (
                                            <p>{t('payment.payment_1')}</p>
                                        ) : order.paymentId === 2 ? (
                                            <p>{t('payment.payment_2')} <br/>
                                                Total: {order.finalPrice.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD'
                                                })}
                                                <span className="badge bg-success rounded-pill">PAID</span>
                                            </p>
                                        ) : order.paymentId === 3 ? (
                                            <p>{t('payment.payment_3')}<br/>
                                                {t('order_detail.price_final')}: {formatVND(order.finalPrice)}
                                                <br/>
                                                {order.statusOrderId === 1
                                                    ? (
                                                        <span className="badge bg-success rounded-pill">{t('order_detail.payment_ok')}</span>
                                                    )
                                                            : (
                                                        <span
                                                            className="badge bg-danger rounded-pill">{t('order_detail.payment_no')}</span>
                                                    )}
                                            </p>
                                        ) : (
                                            <p>{t('payment.payment_4')}</p>
                                        )}
                                    </div>

                                    <div className="col-lg-6">
                                        <h3 className="h6"> {t('order_detail.address')}</h3>
                                        <address>
                                            <strong>{order.receiverName}</strong><br/>
                                            {order.addressDetails}<br/>
                                            {order.district}, {order.ward}, {order.province}<br/>
                                            {t('order_detail.phone')}: {order.receiverPhone}
                                        </address>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        {/* Customer Notes */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h3 className="h6">{t('order_detail.note')}</h3>
                                <p>{order.note ? order.note : t('order_detail.no_note')}</p>
                            </div>
                        </div>
                        <div className="card mb-4">
                            {/* Shipping information */}
                            <div className="card-body">
                                <h3 className="h6">{t('order_detail.shipping_information')}</h3>
                                <strong>{t('order_detail.code_shipping')}</strong>
                                <span><a href="#" className="text-decoration-underline" target="_blank">FF1234567890</a> <i
                                    className="bi bi-box-arrow-up-right"/> </span>
                                <hr/>
                                <h3 className="h6">{t('order_detail.address')}</h3>
                                <address>
                                    <strong>{order.receiverName}</strong><br/>
                                    {order.addressDetails}<br/>
                                    {order.district}, {order.ward}, {order.province}<br/>
                                    {t('order_detail.phone')}: {order.receiverPhone}
                                </address>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default OrderDetail;
