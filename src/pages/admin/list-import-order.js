// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import './AddToCart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTicket } from '@fortawesome/free-solid-svg-icons';
//
// const ListImportOrder = () => {
//     const [importOrders, setImportOrders] = useState([]); // Lưu danh sách đơn nhập hàng
//     const navigate = useNavigate();
//     const [selectedItems, setSelectedItems] = useState([]);
//     const [isAllSelected, setIsAllSelected] = useState(false);
//
//     const handleSelectAll = () => {
//         if (isAllSelected) {
//             setSelectedItems([]);
//         } else {
//             setSelectedItems(importOrders.map(order => order.id));
//         }
//         setIsAllSelected(!isAllSelected);
//     };
//
//     const handleSelectItem = (orderId) => {
//         const updatedItems = selectedItems.includes(orderId)
//             ? selectedItems.filter(id => id !== orderId)
//             : [...selectedItems, orderId];
//         setSelectedItems(updatedItems);
//         setIsAllSelected(updatedItems.length === importOrders.length);
//     };
//
//     useEffect(() => {
//         const fetchImportOrders = async () => {
//             try {
//                 const token = document.cookie
//                     .split('; ')
//                     .find(row => row.startsWith('token='))
//                     ?.split('=')[1];
//                 if (!token) {
//                     Swal.fire({
//                         icon: 'warning',
//                         title: '⚠️ Bạn chưa đăng nhập.',
//                         confirmButtonText: 'OK',
//                     }).then(() => {
//                         navigate('/login');
//                     });
//                     return;
//                 }
//                 const response = await axios.get('https://localhost:8443/api/v1/importOrder/list', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json', // Sửa từ multipart/form-data thành application/json
//                     },
//                     withCredentials: true,
//                 });
//
//                 const data = response.data; // Phản hồi là mảng ImportOrderDTO
//                 console.log("response.data")
//                 console.log(response.data)
//
//                 if (!data || data.length === 0) {
//                     Swal.fire({
//                         icon: 'warning',
//                         title: '⚠️ Danh sách đơn nhập hàng trống.',
//                         confirmButtonText: 'OK',
//                     }).then(() => {
//                         navigate('/import-order');
//                     });
//                     return;
//                 }
//
//                 setImportOrders(data); // Lưu mảng trực tiếp
//             } catch (error) {
//                 console.error('Lỗi khi lấy danh sách đơn nhập: ', error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: '❌ Lỗi khi lấy danh sách đơn nhập!',
//                     text: error.message,
//                 });
//             }
//         };
//         fetchImportOrders();
//     }, [navigate]);
//
//     if (!importOrders.length) {
//         return <div>Đang tải...</div>;
//     }
//
//     const handleRemoveItem = (orderId) => {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Bạn có chắc chắn muốn xóa đơn nhập này không?',
//             showCancelButton: true,
//             confirmButtonText: 'Xóa',
//             cancelButtonText: 'Hủy',
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const token = document.cookie
//                         .split('; ')
//                         .find(row => row.startsWith('token='))
//                         ?.split('=')[1];
//                     if (!token) {
//                         Swal.fire({
//                             icon: 'warning',
//                             title: '⚠️ Bạn chưa đăng nhập.',
//                             confirmButtonText: 'OK',
//                         }).then(() => {
//                             navigate('/login');
//                         });
//                         return;
//                     }
//
//                     await axios.post(`https://localhost:8443/api/v1/importOrder/delete`,{"id": orderId}, {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                         withCredentials: true,
//                     });
//
//                     setImportOrders(importOrders.filter(order => order.id !== orderId));
//                     setSelectedItems(selectedItems.filter(id => id !== orderId));
//                     setIsAllSelected(false);
//
//                     Swal.fire({
//                         icon: 'success',
//                         title: '✅ Đã xóa đơn nhập hàng!',
//                         confirmButtonText: 'OK',
//                     });
//                 } catch (error) {
//                     console.error('Lỗi khi xóa đơn nhập: ', error);
//                     Swal.fire({
//                         icon: 'error',
//                         title: '❌ Lỗi khi xóa!',
//                         text: error.response?.data?.message || error.message,
//                     });
//                 }
//             }
//         });
//     };
//
//     const handleRemoveSelectedItems = () => {
//         if (selectedItems.length === 0) {
//             Swal.fire({
//                 icon: 'info',
//                 title: 'Bạn chưa chọn đơn nhập nào để xóa.',
//                 confirmButtonText: 'OK',
//             });
//             return;
//         }
//
//         Swal.fire({
//             icon: 'warning',
//             title: 'Bạn có chắc chắn muốn xóa các đơn nhập đã chọn?',
//             showCancelButton: true,
//             confirmButtonText: 'Xóa',
//             cancelButtonText: 'Hủy',
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const token = document.cookie
//                         .split('; ')
//                         .find(row => row.startsWith('token='))
//                         ?.split('=')[1];
//                     if (!token) {
//                         Swal.fire({
//                             icon: 'warning',
//                             title: '⚠️ Bạn chưa đăng nhập.',
//                             confirmButtonText: 'OK',
//                         }).then(() => {
//                             navigate('/login');
//                         });
//                         return;
//                     }
//
//                     const query = selectedItems.map(id => `orderId=${id}`).join('&');
//                     const url = `https://localhost:8443/api/v1/importOrder/remove-items?${query}`;
//
//                     await axios.delete(url, {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                         withCredentials: true,
//                     });
//
//                     setImportOrders(importOrders.filter(order => !selectedItems.includes(order.id)));
//                     setSelectedItems([]);
//                     setIsAllSelected(false);
//
//                     Swal.fire({
//                         icon: 'success',
//                         title: '✅ Đã xóa các đơn nhập hàng!',
//                         confirmButtonText: 'OK',
//                     });
//                 } catch (error) {
//                     console.error('Lỗi khi xóa các đơn nhập: ', error);
//                     Swal.fire({
//                         icon: 'error',
//                         title: '❌ Lỗi khi xóa!',
//                         text: error.response?.data?.message || error.message,
//                     });
//                 }
//             }
//         });
//     };
//
//     return (
//         <>
//             <div className="breadcrumb-option">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="breadcrumb__links">
//                                 <Link to="/home" style={{ cursor: 'pointer' }}>
//                                     <i className="fa fa-home"></i> Trang chủ
//                                 </Link>
//                                 <span>Danh sách đơn nhập</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/*<section className="shop-cart spad">*/}
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="shop__cart__table">
//                                 <table>
//                                     <thead>
//                                     <tr>
//                                         <th>
//                                             <input
//                                                 className="check_product"
//                                                 type="checkbox"
//                                                 onChange={handleSelectAll}
//                                                 checked={isAllSelected}
//                                             />
//                                         </th>
//                                         <th>ID</th>
//                                         <th>Ngày nhập</th>
//                                         <th>Người nhập</th>
//                                         <th>Tổng tiền</th>
//                                         <th></th>
//                                     </tr>
//                                     </thead>
//                                     <tbody>
//                                     {importOrders.map(order => (
//                                         <tr key={order.id}>
//                                             <td>
//                                                 <input
//                                                     className="check_product"
//                                                     type="checkbox"
//                                                     checked={selectedItems.includes(order.id)}
//                                                     onChange={() => handleSelectItem(order.id)}
//                                                 />
//                                             </td>
//                                             <td className="cart__product__item" style={{ position: 'relative', overflow: 'visible' }}>
//                                                 <div className="cart__product__item__title" style={{ overflow: 'visible' }}>
//                                                     <h6>{order.id}</h6>
//                                                 </div>
//                                             </td>
//                                             <td className="cart__product__item" style={{ position: 'relative', overflow: 'visible' }}>
//                                                 <div className="cart__product__item__title" style={{ overflow: 'visible' }}>
//                                                     <h6>{new Date(order.createdDate).toLocaleDateString()}</h6>
//                                                 </div>
//                                             </td>
//                                             <td className="cart__product__item" style={{ position: 'relative', overflow: 'visible' }}>
//                                                 <div className="cart__product__item__title" style={{ overflow: 'visible' }}>
//                                                     <h6>{order.username}</h6>
//                                                 </div>
//                                             </td>
//                                             <td className="cart__product__item" style={{ position: 'relative', overflow: 'visible' }}>
//                                                 <div className="cart__product__item__title" style={{ overflow: 'visible' }}>
//                                                     <h6>{order.importPrice} VND</h6>
//                                                 </div>
//                                             </td>
//                                             <td className="cart__close">
//                                                     <span
//                                                         className="icon_close"
//                                                         onClick={() => handleRemoveItem(order.id)}
//                                                         style={{ cursor: 'pointer' }}
//                                                     ></span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="checkout_product">
//                         <div className="information_cart">
//                             <div className="choose_product">
//                                 <input
//                                     className="check_product"
//                                     type="checkbox"
//                                     onChange={handleSelectAll}
//                                     checked={isAllSelected}
//                                 />
//                                 <span style={{ paddingLeft: '15px' }}>
//                                     Chọn tất cả ({importOrders.length})
//                                 </span>
//                                 <button
//                                     style={{ paddingLeft: '15px' }}
//                                     className="delete_all_product"
//                                     onClick={handleRemoveSelectedItems}
//                                 >
//                                     Xóa
//                                 </button>
//                             </div>
//                             <div className="coupon_product">
//                                 <div className="coupon_product_btn">
//                                     <FontAwesomeIcon className="ticket" icon={faTicket} /> Mã giảm giá
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             {/*</section>*/}
//         </>
//     );
// };
//
// export default ListImportOrder;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddToCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';

