import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Pagination, Form, Button, Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Coupon.css';

const ListCoupon = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchCode, setSearchCode] = useState('');
    const [filterActive, setFilterActive] = useState('all'); // 'all', 'true', 'false'
    const [filterType, setFilterType] = useState('all'); // 'all', 'Giảm theo tiền', 'Giảm theo phần trăm', 'Miễn phí vận chuyển'
    const pageSize = 10;
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    useEffect(() => {
        fetchCoupons(currentPage);
    }, [currentPage]);

    // Filter coupons based on searchCode, filterActive, and filterType
    useEffect(() => {
        const filtered = coupons.filter(coupon => {
            const matchesCode = coupon.code.toLowerCase().includes(searchCode.toLowerCase());
            const matchesActive =
                filterActive === 'all' ||
                (filterActive === 'true' && coupon.active) ||
                (filterActive === 'false' && !coupon.active);
            const matchesType =
                filterType === 'all' || coupon.couponType === filterType;
            return matchesCode && matchesActive && matchesType;
        });
        setFilteredCoupons(filtered);
    }, [coupons, searchCode, filterActive, filterType]);

    const fetchCoupons = (page) => {
        const url = `https://localhost:8443/api/v1/coupons?page=${page}&size=${pageSize}`;
        console.log('Fetching coupons with URL:', url);
        console.log('Using token:', token);

        axios
            .get(url, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then(res => {
                console.log('API Response:', res.data);
                setCoupons(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            })
            .catch(err => {
                console.error('Error fetching coupons:', err.response || err);
                Swal.fire({
                    icon: 'error',
                    title: t('coupon.error_title'),
                    text: 'Failed to fetch coupons. Check console for details.',
                });
            });
    };

    const handleSearchSubmit = e => {
        e.preventDefault();
        console.log('Search submitted with code:', searchCode, 'active:', filterActive, 'type:', filterType);
        setCurrentPage(0); // Reset to first page
    };

    const handleSearchChange = e => {
        setSearchCode(e.target.value);
        setCurrentPage(0); // Reset to first page on search change
    };

    const handleActiveChange = e => {
        setFilterActive(e.target.value);
        setCurrentPage(0); // Reset to first page on filter change
    };

    const handleTypeChange = e => {
        setFilterType(e.target.value);
        setCurrentPage(0); // Reset to first page on filter change
    };

    const handleDelete = id => {
        Swal.fire({
            title: t('coupon.confirm_delete_title'),
            text: t('coupon.confirm_delete_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('coupon.confirm'),
            cancelButtonText: t('coupon.cancel'),
        }).then(result => {
            if (result.isConfirmed) {
                axios
                    .delete(`https://localhost:8443/api/v1/coupons/${id}`, {
                        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                        withCredentials: true,
                    })
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: t('coupon.success_title'),
                            text: t('coupon.delete_success'),
                        });
                        fetchCoupons(currentPage);
                    })
                    .catch(err => {
                        console.error('Error deleting coupon:', err);
                        Swal.fire({
                            icon: 'error',
                            title: t('coupon.error_title'),
                            text: t('coupon.delete_error'),
                        });
                    });
            }
        });
    };

    const handleToggleActive = (id, currentActive) => {
        Swal.fire({
            title: t('coupon.confirm_toggle_title'),
            text: t(currentActive ? 'coupon.confirm_deactivate_text' : 'coupon.confirm_activate_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('coupon.confirm'),
            cancelButtonText: t('coupon.cancel'),
        }).then(result => {
            if (result.isConfirmed) {
                axios
                    .patch(
                        `https://localhost:8443/api/v1/coupons/${id}/toggle-active?active=${!currentActive}`,
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                            withCredentials: true,
                        }
                    )
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: t('coupon.success_title'),
                            text: t(currentActive ? 'coupon.deactivate_success' : 'coupon.activate_success'),
                        });
                        fetchCoupons(currentPage);
                    })
                    .catch(err => {
                        console.error('Error toggling coupon active status:', err);
                        Swal.fire({
                            icon: 'error',
                            title: t('coupon.error_title'),
                            text: t('coupon.toggle_error'),
                        });
                    });
            }
        });
    };

    const handleEdit = id => {
        navigate(`/admin-add-coupon/${id}`);
    };

    const handleDetail = id => {
        navigate(`/admin-coupon-detail/${id}`);
    };

    const formatDate = date => new Date(date).toLocaleString('vi-VN');

    const formatVND = money => new Intl.NumberFormat('vi-VN').format(money) + ' ₫';

    return (
        <section className="list-coupon">
            <div className="container">
                <div className="card">
                    <h5 className="card-header d-flex justify-content-between align-items-center">
                        {t('coupon.list_coupon')}
                        <div className="w-50">
                            <Form onSubmit={handleSearchSubmit}>
                                <Row className="g-2 align-items-end">
                                    <Col xs={12} md={5}>
                                        <Form.Control
                                            type="text"
                                            placeholder={t('coupon.search_code')}
                                            value={searchCode}
                                            onChange={handleSearchChange}
                                        />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Select value={filterActive} onChange={handleActiveChange}>
                                            <option value="all">{t('coupon.filter_all')}</option>
                                            <option value="true">{t('coupon.active')}</option>
                                            <option value="false">{t('coupon.inactive')}</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Select value={filterType} onChange={handleTypeChange}>
                                            <option value="all">{t('coupon.filter_all')}</option>
                                            <option value="Giảm theo tiền">{t('coupon.type_fixed_amount')}</option>
                                            <option value="Giảm theo phần trăm">{t('coupon.type_percentage')}</option>
                                            <option value="Miễn phí vận chuyển">{t('coupon.type_free_shipping')}</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </h5>
                    <div className="table-responsive text-nowrap">
                        <Table className="table">
                            <thead className="table-light">
                            <tr>
                                <th>{t('coupon.id')}</th>
                                <th>{t('coupon.code')}</th>
                                <th>{t('coupon.coupon_type')}</th>
                                <th>{t('coupon.discount_value')}</th>
                                <th>{t('coupon.start_date')}</th>
                                <th>{t('coupon.end_date')}</th>
                                <th>{t('coupon.is_active')}</th>
                                <th>{t('coupon.actions')}</th>
                            </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                            {filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        {t('coupon.empty')}
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map(coupon => (
                                    <tr key={coupon.id}>
                                        <td>
                                            <a href="#" onClick={() => handleDetail(coupon.id)}>
                                                {coupon.id}
                                            </a>
                                        </td>
                                        <td>{coupon.code}</td>
                                        <td>
                                            {coupon.couponType === 'Giảm theo tiền' && (
                                                <span className="badge bg-label-info me-1">{coupon.couponType}</span>
                                            )}
                                            {coupon.couponType === 'Giảm theo phần trăm' && (
                                                <span className="badge bg-label-primary me-1">{coupon.couponType}</span>
                                            )}
                                            {coupon.couponType === 'Miễn phí vận chuyển' && (
                                                <span className="badge bg-label-success me-1">{coupon.couponType}</span>
                                            )}
                                            {coupon.couponType !== 'Giảm theo tiền' &&
                                                coupon.couponType !== 'Giảm theo phần trăm' &&
                                                coupon.couponType !== 'Miễn phí vận chuyển' && (
                                                    <span className="badge bg-label-secondary me-1">{coupon.couponType}</span>
                                                )}
                                        </td>
                                        <td>
                                            {coupon.discountValue}
                                            {coupon.couponType === 'Giảm theo phần trăm' ? '%' : ' ₫'}
                                        </td>
                                        <td>{formatDate(coupon.startDate)}</td>
                                        <td>{formatDate(coupon.endDate)}</td>
                                        <td>
                        <span
                            className={`badge me-1 ${
                                coupon.active ? 'bg-label-success' : 'bg-label-secondary'
                            }`}
                        >
                          {coupon.active ? t('coupon.active') : t('coupon.inactive')}
                        </span>
                                        </td>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="light" className="btn p-0 dropdown-toggle hide-arrow">
                                                    <i className="icon-base bx bx-dots-vertical-rounded"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleDetail(coupon.id)}>
                                                        <i className="icon-base bx bx-detail me-1"></i> {t('coupon.view_detail')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleEdit(coupon.id)}>
                                                        <i className="icon-base bx bx-edit-alt me-1"></i> {t('coupon.edit')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleDelete(coupon.id)}>
                                                        <i className="icon-base bx bx-trash me-1"></i> {t('coupon.delete')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleToggleActive(coupon.id, coupon.active)}>
                                                        <i className="icon-base bx bx-power-off me-1"></i>
                                                        {coupon.active ? t('coupon.deactivate') : t('coupon.activate')}
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </div>
                    {totalPages > 1 && (
                        <nav aria-label="Page navigation" style={{ paddingBottom: '10px' }}>
                            <ul className="pagination justify-content-center mt-3">
                                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                        previous
                                    </button>
                                </li>
                                {[...Array(totalPages).keys()].map(page => (
                                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(page)}>
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                        next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ListCoupon;