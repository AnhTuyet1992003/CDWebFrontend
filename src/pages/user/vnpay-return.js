import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {useTranslation} from "react-i18next";

const VNPayReturn = () => {
    const { t } = useTranslation('translation');
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
                        title: t('login.error_login'),
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
                        title: t('vnPay_payment.success_payment'),
                        // text: response.data.message,
                        confirmButtonText: 'OK',
                    }).then(() => {

                        navigate('/order/confirmation', {
                            state: { orderId: response.data.data.id }
                        });
                        localStorage.removeItem("preparedOrder");
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: t('vnPay_payment.error_payment'),
                        // text: response.data.message,
                        confirmButtonText: t('vnPay_payment.btn_return_cart'),
                    }).then(() => {
                        navigate('/cart');
                    });
                }
            } catch (error) {
                console.error('Lỗi khi xử lý kết quả VNPay:', error);
                Swal.fire({
                    icon: 'error',
                    title: t('vnPay_payment.error_server_title'),
                    text: t('vnPay_payment.error_server_text'),
                    confirmButtonText: t('vnPay_payment.btn_return_cart'),
                }).then(() => {
                    navigate('/cart');
                });
            }
        };

        handleVNPayReturn();
    }, [navigate, searchParams]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>{ t('vnPay_payment.processing')}</h2>
        </div>
    );
};

export default VNPayReturn;