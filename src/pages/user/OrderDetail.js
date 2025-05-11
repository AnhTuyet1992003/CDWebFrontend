
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, useLocation } from 'react-router-dom';
import {Link} from "react-router-dom";
import './OrderDetail.css'

import axios from 'axios';
import Swal from 'sweetalert2';
const OrderDetail = () => {
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
                    title: '⚠️ Bạn chưa đăng nhập.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/login');
                });
                return;
            }

            if (!orderId) {
                Swal.fire("Không tìm thấy đơn hàng!").then(() => navigate("/home"));
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
                    title: 'Lỗi',
                    text: 'Không thể tải đơn hàng. Vui lòng thử lại!',
                });
            }
        };
        fetchOrder();
    }, [orderId]);
    if (!order) return <p>Đang tải...</p>;


    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };
    return (
        <div className={"Order_Detail"}>
            <div className={"content"}>
                <div style={{paddingBottom: "20px"}}><h3>Chi tiết đơn hàng của bạn</h3></div>
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
                                                ? 'Thanh toán khi nhận hàng'
                                                : order.paymentId === 2
                                                ? 'Thanh toán qua MoMo'
                                                : order.paymentId === 3
                                                ? 'Thanh toán qua VNPAY'
                                                : 'Không xác định'}
                                        </span>
                                        <span className="badge rounded-pill bg-info">
                                            {order.statusOrderId === 1
                                                    ? 'Chờ xác nhận'
                                                    : order.statusOrderId === 2
                                                    ? 'Đang đóng gói'
                                                    : order.statusOrderId === 3
                                                    ? 'Đang giao hàng'
                                                    : order.statusOrderId === 4
                                                    ? 'Giao thành công'
                                                    : order.statusOrderId === 5
                                                    ? 'Yêu cầu hủy'
                                                    : order.statusOrderId === 6
                                                    ? 'Đã hủy'
                                                    : order.statusOrderId === 7
                                                    ? 'Chờ thanh toán'
                                                    : order.statusOrderId === 8
                                                    ? 'Yêu cầu hoàn'
                                                    : order.statusOrderId === 9
                                                    ? 'Đã hoàn'
                                                    : order.statusOrderId === 10
                                                    ? 'Trả về kho'
                                                    : 'Không xác định'}
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

                                                               <b> Product {item.nameProduct}</b>
                                                            </a>
                                                        </h6>
                                                        <span className="small">Size: {item.size}</span><br />
                                                        <span className="small">Color: {item.color}</span>
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
                                        <td colSpan={2}>Tổng tiền</td>
                                        <td className="text-end">{formatVND(order.totalPrice)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>Tiền ship</td>
                                        <td className="text-end">{formatVND(order.shippingFee)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>Giảm giá (Code: NEWYEAR)</td>
                                        <td className="text-danger text-end">{formatVND(0)}</td>
                                    </tr>
                                    <tr className="fw-bold">
                                        <td colSpan={2}>Tổng thanh toán</td>
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
                                        <h3 className="h6">Phương thức thanh toán</h3>
                                        {order.paymentId === 1 ? (
                                            <p>Thanh toán khi nhận hàng</p>
                                        ) : order.paymentId === 2 ? (
                                            <p>Thanh toán qua MoMo <br/>
                                                Total: {order.finalPrice.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD'
                                                })}
                                                <span className="badge bg-success rounded-pill">PAID</span>
                                            </p>
                                        ) : order.paymentId === 3 ? (
                                            <p>Thanh toán qua VNPAY <br/>
                                                Tổng thanh toán: {formatVND(order.finalPrice)}
                                                <br/>
                                                {order.statusOrderId === 1
                                                    ? (
                                                        <span className="badge bg-success rounded-pill">Đã thanh toán</span>
                                                    )
                                                            : (
                                                        <span
                                                            className="badge bg-danger rounded-pill">Chưa thanh toán</span>
                                                    )}
                                            </p>
                                        ) : (
                                            <p>Không xác định phương thức thanh toán</p>
                                        )}
                                    </div>

                                    <div className="col-lg-6">
                                        <h3 className="h6"> Địa chỉ</h3>
                                        <address>
                                            <strong>{order.receiverName}</strong><br/>
                                            {order.addressDetails}<br/>
                                            {order.district}, {order.ward}, {order.province}<br/>
                                            <abbr title="Phone">Số điện thoại:</abbr> {order.receiverPhone}
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
                                <h3 className="h6">Ghi chú của khách hàng</h3>
                                <p>{order.note ? order.note : 'Không có ghi chú'}</p>
                            </div>
                        </div>
                        <div className="card mb-4">
                            {/* Shipping information */}
                            <div className="card-body">
                                <h3 className="h6">Thông tin vận chuyển</h3>
                                <strong>Mã vận chuyển</strong>
                                <span><a href="#" className="text-decoration-underline" target="_blank">FF1234567890</a> <i
                                    className="bi bi-box-arrow-up-right"/> </span>
                                <hr/>
                                <h3 className="h6">Địa chỉ</h3>
                                <address>
                                    <strong>{order.receiverName}</strong><br/>
                                    {order.addressDetails}<br/>
                                    {order.district}, {order.ward}, {order.province}<br/>
                                    <abbr title="Phone">Số điện thoại:</abbr> {order.receiverPhone}
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
