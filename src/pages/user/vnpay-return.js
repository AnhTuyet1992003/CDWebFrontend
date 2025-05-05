import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const VNPayReturn = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleVNPayReturn = async () => {
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

                const response = await axios.get('https://localhost:8443/api/v1/payments/return', {
                    params: Object.fromEntries(searchParams),
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

                if (response.data.status === '00') {
                    Swal.fire({
                        icon: 'success',
                        title: '✅ Thanh toán thành công!',
                        text: response.data.message,
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate('/shop');
                        localStorage.removeItem("preparedOrder");
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Thanh toán thất bại!',
                        text: response.data.message,
                        confirmButtonText: 'Quay lại giỏ hàng',
                    }).then(() => {
                        navigate('/cart');
                    });
                }
            } catch (error) {
                console.error('Lỗi khi xử lý kết quả VNPay:', error);
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi hệ thống',
                    text: 'Không thể xác nhận trạng thái thanh toán, vui lòng thử lại sau.',
                    confirmButtonText: 'Quay lại giỏ hàng',
                }).then(() => {
                    navigate('/cart');
                });
            }
        };

        handleVNPayReturn();
    }, [navigate, searchParams]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Đang xử lý kết quả thanh toán...</h2>
        </div>
    );
};

export default VNPayReturn;