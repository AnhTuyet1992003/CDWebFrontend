// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './import-order.css';
// import { debounce } from 'lodash';
// import Swal from 'sweetalert2';
//
// // Component quản lý form chỉnh sửa đơn nhập hàng
// const EditImportOrder = () => {
//     const { id } = useParams(); // Lấy id từ URL
//
//     // State lưu dữ liệu form
//     const [formData, setFormData] = useState({
//         username: '',
//         importPrice: 0,
//         products: [], // Mặc định không có sản phẩm
//     });
//
//     // State lưu lỗi validate
//     const [errors, setErrors] = useState({});
//
//     // State lưu thông báo lỗi hoặc thành công
//     const [message, setMessage] = useState('');
//
//     // State cho ô tìm kiếm sản phẩm
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//
//     // State lưu danh sách màu và kích thước theo productId
//     const [colors, setColors] = useState({});
//     const [sizes, setSizes] = useState({});
//
//     // Lấy dữ liệu đơn nhập hàng khi component được mount
//     useEffect(() => {
//         const fetchImportOrder = async () => {
//             try {
//                 const token = document.cookie
//                     .split('; ')
//                     .find((row) => row.startsWith('token='))
//                     ?.split('=')[1];
//                 if (!token) {
//                     setMessage('Vui lòng đăng nhập lại.');
//                     return;
//                 }
//
//                 const response = await axios.get(`https://localhost:8443/api/v1/importOrder/get-import-order/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//
//                 const importOrder = response.data;
//                 console.log('Import Order Data:', importOrder);
//
//                 // Lấy thông tin sản phẩm chi tiết từ product_size_colorId
//                 const products = await Promise.all(
//                     importOrder.products.map(async (product) => {
//                         try {
//                             const productSizeColorResponse = await axios.get(
//                                 `https://localhost:8443/api/v1/products/getNameSizeColor/${product.product_size_colorId}`,
//                                 { headers: { Authorization: `Bearer ${token}` } }
//                             );
//                             const productSizeColor = productSizeColorResponse.data;
//                             console.log("productSizeColor: "+productSizeColorResponse.data)
//
//
//                             const productSizeColorResponse2 = await axios.get(
//                                 `https://localhost:8443/api/v1/products/getProductSizeColor/${product.product_size_colorId}`,
//                                 { headers: { Authorization: `Bearer ${token}` } }
//                             );
//                             const productSizeColor2 = productSizeColorResponse2.data;
//
//                             console.log("productSizeColor2: "+productSizeColorResponse2.data)
//                             // Lấy thông tin sản phẩm từ productId
//                             const productResponse = await axios.get(
//                                 `https://localhost:8443/api/v1/products/getProduct/${productSizeColor2.productId}`,
//                                 { headers: { Authorization: `Bearer ${token}` } }
//                             );
//                             const productData = productResponse.data;
//                             console.log("product: "+ productData.id)
//
//                             // Lấy danh sách màu và kích thước
//                             await fetchColorsAndSizes(productData.id);
//
//                             return {
//                                 productId: product.productId || productData.productId || null,
//                                 product_size_colorId: product.product_size_colorId,
//                                 nameProduct: productData.nameProduct || '',
//                                 color: productSizeColor.colorName,
//                                 size: productSizeColor.sizeName,
//                                 quantity: product.quantity,
//                                 price: product.price,
//                             };
//                         } catch (error) {
//                             console.error('Error fetching product details:', error);
//                             return null;
//                         }
//                     })
//                 );
//
//                 // Lọc bỏ các sản phẩm lỗi (null)
//                 const validProducts = products.filter((p) => p !== null);
//
//                 setFormData({
//                     username: importOrder.username || localStorage.getItem('username') || 'Unknown',
//                     importPrice: importOrder.importPrice || 0,
//                     products: validProducts,
//                 });
//             } catch (error) {
//                 console.error('Error fetching import order:', error);
//                 if (error.response) {
//                     setMessage(
//                         error.response.status === 401
//                             ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
//                             : error.response.data?.message || 'Không thể tải đơn nhập hàng.'
//                     );
//                 } else {
//                     setMessage('Lỗi kết nối server. Vui lòng thử lại.');
//                 }
//             }
//         };
//
//         fetchImportOrder();
//     }, [id]);
//
//     // Tính tổng importPrice khi danh sách sản phẩm thay đổi
//     useEffect(() => {
//         const totalPrice = formData.products.reduce((total, product) => {
//             const quantity = parseInt(product.quantity) || 0;
//             const price = parseInt(product.price) || 0;
//             return total + quantity * price;
//         }, 0);
//         setFormData((prev) => ({ ...prev, importPrice: totalPrice }));
//     }, [formData.products]);
//
//     // Tìm kiếm sản phẩm khi nhập từ khóa
//     useEffect(() => {
//         if (searchTerm.trim() === '') {
//             setSearchResults([]);
//             setShowDropdown(false);
//             setMessage('');
//             return;
//         }
//         const fetchProducts = async () => {
//             try {
//                 const token = document.cookie
//                     .split('; ')
//                     .find((row) => row.startsWith('token='))
//                     ?.split('=')[1];
//                 if (!token) {
//                     setMessage('Vui lòng đăng nhập lại.');
//                     setSearchResults([]);
//                     setShowDropdown(false);
//                     return;
//                 }
//                 const response = await axios.get(
//                     `https://localhost:8443/api/v1/products/getProductName/${encodeURIComponent(searchTerm)}`,
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }
//                 );
//                 const results = Array.isArray(response.data) ? response.data : [];
//                 setSearchResults(results);
//                 setShowDropdown(results.length > 0);
//                 setMessage(results.length === 0 ? 'Không tìm thấy sản phẩm.' : '');
//             } catch (error) {
//                 console.error('Lỗi khi tìm kiếm sản phẩm:', error);
//                 setSearchResults([]);
//                 setShowDropdown(false);
//                 if (error.response) {
//                     setMessage(
//                         error.response.status === 401
//                             ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
//                             : error.response.data?.message || 'Không tìm thấy sản phẩm.'
//                     );
//                 } else {
//                     setMessage('Lỗi kết nối server. Vui lòng thử lại.');
//                 }
//             }
//         };
//
//         const debouncedFetch = setTimeout(fetchProducts, 300);
//         return () => clearTimeout(debouncedFetch);
//     }, [searchTerm]);
//
//     // Lấy danh sách màu và kích thước khi chọn sản phẩm
//     const fetchColorsAndSizes = async (productId) => {
//         try {
//             const token = document.cookie
//                 .split('; ')
//                 .find((row) => row.startsWith('token='))
//                 ?.split('=')[1];
//             if (!token) {
//                 setMessage('Vui lòng đăng nhập lại.');
//                 return;
//             }
//             if (!productId || isNaN(productId)) {
//                 setMessage('ID sản phẩm không hợp lệ.');
//                 return;
//             }
//
//             // Lấy danh sách màu
//             const colorResponse = await axios.get(`https://localhost:8443/api/v1/products/getListColor/${Number(productId)}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const colorData = Array.isArray(colorResponse.data) ? colorResponse.data : [];
//             setColors((prev) => ({ ...prev, [productId]: colorData }));
//
//             // Lấy danh sách kích thước
//             const sizeResponse = await axios.get(`https://localhost:8443/api/v1/products/getListSize/${Number(productId)}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const sizeData = Array.isArray(sizeResponse.data) ? sizeResponse.data : [];
//             setSizes((prev) => ({ ...prev, [productId]: sizeData }));
//         } catch (error) {
//             console.error('Lỗi khi lấy màu/kích thước:', error);
//             setMessage('Lỗi khi lấy thông tin màu hoặc kích thước.');
//         }
//     };
//
//     // Lấy product_size_colorId dựa trên productId, colorId, sizeId
//     const fetchProductSizeColorId = async (productId, colorId, sizeId) => {
//         try {
//             const token = document.cookie
//                 .split('; ')
//                 .find((row) => row.startsWith('token='))
//                 ?.split('=')[1];
//             if (!token) {
//                 setMessage('Vui lòng đăng nhập lại.');
//                 return null;
//             }
//             const response = await axios.get(
//                 `https://localhost:8443/api/v1/products/getIdProductSizeColor?productId=${productId}&colorId=${colorId}&sizeId=${sizeId}`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//             return response.data;
//         } catch (error) {
//             console.error('Lỗi khi lấy product_size_colorId:', error);
//             setMessage('Lỗi khi lấy ID tổ hợp sản phẩm.');
//             return null;
//         }
//     };
//
//     const handleProductChange = async (index, field, value) => {
//         const newProducts = [...formData.products];
//         newProducts[index][field] = value;
//
//         if (field === 'color' || field === 'size') {
//             const product = newProducts[index];
//             const productId = product.productId;
//
//             if (!colors[productId] || !sizes[productId]) {
//                 setErrors((prev) => ({
//                     ...prev,
//                     products: {
//                         ...prev.products,
//                         [index]: {
//                             ...prev.products?.[index],
//                             [field]: `Vui lòng chờ tải danh sách ${field === 'color' ? 'màu sắc' : 'kích thước'}.`,
//                         },
//                     },
//                 }));
//                 setFormData({ ...formData, products: newProducts });
//                 return;
//             }
//
//             const color = colors[productId].find((c) => c.name === product.color);
//             const size = sizes[productId].find((s) => s.name === product.size);
//
//             if (!color?.id || !size?.size_id) {
//                 newProducts[index].product_size_colorId = '';
//                 setErrors((prev) => ({
//                     ...prev,
//                     products: {
//                         ...prev.products,
//                         [index]: {
//                             ...prev.products?.[index],
//                             product_size_colorId: `Vui lòng chọn ${!color?.id ? 'màu sắc' : 'kích thước'} hợp lệ.`,
//                         },
//                     },
//                 }));
//             } else {
//                 const productSizeColorId = await fetchProductSizeColorId(productId, color.id, size.size_id);
//                 if (productSizeColorId) {
//                     newProducts[index].product_size_colorId = productSizeColorId;
//                     setErrors((prev) => ({
//                         ...prev,
//                         products: {
//                             ...prev.products,
//                             [index]: {
//                                 ...prev.products?.[index],
//                                 product_size_colorId: undefined,
//                             },
//                         },
//                     }));
//                 } else {
//                     newProducts[index].product_size_colorId = '';
//                     setErrors((prev) => ({
//                         ...prev,
//                         products: {
//                             ...prev.products,
//                             [index]: {
//                                 ...prev.products?.[index],
//                                 product_size_colorId: 'Không tìm thấy tổ hợp sản phẩm.',
//                             },
//                         },
//                     }));
//                 }
//             }
//         }
//
//         setFormData({ ...formData, products: newProducts });
//     };
//
//     // Thêm sản phẩm vào bảng khi chọn từ dropdown tìm kiếm
//     const selectProduct = async (product) => {
//         const productId = product.id || product.productId;
//         if (!productId) {
//             setMessage('Không tìm thấy ID sản phẩm.');
//             return;
//         }
//         await fetchColorsAndSizes(productId);
//         setFormData({
//             ...formData,
//             products: [
//                 ...formData.products,
//                 {
//                     productId: productId,
//                     product_size_colorId: '',
//                     nameProduct: product.nameProduct || product.name || '',
//                     color: '',
//                     size: '',
//                     quantity: '1',
//                     price: product.import_price || product.importPrice || product.price || '',
//                 },
//             ],
//         });
//         setSearchTerm('');
//         setShowDropdown(false);
//         setMessage('');
//     };
//
//     // Xóa sản phẩm khỏi bảng
//     const removeProduct = (index) => {
//         const newProducts = formData.products.filter((_, i) => i !== index);
//         setFormData({ ...formData, products: newProducts });
//     };
//
//     // Validate form trước khi gửi
//     const validateForm = () => {
//         const newErrors = {};
//         if (formData.products.length === 0) {
//             newErrors.products = 'Vui lòng thêm ít nhất một sản phẩm.';
//             return newErrors;
//         }
//
//         const productErrors = formData.products.map((product, index) => {
//             const errors = {};
//             if (!product.product_size_colorId || isNaN(product.product_size_colorId) || parseInt(product.product_size_colorId) <= 0) {
//                 errors.product_size_colorId = 'Vui lòng chọn màu và kích thước hợp lệ.';
//             }
//             if (!product.quantity || isNaN(product.quantity) || parseInt(product.quantity) <= 0) {
//                 errors.quantity = 'Vui lòng nhập số lượng hợp lệ (số dương).';
//             }
//             if (!product.price || isNaN(product.price) || parseInt(product.price) <= 0) {
//                 errors.price = 'Vui lòng nhập giá hợp lệ (số dương).';
//             }
//             if (!product.color) {
//                 errors.color = 'Vui lòng chọn màu sắc.';
//             }
//             if (!product.size) {
//                 errors.size = 'Vui lòng chọn kích thước.';
//             }
//             return errors;
//         });
//
//         const hasProductErrors = productErrors.some((err) => Object.keys(err).length > 0);
//         if (hasProductErrors) {
//             newErrors.products = productErrors;
//         }
//         return newErrors;
//     };
//
//     const username = localStorage.getItem('username') || 'Unknown';
//
//     // Xử lý gửi form
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validationErrors = validateForm();
//         setErrors(validationErrors);
//
//         if (Object.keys(validationErrors).length === 0) {
//             const payload = {
//                 id: parseInt(id), // Thêm id của đơn nhập hàng
//                 username: username,
//                 importPrice: parseInt(formData.importPrice) || 0,
//                 products: formData.products.map((p) => ({
//                     product_size_colorId: parseInt(p.product_size_colorId) || null,
//                     quantity: parseInt(p.quantity) || 0,
//                     price: parseInt(p.price) || 0,
//                 })),
//             };
//             const token = document.cookie
//                 .split('; ')
//                 .find((row) => row.startsWith('token='))
//                 ?.split('=')[1];
//             if (!token) {
//                 setMessage('Vui lòng đăng nhập lại.');
//                 return;
//             }
//
//             try {
//                 const res = await axios.post(`https://localhost:8443/api/v1/importOrder/update`, payload, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 Swal.fire({
//                     icon: 'success',
//                     title: '✅ Cập nhật đơn hàng thành công!',
//                     showConfirmButton: false,
//                     timer: 1500,
//                 });
//                 setFormData({
//                     username: '',
//                     importPrice: 0,
//                     products: [],
//                 });
//                 setMessage('');
//                 setErrors({});
//                 setColors({});
//                 setSizes({});
//             } catch (error) {
//                 Swal.fire('Lỗi!', 'Lỗi khi cập nhật đơn hàng!', 'error');
//                 console.error('Lỗi:', error);
//                 if (error.response) {
//                     const { status, data } = error.response;
//                     if (status === 400) {
//                         setMessage(
//                             Array.isArray(data)
//                                 ? data.join(', ')
//                                 : typeof data === 'string'
//                                     ? data
//                                     : data?.error || data?.message || 'Dữ liệu không hợp lệ.'
//                         );
//                     } else if (status === 401) {
//                         setMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
//                     } else {
//                         setMessage('Lỗi khi cập nhật đơn hàng. Vui lòng thử lại.');
//                     }
//                 } else {
//                     setMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
//                 }
//             }
//         }
//     };
//
//     // Xử lý hủy form
//     const handleCancel = () => {
//         setFormData({
//             username: '',
//             importPrice: 0,
//             products: [],
//         });
//         setErrors({});
//         setMessage('');
//         setSearchTerm('');
//         setShowDropdown(false);
//         setColors({});
//         setSizes({});
//     };
//
//     // Giao diện form
//     return (
//         <div className="containerEdit light-style flex-grow-1 container-p-y">
//             {/* Ô tìm kiếm sản phẩm */}
//             <div className="form-group position-relative mb-4">
//                 <input
//                     type="text"
//                     placeholder="Nhập tên sản phẩm..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onFocus={() => searchTerm.trim() !== '' && setShowDropdown(true)}
//                     className="form-control"
//                 />
//                 {showDropdown && (
//                     searchResults.length > 0 ? (
//                         <ul className="custom-dropdown w-100" style={{ position: 'relative', zIndex: 10000 }}>
//                             {searchResults.map((result, index) => (
//                                 <li
//                                     key={result.id || index}
//                                     className="custom-dropdown-item d-flex align-items-center"
//                                     onClick={() => selectProduct(result)}
//                                     style={{ cursor: 'pointer' }}
//                                 >
//                                     <img
//                                         src={result.image || 'https://via.placeholder.com/50'}
//                                         alt={result.nameProduct || 'No name'}
//                                         style={{ width: '50px', height: '50px', marginRight: '10px' }}
//                                     />
//                                     <div>
//                                         <div>
//                                             <strong>ID:</strong> {result.id || 'N/A'}
//                                         </div>
//                                         <div>
//                                             <strong>Tên:</strong> {result.nameProduct || 'N/A'}
//                                         </div>
//                                         <div>
//                                             <strong>Danh mục:</strong> {result.categoryName || 'N/A'}
//                                         </div>
//                                         <div>
//                                             <strong>Thương hiệu:</strong> {result.brandName || 'N/A'}
//                                         </div>
//                                         <div>
//                                             <strong>Giá nhập:</strong> {result.import_price || 'N/A'}
//                                         </div>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <div className="no-results">Không có sản phẩm để hiển thị</div>
//                     )
//                 )}
//             </div>
//
//             {/* Tiêu đề form */}
//             <h4 className="font-weight-bold py-3 mb-4">Chỉnh sửa đơn nhập hàng #{id}</h4>
//
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="card2-body pb-2">
//                     {/* Hiển thị thông báo lỗi */}
//                     {message && (
//                         <div className="alert alert-danger" role="alert">
//                             {typeof message === 'string' ? message : 'Có lỗi xảy ra. Vui lòng thử lại.'}
//                         </div>
//                     )}
//                     {errors.products && typeof errors.products === 'string' && (
//                         <div className="alert alert-danger" role="alert">
//                             {errors.products}
//                         </div>
//                     )}
//
//                     {/* Tên người nhập */}
//                     <div className="form-group mb-3">
//                         <label className="form-label">Tên người nhập</label>
//                         <input
//                             type="text"
//                             value={username}
//                             readOnly
//                             className="form-control"
//                         />
//                     </div>
//
//                     {/* Tổng giá nhập */}
//                     <div className="form-group mb-4">
//                         <label className="form-label">Tổng giá nhập</label>
//                         <input
//                             type="number"
//                             name="importPrice"
//                             value={formData.importPrice}
//                             readOnly
//                             className="form-control"
//                         />
//                     </div>
//
//                     {/* Bảng sản phẩm */}
//                     <h5 className="font-weight-bold mt-4 mb-3">Sản phẩm</h5>
//                     <div className="table-responsive">
//                         {formData.products.length === 0 ? (
//                             <div className="no-products text-center py-3">
//                                 Chưa có sản phẩm nào. Vui lòng tìm và chọn sản phẩm từ ô tìm kiếm.
//                             </div>
//                         ) : (
//                             <table className="table table-bordered table-hover">
//                                 <thead className="thead-dark">
//                                 <tr>
//                                     <th style={{ width: '10%' }}>ID</th>
//                                     <th style={{ width: '25%' }}>Tên sản phẩm</th>
//                                     <th style={{ width: '15%' }}>Màu sắc</th>
//                                     <th style={{ width: '15%' }}>Kích thước</th>
//                                     <th style={{ width: '10%' }}>Số lượng</th>
//                                     <th style={{ width: '15%' }}>Giá nhập</th>
//                                     <th style={{ width: '10%' }}>Hành động</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {formData.products.map((product, index) => (
//                                     <tr key={index}>
//                                         <td>
//                                             <input
//                                                 type="number"
//                                                 value={product.productId}
//                                                 readOnly
//                                                 className="form-control"
//                                             />
//                                             {errors.products && errors.products[index]?.product_size_colorId && (
//                                                 <small className="text-danger">{errors.products[index].product_size_colorId}</small>
//                                             )}
//                                         </td>
//                                         <td>
//                                             <input
//                                                 type="text"
//                                                 value={product.nameProduct}
//                                                 readOnly
//                                                 className="form-control"
//                                             />
//                                         </td>
//                                         <td>
//                                             <select
//                                                 value={product.color}
//                                                 onChange={(e) => handleProductChange(index, 'color', e.target.value)}
//                                                 required
//                                                 className="form-control color-select"
//                                             >
//                                                 <option value="">Chọn màu</option>
//                                                 {(colors[product.productId] || []).map((color) => (
//                                                     <option key={color.id} value={color.name}>
//                                                         {color.name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             {errors.products && errors.products[index]?.color && (
//                                                 <small className="text-danger">{errors.products[index].color}</small>
//                                             )}
//                                         </td>
//                                         <td>
//                                             <select
//                                                 value={product.size}
//                                                 onChange={(e) => handleProductChange(index, 'size', e.target.value)}
//                                                 required
//                                                 className="form-control size-select"
//                                             >
//                                                 <option value="">Chọn kích thước</option>
//                                                 {(sizes[product.productId] || []).map((size) => (
//                                                     <option key={size.size_id} value={size.name}>
//                                                         {size.name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             {errors.products && errors.products[index]?.size && (
//                                                 <small className="text-danger">{errors.products[index].size}</small>
//                                             )}
//                                         </td>
//                                         <td>
//                                             <input
//                                                 type="number"
//                                                 value={product.quantity}
//                                                 onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
//                                                 required
//                                                 className="form-control"
//                                                 min="1"
//                                             />
//                                             {errors.products && errors.products[index]?.quantity && (
//                                                 <small className="text-danger">{errors.products[index].quantity}</small>
//                                             )}
//                                         </td>
//                                         <td>
//                                             <input
//                                                 type="number"
//                                                 value={product.price}
//                                                 onChange={(e) => handleProductChange(index, 'price', e.target.value)}
//                                                 required
//                                                 className="form-control"
//                                                 min="0"
//                                             />
//                                             {errors.products && errors.products[index]?.price && (
//                                                 <small className="text-danger">{errors.products[index].price}</small>
//                                             )}
//                                         </td>
//                                         <td>
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-danger btn-sm"
//                                                 onClick={() => removeProduct(index)}
//                                             >
//                                                 Xóa
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//
//                     {/* Nút lưu và hủy */}
//                     <div className="text-right mt-4">
//                         <button type="submit" className="btn btn-primary mr-2">
//                             Lưu đơn hàng
//                         </button>
//                         <button type="button" className="btn btn-secondary" onClick={handleCancel}>
//                             Hủy
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default EditImportOrder;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './import-order.css';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Component quản lý form chỉnh sửa đơn nhập hàng
const EditImportOrder = () => {
  const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    username: '',
    importPrice: 0,
    products: [], // Mặc định không có sản phẩm
  });

  // State lưu lỗi validate
  const [errors, setErrors] = useState({});

  // State lưu thông báo lỗi hoặc thành công
  const [message, setMessage] = useState('');

  // State cho ô tìm kiếm sản phẩm
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // State lưu danh sách màu và kích thước theo productId
  const [colors, setColors] = useState({});
  const [sizes, setSizes] = useState({});

  // Lấy dữ liệu đơn nhập hàng khi component được mount
  useEffect(() => {
    const fetchImportOrder = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];
        if (!token) {
          setMessage('Vui lòng đăng nhập lại.');
          return;
        }

        const response = await axios.get(`https://localhost:8443/api/v1/importOrder/get-import-order/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
});

const importOrder = response.data;
console.log('Import Order Data:', importOrder);

// Lấy thông tin sản phẩm chi tiết từ product_size_colorId
const productsPromises = importOrder.products.map(async (product) => {
    try {
        const productSizeColorResponse = await axios.get(
            `https://localhost:8443/api/v1/products/getNameSizeColor/${product.product_size_colorId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const productSizeColor = productSizeColorResponse.data;
        console.log('productSizeColor:', productSizeColor);

        const productSizeColorResponse2 = await axios.get(
            `https://localhost:8443/api/v1/products/getProductSizeColor/${product.product_size_colorId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const productSizeColor2 = productSizeColorResponse2.data;
        console.log('productSizeColor2:', productSizeColor2);

        // Lấy thông tin sản phẩm từ productId thực sự
        const productResponse = await axios.get(
            `https://localhost:8443/api/v1/products/getProduct/${productSizeColor2.productId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const productData = productResponse.data;
        console.log('product:', { id: productData.id, nameProduct: productData.nameProduct });

        return {
            productId: productData.id || null, // Sử dụng productData.id làm productId
            product_size_colorId: product.product_size_colorId,
            nameProduct: productData.nameProduct || '',
            color: productSizeColor.colorName?.trim().toLowerCase() || '',
            size: productSizeColor.sizeName?.trim().toLowerCase() || '',
            quantity: product.quantity.toString(),
            price: product.price.toString(),
        };
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
});

// Chờ tất cả sản phẩm được xử lý
const products = await Promise.all(productsPromises);
const validProducts = products.filter((p) => p !== null);

// Tải colors và sizes cho tất cả productId
await Promise.all(
    validProducts.map(async (product) => {
        if (product.productId && (!colors[product.productId] || !sizes[product.productId])) {
            console.log(`Fetching colors and sizes for productId: ${product.productId}`);
            await fetchColorsAndSizes(product.productId);
        }
    })
);

// Chỉ set formData sau khi colors và sizes đã tải xong
setFormData({
    username: importOrder.username || localStorage.getItem('username') || 'Unknown',
    importPrice: importOrder.importPrice || 0,
    products: validProducts,
});
} catch (error) {
    console.error('Error fetching import order:', error);
    if (error.response) {
        setMessage(
            error.response.status === 401
                ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                : error.response.data?.message || 'Không thể tải đơn nhập hàng.'
        );
    } else {
        setMessage('Lỗi kết nối server. Vui lòng thử lại.');
    }
}
};