const ListImportOrder = () => {
    const [importOrders, setImportOrders] = useState([]); // Lưu danh sách đơn nhập hàng
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(importOrders.map(order => order.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleSelectItem = (orderId) => {
        const updatedItems = selectedItems.includes(orderId)
            ? selectedItems.filter(id => id !== orderId)
            : [...selectedItems, orderId];
        setSelectedItems(updatedItems);
        setIsAllSelected(updatedItems.length === importOrders.length);
    };

    useEffect(() => {
        const fetchImportOrders = async () => {
            try {
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
                const response = await axios.get('https://localhost:8443/api/v1/importOrder/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                const data = response.data; // Phản hồi là mảng ImportOrderDTO
                console.log("response.data");
                console.log(response.data);

                if (!data || data.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: '⚠️ Danh sách đơn nhập hàng trống.',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/import-order');
                    });
                    return;
                }

                setImportOrders(data); // Lưu mảng trực tiếp
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đơn nhập: ', error);
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi khi lấy danh sách đơn nhập!',
                    text: error.message,
                });
                //colonial_period: true // Đặt giá trị này thành true để bật tính năng in ấn
            }
        }
    }, [navigate]);

    if (!importOrders.length) {
        return <div>Đang tải...</div>;
    }

    const handleRemoveItem = (orderId) => {
        Swal.fire({
            icon: 'warning',
            title: 'Bạn có chắc chắn muốn xóa đơn nhập này không?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
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

                    await axios.post(`https://localhost:8443/api/v1/importOrder/delete`, { id: orderId }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });

                    setImportOrders(importOrders.filter(order => order.id !== orderId));
                    setSelectedItems(selectedItems.filter(id => id !== orderId));
                    setIsAllSelected(false);

                    Swal.fire({
                        icon: 'success',
                        title: '✅ Đã xóa đơn nhập hàng!',
                        confirmButtonText: 'OK',
                    });
                } catch (error) {
                    console.error('Lỗi khi xóa đơn nhập: ', error);
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Lỗi khi xóa!',
                        text: error.response?.data?.message || error.message,
                    });
                }
            }
        });
    };

    const handleRemoveSelectedItems = () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Bạn chưa chọn đơn nhập nào để xóa.',
                confirmButtonText: 'OK',
            });
            return;
        }

        Swal.fire({
            icon: 'warning',
            title: 'Bạn có chắc chắn muốn xóa các đơn nhập đã chọn?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
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

                    const query = selectedItems.map(id => `orderId=${id}`).join('&');
                    const url = `https://localhost:8443/api/v1/importOrder/remove-items?${query}`;

                    await axios.delete(url, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });

                    setImportOrders(importOrders.filter(order => !selectedItems.includes(order.id)));
                    setSelectedItems([]);
                    setIsAllSelected(false);

                    Swal.fire({
                        icon: 'success',
                        title: '✅ Đã xóa các đơn nhập hàng!',
                        confirmButtonText: 'OK',
                    });
                } catch (error) {
                    console.error('Lỗi khi xóa các đơn nhập: ', error);
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Lỗi khi xóa!',
                        text: error.response?.data?.message || error.message,
                    });
                }
            }
        });
    };

    // Hàm xử lý khi click vào ID để chuyển hướng đến trang chỉnh sửa
    const handleEditOrder = (orderId) => {
        navigate(`/edit-import-order/${orderId}`);
    };

    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/home" style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-home"></i> Trang chủ
                                </Link>
                                <span>Danh sách đơn nhập</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="shop__cart__table">
                            <table>
                                <thead>
                                <tr>
                                    <th>
                                        <input
                                            className="check_product"
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={isAllSelected}
                                        />
                                    </th>
                                    <th>ID</th>
                                    <th>Ngày nhập</th>
                                    <th>Người nhập</th>
                                    <th>Tổng tiền</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {importOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <input
                                                className="check_product"
                                                type="checkbox"
                                                checked={selectedItems.includes(order.id)}
                                                onChange={() => handleSelectItem(order.id)}
                                            />
                                        </td>
                                        <td className="cart__product__item" style={{ position: 'relative', overflow: 'visible' }}>
                                            <div className="cart__product__item__title" style={{ overflow: 'visible' }}>
                                                <h6
                                                    onClick={() => handleEditOrder(order.id)}
                                                    style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                                                >
                                                    {order.id}
                                                </h6>
                                            </div>
                                        </td>
                                        <td className="cart__product__item" style={{ position: 'relative', overflow: 'visible' }}>
                                            <div className="cart__product__item__title" style={{ overflow: 'visible' }}>
                                                <h6>{new Date(order.createdDate).toLocaleDateString()}</h6>
                                            </div>
                                        </td>
                                        <td className="cart__product__item" style={{ position: 'relative', overflow: 'visible' }}>
                                            <div className="cart__product__item__title" style={{ overflow: 'visible' }}>
                                                <h6>{order.username}</h6>
                                            </div>
                                        </td>
                                        <td className="cart__product__item" style={{ position: 'relative', overflow: 'visible' }}>
                                            <div className="cart__product__item__title" style={{ overflow: 'visible' }}>
                                                <h6>{order.importPrice} VND</h6>
                                            </div>
                                        </td>
                                        <td className="cart__close">
                                                <span
                                                    className="icon_close"
                                                    onClick={() => handleRemoveItem(order.id)}
                                                    style={{ cursor: 'pointer' }}
                                                ></span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="checkout_product">
                    <div className="information_cart">
                        <div className="choose_product">
                            <input
                                className="check_product"
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={isAllSelected}
                            />
                            <span style={{ paddingLeft: '15px' }}>
                                Chọn tất cả ({importOrders.length})
                            </span>
                            <button
                                style={{ paddingLeft: '15px' }}
                                className="delete_all_product"
                                onClick={handleRemoveSelectedItems}
                            >
                                Xóa
                            </button>
                        </div>
                        <div className="coupon_product">
                            <div className="coupon_product_btn">
                                <FontAwesomeIcon className="ticket" icon={faTicket} /> Mã giảm giá
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListImportOrder;