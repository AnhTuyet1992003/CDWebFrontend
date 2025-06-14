import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Coupon.css';

const CouponDetail = () => {
    const { t } = useTranslation('translation');
    const { id } = useParams();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState(null);
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    useEffect(() => {
        axios
            .get(`https://localhost:8443/api/v1/coupons/${id}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then(res => setCoupon(res.data))
            .catch(err => {
                console.error('Error fetching coupon:', err);
                Swal.fire({
                    icon: 'error',
                    title: t('coupon.error_title'),
                    text: t('coupon.fetch_error'),
                });
            });
    }, [id, token, t]);

    const formatDate = date => new Date(date).toLocaleString('vi-VN');

    const formatVND = money => new Intl.NumberFormat('vi-VN').format(money) + ' ₫';

    const getCouponTypeName = (typeId) => {
        switch (typeId) {
            case 1: return t('coupon.type_fixed_amount');
            case 2: return t('coupon.type_percentage');
            case 3: return t('coupon.type_free_shipping');
            default: return '-';
        }
    };

    if (!coupon) {
        return <div className="text-center">{t('coupon.loading')}</div>;
    }

    return (
        <section className="coupon-detail">
            <div className="container">
                <h2>{t('coupon.coupon_detail')}</h2>
                <Card>
                    <Card.Body>
                        <Card.Title>{t('coupon.code')}: {coupon.code}</Card.Title>
                        <Card.Text>
                            <strong>{t('coupon.coupon_type')}:</strong> {coupon.couponType}<br />
                            <strong>{t('coupon.discount_value')}:</strong> {coupon.discountValue}{coupon.couponType === "Giảm theo phần trăm" ? '%' : ' ₫'}<br />
                            <strong>{t('coupon.start_date')}:</strong> {formatDate(coupon.startDate)}<br />
                            <strong>{t('coupon.end_date')}:</strong> {formatDate(coupon.endDate)}<br />
                            <strong>{t('coupon.min_order_value')}:</strong> {coupon.minOrderValue ? formatVND(coupon.minOrderValue) : '-'}<br />
                            <strong>{t('coupon.quantity')}:</strong> {coupon.quantity || '-'}<br />
                            <strong>{t('coupon.max_uses_per_user')}:</strong> {coupon.maxUsesPerUser || '-'}<br />
                            <strong>{t('coupon.max_discount_amount')}:</strong> {coupon.maxDiscountAmount ? formatVND(coupon.maxDiscountAmount) : '-'}<br />
                            <strong>{t('coupon.min_product_quantity')}:</strong> {coupon.minProductQuantity || '-'}<br />
                            <strong>{t('coupon.is_active')}:</strong> {coupon.isActive ? t('coupon.active') : t('coupon.inactive')}
                        </Card.Text>
                        <Button variant="warning" onClick={() => navigate(`/admin-add-coupon/${id}`)}>
                            {t('coupon.edit')}
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </section>
    );
};

export default CouponDetail;