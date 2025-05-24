import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import './ChooseAddressCheckout.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCartShopping, faLocationDot, faPen, faPenToSquare, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import {useTranslation} from "react-i18next";

const CheckoutChooseAddress = ({ onClose, onSelectAddress, toggleAddressForm }) => {
    const { t } = useTranslation('translation');
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
            title: t('checkout_choose_address.warning_delete_address_title'),
            text:t('checkout_choose_address.warning_delete_address_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('checkout_choose_address.btn_delete'),
            cancelButtonText: t('checkout_choose_address.btn_cancel'),
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
                    Swal.fire(t('checkout_choose_address.success_delete_address'), '', 'success');
                    // Cập nhật danh sách địa chỉ sau khi xóa
                    setAddresses(prev => prev.filter(addr => addr.id !== id));
                    setEditAddress(false)
                } else {
                    Swal.fire(t('checkout_choose_address.error_delete_address'), response.data.message, 'error');
                }
            } catch (err) {
                console.error("Lỗi xoá địa chỉ:", err);
                Swal.fire(t('checkout_choose_address.error'), '', 'error');
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
                <div className="title">{t('checkout_choose_address.title')}</div>
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
                                                    <b>{t('checkout_choose_address.name')}: </b> {address.receiverName}<br/>
                                                    <b>{t('checkout_choose_address.phone')}:</b> {address.receiverPhone}
                                                </p>
                                            </div>
                                            <div className="address">
                                                <p>
                                                    <b>{t('checkout_choose_address.address')}: </b><br/>
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
                                                <FontAwesomeIcon style={{ color: "black" }} icon={faPen} /> {t('checkout_choose_address.edit')}
                                            </div>
                                            <div
                                                className={"delete_address_btn"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAddress(address.id);
                                                    console.log("Delete:", address);
                                                }}
                                            >
                                                <FontAwesomeIcon style={{ color: "black" }} icon={faTrash} /> {t('checkout_choose_address.delete')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                <div className="btn_address">
                    <div className="add_new_address" onClick={handleAddNewAddress}>{t('checkout_choose_address.add_address')}</div>
                    <div className="confirm" onClick={handleConfirm}>{t('checkout_choose_address.btn_confirm')}</div>
                </div>
                <div className="close_ChooseAddress" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark}/>
                </div>
            </div>
        </div>
    );
};

export default CheckoutChooseAddress;