fetchImportOrder();
}, [id]);

// Tính tổng importPrice khi danh sách sản phẩm thay đổi
useEffect(() => {
    const totalPrice = formData.products.reduce((total, product) => {
        const quantity = parseInt(product.quantity) || 0;
        const price = parseInt(product.price) || 0;
        return total + quantity * price;
    }, 0);
    setFormData((prev) => ({ ...prev, importPrice: totalPrice }));
}, [formData.products]);

// Debug state để kiểm tra dữ liệu
useEffect(() => {
    console.log('FormData.products:', formData.products);
    console.log('Colors:', colors);
    console.log('Sizes:', sizes);
}, [formData.products, colors, sizes]);

// Tìm kiếm sản phẩm khi nhập từ khóa
useEffect(() => {
    if (searchTerm.trim() === '') {
        setSearchResults([]);
        setShowDropdown(false);
        setMessage('');
        return;
    }
    const fetchProducts = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))
                ?.split('=')[1];
            if (!token) {
                setMessage('Vui lòng đăng nhập lại.');
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }
            const response = await axios.get(
                `https://localhost:8443/api/v1/products/getProductName/${encodeURIComponent(searchTerm)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const results = Array.isArray(response.data) ? response.data : [];
            setSearchResults(results);
            setShowDropdown(results.length > 0);
            setMessage(results.length === 0 ? 'Không tìm thấy sản phẩm.' : '');
        } catch (error) {
            console.error('Lỗi khi tìm kiếm sản phẩm:', error);
            setSearchResults([]);
            setShowDropdown(false);
            if (error.response) {
                setMessage(
                    error.response.status === 401
                        ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                        : error.response.data?.message || 'Không tìm thấy sản phẩm.'
                );
            } else {
                setMessage('Lỗi kết nối server. Vui lòng thử lại.');
            }
        }
    };

    const debouncedFetch = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debouncedFetch);
}, [searchTerm]);

// Lấy danh sách màu và kích thước khi chọn sản phẩm
const fetchColorsAndSizes = async (productId) => {
    try {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            setMessage('Vui lòng đăng nhập lại.');
            return;
        }
        if (!productId || isNaN(productId)) {
            setMessage('ID sản phẩm không hợp lệ.');
            return;
        }

        // Lấy danh sách màu
        const colorResponse = await axios.get(`https://localhost:8443/api/v1/products/getListColor/${Number(productId)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const colorData = Array.isArray(colorResponse.data)
            ? colorResponse.data.map((c) => ({ ...c, name: c.name?.trim().toLowerCase() || '' }))
            : [];
        setColors((prev) => ({ ...prev, [productId]: colorData }));

        // Lấy danh sách kích thước
        const sizeResponse = await axios.get(`https://localhost:8443/api/v1/products/getListSize/${Number(productId)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const sizeData = Array.isArray(sizeResponse.data)
            ? sizeResponse.data.map((s) => ({ ...s, name: s.name?.trim().toLowerCase() || '' }))
            : [];
        setSizes((prev) => ({ ...prev, [productId]: sizeData }));

        // Kiểm tra dữ liệu trả về
        if (colorData.length === 0 || sizeData.length === 0) {
            setMessage(`Không tìm thấy ${colorData.length === 0 ? 'màu sắc' : 'kích thước'} cho sản phẩm ID ${productId}.`);
        }
    } catch (error) {
        console.error('Lỗi khi lấy màu/kích thước:', error);
        setMessage('Lỗi khi lấy thông tin màu hoặc kích thước.');
        setColors((prev) => ({ ...prev, [productId]: [] }));
        setSizes((prev) => ({ ...prev, [productId]: [] }));
    }
};

// Lấy product_size_colorId dựa trên productId, colorId, sizeId
const fetchProductSizeColorId = async (productId, colorId, sizeId) => {
    try {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            setMessage('Vui lòng đăng nhập lại.');
            return null;
        }
        const response = await axios.get(
            `https://localhost:8443/api/v1/products/getIdProductSizeColor?productId=${productId}&colorId=${colorId}&sizeId=${sizeId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy product_size_colorId:', error);
        setMessage('Lỗi khi lấy ID tổ hợp sản phẩm.');
        return null;
    }
};

const handleProductChange = async (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;

    if (field === 'color' || field === 'size') {
        const product = newProducts[index];
        const productId = product.productId;

        if (!colors[productId] || !sizes[productId]) {
            setErrors((prev) => ({
                ...prev,
                products: {
                    ...prev.products,
                    [index]: {
                        ...prev.products?.[index],
                        [field]: `Vui lòng chờ tải danh sách ${field === 'color' ? 'màu sắc' : 'kích thước'}.`,
                    },
                },
            }));
            setFormData({ ...formData, products: newProducts });
            return;
        }

        const color = colors[productId].find((c) => c.name === product.color);
        const size = sizes[productId].find((s) => s.name === product.size);

        if (!color?.id || !size?.size_id) {
            newProducts[index].product_size_colorId = '';
            setErrors((prev) => ({
                ...prev,
                products: {
                    ...prev.products,
                    [index]: {
                        ...prev.products?.[index],
                        product_size_colorId: `Vui lòng chọn ${!color?.id ? 'màu sắc' : 'kích thước'} hợp lệ.`,
                    },
                },
            }));
        } else {
            const productSizeColorId = await fetchProductSizeColorId(productId, color.id, size.size_id);
            if (productSizeColorId) {
                newProducts[index].product_size_colorId = productSizeColorId;
                setErrors((prev) => ({
                    ...prev,
                    products: {
                        ...prev.products,
                        [index]: {
                            ...prev.products?.[index],
                            product_size_colorId: undefined,
                        },
                    },
                }));
            } else {
                newProducts[index].product_size_colorId = '';
                setErrors((prev) => ({
                    ...prev,
                    products: {
                        ...prev.products,
                        [index]: {
                            ...prev.products?.[index],
                            product_size_colorId: 'Không tìm thấy tổ hợp sản phẩm.',
                        },
                    },
                }));
            }
        }
    }

    setFormData({ ...formData, products: newProducts });
};

// Thêm sản phẩm vào bảng khi chọn từ dropdown tìm kiếm
const selectProduct = async (product) => {
    const productId = product.id || product.productId;
    if (!productId) {
        setMessage('Không tìm thấy ID sản phẩm.');
        return;
    }
    await fetchColorsAndSizes(productId);
    setFormData({
        ...formData,
        products: [
            ...formData.products,
            {
                productId: productId,
                product_size_colorId: '',
                nameProduct: product.nameProduct || product.name || '',
                color: '',
                size: '',
                quantity: '1',
                price: product.import_price || product.importPrice || product.price || '',
            },
        ],
    });
    setSearchTerm('');
    setShowDropdown(false);
    setMessage('');
};

// Xóa sản phẩm khỏi bảng
const removeProduct = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: newProducts });
};

// Validate form trước khi gửi
const validateForm = () => {
    const newErrors = {};
    if (formData.products.length === 0) {
        newErrors.products = 'Vui lòng thêm ít nhất một sản phẩm.';
        return newErrors;
    }

    const productErrors = formData.products.map((product, index) => {
        const errors = {};
        if (!product.product_size_colorId || isNaN(product.product_size_colorId) || parseInt(product.product_size_colorId) <= 0) {
            errors.product_size_colorId = 'Vui lòng chọn màu và kích thước hợp lệ.';
        }
        if (!product.quantity || isNaN(product.quantity) || parseInt(product.quantity) <= 0) {
            errors.quantity = 'Vui lòng nhập số lượng hợp lệ (số dương).';
        }
        if (!product.price || isNaN(product.price) || parseInt(product.price) <= 0) {
            errors.price = 'Vui lòng nhập giá hợp lệ (số dương).';
        }
        if (!product.color) {
            errors.color = 'Vui lòng chọn màu sắc.';
        }
        if (!product.size) {
            errors.size = 'Vui lòng chọn kích thước.';
        }
        return errors;
    });

    const hasProductErrors = productErrors.some((err) => Object.keys(err).length > 0);
    if (hasProductErrors) {
        newErrors.products = productErrors;
    }
    return newErrors;
};

