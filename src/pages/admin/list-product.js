import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListProduct = () => {
    const [activeProducts, setActiveProducts] = useState([]);
    const [inactiveProducts, setInactiveProducts] = useState([]);
    const navigate = useNavigate();

    // State cho sản phẩm hoạt động
    const [activeCurrentPage, setActiveCurrentPage] = useState(0);
    const [activeTotalPages, setActiveTotalPages] = useState(1);
    const [activePageSize, setActivePageSize] = useState(9);

    // State cho sản phẩm không hoạt động
    const [inactiveCurrentPage, setInactiveCurrentPage] = useState(0);
    const [inactiveTotalPages, setInactiveTotalPages] = useState(1);
    const [inactivePageSize, setInactivePageSize] = useState(9);

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };

    useEffect(() => {
        fetchActiveProducts(activeCurrentPage, activePageSize);
        fetchInactiveProducts(inactiveCurrentPage, inactivePageSize);
    }, [activeCurrentPage, activePageSize, inactiveCurrentPage, inactivePageSize]);

    const fetchActiveProducts = async (page, size) => {
        try {
            const res = await axios.get(`https://localhost:8443/api/v1/products/list_page?page=${page}&size=${size}&isActive=true`, {
                withCredentials: true
            });
            setActiveProducts(res.data.products);
            setActiveCurrentPage(res.data.currentPage);
            setActivePageSize(res.data.pageSize);
            setActiveTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm hoạt động:', error);
        }
    };

    const fetchInactiveProducts = async (page, size) => {
        try {
            const res = await axios.get(`https://localhost:8443/api/v1/products/list_page?page=${page}&size=${size}&isActive=false`, {
                withCredentials: true
            });
            setInactiveProducts(res.data.products);
            setInactiveCurrentPage(res.data.currentPage);
            setInactivePageSize(res.data.pageSize);
            setInactiveTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm không hoạt động:', error);
        }
    };

    const handleActivePageSizeChange = (newSize) => {
        setActivePageSize(Number(newSize));
        setActiveCurrentPage(0); // reset về trang đầu tiên
    };

    const handleInactivePageSizeChange = (newSize) => {
        setInactivePageSize(Number(newSize));
        setInactiveCurrentPage(0); // reset về trang đầu tiên
    };

    const handleDeleteProduct = (productId, isActive) => {
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

        const newStatusText = !isActive ? 'hoạt động' : 'không hoạt động';

        Swal.fire({
            title: `Bạn có chắc muốn đổi trạng thái sản phẩm này thành ${newStatusText}?`,
            text: "Thao tác này sẽ cập nhật trạng thái của sản phẩm.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(
                    `https://localhost:8443/api/v1/products/change_active_product`,
                    null,
                    {
                        params: {
                            productId: productId,
                            active: !isActive
                        },
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                )
                    .then(() => {
                        // Gọi lại cả hai API để cập nhật danh sách
                        fetchActiveProducts(activeCurrentPage, activePageSize);
                        fetchInactiveProducts(inactiveCurrentPage, inactivePageSize);

                        Swal.fire({
                            icon: 'success',
                            title: `Đã đổi trạng thái sản phẩm thành ${newStatusText}!`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .catch((err) => {
                        console.error("Lỗi khi đổi trạng thái sản phẩm:", err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại sau.',
                        });
                    });
            }
        });
    };

    const renderProductTable = (products, isActive, currentPage, totalPages, pageSize, handlePageSizeChange, setCurrentPage) => (
        <div className="card" style={{ marginTop: isActive ? '0' : '20px' }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h5 className="card-header">
                    Danh sách sản phẩm {isActive ? "hoạt động" : "không hoạt động"}
                </h5>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                        className="form-select form-select-sm"
                    >
                        <option value="3">3 / trang</option>
                        <option value="6">6 / trang</option>
                        <option value="9">9 / trang</option>
                        <option value="12">12 / trang</option>
                    </select>
                </div>
            </div>
            <div className="table-responsive text-nowrap">
                <table className="table">
                    <thead className="table-light">
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Hình</th>
                        <th>Tên</th>
                        <th>Số lượng</th>
                        <th>Giá nhập</th>
                        <th>Giá bán</th>
                        <th>Màu sắc</th>
                        <th>Kích thước</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                    {products.map((product) => {
                        // Loại bỏ màu sắc trùng lặp
                        const uniqueColors = [...new Set(
                            product.sizeColorVariants.length > 0
                                ? product.sizeColorVariants.map((variant) => variant.color)
                                : []
                        )];
                        // Loại bỏ kích thước trùng lặp
                        const uniqueSizes = [...new Set(
                            product.sizeColorVariants.length > 0
                                ? product.sizeColorVariants.map((variant) => variant.size)
                                : []
                        )];
                        return (
                            <tr key={product.id}>
                                <td className="align-middle text-center"></td>
                                <td>{product.id}</td>
                                <td>
                                    <img
                                        style={{ height: "50px", width: "40px" }}
                                        src={
                                            product.image ||
                                            product.sizeColorVariants[0]?.image ||
                                            "https://via.placeholder.com/40x50"
                                        }
                                        alt="product"
                                    />
                                </td>
                                <td style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                    <p style={{ margin: 0, fontSize: "12px" }}>{product.nameProduct}</p>
                                </td>
                                <td>{product.stock}</td>
                                <td>
                                    <p style={{ color: "red", fontWeight: "bold" }}>
                                        {formatVND(product.import_price)}
                                    </p>
                                </td>
                                <td>
                                    <p style={{ color: "red", fontWeight: "bold" }}>
                                        {formatVND(product.price)}
                                    </p>
                                </td>
                                <td style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                    {uniqueColors.length > 0 ? uniqueColors.join(", ") : "-"}
                                </td>
                                <td style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                    {uniqueSizes.length > 0 ? uniqueSizes.join(", ") : "-"}
                                </td>
                                <td>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            className="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="icon-base bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu">
                                            <a
                                                className="dropdown-item"
                                                href={`/admin-add-product?productId=${product.id}`}
                                            >
                                                <i className="icon-base bx bx-edit-alt me-1"></i> Chỉnh sửa
                                            </a>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                                onClick={() => handleDeleteProduct(product.id, isActive)}
                                            >
                                                <i className={`icon-base bx ${isActive ? 'bx-trash' : 'bx-check'} me-1`}></i>
                                                {isActive ? 'Ngừng hoạt động' : 'Mở hoạt động'}
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "20px",
                paddingRight: "30px"
            }}>
                <nav aria-label="Page navigation">
                    <ul className="pagination pagination-sm">
                        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                <i className="icon-base bx bx-chevrons-left icon-xs"></i>
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                <i className="icon-base bx bx-chevrons-right icon-xs"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                {renderProductTable(
                    activeProducts,
                    true,
                    activeCurrentPage,
                    activeTotalPages,
                    activePageSize,
                    handleActivePageSizeChange,
                    setActiveCurrentPage
                )}
                {renderProductTable(
                    inactiveProducts,
                    false,
                    inactiveCurrentPage,
                    inactiveTotalPages,
                    inactivePageSize,
                    handleInactivePageSizeChange,
                    setInactiveCurrentPage
                )}
                <hr className="my-12" />
            </div>
            <div className="content-backdrop fade"></div>
        </>
    );
};

export default ListProduct;