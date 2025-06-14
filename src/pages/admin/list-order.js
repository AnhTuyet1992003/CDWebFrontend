import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTruckFast, faBox, faCircleXmark, faCircleCheck, faBan, faCreditCard, faRotateLeft, faWarehouse, faTrashArrowUp, faSearch } from '@fortawesome/free-solid-svg-icons';
import './ListOrderAdmin.css';

const ListOrder = () => {
    const [statuses, setStatuses] = useState([]);
    const [orderCountsByStatus, setOrderCountsByStatus] = useState({});
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]); // Danh sách đơn hàng đã lọc
    const [searchQuery, setSearchQuery] = useState(''); // Giá trị tìm kiếm
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [reasons, setReasons] = useState([]);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedReasonId, setSelectedReasonId] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [actionType, setActionType] = useState(''); // 'cancel' or 'delivery_failed'
    const pageSize = 10;
    const navigate = useNavigate();

    // Lấy token từ cookie
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    const getIconAndColor = (statusId) => {
        switch (statusId) {
            case 1: return { icon: faClock, color: '#f0ad4e', title: 'Chờ xác nhận' };
            case 2: return { icon: faBox, color: '#5bc0de', title: 'Đang chuẩn bị' };
            case 3: return { icon: faTruckFast, color: '#0275d8', title: 'Đang giao' };
            case 4: return { icon: faCircleCheck, color: '#5cb85c', title: 'Đã giao' };
            case 5: return { icon: faTrashArrowUp, color: '#f86c6b', title: 'Yêu cầu hủy' };
            case 6: return { icon: faCircleXmark, color: '#999', title: 'Đã hủy' };
            case 7: return { icon: faCreditCard, color: '#f7a35c', title: 'Chờ thanh toán' };
            case 8: return { icon: faRotateLeft, color: '#ff6666', title: 'Yêu cầu trả hàng' };
            case 9: return { icon: faBan, color: '#9966cc', title: 'Đã trả hàng' };
            case 10: return { icon: faWarehouse, color: '#6c757d', title: 'Trả về kho' };
            default: return { icon: faClock, color: '#999', title: 'Không xác định' };
        }
    };

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

    const hasReasonCancel = filteredOrders.some(order => order.reasonCancel != null);

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

        axios.get('https://localhost:8443/api/v1/orders/getStatus', {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).then(async (res) => {
            setStatuses(res.data);
            setSelectedStatusId(1);
            handleStatusClick(1, 0);
            res.data.forEach(status => {
                axios.get(`https://localhost:8443/api/v1/orders/getOrder/status/admin?statusId=${status.status_id}&page=0&size=${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then(resOrder => {
                    setOrderCountsByStatus(prev => ({
                        ...prev,
                        [status.status_id]: resOrder.data.totalItems
                    }));
                }).catch(err => {
                    console.error("Error loading orders by status", err);
                });
            });
        }).catch(err => {
            console.error("Error loading statuses", err);
        });
    }, [token, navigate]);

    // Lọc đơn hàng dựa trên searchQuery
    useEffect(() => {
        const filtered = orders.filter(order =>
            order.id.toString().includes(searchQuery)
        );
        setFilteredOrders(filtered);
    }, [orders, searchQuery]);

    const handleStatusClick = (statusId, page = 0) => {
        setSelectedStatusId(statusId);
        setCurrentPage(page);
        axios.get(`https://localhost:8443/api/v1/orders/getOrder/status/admin?statusId=${statusId}&page=${page}&size=${pageSize}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).then(res => {
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
            setTotalItems(res.data.totalItems);
            setCurrentPage(res.data.currentPage);
        }).catch(err => {
            console.error("Error fetching orders", err);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể tải danh sách đơn hàng!',
            });
        });
    };

    const handleOrderDetail = (id) => {
        navigate(`/admin-order-detail?orderId=${id}`);
    };

    const updateOrderStatus = (orderId, statusId) => {
        return axios.put(`https://localhost:8443/api/v1/orders/update_status?statusId=${statusId}&orderId=${orderId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
    };

    const deleteOrderReason = (orderId) => {
        return axios.put(`https://localhost:8443/api/v1/orders/delete_order_reason?orderId=${orderId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            withCredentials: true
        });
    };

    const saveOrderReason = (orderId, reasonId) => {
        return axios.put(`https://localhost:8443/api/v1/orders/update_order_reason?orderId=${orderId}&reasonId=${reasonId}`, {}, {
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
        const group = action === 'cancel' ? ['Admin'] : ['Vận chuyển'];
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
                title: 'Lỗi',
                text: 'Không thể tải danh sách lý do!',
            });
        });
    };

    const handleConfirmReason = () => {
        if (!selectedReasonId) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng chọn lý do!',
                confirmButtonText: 'OK',
            });
            return;
        }

        saveOrderReason(selectedOrderId, selectedReasonId).then(() => {
            if (actionType === 'cancel') {
                updateOrderStatus(selectedOrderId, 6).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Đơn hàng đã được hủy!',
                    });
                });
            } else if (actionType === 'delivery_failed') {
                const reasonId = parseInt(selectedReasonId);
                const targetStatus = [15, 16, 17].includes(reasonId) ? 10 : [13, 14].includes(reasonId) ? 6 : 10;
                updateOrderStatus(selectedOrderId, targetStatus).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Đã cập nhật trạng thái giao hàng thất bại!',
                    });
                });
            }
            setShowReasonModal(false);
            setReasons([]);
            handleStatusClick(selectedStatusId, currentPage);
            statuses.forEach(status => {
                axios.get(`https://localhost:8443/api/v1/orders/getOrder/status/admin?statusId=${status.status_id}&page=0&size=${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then(resOrder => {
                    setOrderCountsByStatus(prev => ({
                        ...prev,
                        [status.status_id]: resOrder.data.totalItems
                    }));
                }).catch(err => {
                    console.error("Error refreshing order counts", err);
                });
            });
        }).catch(err => {
            console.error("Error saving reason", err);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể lưu lý do!',
            });
        });
    };

    const handleSimpleAction = (orderId, statusId, successMessage) => {
        Swal.fire({
            title: 'Xác nhận hành động',
            text: `Bạn có chắc chắn muốn thực hiện hành động này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Không',
        }).then((result) => {
            if (result.isConfirmed) {
                // For "Hủy yêu cầu" actions (status 5 or 8), clear the cancel reason first
                if ((statusId === 2 && orders.find(o => o.id === orderId).statusOrderId === 5) ||
                    (statusId === 4 && orders.find(o => o.id === orderId).statusOrderId === 8)) {
                    deleteOrderReason(orderId)
                        .then(() => {
                            updateOrderStatus(orderId, statusId).then(() => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Thành công',
                                    text: successMessage,
                                });
                                handleStatusClick(selectedStatusId, currentPage);
                                statuses.forEach(status => {
                                    axios.get(`https://localhost:8443/api/v1/orders/getOrder/status/admin?statusId=${status.status_id}&page=0&size=${pageSize}`, {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            "Content-Type": "application/json"
                                        },
                                        withCredentials: true
                                    }).then(resOrder => {
                                        setOrderCountsByStatus(prev => ({
                                            ...prev,
                                            [status.status_id]: resOrder.data.totalItems
                                        }));
                                    }).catch(err => {
                                        console.error("Error refreshing order counts", err);
                                    });
                                });
                            }).catch(err => {
                                console.error("Error updating status", err);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Lỗi',
                                    text: 'Không thể cập nhật trạng thái đơn hàng!',
                                });
                            });
                        })
                        .catch(err => {
                            console.error("Error deleting reason", err);
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: 'Không thể xóa lý do hủy!',
                            });
                        });
                } else {
                    // For other actions, just update the status
                    updateOrderStatus(orderId, statusId).then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: successMessage,
                        });
                        handleStatusClick(selectedStatusId, currentPage);
                        statuses.forEach(status => {
                            axios.get(`https://localhost:8443/api/v1/orders/getOrder/status/admin?statusId=${status.status_id}&page=0&size=${pageSize}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                },
                                withCredentials: true
                            }).then(resOrder => {
                                setOrderCountsByStatus(prev => ({
                                    ...prev,
                                    [status.status_id]: resOrder.data.totalItems
                                }));
                            }).catch(err => {
                                console.error("Error refreshing order counts", err);
                            });
                        });
                    }).catch(err => {
                        console.error("Error updating status", err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Không thể cập nhật trạng thái đơn hàng!',
                        });
                    });
                }
            }
        });
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            handleStatusClick(selectedStatusId, page);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <section className="list_order_admin">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3">
                            <div className="menu_status_order">
                                {statuses.map((status, idx) => {
                                    const { icon, color, title } = getIconAndColor(status.status_id);
                                    const count = orderCountsByStatus[status.status_id] || 0;
                                    const isActive = selectedStatusId === status.status_id;

                                    return (
                                        <div
                                            key={idx}
                                            className={`status ${isActive ? 'active' : ''}`}
                                            onClick={() => handleStatusClick(status.status_id, 0)}
                                            style={{ color }}
                                        >
                                            <FontAwesomeIcon icon={icon} style={{ marginRight: 8 }} />
                                            {title} ({count})
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-lg-9 col-md-9">
                            <div className="card">
                                <h5 className="card-header d-flex justify-content-between align-items-center">
                                    Danh sách đơn hàng
                                    <div className="input-group w-50">
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faSearch} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm theo ID đơn hàng"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                </h5>
                                <div className="table-responsive text-nowrap">
                                    <table className="table">
                                        <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày tạo</th>
                                            {hasReasonCancel && <th className="reason-column">Lý do</th>}
                                            <th>Hành động</th>
                                        </tr>
                                        </thead>
                                        <tbody className="table-border-bottom-0">
                                        {filteredOrders.map((order) => {
                                            const { icon, color, title } = getIconAndColor(order.statusOrderId);
                                            return (
                                                <tr key={order.id}>
                                                    <td>
                                                        <a href="#" onClick={() => handleOrderDetail(order.id)}>
                                                            MDH:{order.id}
                                                        </a>
                                                    </td>
                                                    <td>{formatVND(order.finalPrice)}</td>
                                                    <td>
                                                        <span className="badge" style={{ backgroundColor: color }}>
                                                            <FontAwesomeIcon icon={icon} style={{ marginRight: 8 }} />
                                                            {title}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(order.created)}</td>
                                                    {hasReasonCancel && <td className="reason-column">{order.reasonCancel || ''}</td>}
                                                    <td>
                                                        <div className="dropdown">
                                                            <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                <i className="icon-base bx bx-dots-vertical-rounded"></i>
                                                            </button>
                                                            <div className="dropdown-menu">
                                                                <a className="dropdown-item" href="#" onClick={() => handleOrderDetail(order.id)}>
                                                                    <i className="icon-base bx bx-edit-alt me-1"></i> Xem chi tiết
                                                                </a>
                                                                {order.statusOrderId === 1 && (
                                                                    <>
                                                                        <a className="dropdown-item" style={{color:"brown"}} href="#" onClick={() => handleSimpleAction(order.id, 2, 'Đơn hàng đã được chuẩn bị!')}>
                                                                            <i className="icon-base bx bx-package me-1"></i> Chờ đóng gói
                                                                        </a>
                                                                        <a className="dropdown-item" style={{color:"red"}} href="#" onClick={() => handleActionWithReason(order.id, 'cancel')}>
                                                                            <i className="icon-base bx bx-trash me-1"></i> Hủy đơn
                                                                        </a>
                                                                    </>
                                                                )}
                                                                {order.statusOrderId === 2 && (
                                                                    <>
                                                                        <a className="dropdown-item" href="#" style={{color:"blue"}} onClick={() => handleSimpleAction(order.id, 3, 'Đơn hàng đã đưa đơn vị vận chuyển!')}>
                                                                            <FontAwesomeIcon icon={faTruckFast} style={{ marginRight: 8, color:"blue"}} /> Giao hàng
                                                                        </a>
                                                                        <a className="dropdown-item" style={{color:"red"}} href="#" onClick={() => handleActionWithReason(order.id, 'cancel')}>
                                                                            <i className="icon-base bx bx-trash me-1"></i> Hủy đơn
                                                                        </a>
                                                                    </>
                                                                )}
                                                                {order.statusOrderId === 3 && (
                                                                    <>
                                                                        <a className="dropdown-item" href="#"
                                                                           style={{color: "red"}}
                                                                           onClick={() => handleSimpleAction(order.id, 4, "Giao hàng thành công")}>
                                                                            <i className="icon-base bx bx-error-circle me-1"></i> Giao
                                                                            hàng thất bại
                                                                        </a>
                                                                        <a className="dropdown-item" href="#"
                                                                           style={{color: "red"}}
                                                                           onClick={() => handleActionWithReason(order.id, 'delivery_failed')}>
                                                                            <i className="icon-base bx bx-error-circle me-1"></i> Giao
                                                                            hàng thất bại
                                                                        </a>
                                                                    </>
                                                                )}
                                                                {order.statusOrderId === 5 && (
                                                                    <>
                                                                        <a className="dropdown-item" href="#" style={{color:"red"}} onClick={() => handleSimpleAction(order.id, 6, 'Yêu cầu hủy đã được xác nhận!')}>
                                                                            <i className="icon-base bx bx-check-circle me-1"></i> Xác nhận hủy
                                                                        </a>
                                                                        <a className="dropdown-item" href="#" style={{color:"blue"}} onClick={() => handleSimpleAction(order.id, 2, 'Yêu cầu hủy đã bị hủy!')}>
                                                                            <i className="icon-base bx bx-undo me-1"></i> Hủy yêu cầu
                                                                        </a>
                                                                    </>
                                                                )}
                                                                {order.statusOrderId === 8 && (
                                                                    <>
                                                                        <a className="dropdown-item" href="#" style={{color:"red"}} onClick={() => handleSimpleAction(order.id, 9, 'Yêu cầu trả hàng đã được xác nhận!')}>
                                                                            <i className="icon-base bx bx-check-circle me-1"></i> Xác nhận trả hàng
                                                                        </a>
                                                                        <a className="dropdown-item" href="#" style={{color:"blue"}} onClick={() => handleSimpleAction(order.id, 4, 'Yêu cầu trả hàng đã bị hủy!')}>
                                                                            <i className="icon-base bx bx-undo me-1"></i> Hủy yêu cầu
                                                                        </a>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredOrders.length === 0 && (
                                            <tr>
                                                <td colSpan={hasReasonCancel ? 7 : 6} style={{ textAlign: 'center' }}>
                                                    Không tìm thấy đơn hàng
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <nav aria-label="Page navigation" style={{paddingBottom:"10px"}}>
                                        <ul className="pagination justify-content-center mt-3">
                                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                                    Trước
                                                </button>
                                            </li>
                                            {[...Array(totalPages).keys()].map(page => (
                                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(page)}>
                                                        {page + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                                    Sau
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
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
                            <h5 className="modal-title">Chọn lý do {actionType === 'cancel' ? 'hủy đơn' : 'giao hàng thất bại'}</h5>
                            <button type="button" className="btn-close" onClick={() => setShowReasonModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="reasonSelect" className="form-label">Lý do</label>
                                <select
                                    id="reasonSelect"
                                    className="form-select"
                                    value={selectedReasonId}
                                    onChange={(e) => setSelectedReasonId(e.target.value)}
                                >
                                    <option value="">Chọn lý do</option>
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
                                Hủy
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleConfirmReason}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListOrder;