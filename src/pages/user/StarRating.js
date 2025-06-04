import React, { useState, useEffect } from 'react';
import './ProductReviews.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsUp, faReply, faImage, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ productId }) => {
    const navigate = useNavigate();
    const localStorageUsername = localStorage.getItem('username');
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    const [comment, setComment] = useState('');
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [comments, setComments] = useState([]);
    const [ratings, setRatings] = useState([
        { stars: 5, count: 0 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
    ]);
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editRating, setEditRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const totalReviews = ratings.reduce((sum, rating) => sum + rating.count, 0);
    const averageRating = totalReviews > 0 ? ratings.reduce((sum, rating) => sum + (rating.stars * rating.count), 0) / totalReviews : 0;
    const roundedAverage = Math.floor(averageRating) + (averageRating >= Math.floor(averageRating) + 0.5 ? 1 : 0);

    const handleAuthError = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.',
            confirmButtonText: 'OK',
        }).then(() => {
            localStorage.removeItem('username');
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            navigate('/login');
        });
    };

    const fetchReviews = async () => {
        if (!token) {
            handleAuthError();
            return;
        }

        try {
            const response = await axios.get(`https://localhost:8443/api/v1/reviews/product/${productId}/with-likes`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: currentPage, size: pageSize },
            });

            const data = response.data;

            const replyIds = new Set();
            data.reviews.forEach(review => {
                review.replies.forEach(reply => {
                    replyIds.add(reply.id);
                });
            });

            const fetchedComments = data.reviews
                .filter(review => !replyIds.has(review.id))
                .map(review => ({
                    id: review.id,
                    username: review.username,
                    name: review.userFullName,
                    avatar: review.avatar,
                    rating: review.stars,
                    content: review.comment,
                    image: review.image,
                    likes: review.likes,
                    liked: review.liked || false,
                    replies: review.replies.map(reply => ({
                        id: reply.id,
                        username: reply.username,
                        name: reply.userFullName,
                        content: reply.comment,
                        avatar: reply.avatar,
                        likes: reply.likes,
                        liked: reply.liked || false,
                        createdDate: reply.createdDate,
                    })),
                    createdDate: review.createdDate,
                }));

            setComments(fetchedComments);
            console.log('Fetched Comments:', fetchedComments);

            const updatedRatings = [
                { stars: 5, count: 0 },
                { stars: 4, count: 0 },
                { stars: 3, count: 0 },
                { stars: 2, count: 0 },
                { stars: 1, count: 0 },
            ];
            data.stats.forEach(stat => {
                const index = updatedRatings.findIndex(r => r.stars === stat.stars);
                if (index !== -1) {
                    updatedRatings[index].count = stat.total || 0;
                }
            });
            setRatings(updatedRatings);

            setTotalPages(data.totalPages);
            setTotalItems(data.totalItems);
            setCurrentPage(data.currentPage);
        } catch (error) {
            if (error.response?.status === 401) {
                handleAuthError();
            } else {
                console.error('Lỗi khi lấy danh sách đánh giá:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi khi lấy dữ liệu đánh giá!',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId, token, navigate, currentPage, pageSize]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-button ${i === currentPage ? 'active' : ''}`}
                >
                    {i + 1}
                </button>
            );
        }

        return (
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="pagination-button"
                >
                    Previous
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="pagination-button"
                >
                    Next
                </button>
                <span className="pagination-info">
                    Trang {currentPage + 1} / {totalPages} (Tổng: {totalItems} bình luận)
                </span>
            </div>
        );
    };

    const renderStars = () => {
        const fullStars = roundedAverage;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star full-star" />);
        }
        while (stars.length < 5) {
            stars.push(<FontAwesomeIcon key={stars.length} icon={faStar} className="star faded-star" />);
        }
        return stars;
    };

    const handleStarClick = (stars) => {
        setSelectedRating(stars);
    };

    const handleEditStarClick = (stars) => {
        setEditRating(stars);
    };

    const renderSelectionStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={`star ${selectedRating >= i ? 'selected' : ''}`}
                    onClick={() => handleStarClick(i)}
                />
            );
        }
        return stars;
    };

    const renderEditSelectionStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={`star ${editRating >= i ? 'selected' : ''}`}
                    onClick={() => handleEditStarClick(i)}
                />
            );
        }
        return stars;
    };

    const renderCommentStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={`star ${rating >= i ? 'full-star' : 'faded-star'}`}
                />
            );
        }
        return stars;
    };

    const renderRatingStars = (stars) => {
        const starIcons = [];
        for (let i = 1; i <= stars; i++) {
            starIcons.push(<FontAwesomeIcon key={i} icon={faStar} className="star full-star" />);
        }
        return starIcons;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleSubmitComment = async () => {
        if (!token) {
            handleAuthError();
            return;
        }

        if (!comment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng nhập nội dung bình luận!',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (selectedRating === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng chọn số sao đánh giá!',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('comment', comment);
            formData.append('stars', selectedRating);
            formData.append('productId', productId);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await axios.post('https://localhost:8443/api/v1/reviews', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Gửi bình luận thành công!',
                confirmButtonText: 'OK',
            });

            fetchReviews();
            setComment('');
            setSelectedRating(0);
            setSelectedImage(null);
        } catch (error) {
            if (error.response?.status === 401) {
                handleAuthError();
            } else {
                console.error('Lỗi khi gửi bình luận:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi khi gửi bình luận!',
                    text: error.response?.data || 'Có lỗi xảy ra, vui lòng thử lại!',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const handleEditComment = (comment, isReply = false) => {
        setEditingComment({ id: comment.id, isReply });
        setEditContent(comment.content);
        setEditRating(isReply ? 0 : comment.rating || 0);
    };

    const handleSubmitEditComment = async (commentId, isReply) => {
        if (!editContent.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng nhập nội dung bình luận!',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (!isReply && editRating === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng chọn số sao đánh giá!',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const params = {
                comment: editContent,
                ...(isReply ? {} : { stars: editRating }),
            };

            await axios.put(
                `https://localhost:8443/api/v1/reviews/${commentId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: params,
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Cập nhật bình luận thành công!',
                confirmButtonText: 'OK',
            });

            fetchReviews();
            setEditingComment(null);
            setEditContent('');
            setEditRating(0);
        } catch (error) {
            if (error.response?.status === 401) {
                handleAuthError();
            } else {
                console.error('Lỗi khi sửa bình luận:', error.response?.data || error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi khi sửa bình luận!',
                    text: error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại!',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        Swal.fire({
            icon: 'warning',
            title: 'Bạn có chắc chắn muốn xóa bình luận này?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://localhost:8443/api/v1/reviews/${commentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Xóa bình luận thành công!',
                        confirmButtonText: 'OK',
                    });

                    fetchReviews();
                } catch (error) {
                    if (error.response?.status === 401) {
                        handleAuthError();
                    } else {
                        console.error('Lỗi khi xóa bình luận:', error.response?.data || error.message);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi khi xóa bình luận!',
                            text: error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại!',
                            confirmButtonText: 'OK',
                        });
                    }
                }
            }
        });
    };

    const handleLike = async (id, isReply = false, parentId = null) => {
        if (!token) {
            handleAuthError();
            return;
        }

        try {
            const response = await axios.post(`https://localhost:8443/api/v1/reviews/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { review, liked } = response.data;

            if (isReply) {
                setComments(comments.map(c => {
                    if (c.id === parentId) {
                        return {
                            ...c,
                            replies: c.replies.map(r =>
                                r.id === id ? { ...r, likes: review.likes, liked } : r
                            ),
                        };
                    }
                    return c;
                }));
            } else {
                setComments(comments.map(c =>
                    c.id === id ? { ...c, likes: review.likes, liked } : c
                ));
            }
        } catch (error) {
            if (error.response?.status === 401) {
                handleAuthError();
            } else {
                console.error('Lỗi khi toggle like/unlike:', error.response?.data || error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi khi thực hiện hành động!',
                    text: error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại!',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const handleSubmitReply = async (commentId) => {
        if (!token) {
            handleAuthError();
            return;
        }

        if (!replyContent.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng nhập nội dung trả lời!',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            await axios.post('https://localhost:8443/api/v1/reviews/reply', null, {
                headers: { Authorization: `Bearer ${token}` },
                params: { parentReviewId: commentId, comment: replyContent },
            });

            Swal.fire({
                icon: 'success',
                title: 'Gửi trả lời thành công!',
                confirmButtonText: 'OK',
            });

            fetchReviews();
            setReplyContent('');
            setReplyingTo(null);
        } catch (error) {
            if (error.response?.status === 401) {
                handleAuthError();
            } else {
                console.error('Lỗi khi gửi trả lời:', error.response?.data || error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi khi gửi trả lời!',
                    text: error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại!',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getAvatarInitials = (name) => {
        if (!name) return '';
        const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
        return initials.substring(0, 2);
    };

    return (
        <div className="product_review">
            <div className="star_rating">
                <div className="star_product">
                    <div>{averageRating.toFixed(1)}/5</div>
                    <div className="average-stars">{renderStars()}</div>
                    <div>{totalReviews} đánh giá</div>
                </div>
                <div className="star_rating_content">
                    <div className="rating-container">
                        {ratings.map((rating) => {
                            const percentage = totalReviews > 0 ? (rating.count / totalReviews) * 100 : 0;
                            return (
                                <div key={rating.stars} className="rating-row">
                                    <span className="star-label">
                                        <span className="star-label-text">{rating.stars}</span>
                                        <span className="star-label-icons">{renderRatingStars(rating.stars)}</span>
                                    </span>
                                    <div className="bar-container">
                                        <div className="filled-bar" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="count-label">({rating.count})</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div>
                <div className="comment-section full-width">
                    <label className="comment-label">Viết bình luận của bạn</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                        rows="4"
                    />
                    <div className="image-upload-section">
                        <label className="image-upload-label">
                            <FontAwesomeIcon icon={faImage} className="image-upload-icon" />
                            <span>Thêm ảnh</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </label>
                        {selectedImage && (
                            <div className="image-preview">
                                <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                                <button onClick={() => setSelectedImage(null)} className="remove-image-button">Xóa</button>
                            </div>
                        )}
                    </div>
                    <div className="star-selection-wrapper">
                        <label className="rating-label">Chọn số sao</label>
                        <div className="star-selection">
                            {renderSelectionStars()}
                        </div>
                    </div>
                    <button onClick={handleSubmitComment}>Gửi bình luận</button>
                </div>
                <div className="comments-display full-width">
                    <h3>Bình luận ({totalItems})</h3>
                    {comments.map((c) => (
                        <div key={c.id} className="comment">
                            {editingComment && editingComment.id === c.id && !editingComment.isReply ? (
                                <div className="edit-section">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        placeholder="Chỉnh sửa bình luận của bạn..."
                                        rows="4"
                                    />
                                    <div className="star-selection-wrapper">
                                        <label className="rating-label">Chọn số sao</label>
                                        <div className="star-selection">
                                            {renderEditSelectionStars()}
                                        </div>
                                    </div>
                                    <div className="edit-actions">
                                        <p className="comment-date">Ngày tạo: {formatDateTime(c.createdDate)}</p>
                                        <button onClick={() => handleSubmitEditComment(c.id, false)} className="save-edit-button">Lưu</button>
                                        <button onClick={() => setEditingComment(null)} className="cancel-edit-button">Hủy</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="comment-header">
                                        <div className="avatar">
                                            {c.avatar ? (
                                                <img src={c.avatar} alt={`${c.name}'s avatar`} className="avatar-image" />
                                            ) : (
                                                getAvatarInitials(c.name)
                                            )}
                                        </div>
                                        <span className="comment-name">{c.name}</span>
                                        <div className="comment-stars">{renderCommentStars(c.rating)}</div>
                                    </div>
                                    <p className="comment-content">{c.content}</p>
                                    {c.image && (
                                        <div className="comment-content-image">
                                            <img src={c.image} alt="Comment image" />
                                        </div>
                                    )}
                                    <p className="comment-date">{formatDateTime(c.createdDate)}</p>
                                    <div className="comment-actions">
                                        <button onClick={() => handleLike(c.id)} className={`like-button ${c.liked ? 'liked' : ''}`}>
                                            <FontAwesomeIcon icon={faThumbsUp} /> {c.likes} Like
                                        </button>
                                        <button onClick={() => setReplyingTo(c.id)} className="reply-button">
                                            <FontAwesomeIcon icon={faReply} /> Trả lời
                                        </button>
                                        {localStorageUsername && localStorageUsername === c.username && (
                                            <>
                                                <button onClick={() => handleEditComment(c)} className="edit-button">
                                                    <FontAwesomeIcon icon={faEdit} /> Sửa
                                                </button>
                                                <button onClick={() => handleDeleteComment(c.id)} className="delete-button">
                                                    <FontAwesomeIcon icon={faTrash} /> Xóa
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {replyingTo === c.id && (
                                        <div className="reply-section">
                                            <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Nhập câu trả lời của bạn..."
                                                rows="2"
                                            />
                                            <div className="reply-actions">
                                                <button onClick={() => handleSubmitReply(c.id)} className="submit-reply-button">Gửi trả lời</button>
                                                <button onClick={() => setReplyingTo(null)} className="cancel-reply-button">Hủy</button>
                                            </div>
                                        </div>
                                    )}
                                    {c.replies.length > 0 && (
                                        <div className="replies">
                                            {c.replies.map((reply) => (
                                                <div key={reply.id} className="reply">
                                                    {editingComment && editingComment.id === reply.id && editingComment.isReply ? (
                                                        <div className="edit-section">
                                                            <textarea
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                placeholder="Chỉnh sửa trả lời của bạn..."
                                                                rows="2"
                                                            />
                                                            <div className="edit-actions">
                                                                <p className="comment-date">Ngày tạo: {formatDateTime(reply.createdDate)}</p>
                                                                <button onClick={() => handleSubmitEditComment(reply.id, true)} className="save-edit-button">Lưu</button>
                                                                <button onClick={() => setEditingComment(null)} className="cancel-edit-button">Hủy</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="reply-header">
                                                                <div className="avatar">
                                                                    {reply.avatar ? (
                                                                        <img src={reply.avatar} alt={`${reply.name}'s avatar`} className="avatar-image" />
                                                                    ) : (
                                                                        getAvatarInitials(reply.name)
                                                                    )}
                                                                </div>
                                                                <span className="reply-name">{reply.name}</span>
                                                            </div>
                                                            <span className="reply-content">{reply.content}</span>
                                                            <p className="comment-date">{formatDateTime(reply.createdDate)}</p>
                                                            <div className="reply-actions">
                                                                <button onClick={() => handleLike(reply.id, true, c.id)} className={`like-button ${reply.liked ? 'liked' : ''}`}>
                                                                    <FontAwesomeIcon icon={faThumbsUp} /> {reply.likes} Like
                                                                </button>
                                                                {localStorageUsername && localStorageUsername === reply.username && (
                                                                    <>
                                                                        <button onClick={() => handleEditComment(reply, true)} className="edit-button">
                                                                            <FontAwesomeIcon icon={faEdit} /> Sửa
                                                                        </button>
                                                                        <button onClick={() => handleDeleteComment(reply.id)} className="delete-reply-button">
                                                                            <FontAwesomeIcon icon={faTrash} /> Xóa
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                    {totalPages > 1 && renderPagination()}
                </div>
            </div>
        </div>
    );
};

export default StarRating;