const username = localStorage.getItem('username') || 'Unknown';

// Xử lý gửi form
const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
        const payload = {
            id: parseInt(id), // Thêm id của đơn nhập hàng
            username: username,
            importPrice: parseInt(formData.importPrice) || 0,
            products: formData.products.map((p) => ({
                product_size_colorId: parseInt(p.product_size_colorId) || null,
                quantity: parseInt(p.quantity) || 0,
                price: parseInt(p.price) || 0,
            })),
        };
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            setMessage('Vui lòng đăng nhập lại.');
            return;
        }

        try {
            const res = await axios.post(`https://localhost:8443/api/v1/importOrder/update`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: '✅ Cập nhật đơn hàng thành công!',
                showConfirmButton: false,
                timer: 1500,
            });

            setFormData({
                username: '',
                importPrice: 0,
                products: [],
            });
            setMessage('');
            setErrors({});
            setColors({});
            setSizes({});

            navigate('/list-import-order');
        } catch (error) {
            Swal.fire('Lỗi!', 'Lỗi khi cập nhật đơn hàng!', 'error');
            console.error('Lỗi:', error);
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400) {
                    setMessage(
                        Array.isArray(data)
                            ? data.join(', ')
                            : typeof data === 'string'
                                ? data
                                : data?.error || data?.message || 'Dữ liệu không hợp lệ.'
                    );
                } else if (status === 401) {
                    setMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                } else {
                    setMessage('Lỗi khi cập nhật đơn hàng. Vui lòng thử lại.');
                }
            } else {
                setMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
            }
        }
    }
};

