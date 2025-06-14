import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Col, Row, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Coupon.css';

const AddCoupon = () => {
    const { t } = useTranslation('translation');
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code: '',
        coupon_type_id: '',
        discount_value: '',
        start_date: new Date().toISOString().slice(0, 16),
        end_date: '',
        min_order_value: '',
        quantity: '',
        max_uses_per_user: '',
        max_discount_amount: '',
        min_product_quantity: '',
        is_active: true,
    });
    const [couponTypes, setCouponTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    // Hàm ánh xạ chuỗi couponType thành id
    const getCouponTypeId = (couponTypeName) => {
        const type = couponTypes.find(type => type.coupon_type === couponTypeName);
        return type ? type.id : '';
    };

    useEffect(() => {
        // 1. Tải couponTypes
        setLoading(true);
        axios
            .get('https://localhost:8443/api/v1/coupons/get_couponType', {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then(res => {
                setCouponTypes(res.data); // Cập nhật couponTypes
            })
            .catch(err => {
                console.error('Error fetching coupon types:', err);
                Swal.fire({
                    icon: 'error',
                    title: t('coupon.error_title'),
                    text: t('coupon.error_loading_types'),
                });
            })
            .finally(() => setLoading(false));
    }, [token, t]);

    useEffect(() => {
        // 2. Khi đã có couponTypes và có id -> lấy coupon theo id
        if (id && couponTypes.length > 0) {
            setLoading(true);
            axios
                .get(`https://localhost:8443/api/v1/coupons/${id}`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    withCredentials: true,
                })
                .then(res => {
                    const coupon = res.data;
                    setFormData({
                        code: coupon.code || '',
                        coupon_type_id: getCouponTypeId(coupon.couponType) || '',
                        discount_value: coupon.discountValue || '',
                        start_date: coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : '',
                        end_date: coupon.endDate ? new Date(coupon.endDate).toISOString().slice(0, 16) : '',
                        min_order_value: coupon.minOrderValue || '',
                        quantity: coupon.quantity || '',
                        max_uses_per_user: coupon.maxUsesPerUser || '',
                        max_discount_amount: coupon.maxDiscountAmount || '',
                        min_product_quantity: coupon.minProductQuantity || '',
                        is_active: coupon.active ?? true,
                    });
                })
                .catch(err => {
                    console.error('Error fetching coupon:', err);
                    Swal.fire({
                        icon: 'error',
                        title: t('coupon.error_title'),
                        text: t('coupon.fetch_error'),
                    });
                })
                .finally(() => setLoading(false));
        }
    }, [id, token, couponTypes]); // Đợi couponTypes có dữ liệu rồi mới chạy


    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setFormData({ ...formData, code });
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!formData.code || !formData.coupon_type_id || !formData.discount_value || !formData.start_date || !formData.end_date) {
            Swal.fire({
                icon: 'warning',
                title: t('coupon.error_title'),
                text: t('coupon.fill_required_fields'),
            });
            return;
        }

        const payload = {
            code: formData.code,
            coupon_type_id: parseInt(formData.coupon_type_id) || null,
            discount_value: parseInt(formData.discount_value) || null,
            start_date: formData.start_date,
            end_date: formData.end_date,
            min_order_value: parseInt(formData.min_order_value) || null,
            quantity: parseInt(formData.quantity) || null,
            max_uses_per_user: parseInt(formData.max_uses_per_user) || null,
            max_discount_amount: parseInt(formData.max_discount_amount) || null,
            min_product_quantity: parseInt(formData.min_product_quantity) || null,
            is_active: formData.is_active,
        };

        setLoading(true);
        const request = id
            ? axios.put(`https://localhost:8443/api/v1/coupons/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            : axios.post('https://localhost:8443/api/v1/coupons', payload, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                withCredentials: true,
            });

        request
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: t('coupon.success_title'),
                    text: id ? t('coupon.update_success') : t('coupon.create_success'),
                });
                navigate('/admin-list-coupon');
            })
            .catch(err => {
                console.error('Error saving coupon:', err);
                Swal.fire({
                    icon: 'error',
                    title: t('coupon.error_title'),
                    text: id ? t('coupon.update_error') : t('coupon.create_error'),
                });
            })
            .finally(() => setLoading(false));
    };

    const handleReset = () => {
        setFormData({
            code: '',
            coupon_type_id: '',
            discount_value: '',
            start_date: new Date().toISOString().slice(0, 16),
            end_date: '',
            min_order_value: '',
            quantity: '',
            max_uses_per_user: '',
            max_discount_amount: '',
            min_product_quantity: '',
            is_active: true,
        });
        if (id) {
            navigate('/admin-add-coupon');
        }
    };


    return (
        <section className="add-coupon">
            <div className="container">
                <h2>{id ? t('coupon.edit_coupon') : t('coupon.add_coupon')}</h2>
                {loading && <div className="text-center">{t('coupon.loading')}</div>}
                {!loading && (
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.code')}</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            placeholder={t('coupon.enter_code')}
                                            required
                                        />
                                        <Button variant="secondary" onClick={generateRandomCode}>
                                            {t('coupon.random')}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.coupon_type')}</Form.Label>
                                    <Form.Select
                                        name="coupon_type_id"
                                        value={formData.coupon_type_id}
                                        onChange={handleChange}
                                        required
                                        disabled={couponTypes.length === 0}
                                    >
                                        <option value="">{t('coupon.select_type')}</option>
                                        {couponTypes.length > 0 ? (
                                            couponTypes.map(type => (
                                                <option key={type.id} value={type.id}>
                                                    {type.coupon_type}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>
                                                {t('coupon.no_types_available')}
                                            </option>
                                        )}
                                    </Form.Select>
                                    {couponTypes.length === 0 && (
                                        <Form.Text className="text-danger">
                                            {t('coupon.error_loading_types')}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.discount_value')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="discount_value"
                                        value={formData.discount_value}
                                        onChange={handleChange}
                                        placeholder={t('coupon.enter_discount_value')}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.start_date')}</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.end_date')}</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.min_order_value')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="min_order_value"
                                        value={formData.min_order_value}
                                        onChange={handleChange}
                                        placeholder={t('coupon.enter_min_order_value')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.quantity')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder={t('coupon.enter_quantity')}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.max_uses_per_user')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="max_uses_per_user"
                                        value={formData.max_uses_per_user}
                                        onChange={handleChange}
                                        placeholder={t('coupon.enter_max_uses_per_user')}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.max_discount_amount')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="max_discount_amount"
                                        value={formData.max_discount_amount}
                                        onChange={handleChange}
                                        placeholder={t('coupon.enter_max_discount_amount')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t('coupon.min_product_quantity')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="min_product_quantity"
                                        value={formData.min_product_quantity}
                                        onChange={handleChange}
                                        placeholder={t('coupon.enter_min_product_quantity')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                name="is_active"
                                label={t('coupon.is_active')}
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="me-2" disabled={loading}>
                            {id ? t('coupon.update') : t('coupon.create')}
                        </Button>
                        <Button variant="secondary" onClick={handleReset} disabled={loading}>
                            {t('coupon.add_new')}
                        </Button>
                    </Form>
                )}
            </div>
        </section>
    );
};

export default AddCoupon;