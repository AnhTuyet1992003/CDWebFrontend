import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(9);

    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };
    // useEffect(() => {
    //     axios.get("https://localhost:8443/api/v1/products/list", { withCredentials: true })
    //         .then((response) => {
    //             setProducts(response.data);
    //         })
    //         .catch((error) => {
    //             console.error("Lỗi khi lấy sản phẩm:", error);
    //         });
    // }, []);


    useEffect(() => {
        fetchProducts(currentPage, pageSize);
    }, [currentPage, pageSize]);


    const fetchProducts = async (page, size) => {
        try {
            const res = await axios.get(`https://localhost:8443/api/v1/products/list_page?page=${page}&size=${size}`);
            setProducts(res.data.products);
            setCurrentPage(res.data.currentPage);
            setPageSize(res.data.pageSize)
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    };
    const handlePageSizeChange = (newSize) => {
        setPageSize(Number(newSize));
        setCurrentPage(0); // reset về trang đầu tiên
    };

    const handleDeleteProduct = (productId) => {
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

        Swal.fire({
            title: 'Bạn có chắc muốn xóa sản phẩm này?',
            text: "Thao tác này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://localhost:8443/api/v1/products/delete_product`, {
                    params: {
                        productId: productId
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                })
                    .then((res) => {
                        // Cập nhật lại danh sách sau khi xóa
                        setProducts(prev => prev.filter(p => p.id !== productId));

                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa sản phẩm thành công!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .catch((err) => {
                        console.error("Lỗi khi xóa sản phẩm:", err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Không thể xóa sản phẩm. Vui lòng thử lại sau.',
                        });
                    });
            }
        });
    };

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">

                <div className="card">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h5 className="card-header">Danh sách sản phẩm</h5>
                        {/* Bộ chọn số sản phẩm/trang */}
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
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
                            {products.map((product, index) => (
                                <tr key={product.id}>
                                    <td className="align-middle text-center">
                                        {/* Checkbox nếu muốn thêm sau */}
                                    </td>
                                    <td>{product.id}</td>
                                    <td>
                                        <img
                                            style={{height: "50px", width: "40px"}}
                                            src={
                                                product.image ||
                                                product.sizeColorVariants[0]?.image ||
                                                "https://via.placeholder.com/40x50"
                                            }
                                            alt="product"
                                        />
                                    </td>
                                    <td style={{maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word"}}>
                                        <p style={{margin: 0, fontSize: "12px"}}>{product.nameProduct}</p>
                                    </td>

                                    <td>{product.stock}</td>
                                    <td>
                                        <p style={{color: "red", fontWeight: "bold"}}>
                                            {formatVND(product.import_price)}
                                        </p>
                                    </td>
                                    <td>
                                        <p style={{color: "red", fontWeight: "bold"}}>
                                            {formatVND(product.price)}
                                        </p>
                                    </td>
                                    <td style={{maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word"}}>
                                        {product.sizeColorVariants.length > 0
                                            // ? (product.sizeColorVariants.map((variant, idx) => (
                                            ? product.sizeColorVariants.map((variant) => variant.color).join(", ")
                                            : "-"}
                                    </td>
                                    <td style={{maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word"}}>
                                        {product.sizeColorVariants.length > 0
                                            ? product.sizeColorVariants.map((variant) => variant.size).join(", ")
                                            : "-"}
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
                                                <a className="dropdown-item"
                                                   href={`/admin-add-product?productId=${product.id}`}>
                                                    <i className="icon-base bx bx-edit-alt me-1"></i> Chỉnh sửa
                                                </a>

                                                <a className="dropdown-item" href="#"
                                                   onClick={() => handleDeleteProduct(product.id)}>
                                                    <i className="icon-base bx bx-trash me-1"></i> Xóa
                                                </a>

                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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


                        {/* Phân trang */}
                        <nav aria-label="Page navigation">
                            <ul className="pagination pagination-sm">
                                {/* Nút Prev */}
                                <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 0}>
                                        <i className="icon-base bx bx-chevrons-left icon-xs"></i>
                                    </button>
                                </li>

                                {/* Các nút số trang */}
                                {Array.from({length: totalPages}, (_, i) => (
                                    <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(i)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}

                                {/* Nút Next */}
                                <li className={`page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}>
                                        <i className="icon-base bx bx-chevrons-right icon-xs"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>


                </div>

                <hr className="my-12"/>

            </div>
            <div className="content-backdrop fade"></div>
        </>
    );
}

export default ListProduct;
