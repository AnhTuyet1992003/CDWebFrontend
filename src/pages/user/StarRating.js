import React, { useState, useEffect } from 'react';
import './ProductReviews.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsUp, faReply, faEdit, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';
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
    // Thêm state để lưu averageRating và totalReviews từ API
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    // Lấy danh sách đánh giá và thống kê từ API, cập nhật state comments, ratings, averageRating, totalReviews
    // Cách chạy: Gửi GET request tới API với productId, page, size và token trong header
    // Kết quả: Cập nhật comments (bình luận cha), ratings (thống kê sao), averageRating, totalReviews, totalPages, totalItems
    // Đảm bảo: Xử lý lỗi 401, ratings luôn có 5 mức sao, lấy averageRating và totalReviews từ API
    const fetchReviews = async () => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập để xem đánh giá!',
                confirmButtonText: 'OK',
            }).then(() => navigate('/login'));
            return;
        }

        try {
            const response = await axios.get(`https://localhost:8443/api/v1/reviews/product/${productId}/with-likes`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: currentPage, size: pageSize },
                withCredentials: true,
            });

            const { reviews, stats, averageRating, totalReviews, totalPages, totalItems, currentPage: responsePage } = response.data;

            // Lọc bình luận cha (không phải reply) bằng cách loại bỏ các review có id nằm trong danh sách reply
            const replyIds = new Set(reviews.flatMap(review => review.replies.map(reply => reply.id)));
            const fetchedComments = reviews
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

            // Cập nhật state với dữ liệu từ API
            setComments(fetchedComments);
            const updatedRatings = [
                { stars: 5, count: 0 },
                { stars: 4, count: 0 },
                { stars: 3, count: 0 },
                { stars: 2, count: 0 },
                { stars: 1, count: 0 },
            ];
            stats.forEach(stat => {
                const index = updatedRatings.findIndex(r => r.stars === stat.stars);
                if (index !== -1) updatedRatings[index].count = stat.total || 0;
            });
            setRatings(updatedRatings);
            setAverageRating(averageRating || 0);
            setTotalReviews(totalReviews || 0);
            setTotalPages(totalPages);
            setTotalItems(totalItems);
            setCurrentPage(responsePage);
        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.',
                    confirmButtonText: 'OK',
                }).then(() => navigate('/login'));
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi khi lấy dữ liệu đánh giá!', confirmButtonText: 'OK' });
            }
        }
    };

    // Tự động gọi fetchReviews khi productId, token hoặc currentPage thay đổi
    // Cách chạy: useEffect theo dõi các dependency, gọi fetchReviews để cập nhật dữ liệu
    // Đảm bảo: Luôn gọi lại khi cần để cập nhật averageRating và totalReviews từ API
    useEffect(() => {
        fetchReviews();
    }, [productId, token, currentPage]);

    // Chuyển đổi trang phân trang
    // Cách chạy: Nhận số trang mới, kiểm tra tính hợp lệ (0 <= page < totalPages), cập nhật currentPage
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) setCurrentPage(page);
    };

    // Gửi bình luận mới kèm rating và ảnh (nếu có)
    // Cách chạy: Kiểm tra nội dung, số sao và token, tạo FormData, gửi POST request tới API
    // Kết quả: Làm mới danh sách đánh giá, reset form nhập liệu
    const handleSubmitComment = async () => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập để gửi bình luận!',
                confirmButtonText: 'OK',
            }).then(() => navigate('/login'));
            return;
        }
        if (!comment.trim()) return Swal.fire({ icon: 'warning', title: 'Vui lòng nhập nội dung bình luận!', confirmButtonText: 'OK' });
        if (!selectedRating) return Swal.fire({ icon: 'warning', title: 'Vui lòng chọn số sao đánh giá!', confirmButtonText: 'OK' });

        try {
            const formData = new FormData();
            formData.append('comment', comment);
            formData.append('stars', selectedRating);
            formData.append('productId', productId);
            if (selectedImage) formData.append('image', selectedImage);

            await axios.post('https://localhost:8443/api/v1/reviews', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            Swal.fire({ icon: 'success', title: 'Gửi bình luận thành công!', confirmButtonText: 'OK' });
            fetchReviews();
            setComment('');
            setSelectedRating(0);
            setSelectedImage(null);
        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.',
                    confirmButtonText: 'OK',
                }).then(() => navigate('/login'));
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi khi gửi bình luận!', confirmButtonText: 'OK' });
            }
        }
    };

    // Sửa bình luận hoặc trả lời
    // Cách chạy: Kiểm tra nội dung, số sao (nếu không phải reply) và token, gửi PUT request tới API
    const handleSubmitEditComment = async (commentId, isReply) => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập để sửa bình luận!',
                confirmButtonText: 'OK',
            }).then(() => navigate('/login'));
            return;
        }
        if (!editContent.trim()) return Swal.fire({ icon: 'warning', title: 'Vui lòng nhập nội dung!', confirmButtonText: 'OK' });
        if (!isReply && !editRating) return Swal.fire({ icon: 'warning', title: 'Vui lòng chọn số sao!', confirmButtonText: 'OK' });

        try {
            await axios.put(`https://localhost:8443/api/v1/reviews/${commentId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
                params: { comment: editContent, ...(!isReply && { stars: editRating }) },
                withCredentials: true,
            });

            Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', confirmButtonText: 'OK' });
            fetchReviews();
            setEditingComment(null);
            setEditContent('');
            setEditRating(0);
        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.',
                    confirmButtonText: 'OK',
                }).then(() => navigate('/login'));
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi khi sửa bình luận!', confirmButtonText: 'OK' });
            }
        }
    };

    // Xóa bình luận hoặc trả lời
    // Cách chạy: Kiểm tra token, hiển thị xác nhận xóa, gửi DELETE request tới API nếu đồng ý
    const handleDeleteComment = async (commentId) => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập để xóa bình luận!',
                confirmButtonText: 'OK',
            }).then(() => navigate('/login'));
            return;
        }

        Swal.fire({
            icon: 'warning',
            title: 'Bạn có chắc chắn muốn xóa?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://localhost:8443/api/v1/reviews/${commentId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    });

                    Swal.fire({ icon: 'success', title: 'Xóa thành công!', confirmButtonText: 'OK' });
                    fetchReviews();
                } catch (error) {
                    if (error.response?.status === 401) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.',
                            confirmButtonText: 'OK',
                        }).then(() => navigate('/login'));
                    } else {
                        Swal.fire({ icon: 'error', title: 'Lỗi khi xóa bình luận!', confirmButtonText: 'OK' });
                    }
                }
            }
        });
    };

    // Thích hoặc bỏ thích bình luận/trả lời
    // Cách chạy: Kiểm tra token, gửi POST request tới API để toggle like, cập nhật state comments
    const handleLike = async (id, isReply = false, parentId = null) => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập để thích bình luận!',
                confirmButtonText: 'OK',
            }).then(() => navigate('/login'));
            return;
        }

        try {
            const response = await axios.post(`https://localhost:8443/api/v1/reviews/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            const { review, liked } = response.data;
            setComments(comments.map(c => {
                if (isReply && c.id === parentId) {
                    return {
                        ...c,
                        replies: c.replies.map(r => r.id === id ? { ...r, likes: review.likes, liked } : r),
                    };
                }
                return c.id === id ? { ...c, likes: review.likes, liked } : c;
            }));
        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.',
                    confirmButtonText: 'OK',
                }).then(() => navigate('/login'));
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi khi thực hiện hành động!', confirmButtonText: 'OK' });
            }
        }
    };

    // Gửi trả lời cho bình luận
    // Cách chạy: Kiểm tra nội dung trả lời và token, gửi POST request tới API với parentReviewId
    const handleSubmitReply = async (commentId) => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập để gửi trả lời!',
                confirmButtonText: 'OK',
            }).then(() => navigate('/login'));
            return;
        }
        if (!replyContent.trim()) return Swal.fire({ icon: 'warning', title: 'Vui lòng nhập nội dung trả lời!', confirmButtonText: 'OK' });

        try {
            await axios.post('https://localhost:8443/api/v1/reviews/reply', null, {
                headers: { Authorization: `Bearer ${token}` },
                params: { parentReviewId: commentId, comment: replyContent },
                withCredentials: true,
            });

            Swal.fire({ icon: 'success', title: 'Gửi trả lời thành công!', confirmButtonText: 'OK' });
            fetchReviews();
            setReplyContent('');
            setReplyingTo(null);
        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.',
                    confirmButtonText: 'OK',
                }).then(() => navigate('/login'));
            } else {
                Swal.fire({ icon: 'error', title: 'Lỗi khi gửi trả lời!', confirmButtonText: 'OK' });
            }
        }
    };

    // Định dạng ngày giờ theo chuẩn Việt Nam
    // Cách chạy: Chuyển timestamp thành chuỗi định dạng dd/mm/yyyy hh:mm:ss
    const formatDateTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    // Lấy chữ cái đầu của tên để hiển thị trong avatar
    // Cách chạy: Tách tên thành các từ, lấy chữ cái đầu, ghép lại và lấy 2 ký tự đầu tiên
    const getAvatarInitials = (name) => {
        if (!name) return '';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    };

    // Xử lý chọn sao đánh giá
    // Cách chạy: Cập nhật state selectedRating hoặc editRating khi người dùng click vào sao
    const handleStarClick = (stars) => setSelectedRating(stars);
    const handleEditStarClick = (stars) => setEditRating(stars);

    // Xử lý upload ảnh
    // Cách chạy: Lấy file ảnh từ input, cập nhật state selectedImage
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedImage(file);
    };

    // Bắt đầu chỉnh sửa bình luận hoặc trả lời
    // Cách chạy: Cập nhật state editingComment, editContent và editRating dựa trên bình luận/reply
    const handleEditComment = (comment, isReply = false) => {
        setEditingComment({ id: comment.id, isReply });
        setEditContent(comment.content);
        setEditRating(isReply ? 0 : comment.rating || 0);
    };

    // Render sao trung bình của sản phẩm
    // Cách chạy: Tạo mảng 5 sao, hiển thị sao đầy hoặc mờ dựa trên averageRating từ API
    // Đảm bảo: Luôn hiển thị 5 sao, kể cả khi averageRating = 0
    const renderStars = () => {
        const fullStars = Math.round(averageRating);
        return Array(5).fill().map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className={`star ${i < fullStars ? 'full-star' : 'faded-star'}`} />
        ));
    };

    // Render sao để người dùng chọn khi viết bình luận
    // Cách chạy: Tạo mảng 5 sao, hiển thị sao được chọn dựa trên selectedRating
    // Đảm bảo: Luôn hiển thị 5 sao để người dùng chọn
    const renderSelectionStars = () => (
        Array(5).fill().map((_, i) => (
            <FontAwesomeIcon
                key={i + 1}
                icon={faStar}
                className={`star ${selectedRating >= i + 1 ? 'selected' : ''}`}
                onClick={() => handleStarClick(i + 1)}
            />
        ))
    );

    // Render sao để người dùng chọn khi chỉnh sửa bình luận
    // Cách chạy: Tương tự renderSelectionStars, nhưng dùng editRating
    // Đảm bảo: Luôn hiển thị 5 sao trong form chỉnh sửa
    const renderEditSelectionStars = () => (
        Array(5).fill().map((_, i) => (
            <FontAwesomeIcon
                key={i + 1}
                icon={faStar}
                className={`star ${editRating >= i + 1 ? 'selected' : ''}`}
                onClick={() => handleEditStarClick(i + 1)}
            />
        ))
    );

    // Render sao cho bình luận
    // Cách chạy: Tạo mảng 5 sao, hiển thị sao đầy hoặc mờ dựa trên rating của bình luận
    // Đảm bảo: Mỗi bình luận luôn hiển thị 5 sao (đầy hoặc mờ)
    const renderCommentStars = (rating) => (
        Array(5).fill().map((_, i) => (
            <FontAwesomeIcon
                key={i + 1}
                icon={faStar}
                className={`star ${rating >= i + 1 ? 'full-star' : 'faded-star'}`}
            />
        ))
    );

    // Render sao cho thống kê đánh giá
    // Cách chạy: Tạo mảng sao đầy dựa trên số sao (stars) của từng rating
    // Đảm bảo: Hiển thị đúng số sao đầy cho mỗi mức đánh giá trong thống kê
    const renderRatingStars = (stars) => (
        Array(stars).fill().map((_, i) => (
            <FontAwesomeIcon key={i + 1} icon={faStar} className="star full-star" />
        ))
    );

    // Render phân trang
    // Cách chạy: Tạo các nút phân trang (tối đa 5), hiển thị nút Previous/Next và thông tin trang
    const renderPagination = () => {
        const maxPagesToShow = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        const pages = Array(endPage - startPage + 1).fill().map((_, i) => (
            <button
                key={startPage + i}
                onClick={() => handlePageChange(startPage + i)}
                className={`pagination-button ${startPage + i === currentPage ? 'active' : ''}`}
            >
                {startPage + i + 1}
            </button>
        ));

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