import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import './ChooseAddressCheckout.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCartShopping, faLocationDot, faPen, faPenToSquare, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';

const CheckoutChooseAddress = ({ onClose, onSelectAddress, toggleAddressForm }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedEditAddress, setEditAddress] = useState(null);
    const [editVisibleIndex, setEditVisibleIndex] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];

                const response = await axios.get('https://localhost:8443/api/v1/orders/get-shipping-address', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    const addressList = response.data.data;

                    // Tìm địa chỉ mặc định và đẩy lên đầu danh sách
                    const defaultAddress = addressList.find(address => address.default === true);
                    if (defaultAddress) {
                        // Loại bỏ địa chỉ mặc định khỏi danh sách gốc và thêm vào đầu danh sách
                        const otherAddresses = addressList.filter(address => address.default !== true);
                        const updatedAddresses = [defaultAddress, ...otherAddresses];
                        setAddresses(updatedAddresses);

                        // Set selectedIndex là địa chỉ mặc định
                        setSelectedIndex(0); // Địa chỉ mặc định giờ là phần tử đầu tiên trong danh sách
                    } else {
                        // Nếu không có địa chỉ mặc định, giữ nguyên danh sách
                        setAddresses(addressList);
                        setSelectedIndex(null); // Không có địa chỉ mặc định được chọn
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Lỗi khi lấy địa chỉ!',
                    });
                    console.error("Lỗi khi lấy địa chỉ:", response.data.message);
                }
            } catch (error) {
                console.error("Lỗi API:", error);
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi khi lấy địa chỉ!',
                });
            }
        };

        fetchAddresses();
    }, []);


// Xóa địa chỉ
    const handleDeleteAddress = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xoá địa chỉ này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        });

        if (result.isConfirmed) {
            try {
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))?.split('=')[1];

                const response = await axios.delete(`https://localhost:8443/api/v1/orders/delete-shipping-address`, {
                    params: { id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

                if (response.data.status === "success") {
                    Swal.fire('✅ Xóa thành công!', '', 'success');
                    // Cập nhật danh sách địa chỉ sau khi xóa
                    setAddresses(prev => prev.filter(addr => addr.id !== id));
                    setEditAddress(false)
                } else {
                    Swal.fire('❌ Xóa thất bại!', response.data.message, 'error');
                }
            } catch (err) {
                console.error("Lỗi xoá địa chỉ:", err);
                Swal.fire('❌ Lỗi server!', '', 'error');
            }
        }
    };




    const handleSelect = (index) => {
        setSelectedIndex(index);
    };

    const handleConfirm = async () => {
        if (selectedIndex !== null) {
            const selectedAddress = addresses[selectedIndex];
            try {
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];

                const response = await axios.put('https://localhost:8443/api/v1/orders/choose-shipping-address', null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        addressId: selectedAddress.id,
                    }
                });

                if (response.data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: '✔ Địa chỉ đã được chọn!',
                    });
                    onSelectAddress(selectedAddress);
                    onClose();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Lỗi khi chọn địa chỉ!',
                    });
                }
            } catch (error) {
                console.error("Lỗi API:", error);
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi khi chọn địa chỉ!',
                });
            }
        }
    };

    const handleAddNewAddress = () => {
        onClose();
        toggleAddressForm();
    };

    const handleEditsAddress = (address) => {
        onClose();
        toggleAddressForm(address);
    };


    return (
        <div className="ChooseAddress">
            <div className="content">
                <div className="title">Địa chỉ của bạn</div>
                <div className="address_content">
                    {addresses.map((address, index) => (
                        <div className="contain_address" key={address.id} onClick={() => handleSelect(index)}>
                            <div className="checkbox_address">
                                <input
                                    className="check_address"
                                    type="checkbox"
                                    checked={selectedIndex === index}
                                    readOnly
                                />
                            </div>
                            <div className="content_main">
                                <div className="checkout_choose_address">
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <FontAwesomeIcon style={{color: "red"}} icon={faLocationDot}/>
                                        <div style={{paddingLeft: "10px", display: "flex", flexDirection: "column"}}>
                                            <div className="name">
                                                <p>
                                                    <b>Tên người nhận: </b> {address.receiverName}<br/>
                                                    <b>Số điện thoại:</b> {address.receiverPhone}
                                                </p>
                                            </div>
                                            <div className="address">
                                                <p>
                                                    <b>Địa chỉ: </b><br/>
                                                    {address.addressDetail}<br/>
                                                    {address.ward}, {address.district}, {address.province}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <FontAwesomeIcon
                                        style={{ color: "black", cursor: "pointer" }}
                                        icon={faPenToSquare}
                                        onClick={(e) => {
                                            e.stopPropagation(); // tránh ảnh hưởng đến việc chọn địa chỉ
                                            setEditVisibleIndex(index === editVisibleIndex ? null : index);
                                        }}
                                    />

                                    {editVisibleIndex === index && (
                                        <div className={"edit_address_checkout"}>
                                            <div
                                                className={"edit_address_btn"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditsAddress(address);
                                                    console.log("Edit:", address);
                                                }}
                                            >
                                                <FontAwesomeIcon style={{ color: "black" }} icon={faPen} /> Chỉnh sửa
                                            </div>
                                            <div
                                                className={"delete_address_btn"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAddress(address.id);
                                                    console.log("Delete:", address);
                                                }}
                                            >
                                                <FontAwesomeIcon style={{ color: "black" }} icon={faTrash} /> Xóa
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                <div className="btn_address">
                    <div className="add_new_address" onClick={handleAddNewAddress}>Thêm địa chỉ mới</div>
                    <div className="confirm" onClick={handleConfirm}>Xác nhận</div>
                </div>
                <div className="close_ChooseAddress" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark}/>
                </div>
            </div>
        </div>
    );
};

export default CheckoutChooseAddress;
