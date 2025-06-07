import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './coupon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Coupon = () => {
    const [freeShipCoupons, setFreeShipCoupons] = useState([]);
    const [discountCoupons, setDiscountCoupons] = useState([]);
    const [couponStatus, setCouponStatus] = useState({}); // Lưu trạng thái hasCoupon cho mỗi coupon

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + ' ₫';
    };

    const fetchCoupons = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))
                ?.split('=')[1];

            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Vui lòng đăng nhập để tiếp tục',
                    confirmButtonText: 'OK',
                });
                return;
            }

            // Gọi cả hai API lấy danh sách coupon
            const [responseType3, responseType12] = await Promise.all([
                axios.get('https://localhost:8443/api/v1/coupons/type/3', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }),
                axios.get('https://localhost:8443/api/v1/coupons/type/1-2', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }),
            ]);

            const freeShip = responseType3.data || [];
            const discounts = responseType12.data || [];

            // Kiểm tra trạng thái hasCoupon cho từng coupon
            const statusPromises = [...freeShip, ...discounts].map(coupon =>
                axios.get(`https://localhost:8443/api/v1/coupons/user/has?couponCode=${encodeURIComponent(coupon.code)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }).then(response => ({ code: coupon.code, hasCoupon: response.data }))
            );

            const statuses = await Promise.all(statusPromises);
            const statusMap = statuses.reduce((acc, { code, hasCoupon }) => ({ ...acc, [code]: hasCoupon }), {});

            setFreeShipCoupons(freeShip);
            setDiscountCoupons(discounts);
            setCouponStatus(statusMap);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách coupon:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể lấy danh sách mã giảm giá',
            });
            setFreeShipCoupons([]);
            setDiscountCoupons([]);
            setCouponStatus({});
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSaveCoupon = async (coupon) => {
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))
                ?.split('=')[1];

            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Vui lòng đăng nhập',
                    confirmButtonText: 'OK',
                });
                return;
            }

            // Gọi API lưu coupon
            await axios.post(
                `https://localhost:8443/api/v1/coupons/user/save?couponCode=${encodeURIComponent(coupon.code)}`,
                null,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: `Mã ${coupon.code} đã được lưu!`,
            });

            // Cập nhật trạng thái hasCoupon
            setCouponStatus(prev => ({ ...prev, [coupon.code]: true }));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.response?.data?.message || 'Không thể lưu mã giảm giá',
            });
        }
    };

    const renderCoupon = (coupon) => {
        const hasCoupon = couponStatus[coupon.code] || false;
        return (
            <article key={coupon.id} className="card_coupon">
                <section
                    className={
                        coupon.couponType === 'Miễn phí vận chuyển'
                            ? 'type_coupon_free_ship'
                            : 'type_coupon_discount'
                    }
                >
                    <div dateTime={coupon.endDate}>
                        <img
                            style={{ height: '100%', width: '100%' }}
                            src={
                                coupon.couponType === 'Miễn phí vận chuyển'
                                    ? 'https://res.cloudinary.com/dorz7ucva/image/upload/v1749220499/image_b650c1319941d5d1c2381d8866ec640c7a415455.png'
                                    : 'https://res.cloudinary.com/dorz7ucva/image/upload/v1749220508/image_b3e896e2221e1f5324cc5ad87f1e535840fc39e3.png'
                            }
                            alt="coupon"
                        />
                        <span>{new Date(coupon.endDate).getDate()}</span>
                        <span>
              {new Date(coupon.endDate).toLocaleString('default', {
                  month: 'short',
              })}
            </span>
                    </div>
                </section>
                <section className="card_coupon-cont">
                    <h3>
                        {coupon.couponType === 'Miễn phí vận chuyển'
                            ? 'Miễn phí vận chuyển'
                            : coupon.couponType === 'Giảm theo tiền'
                                ? `Giảm ${formatVND(coupon.discountValue)}`
                                : `Giảm ${coupon.discountValue}%`}
                    </h3>
                    {coupon.maxDiscountAmount && (
                        <small>Giảm tối đa {formatVND(coupon.maxDiscountAmount)}</small>
                    )}
                    {coupon.minProductQuantity > 1 && (
                        <small>
                            Áp dụng khi mua tối thiểu {coupon.minProductQuantity} sản phẩm
                        </small>
                    )}
                    <small>Đơn tối thiểu {formatVND(coupon.minOrderValue)}</small>
                    <div className="even-date">
                        <FontAwesomeIcon icon={faCalendar}/>
                        <time>
                          <span>
                            Hết hạn: {new Date(coupon.endDate).toLocaleDateString('vi-VN')}
                          </span>
                        </time>
                    </div>
                    <a
                        className={hasCoupon ? 'disabled' : ''}
                        onClick={hasCoupon ? undefined : () => handleSaveCoupon(coupon)}
                        style={{color: "white"}}
                    >
                        {hasCoupon ? 'Đã sở hữu' : 'Lưu'}
                    </a>
                    <div className="quantity_coupon">
                        {coupon.quantity > 0 ? (
                            <>
                                <FontAwesomeIcon icon={faXmark}/> {coupon.quantity}
                            </>
                        ) : (
                            'Hết'
                        )}
                    </div>

                </section>
            </article>
        );
    };

    return (
        <section className="coupon_container">
            <h1>Mã Giảm Giá</h1>
            <div className="coupon_row">
                {discountCoupons.length > 0 ? (
                    discountCoupons.map(renderCoupon)
                ) : (
                    <p>Không có mã giảm giá nào</p>
                )}
            </div>

            <h1 style={{ marginTop: '30px' }}>Mã Freeship</h1>
            <div className="coupon_row">
                {freeShipCoupons.length > 0 ? (
                    freeShipCoupons.map(renderCoupon)
                ) : (
                    <p>Không có mã miễn phí vận chuyển nào</p>
                )}
            </div>
        </section>
    );
};

export default Coupon;