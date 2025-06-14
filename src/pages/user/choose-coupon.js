import React, { useState } from 'react';
import './coupon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';

const ChooseCoupon = ({ visible, onClose, formatVND, coupons, onCouponSelect }) => {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading

    // Xử lý nhập mã coupon và xác nhận
    const handleConfirmCouponCode = async () => {
        if (!couponCode.trim()) {
            setError('Vui lòng nhập mã giảm giá');
            return;
        }

        setIsLoading(true);
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))
                ?.split('=')[1];

            const response = await axios.get(`https://localhost:8443/api/v1/coupons/code/${couponCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const coupon = response.data;
            if (coupon && (coupon.couponType === 'Giảm theo tiền' || coupon.couponType === 'Giảm theo phần trăm'|| coupon.couponType === 'Miễn phí vận chuyển')) {
                setSelectedCoupon(coupon);
                setError('');
                onCouponSelect(coupon);
            } else {
                setError('Mã giảm giá không hợp lệ hoặc không áp dụng được');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
            console.error('Lỗi khi kiểm tra mã coupon:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý chọn coupon từ danh sách
    const handleSelectCoupon = (coupon) => {
        setSelectedCoupon(coupon);
        setError('');
        onCouponSelect(coupon);
    };

    // Xử lý xác nhận và đóng modal
    const handleConfirm = () => {
        if (selectedCoupon) {
            onClose();
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa chọn mã giảm giá',
                text: 'Vui lòng chọn một mã giảm giá trước khi xác nhận',
            });
        }
    };

    return (
        visible && (
            <div className="choose_coupon">
                <div className="choose_coupon_content">
                    <div className="title">
                        <h4 style={{ fontWeight: 'bold' }}>Mã Giảm Giá</h4>
                    </div>
                    <div className="input_coupon">
                        {error && <div className="error_code_coupon">{error}</div>}
                        <div className="input__coupon">
                            <input
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Nhập mã giảm giá"
                                disabled={isLoading}
                            />
                            <div className="btn_confirm" onClick={handleConfirmCouponCode} disabled={isLoading}>
                                {isLoading ? 'Đang kiểm tra...' : 'Xác nhận'}
                            </div>
                        </div>
                    </div>
                    <div className="content_choose_coupon">

                        {coupons.length === 0 ? (
                            <div className="no_coupons_available">
                                Không có mã giảm giá nào
                            </div>
                        ) : (
                        coupons
                            .map((coupon) => (
                                <article
                                    key={coupon.id}
                                    className={`card_coupon_choose fl-left ${
                                        selectedCoupon?.id === coupon.id ? 'active' : ''
                                    }`}
                                    onClick={() => handleSelectCoupon(coupon)}
                                >
                                    {coupon.couponType === "Miễn phí vận chuyển" ? (
                                        <section className="type_coupon_choose_free_ship">
                                            <div dateTime={coupon.endDate}>
                                                <img
                                                    style={{ height: '100%', width: '100%' }}
                                                    src="https://res.cloudinary.com/dorz7ucva/image/upload/v1749220499/image_b650c1319941d5d1c2381d8866ec640c7a415455.png"
                                                    alt="coupon"
                                                />
                                                <span>{new Date(coupon.endDate).getDate()}</span>
                                                <span>{new Date(coupon.endDate).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                        </section>
                                    ) : (
                                        <section className="type_coupon_choose_discount">
                                            <div dateTime={coupon.endDate}>
                                                <img
                                                    style={{ height: '100%', width: '100%' }}
                                                    src="https://res.cloudinary.com/dorz7ucva/image/upload/v1749220508/image_b3e896e2221e1f5324cc5ad87f1e535840fc39e3.png"
                                                    alt="coupon"
                                                />
                                                <span>{new Date(coupon.endDate).getDate()}</span>
                                                <span>{new Date(coupon.endDate).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                        </section>
                                    )}

                                    <section className="card_coupon_choose-cont">
                                        <div className="content_discount">
                                            <div className="value__discount_title">
                                                {coupon.couponType === 'Giảm theo tiền' &&
                                                    `Giảm ${formatVND(coupon.discountValue)}`}
                                                {coupon.couponType === 'Giảm theo phần trăm' &&
                                                    `Giảm ${coupon.discountValue}%`}
                                                {coupon.couponType === 'Miễn phí vận chuyển' && (
                                                    <>
                                                        {`Giảm ${formatVND(coupon.discountValue)}`}
                                                        <br/>
                                                        Miễn phí vận chuyển
                                                    </>
                                                )}
                                            </div>


                                            {coupon.couponType === 'Giảm theo phần trăm' && coupon.maxDiscountAmount && (
                                                <div>
                                                    Giảm tối đa {formatVND(coupon.maxDiscountAmount)}
                                                </div>
                                            )}
                                            {coupon.minProductQuantity > 1 && (
                                                <div>
                                                    Áp dụng khi mua tối thiểu {coupon.minProductQuantity} sản phẩm
                                                </div>
                                            )}

                                            <div>Đơn tối thiểu {formatVND(coupon.minOrderValue)}</div>
                                        </div>
                                        {/*<div className="even-date">*/}
                                        {/*    <i className="fa fa-calendar"></i>*/}
                                        {/*    <time>*/}
                                        {/*        <span>Hết hạn: {new Date(coupon.endDate).toLocaleDateString()}</span>*/}
                                        {/*    </time>*/}
                                        {/*</div>*/}
                                    </section>
                                    <div className="quantity_coupon">
                                        {coupon.maxUsesPerUser - coupon.usageCount > 0 ? (
                                            <>
                                                <FontAwesomeIcon
                                                    icon={faXmark}/> {coupon.maxUsesPerUser - coupon.usageCount}
                                            </>
                                        ) : (
                                            'Hết'
                                        )}
                                    </div>

                                </article>
                            ))
                        )}
                    </div>
                    <div className="footer_choose_coupon">
                        <div className="btn_confirm" onClick={handleConfirm}>
                            Xác nhận
                        </div>
                        <div className="value_discount">
                            <div className="value_discount">
                                {selectedCoupon ? (
                                    selectedCoupon.couponType === 'Giảm theo tiền' ? `Giảm ${formatVND(selectedCoupon.discountValue)}` :
                                        selectedCoupon.couponType === 'Giảm theo phần trăm' ? `Giảm ${selectedCoupon.discountValue}%` :
                                            selectedCoupon.couponType === 'Miễn phí vận chuyển' ? `Giảm ${formatVND(selectedCoupon.discountValue)}` :
                                                'Chưa chọn mã giảm giá'
                                ) : 'Chưa chọn mã giảm giá'}


                            </div>

                        </div>
                    </div>
                    <div className="choose_coupon_content_close" onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
            </div>
        )
    );
};

export default ChooseCoupon;