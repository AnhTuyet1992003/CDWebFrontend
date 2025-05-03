import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import './ChooseAddressCheckout.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCartShopping, faLocationDot, faXmark} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';

const CheckoutChooseAddress = ({ onClose, onSelectAddress, toggleAddressForm }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('token='))
                    ?.split('=')[1];

                const response = await axios.get('https://localhost:8443/api/v1/oders/get-shipping-address', {
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

                const response = await axios.put('https://localhost:8443/api/v1/oders/choose-shipping-address', null, {
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
                                                {address.addressDetails}<br/>
                                                {address.ward}, {address.district}, {address.province}
                                            </p>
                                        </div>
                                    </div>
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
