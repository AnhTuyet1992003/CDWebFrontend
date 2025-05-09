// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import './import-order.css';
// //
// // const ImportOrder = () => {
// //     const [formData, setFormData] = useState({
// //         username: '',
// //         importPrice: 0,
// //         products: [{ product_size_colorId: '', quantity: '', price: '' }],
// //     });
// //     const [errors, setErrors] = useState({});
// //     const [message, setMessage] = useState('');
// //
// //     // Calculate total importPrice whenever products change
// //     useEffect(() => {
// //         const totalPrice = formData.products.reduce((total, product) => {
// //             const quantity = parseInt(product.quantity) || 0;
// //             const price = parseInt(product.price) || 0;
// //             return total + quantity * price;
// //         }, 0);
// //         setFormData((prev) => ({ ...prev, importPrice: totalPrice }));
// //     }, [formData.products]);
// //
// //     const handleProductChange = (index, field, value) => {
// //         const newProducts = [...formData.products];
// //         newProducts[index][field] = value;
// //         setFormData({ ...formData, products: newProducts });
// //     };
// //
// //     const addProduct = () => {
// //         setFormData({
// //             ...formData,
// //             products: [...formData.products, { product_size_colorId: '', quantity: '', price: '' }],
// //         });
// //     };
// //
// //     const removeProduct = (index) => {
// //         if (formData.products.length > 1) {
// //             const newProducts = formData.products.filter((_, i) => i !== index);
// //             setFormData({ ...formData, products: newProducts });
// //         }
// //     };
// //
// //     const validateForm = () => {
// //         const newErrors = {};
// //
// //         const productErrors = formData.products.map((product, index) => {
// //             const errors = {};
// //             if (!product.product_size_colorId || isNaN(product.product_size_colorId) || parseInt(product.product_size_colorId) <= 0) {
// //                 errors.product_size_colorId = 'Vui lòng nhập ID sản phẩm hợp lệ (số dương).';
// //             }
// //             if (!product.quantity || isNaN(product.quantity) || parseInt(product.quantity) <= 0) {
// //                 errors.quantity = 'Vui lòng nhập số lượng hợp lệ (số dương).';
// //             }
// //             if (!product.price || isNaN(product.price) || parseInt(product.price) <= 0) {
// //                 errors.price = 'Vui lòng nhập giá hợp lệ (số dương).';
// //             }
// //             return errors;
// //         });
// //
// //         const hasProductErrors = productErrors.some((err) => Object.keys(err).length > 0);
// //         if (hasProductErrors) {
// //             newErrors.products = productErrors;
// //         }
// //
// //         return newErrors;
// //     };
// //
// //     const username = localStorage.getItem("username");
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         const validationErrors = validateForm();
// //         setErrors(validationErrors);
// //
// //         if (Object.keys(validationErrors).length === 0) {
// //             const payload = {
// //                 username: username,
// //                 importPrice: parseInt(formData.importPrice) || 0,
// //                 products: formData.products.map((p) => ({
// //                     product_size_colorId: parseInt(p.product_size_colorId) || null,
// //                     quantity: parseInt(p.quantity) || 0,
// //                     price: parseInt(p.price) || 0,
// //                 })),
// //             };
// //             const token = document.cookie
// //                 .split('; ')
// //                 .find(row => row.startsWith('token='))
// //                 ?.split('=')[1];
// //
// //             try {
// //                 const res = await axios.post('https://localhost:8443/api/v1/importOrder/insert', payload, {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                     },
// //                 });
// //                 alert('Thêm đơn hàng thành công!');
// //                 setFormData({
// //                     username: '',
// //                     importPrice: 0,
// //                     products: [{ product_size_colorId: '', quantity: '', price: '' }],
// //                 });
// //                 setMessage('');
// //                 setErrors({});
// //             } catch (error) {
// //                 console.error(error);
// //                 if (error.response) {
// //                     const { status, data } = error.response;
// //                     if (status === 400) {
// //                         setMessage(Array.isArray(data) ? data.join(', ') : data || 'Dữ liệu không hợp lệ.');
// //                     } else {
// //                         setMessage('Lỗi khi thêm đơn hàng. Vui lòng thử lại.');
// //                     }
// //                 } else {
// //                     setMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
// //                 }
// //             }
// //         }
// //     };
// //
// //     const handleCancel = () => {
// //         setFormData({
// //             username: '',
// //             importPrice: 0,
// //             products: [{ product_size_colorId: '', quantity: '', price: '' }],
// //         });
// //         setErrors({});
// //         setMessage('');
// //     };
// //
// //     return (
// //         <div className="containerEdit light-style flex-grow-1 container-p-y">
// //             <h4 className="font-weight-bold py-3 mb-4">Thêm đơn nhập hàng</h4>
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //                 <div className="card2-body pb-2">
// //                     {message && (
// //                         <div className="alert alert-danger" role="alert">
// //                             {message}
// //                         </div>
// //                     )}
// //                     <div className="font-weight-bold">
// //                         <label>Tên người nhập: {username}</label>
// //                     </div>
// //
// //                     <div className="form-group">
// //                         <label className="form-label">Tổng giá nhập</label>
// //                         <input
// //                             type="number"
// //                             name="importPrice"
// //                             value={formData.importPrice}
// //                             readOnly // Make the field read-only
// //                             className="form-control"
// //                         />
// //                     </div>
// //
// //                     <h5 className="font-weight-bold mt-4">Sản phẩm</h5>
// //                     {formData.products.map((product, index) => (
// //                         <div key={index} className="product-row">
// //                             {errors.products && errors.products[index] && (
// //                                 <div className="error-container">
// //                                     {errors.products[index].product_size_colorId && (
// //                                         <small className="error">{errors.products[index].product_size_colorId}</small>
// //                                     )}
// //                                     {errors.products[index].quantity && (
// //                                         <small className="error">{errors.products[index].quantity}</small>
// //                                     )}
// //                                     {errors.products[index].price && (
// //                                         <small className="error">{errors.products[index].price}</small>
// //                                     )}
// //                                 </div>
// //                             )}
// //                             <div className="row">
// //                                 <div className="col-md-4 form-group">
// //                                     <label className="form-label">ID sản phẩm</label>
// //                                     <input
// //                                         type="number"
// //                                         value={product.product_size_colorId}
// //                                         onChange={(e) => handleProductChange(index, 'product_size_colorId', e.target.value)}
// //                                         required={true}
// //                                         className="form-control"
// //                                     />
// //                                 </div>
// //                                 <div className="col-md-3 form-group">
// //                                     <label className="form-label">Số lượng</label>
// //                                     <input
// //                                         type="number"
// //                                         value={product.quantity}
// //                                         onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
// //                                         required={true}
// //                                         className="form-control"
// //                                     />
// //                                 </div>
// //                                 <div className="col-md-3 form-group">
// //                                     <label className="form-label">Giá</label>
// //                                     <input
// //                                         type="number"
// //                                         value={product.price}
// //                                         onChange={(e) => handleProductChange(index, 'price', e.target.value)}
// //                                         required={true}
// //                                         className="form-control"
// //                                     />
// //                                 </div>
// //                                 <div className="col-md-2 d-flex align-items-end">
// //                                     <button
// //                                         type="button"
// //                                         className="btn btn-danger"
// //                                         onClick={() => removeProduct(index)}
// //                                         disabled={formData.products.length === 1}
// //                                     >
// //                                         Xóa
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                     <button
// //                         type="button"
// //                         className="btn btn-secondary mb-3"
// //                         onClick={addProduct}
// //                     >
// //                         Thêm sản phẩm
// //                     </button>
// //
// //                     <div className="text-right mt-3">
// //                         <button type="submit" className="btn btn-primary">
// //                             Lưu đơn hàng
// //                         </button>{' '}
// //                         <button
// //                             type="button"
// //                             className="btn btn-default"
// //                             onClick={handleCancel}
// //                         >
// //                             Hủy
// //                         </button>
// //                     </div>
// //                 </div>
// //             </form>
// //         </div>
// //     );
// // };
// //
// // export default ImportOrder;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './import-order.css';
// import { debounce } from 'lodash';
//
// const ImportOrder = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         importPrice: 0,
//         products: [{ product_size_colorId: '', quantity: '', price: '' }],
//     });
//     const [errors, setErrors] = useState({});
//     const [message, setMessage] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//
//     // Tính tổng importPrice
//     useEffect(() => {
//         const totalPrice = formData.products.reduce((total, product) => {
//             const quantity = parseInt(product.quantity) || 0;
//             const price = parseInt(product.price) || 0;
//             return total + quantity * price;
//         }, 0);
//         setFormData((prev) => ({ ...prev, importPrice: totalPrice }));
//     }, [formData.products]);
//
//     // Tìm kiếm sản phẩm
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
//                     .find(row => row.startsWith('token='))
//                     ?.split('=')[1];
//                 const response = await axios.get(
//                     `https://localhost:8443/api/v1/products/getProductName/${encodeURIComponent(searchTerm)}`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );
//                 console.log('Dữ liệu từ API:', response.data);
//                 const results = Array.isArray(response.data) ? response.data : [];
//                 console.log('searchResults:', results);
//                 setSearchResults(results);
//                 setShowDropdown(results.length > 0);
//                 console.log('Set showDropdown:', results.length > 0);
//                 setMessage(results.length === 0 ? 'Không tìm thấy sản phẩm.' : '');
//             } catch (error) {
//                 console.error('Lỗi khi tìm kiếm sản phẩm:', error);
//                 setSearchResults([]);
//                 setShowDropdown(false);
//                 if (error.response) {
//                     console.log('Thông báo lỗi từ server:', error.response.data);
//                     setMessage(error.response.data || 'Không tìm thấy sản phẩm.');
//                 } else {
//                     setMessage('Lỗi kết nối server. Vui lòng thử lại.');
//                 }
//             }
//         };
//
//         const debounce = setTimeout(fetchProducts, 300);
//         return () => clearTimeout(debounce);
//     }, [searchTerm]);
//
//     const handleProductChange = (index, field, value) => {
//         const newProducts = [...formData.products];
//         newProducts[index][field] = value;
//         setFormData({ ...formData, products: newProducts });
//     };
//
//     const addProduct = () => {
//         setFormData({
//             ...formData,
//             products: [...formData.products, { product_size_colorId: '', quantity: '', price: '' }],
//         });
//     };
//
//     const removeProduct = (index) => {
//         if (formData.products.length > 1) {
//             const newProducts = formData.products.filter((_, i) => i !== index);
//             setFormData({ ...formData, products: newProducts });
//         }
//     };
//
//     const selectProduct = (product) => {
//         setFormData({
//             ...formData,
//             products: [
//                 ...formData.products,
//                 { product_size_colorId: product.id, quantity: '', price: product.import_price || '' },
//             ],
//         });
//         setSearchTerm('');
//         setShowDropdown(false);
//         setMessage('');
//     };
//
//     const validateForm = () => {
//         const newErrors = {};
//         const productErrors = formData.products.map((product, index) => {
//             const errors = {};
//             if (!product.product_size_colorId || isNaN(product.product_size_colorId) || parseInt(product.product_size_colorId) <= 0) {
//                 errors.product_size_colorId = 'Vui lòng nhập ID sản phẩm hợp lệ (số dương).';
//             }
//             if (!product.quantity || isNaN(product.quantity) || parseInt(product.quantity) <= 0) {
//                 errors.quantity = 'Vui lòng nhập số lượng hợp lệ (số dương).';
//             }
//             if (!product.price || isNaN(product.price) || parseInt(product.price) <= 0) {
//                 errors.price = 'Vui lòng nhập giá hợp lệ (số dương).';
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
//     const username = localStorage.getItem("username");
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validationErrors = validateForm();
//         setErrors(validationErrors);
//
//         if (Object.keys(validationErrors).length === 0) {
//             const payload = {
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
//                 .find(row => row.startsWith('token='))
//                 ?.split('=')[1];
//
//             try {
//                 const res = await axios.post('https://localhost:8443/api/v1/importOrder/insert', payload, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 alert('Thêm đơn hàng thành công!');
//                 setFormData({
//                     username: '',
//                     importPrice: 0,
//                     products: [{ product_size_colorId: '', quantity: '', price: '' }],
//                 });
//                 setMessage('');
//                 setErrors({});
//             } catch (error) {
//                 console.error(error);
//                 if (error.response) {
//                     const { status, data } = error.response;
//                     if (status === 400) {
//                         setMessage(Array.isArray(data) ? data.join(', ') : data || 'Dữ liệu không hợp lệ.');
//                     } else {
//                         setMessage('Lỗi khi thêm đơn hàng. Vui lòng thử lại.');
//                     }
//                 } else {
//                     setMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
//                 }
//             }
//         }
//     };
//
//     const handleCancel = () => {
//         setFormData({
//             username: '',
//             importPrice: 0,
//             products: [{ product_size_colorId: '', quantity: '', price: '' }],
//         });
//         setErrors({});
//         setMessage('');
//         setSearchTerm('');
//         setShowDropdown(false);
//     };
//
//     return (
//         <div className="containerEdit light-style flex-grow-1 container-p-y">
//             <div className="form-group position-relative mb-4">
//                 <input
//                     type="text"
//                     placeholder="Nhập tên sản phẩm..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onFocus={() => setShowDropdown(true)} // Hiển thị dropdown khi focus
//                     className="form-control"
//                 />
//                 {console.log('Rendering dropdown:', {showDropdown, searchResults})}
//                 {showDropdown && (
//                     searchResults.length > 0 ? (
//                         <ul
//                             className="custom-dropdown w-100"
//                             style={{
//                                 maxHeight: '300px',
//                                 overflowY: 'auto',
//                                  position: "relative", zIndex:"100000000",
//                                 top: '100%',
//                                 left: 0,
//                             }}
//                         >
//                             {searchResults.map((result, index) => (
//                                 <li
//                                     key={result.id || index}
//                                     className="custom-dropdown-item d-flex align-items-center"
//                                     onClick={() => selectProduct(result)}
//                                     style={{cursor: 'pointer'}}
//                                 >
//                                     <img
//                                         src={result.image || 'https://via.placeholder.com/50'}
//                                         alt={result.nameProduct || 'No name'}
//                                         style={{width: '50px', height: '50px', marginRight: '10px'}}
//                                     />
//                                     <div>
//                                         <div><strong>ID:</strong> {result.id || 'N/A'}</div>
//                                         <div><strong>Tên:</strong> {result.nameProduct || 'N/A'}</div>
//                                         <div><strong>Danh mục:</strong> {result.categoryName || 'N/A'}</div>
//                                         <div><strong>Thương hiệu:</strong> {result.brandName || 'N/A'}</div>
//                                         <div><strong>Giá nhập:</strong> {result.import_price || 'N/A'}</div>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <div className="no-results">Không có sản phẩm để hiển thị</div>
//                     )
//                 )}
//             </div>
//             <h4 className="font-weight-bold py-3 mb-4">Thêm đơn nhập hàng</h4>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="card2-body pb-2">
//                     {/* Thông báo lỗi */}
//                     {message && (
//                         <div className="alert alert-danger" role="alert">
//                             {message}
//                         </div>
//                     )}
//
//                     {/* Thông tin người nhập */}
//                     <div className="font-weight-bold mb-3">
//                         <label className={"label"} style={{position: "relative"}}>Tên người nhập: {username}</label>
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
//                     {/* Danh sách sản phẩm nhập hàng */}
//                     <h5 className="font-weight-bold mt-4">Sản phẩm</h5>
//                     {formData.products.map((product, index) => (
//                         <div key={index} className="product-row mb-3">
//                             {errors.products && errors.products[index] && (
//                                 <div className="error-container">
//                                     {errors.products[index].product_size_colorId && (
//                                         <small className="error">{errors.products[index].product_size_colorId}</small>
//                                     )}
//                                     {errors.products[index].quantity && (
//                                         <small className="error">{errors.products[index].quantity}</small>
//                                     )}
//                                     {errors.products[index].price && (
//                                         <small className="error">{errors.products[index].price}</small>
//                                     )}
//                                 </div>
//                             )}
//                             <div className="row">
//                                 <div className="col-md-4 form-group">
//                                     <label className="form-label">ID sản phẩm</label>
//                                     <input
//                                         type="number"
//                                         value={product.product_size_colorId}
//                                         onChange={(e) => handleProductChange(index, 'product_size_colorId', e.target.value)}
//                                         required
//                                         className="form-control"
//                                     />
//                                 </div>
//                                 <div className="col-md-3 form-group">
//                                     <label className="form-label">Số lượng</label>
//                                     <input
//                                         type="number"
//                                         value={product.quantity}
//                                         onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
//                                         required
//                                         className="form-control"
//                                     />
//                                 </div>
//                                 <div className="col-md-3 form-group">
//                                     <label className="form-label">Giá</label>
//                                     <input
//                                         type="number"
//                                         value={product.price}
//                                         onChange={(e) => handleProductChange(index, 'price', e.target.value)}
//                                         required
//                                         className="form-control"
//                                     />
//                                 </div>
//                                 <div className="col-md-2 d-flex align-items-end">
//                                     <button
//                                         type="button"
//                                         className="btn btn-danger"
//                                         onClick={() => removeProduct(index)}
//                                         disabled={formData.products.length === 1}
//                                     >
//                                         Xóa
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                     <button
//                         type="button"
//                         className="btn btn-secondary mb-3"
//                         onClick={addProduct}
//                     >
//                         Thêm sản phẩm
//                     </button>
//
//                     <div className="text-right mt-3">
//                         <button type="submit" className="btn btn-primary">
//                             Lưu đơn hàng
//                         </button>
//                         {' '}
//                         <button
//                             type="button"
//                             className="btn btn-default"
//                             onClick={handleCancel}
//                         >
//                             Hủy
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default ImportOrder;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './import-order.css';
import { debounce } from 'lodash';