// Xử lý hủy form
const handleCancel = () => {
    setFormData({
        username: '',
        importPrice: 0,
        products: [],
    });
    setErrors({});
    setMessage('');
    setSearchTerm('');
    setShowDropdown(false);
    setColors({});
    setSizes({});
};

// Giao diện form
return (
    <div className="containerEdit light-style flex-grow-1 container-p-y">
        {/* Ô tìm kiếm sản phẩm */}
        <div className="form-group position-relative mb-4">
            <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim() !== '' && setShowDropdown(true)}
                className="form-control"
            />
            {showDropdown && (
                searchResults.length > 0 ? (
                    <ul className="custom-dropdown w-100" style={{ position: 'relative', zIndex: 10000 }}>
                        {searchResults.map((result, index) => (
                            <li
                                key={result.id || index}
                                className="custom-dropdown-item d-flex align-items-center"
                                onClick={() => selectProduct(result)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={result.image || 'https://via.placeholder.com/50'}
                                    alt={result.nameProduct || 'No name'}
                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                />
                                <div>
                                    <div>
                                        <strong>ID:</strong> {result.id || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Tên:</strong> {result.nameProduct || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Danh mục:</strong> {result.categoryName || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Thương hiệu:</strong> {result.brandName || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Giá nhập:</strong> {result.import_price || 'N/A'}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-results">Không có sản phẩm để hiển thị</div>
                )
            )}
        </div>

        {/* Tiêu đề form */}
        <h4 className="font-weight-bold py-3 mb-4">Chỉnh sửa đơn nhập hàng #{id}</h4>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="card2-body pb-2">
                {/* Hiển thị thông báo lỗi */}
                {message && (
                    <div className="alert alert-danger" role="alert">
                        {typeof message === 'string' ? message : 'Có lỗi xảy ra. Vui lòng thử lại.'}
                    </div>
                )}
                {errors.products && typeof errors.products === 'string' && (
                    <div className="alert alert-danger" role="alert">
                        {errors.products}
                    </div>
                )}

                {/* Tên người nhập */}
                <div className="form-group mb-3">
                    <label className="form-label">Tên người nhập</label>
                    <input
                        type="text"
                        value={username}
                        readOnly
                        className="form-control"
                    />
                </div>

                {/* Tổng giá nhập */}
                <div className="form-group mb-4">
                    <label className="form-label">Tổng giá nhập</label>
                    <input
                        type="number"
                        name="importPrice"
                        value={formData.importPrice}
                        readOnly
                        className="form-control"
                    />
                </div>

                {/* Bảng sản phẩm */}
                <h5 className="font-weight-bold mt-4 mb-3">Sản phẩm</h5>
                <div className="table-responsive">
                    {formData.products.length === 0 ? (
                        <div className="no-products text-center py-3">
                            Chưa có sản phẩm nào. Vui lòng tìm và chọn sản phẩm từ ô tìm kiếm.
                        </div>
                    ) : (
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                            <tr>
                                <th style={{ width: '10%' }}>ID</th>
                                <th style={{ width: '25%' }}>Tên sản phẩm</th>
                                <th style={{ width: '15%' }}>Màu sắc</th>
                                <th style={{ width: '15%' }}>Kích thước</th>
                                <th style={{ width: '10%' }}>Số lượng</th>
                                <th style={{ width: '15%' }}>Giá nhập</th>
                                <th style={{ width: '10%' }}>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {formData.products.map((product, index) => {
                                console.log(`Product ${index}:`, {
                                    productId: product.productId,
                                    color: product.color,
                                    size: product.size,
                                    colors: colors[product.productId],
                                    sizes: sizes[product.productId],
                                });
                                return (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.productId}
                                                readOnly
                                                className="form-control"
                                            />
                                            {errors.products && errors.products[index]?.product_size_colorId && (
                                                <small className="text-danger">{errors.products[index].product_size_colorId}</small>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={product.nameProduct}
                                                readOnly
                                                className="form-control"
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={product.color || ''}
                                                onChange={(e) => handleProductChange(index, 'color', e.target.value)}
                                                required
                                                className="form-control color-select"
                                            >
                                                <option value="">Chọn màu</option>
                                                {(colors[product.productId] || []).map((color) => (
                                                    <option key={color.id} value={color.name}>
                                                        {color.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.products && errors.products[index]?.color && (
                                                <small className="text-danger">{errors.products[index].color}</small>
                                            )}
                                            {!(colors[product.productId]?.length > 0) && (
                                                <small className="text-warning">Đang tải màu sắc...</small>
                                            )}
                                        </td>
                                        <td>
                                            <select
                                                value={product.size || ''}
                                                onChange={(e) => handleProductChange(index, 'size', e.target.value)}
                                                required
                                                className="form-control size-select"
                                            >
                                                <option value="">Chọn kích thước</option>
                                                {(sizes[product.productId] || []).map((size) => (
                                                    <option key={size.size_id} value={size.name}>
                                                        {size.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.products && errors.products[index]?.size && (
                                                <small className="text-danger">{errors.products[index].size}</small>
                                            )}
                                            {!(sizes[product.productId]?.length > 0) && (
                                                <small className="text-warning">Đang tải kích thước...</small>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.quantity}
                                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                required
                                                className="form-control"
                                                min="1"
                                            />
                                            {errors.products && errors.products[index]?.quantity && (
                                                <small className="text-danger">{errors.products[index].quantity}</small>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.price}
                                                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                                required
                                                className="form-control"
                                                min="0"
                                            />
                                            {errors.products && errors.products[index]?.price && (
                                                <small className="text-danger">{errors.products[index].price}</small>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeProduct(index)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Nút lưu và hủy */}
                <div className="text-right mt-4">
                    <button type="submit" className="btn btn-primary mr-2">
                        Lưu đơn hàng
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Hủy
                    </button>
                </div>
            </div>
        </form>
    </div>
);
};

export default EditImportOrder;
