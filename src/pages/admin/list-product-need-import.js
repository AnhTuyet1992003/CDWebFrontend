import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListProductNeedImport = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(9);

    useEffect(() => {
        fetchProductsToRestock(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const fetchProductsToRestock = async (page, size) => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];

            if (!token) {
                throw new Error("No token found");
            }

            // Gọi API để lấy danh sách ProductSizeColorDTO
            const res = await axios.get(`https://localhost:8443/api/v1/products/getProductsWithZeroStock`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            console.log("data", res)
            const productSizeColors = res.data;

            // Lấy thông tin bổ sung (productName, sizeName, colorName)
            const enrichedProducts = await Promise.all(
                productSizeColors.map(async (psc) => {
                    try {
                        // Gọi API để lấy tên sản phẩm
                        const productRes = await axios.get(
                            `https://localhost:8443/api/v1/products/getProduct/${psc.productId}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                withCredentials: true
                            }
                        );
                        const productImage = (await axios.get(`https://localhost:8443/api/v1/products/getImageByProductSizeColorId/${psc.id}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                withCredentials: true
                            })).data;
                        const productName = productRes.data.nameProduct || "N/A";

                        // Gọi API để lấy tên kích thước và màu sắc
                        const sizeColorRes = await axios.get(
                            `https://localhost:8443/api/v1/products/getNameSizeColor/${psc.id}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                withCredentials: true
                            }
                        );
                        const sizeName = sizeColorRes.data.sizeName || "N/A";
                        console.log("id: "+psc.id)
                        console.log("product: "+psc.productId)
                        console.log("id: "+psc.id)
                        const colorName = sizeColorRes.data.colorName || "N/A";

                        return {
                            ...psc,
                            productImage,
                            productName,
                            sizeName,
                            colorName
                            // image: null // Thêm sau nếu tích hợp API lấy image
                        };
                    } catch (err) {
                        console.error(`Lỗi khi lấy thông tin cho ProductSizeColor ID ${psc.id}:`, err);
                        return {
                            ...psc,
                            productImage:"N/A",
                            productName: "N/A",
                            sizeName: "N/A",
                            colorName: "N/A"
                            // image: null
                        };
                    }
                })
            );

            // Phân trang phía client
            const startIndex = page * size;
            const paginatedProducts = enrichedProducts.slice(startIndex, startIndex + size);

            setProducts(paginatedProducts);
            setCurrentPage(page);
            setTotalPages(Math.ceil(enrichedProducts.length / size));
            setPageSize(size);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm cần nhập:', error);
            if (error.message === "No token found" || error.response?.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: '⚠️ Bạn chưa đăng nhập hoặc token hết hạn.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Không thể tải danh sách sản phẩm cần nhập.',
                });
            }
        }
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(Number(newSize));
        setCurrentPage(0); // Reset về trang đầu tiên
    };

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h5 className="card-header">Danh sách sản phẩm cần nhập</h5>
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
                                <th>Tên sản phẩm</th>
                                <th>Màu sắc</th>
                                <th>Kích thước</th>
                                <th>Số lượng</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="align-middle text-center">
                                        {/* Checkbox nếu muốn thêm sau */}
                                    </td>
                                    <td>{product.id}</td>
                                    <td>
                                        <img
                                            style={{height: "50px", width: "40px"}}
                                            src={
                                                product.productImage||
                                                "https://via.placeholder.com/40x50"
                                            }
                                            alt="product"
                                        />
                                    </td>
                                    <td style={{maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word"}}>
                                        <p style={{margin: 0, fontSize: "12px"}}>{product.productName}</p>
                                    </td>
                                    <td style={{maxWidth: "100px", whiteSpace: "normal", wordWrap: "break-word"}}>
                                        {product.colorName}
                                    </td>
                                    <td style={{ maxWidth: "100px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                        {product.sizeName}
                                    </td>
                                    <td>{product.stock}</td>
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
                                                    href={`/admin-add-product?productId=${product.productId}`}
                                                >
                                                    <i className="icon-base bx bx-edit-alt me-1"></i> Chỉnh sửa
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            marginTop: "20px",
                            paddingRight: "30px",
                        }}
                    >
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
                <hr className="my-12" />
            </div>
            <div className="content-backdrop fade"></div>
        </>
    );
};

export default ListProductNeedImport;