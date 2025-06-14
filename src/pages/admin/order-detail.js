import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import './ListOrderAdmin.css';

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy orderId từ state hoặc URL params
    const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');

    // Lấy token từ cookie
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getStatusText = (statusId) => {
        switch (statusId) {
            case 1: return 'Chờ xác nhận';
            case 2: return 'Đang chuẩn bị';
            case 3: return 'Đang giao';
            case 4: return 'Đã giao';
            case 5: return 'Yêu cầu hủy';
            case 6: return 'Đã hủy';
            case 7: return 'Chờ thanh toán';
            case 8: return 'Yêu cầu trả hàng';
            case 9: return 'Đã trả hàng';
            case 10: return 'Trả về kho';
            default: return 'Không xác định';
        }
    };

    const getPaymentText = (paymentId) => {
        switch (paymentId) {
            case 1: return 'Thanh toán khi nhận hàng (COD)';
            case 2: return 'Thanh toán qua thẻ';
            default: return 'Không xác định';
        }
    };

    useEffect(() => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn chưa đăng nhập!',
                confirmButtonText: 'OK',
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        // if (!orderId) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Lỗi',
        //         text: 'Không tìm thấy ID đơn hàng!',
        //     }).then(() => {
        //         navigate('/admin-list-order');
        //     });
        //     return;
        // }

        // Gọi API để lấy chi tiết đơn hàng
        axios.get(`https://localhost:8443/api/v1/orders/getOrderAdmin?orderId=${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).then(res => {
            if (res.data.status === 'success') {
                setOrder(res.data.data);
                setLoading(false);
            } else {
                throw new Error('Dữ liệu không hợp lệ');
            }
        }).catch(err => {
            console.error("Error fetching order details", err);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải chi tiết đơn hàng!',
            }).then(() => {
                navigate('/admin-list-order');
            });
            setLoading(false);
        });
    }, [token, orderId, navigate]);

    if (loading) {
        return (
            <section className="order-detail">
                <div className="container">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="order-detail">
                <div className="container">
                    <div className="alert alert-danger" role="alert">
                        Không tìm thấy thông tin đơn hàng!
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="order-detail">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5>Chi tiết đơn hàng #{order.id}</h5>
                                <span className="badge bg-info">{getStatusText(order.statusOrderId)}</span>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {/* Thông tin khách hàng */}
                                    <div className="col-md-6">
                                        <h6 className="mb-3">Thông tin khách hàng</h6>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Họ tên:</span>
                                                <strong>{order.receiverName}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Số điện thoại:</span>
                                                <strong>{order.receiverPhone}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Địa chỉ:</span>
                                                <strong>{order.addressDetails}, {order.ward}, {order.district}, {order.province}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Ghi chú:</span>
                                                <strong>{order.note || 'Không có'}</strong>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* Thông tin đơn hàng */}
                                    <div className="col-md-6">
                                        <h6 className="mb-3">Thông tin đơn hàng</h6>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Mã đơn hàng:</span>
                                                <strong>MDH:{order.id}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Ngày đặt:</span>
                                                <strong>{formatDate(order.created)}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Phương thức thanh toán:</span>
                                                <strong>{getPaymentText(order.paymentId)}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Trạng thái:</span>
                                                <strong>{getStatusText(order.statusOrderId)}</strong>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Danh sách sản phẩm */}
                                <h6 className="mt-4 mb-3">Danh sách sản phẩm</h6>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="table-light">
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Kích cỡ</th>
                                            <th>Màu sắc</th>
                                            <th>Đơn giá</th>
                                            <th>Tổng</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {order.orderDetails.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={item.image}
                                                            alt={item.nameProduct}
                                                            className="product-image me-2"
                                                            style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                                        />
                                                        <span>{item.nameProduct}</span>
                                                    </div>
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>{item.size}</td>
                                                <td>{item.color}</td>
                                                <td>{formatVND(item.priceUnit)}</td>
                                                <td>{formatVND(item.subtotal)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Tóm tắt giá */}
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Tổng tiền hàng:</span>
                                                <strong>{formatVND(order.totalPrice)}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Phí vận chuyển:</span>
                                                <strong>{formatVND(order.shippingFee)}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Giảm giá:</span>
                                                <strong>{formatVND(order.discountValue)}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between bg-light">
                                                <strong>Tổng thanh toán:</strong>
                                                <strong className="text-danger">{formatVND(order.finalPrice)}</strong>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                            <div className="card-footer text-start">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/admin-list-order')}
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderDetail;