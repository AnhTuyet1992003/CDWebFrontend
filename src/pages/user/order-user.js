import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import './OrderDetail.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClock, faTruckFast, faBox, faCircleXmark, faCircleCheck, faBan, faCreditCard, faRotateLeft, faWarehouse, faTrashArrowUp} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Swal from "sweetalert2";

const OrderUser = () => {
    const [status, setStatus] = useState([]);
    const navigate = useNavigate();
    const [ordersByStatus, setOrdersByStatus] = useState([]);
    const [orderCountsByStatus, setOrderCountsByStatus] = useState({});
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };


    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
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

        axios.get("https://localhost:8443/api/v1/orders/getStatus", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
            .then(res => {
                setStatus(res.data);
                // Gọi fetchOrdersByStatus cho statusId = 1 mặc định
                fetchOrdersByStatus(1);
                // Lặp qua tất cả các status_id và gọi fetchOrdersByStatus cho từng status_id
                res.data.forEach(statusItem => {
                    fetchCountOrdersByStatus(statusItem.status_id);
                });
            })
            .catch(err => console.error("Lỗi khi lấy category:", err));
    }, []);
    const handleOrderDetail = (id) => {
        navigate('/order/confirmation', {
            state: { orderId: id }
        });

    };

    const fetchCountOrdersByStatus = (statusId) => {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];
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
                    // setOrdersByStatus(res.data.orders);

                    // Đếm số lượng đơn hàng và lưu vào state
                    setOrderCountsByStatus(prev => ({
                        ...prev,
                        [statusId]: res.data.orders.length
                    }));
                }
            })
            .catch(err => console.error("Lỗi khi lấy đơn hàng theo trạng thái:", err));
    };

    const fetchOrdersByStatus = (statusId) => {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];
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

                    // Đếm số lượng đơn hàng và lưu vào state
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
            case 1:
                return { icon: faClock, color: '#f0ad4e', title: 'Chờ xác nhận' };
            case 2:
                return { icon: faBox, color: '#5bc0de', title: 'Đang đóng gói' };
            case 3:
                return { icon: faTruckFast, color: '#0275d8', title: 'Đang giao hàng' };
            case 4:
                return { icon: faCircleCheck, color: '#5cb85c', title: 'Giao thành công' };
            case 5:
                return { icon: faTrashArrowUp, color: '#f86c6b', title: 'Yêu cầu hủy' };
            case 6:
                return { icon: faCircleXmark, color: '#999', title: 'Đã hủy' };
            case 7:
                return { icon: faCreditCard, color: '#f7a35c', title: 'Chờ thanh toán' };
            case 8:
                return { icon: faRotateLeft, color: '#ff6666', title: 'Yêu cầu hoàn' };
            case 9:
                return { icon: faBan, color: '#9966cc', title: 'Đã hoàn' };
            case 10:
                return { icon: faWarehouse, color: '#6c757d', title: 'Trả về kho' };
            default:
                return { icon: faClock, color: '#999', title: 'Không xác định' };
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
                                <a href="#">Đơn hàng của bạn</a>
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
                                        const {icon, color} = getIconAndColor(item.status_id);
                                        const count = orderCountsByStatus[item.status_id] || 0;
                                        const isActive = selectedStatusId === item.status_id; // Kiểm tra thẻ đang được chọn

                                        return (
                                            <div
                                                key={index}
                                                className={`order_status ${isActive ? 'active' : ''}`} // Nếu thẻ đang được chọn, thêm class 'active'
                                                onClick={() => {
                                                    fetchOrdersByStatus(item.status_id);
                                                    setSelectedStatusId(item.status_id); // Cập nhật selectedStatusId khi click
                                                }}
                                            >
                                                <div className="title" style={{color}}>
                                                    <FontAwesomeIcon icon={icon} style={{marginRight: 8}}/>
                                                    {item.name}
                                                </div>
                                                <div className="title">{count}</div>
                                            </div>
                                        );
                                    })}
                                </div>


                            </div>
                        </div>

                        <div className="col-lg-8 col-md-8">
                            <div className={"order_user_content"}>

                                {ordersByStatus.length === 0 ? (
                                    <div style={{ textAlign: "center", fontSize: "16px", color: "gray", marginTop: "20px" }}>
                                        Không có sản phẩm nào
                                    </div>
                                ) : (
                                    ordersByStatus.map((order, index) => {
                                        const firstItem = order.orderDetails[0];
                                        const totalItems = order.orderDetails.length;

                                        return (
                                            <div className={"content"} key={order.id}>
                                                <div className={"inf_product_order"}>
                                                    <div className={"product_detail_order"}>
                                                        <div className={"img_product_order"}>
                                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                                <img src={firstItem.image} alt={firstItem.nameProduct}/>
                                                                <div className={"nameProduct"}>
                                                                    <div><b>{firstItem.nameProduct}</b> <span
                                                                        style={{ fontSize: "12px" }}>x {firstItem.quantity}</span></div>
                                                                    <span
                                                                        style={{ fontSize: "10px" }}>Kích thước: {firstItem.size}, Màu sắc: {firstItem.color}</span>
                                                                </div>
                                                            </div>
                                                            <div className={"status_price"}>
                                                                <div style={{fontSize: "10px"}}>{order.created}</div>
                                                                <div style={{
                                                                    color: "red",
                                                                    whiteSpace: "nowrap"
                                                                }}>{formatVND(firstItem.priceUnit)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr style={{ marginTop: "0", marginBottom: "0" }}/>
                                                    <div className={"product_price_order"}>
                                                        <div className="view-detail"
                                                             onClick={() => handleOrderDetail(order.id)}>
                                                            Xem chi tiết ({totalItems} sản phẩm)
                                                        </div>
                                                        <div style={{
                                                            fontWeight: "bold",
                                                            color: "red",
                                                            fontSize: "12px"
                                                        }}>Tổng thanh toán: {formatVND(order.finalPrice)}</div>
                                                    </div>
                                                    <hr style={{ marginTop: "0", marginBottom: "0" }}/>
                                                    <div className={"btn_status_order"}>
                                                        <div className={"status_order_detail"}
                                                             style={{ color: getIconAndColor(order.statusOrderId).color, fontWeight: "bold" }}>
                                                            <FontAwesomeIcon
                                                                icon={getIconAndColor(order.statusOrderId).icon}
                                                                style={{ marginRight: 8 }}
                                                            />
                                                            {getIconAndColor(order.statusOrderId).title}
                                                        </div>

                                                        <div className={"btn_orderDetail"}>
                                                            {(() => {
                                                                const id = order.statusOrderId;
                                                                const buttons = [];

                                                                if ([1, 2].includes(id)) {
                                                                    buttons.push(<div className="btn cancel-btn"
                                                                                      key="cancel">Hủy</div>);
                                                                }

                                                                if (id === 7) {
                                                                    buttons.push(<div className="btn cancel-btn"
                                                                                      key="cancel">Hủy</div>);
                                                                    buttons.push(<div className="btn pay-btn"
                                                                                      key="pay">Thanh toán</div>);
                                                                }

                                                                if (id === 4) {
                                                                    buttons.push(<div className="btn return-btn"
                                                                                      key="return">Yêu cầu hoàn</div>);
                                                                }

                                                                if ([5, 8].includes(id)) {
                                                                    buttons.push(<div className="btn undo-btn"
                                                                                      key="undo">Hủy yêu cầu</div>);
                                                                }

                                                                if ([6, 9].includes(id)) {
                                                                    buttons.push(<div className="btn rebuy-btn"
                                                                                      key="rebuy">Mua lại</div>);
                                                                }

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

        </>
    );
}

export default OrderUser;