// Component quản lý form nhập hàng
const ImportOrder = () => {
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

    // Tính tổng importPrice khi danh sách sản phẩm thay đổi
    useEffect(() => {
        const totalPrice = formData.products.reduce((total, product) => {
            const quantity = parseInt(product.quantity) || 0;
            const price = parseInt(product.price) || 0;
            return total + quantity * price;
        }, 0);
        setFormData((prev) => ({ ...prev, importPrice: totalPrice }));
    }, [formData.products]);

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
                console.log('Fetching products with searchTerm:', searchTerm);
                const response = await axios.get(
                    `https://localhost:8443/api/v1/products/getProductName/${encodeURIComponent(searchTerm)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('Search API response:', JSON.stringify(response.data, null, 2));
                const results = Array.isArray(response.data) ? response.data : [];
                setSearchResults(results);
                setShowDropdown(results.length > 0);
                setMessage(results.length === 0 ? 'Không tìm thấy sản phẩm.' : '');
            } catch (error) {
                console.error('Lỗi khi tìm kiếm sản phẩm:', error);
                setSearchResults([]);
                setShowDropdown(false);
                if (error.response) {
                    const { status, data } = error.response;
                    setMessage(
                        status === 401
                            ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                            : Array.isArray(data)
                                ? data.join(', ')
                                : typeof data === 'string'
                                    ? data
                                    : data?.error || data?.message || 'Không tìm thấy sản phẩm.'
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
            console.log('Color API response:', JSON.stringify(colorResponse.data, null, 2));
            const colorData = Array.isArray(colorResponse.data) ? colorResponse.data : [];
            setColors((prev) => ({ ...prev, [productId]: colorData }));

            // Lấy danh sách kích thước
            const sizeResponse = await axios.get(`https://localhost:8443/api/v1/products/getListSize/${Number(productId)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Size API response:', JSON.stringify(sizeResponse.data, null, 2));
            const sizeData = Array.isArray(sizeResponse.data) ? sizeResponse.data : [];
            setSizes((prev) => ({ ...prev, [productId]: sizeData }));
        } catch (error) {
            console.error('Lỗi khi lấy màu/kích thước:', error);
            setMessage('Lỗi khi lấy thông tin màu hoặc kích thước.');
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
            console.log('Fetching ProductSizeColorId with:', { productId, colorId, sizeId });
            const response = await axios.get(
                `https://localhost:8443/api/v1/products/getIdProductSizeColor?productId=${productId}&colorId=${colorId}&sizeId=${sizeId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log('ProductSizeColorId response:', response.data);
            return response.data; // Giả định trả về product_size_colorId (Long)
        } catch (error) {
            console.error('Lỗi khi lấy product_size_colorId:', error);
            setMessage('Lỗi khi lấy ID tổ hợp sản phẩm.');
            return null;
        }
    };

    // Xử lý thay đổi thông tin sản phẩm trong bảng
    const handleProductChange = async (index, field, value) => {
        const newProducts = [...formData.products];
        newProducts[index][field] = value;

        // Nếu thay đổi color hoặc size, lấy lại product_size_colorId
        if (field === 'color' || field === 'size') {
            const product = newProducts[index];
            const productId = product.productId;
            const color = colors[productId]?.find((c) => c.name === product.color);
            const size = sizes[productId]?.find((s) => s.name === product.size);

            if (color?.id && size?.id) {
                const productSizeColorId = await fetchProductSizeColorId(productId, color.id, size.id);
                if (productSizeColorId) {
                    newProducts[index].product_size_colorId = productSizeColorId;
                } else {
                    newProducts[index].product_size_colorId = '';
                    setErrors((prev) => ({
                        ...prev,
                        products: prev.products || [],
                        [index]: { ...prev[index], product_size_colorId: 'Không tìm thấy tổ hợp sản phẩm.' },
                    }));
                }
            } else {
                newProducts[index].product_size_colorId = '';
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
        console.log('Selected productId:', productId);
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
                const res = await axios.post('https://localhost:8443/api/v1/importOrder/insert', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Thêm đơn hàng thành công!');
                setFormData({
                    username: '',
                    importPrice: 0,
                    products: [],
                });
                setMessage('');
                setErrors({});
                setColors({});
                setSizes({});
            } catch (error) {
                console.error('Lỗi khi gửi đơn hàng:', error);
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
                        setMessage('Lỗi khi thêm đơn hàng. Vui lòng thử lại.');
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
                        <ul className="custom-dropdown w-100" style={{position: "relative",zIndex: 10000}}>
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
                                        <div><strong>ID:</strong> {result.id || 'N/A'}</div>
                                        <div><strong>Tên:</strong> {result.nameProduct || 'N/A'}</div>
                                        <div><strong>Danh mục:</strong> {result.categoryName || 'N/A'}</div>
                                        <div><strong>Thương hiệu:</strong> {result.brandName || 'N/A'}</div>
                                        <div><strong>Giá nhập:</strong> {result.import_price || 'N/A'}</div>
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
            <h4 className="font-weight-bold py-3 mb-4">Thêm đơn nhập hàng</h4>

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
                                {formData.products.map((product, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.id}
                                                onChange={(e) => handleProductChange(index, 'product_size_colorId', e.target.value)}
                                                required
                                                className="form-control"
                                                readOnly
                                            />
                                            {errors.products && errors.products[index]?.product_size_colorId && (
                                                <small className="text-danger">{errors.products[index].product_size_colorId}</small>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={product.nameProduct}
                                                onChange={(e) => handleProductChange(index, 'nameProduct', e.target.value)}
                                                required
                                                className="form-control"
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={product.color}
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
                                        </td>
                                        <td>
                                            <select
                                                value={product.size}
                                                onChange={(e) => handleProductChange(index, 'size', e.target.value)}
                                                required
                                                className="form-control size-select"
                                            >
                                                <option value="">Chọn kích thước</option>
                                                {(sizes[product.productId] || []).map((size) => (
                                                    <option key={size.id} value={size.name}>
                                                        {size.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.products && errors.products[index]?.size && (
                                                <small className="text-danger">{errors.products[index].size}</small>
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
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Nút lưu và hủy */}
                    <div className="text-right mt-4">
                        <button type="submit" className="btn btn-primary mr-2">Lưu đơn hàng</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Hủy
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ImportOrder;