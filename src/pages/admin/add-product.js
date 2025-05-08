import React, { useEffect, useState } from "react";
import '../../assets/admin/vendor/css/core.css'
import './addProduct.css'
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    // const [productColors, setProductColors] = useState([]);
    // const [productId, setProductId] = useState(1);

    // hiển thị thông tin sản phẩm màu sắc/kích thước
    const [productColors, setProductColors] = useState([]);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productFound, setProductFound] = useState(true); // để kiểm soát hiển thị bảng
    const [productId, setProductId] = useState("");

    const navigate = useNavigate();
    // them san pham
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [brandId, setBrandId] = useState("");


    //Chọn màu sắc và hình ảnh
    const [selectedColorId, setSelectedColorId] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    // chọn kích thước và số lượng sản phẩm
    const [selectedSizeId, setSelectedSizeId] = useState("");
    const [inputStock, setInputStock] = useState("");


    const formatVND = (money) => {
        return new Intl.NumberFormat('vi-VN').format(money) + " ₫";
    };

    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");  // Xóa các ký tự không phải số
        const formattedValue = formatVND(value);
        setPrice(formattedValue);
    };


    useEffect(() => {
        axios.get("https://localhost:8443/api/v1/products/getCategory", { withCredentials: true })
            .then(res => setCategories(res.data))
            .catch(err => console.error("Lỗi khi lấy category:", err));

        axios.get("https://localhost:8443/api/v1/products/getBrand", { withCredentials: true })
            .then(res => setBrands(res.data))
            .catch(err => console.error("Lỗi khi lấy brand:", err));

        axios.get("https://localhost:8443/api/v1/products/getSize", { withCredentials: true })
            .then(res => setSizes(res.data))
            .catch(err => console.error("Lỗi khi lấy size:", err));

        axios.get("https://localhost:8443/api/v1/products/getColor", { withCredentials: true })
            .then(res => setColors(res.data))
            .catch(err => console.error("Lỗi khi lấy color:", err));

        }, []);
    useEffect(() => {
        if (!productId) return; // Kiểm tra nếu không có productId thì không gọi API

        axios.get(`https://localhost:8443/api/v1/products/getProductSizeColor?productId=${productId}`, { withCredentials: true })
            .then(res => {
                const { data } = res.data;
                setProductColors(data);
                setProductName(res.data.nameProduct);
                setProductPrice(res.data.price);
                setProductFound(true);
            })
            .catch(err => {
                if (err.response?.status === 404) {
                    setProductFound(false); // không tìm thấy sản phẩm
                } else {
                    console.error("Lỗi khi gọi API", err);
                }
            });
    }, [productId]);  // Khi productId thay đổi, useEffect sẽ tự động gọi lại API




    useEffect(() => {
        if (productId) {
            axios.get(`https://localhost:8443/api/v1/products/getColorProduct?productId=${productId}`, { withCredentials: true })
                .then(res => setProductColors(res.data))
                .catch(err => console.error("Lỗi khi lấy colorProduct:", err));
        }
    }, [productId]);


    const handleAddProduct = async (e) => {
        e.preventDefault();

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
        }

        try {
            const rawPrice = String(price).replace(/\D/g, "");

            const productData = {
                name_product: name,
                description: description,
                stock: parseInt(stock),
                price: parseInt(rawPrice),
                category_id: categoryId,
                brand_id: brandId,
            };

            const formData = new FormData();
            formData.append("product", JSON.stringify(productData));
            console.log("Form data"+formData)
            const response = await axios.post("https://localhost:8443/api/v1/products/add", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });

            const data = response.data;
            const newProductId = data.productId;
            setProductId(newProductId);  // Lưu productId vừa thêm

            // ✅ Reset form
            // ✅ Reset form và gán lại đúng kiểu dữ liệu
            setName(data.data.nameProduct);
            setDescription(data.data.description);
            setPrice(formatVND(data.data.price)); // hoặc String(data.data.price)
            setStock(String(data.data.stock));
            setCategoryId(productData.category_id);
            setBrandId(productData.brand_id);

            Swal.fire({
                icon: 'success',
                title: '✅ ' + data.message,
                text: `Mã sản phẩm: ${newProductId} - ${productData.name_product}`,
            });
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            alert("❌ Đã xảy ra lỗi khi thêm sản phẩm.");
        }
    };


    const handleAddColorProduct = async () => {
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

        if (!productId || !selectedColorId || !selectedFile) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng chọn màu và ảnh trước khi thêm!',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("productId", productId);
            formData.append("colorId", selectedColorId);
            formData.append("file", selectedFile);

            const response = await axios.post("https://localhost:8443/api/v1/products/add_color_product", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            setProductColors(response.data.productId); // Cập nhật danh sách màu
            Swal.fire({
                icon: 'success',
                title: '🎉 Thêm màu sắc thành công!',
            });

            // Gọi lại API lấy thông tin sản phẩm mới sau khi thêm kích thước thành công
            axios.get(`https://localhost:8443/api/v1/products/getProductSizeColor?productId=${productId}`, { withCredentials: true })
                .then(res => {
                    const { data } = res.data;
                    setProductColors(data);
                    setProductName(res.data.nameProduct);
                    setProductPrice(res.data.price);
                    setProductFound(true);
                })
                .catch(err => {
                    if (err.response?.status === 404) {
                        setProductFound(false); // không tìm thấy sản phẩm
                    } else {
                        console.error("Lỗi khi gọi API", err);
                    }
                });


        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Thêm màu sắc thất bại!',
                text: error.response?.data?.error || error.message,
            });
        }
    };

    const handleAddSizeByColor = async () => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))?.split('=')[1];

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

        if (!productId || !selectedColorId || !selectedSizeId || !inputStock) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng chọn đầy đủ thông tin!',
            });
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('productId', productId);
            params.append('productColorId', selectedColorId);
            params.append('sizeId', selectedSizeId);
            params.append('stock', inputStock);

            const response = await axios.post('https://localhost:8443/api/v1/products/add_size_by_color', params, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true
            });

            const data = response.data;
            Swal.fire({
                icon: 'success',
                title: data.message || "Thêm kích thước thành công!",
            });

            // Gọi lại API lấy thông tin sản phẩm mới sau khi thêm kích thước thành công
            axios.get(`https://localhost:8443/api/v1/products/getProductSizeColor?productId=${productId}`, { withCredentials: true })
                .then(res => {
                    const { data } = res.data;
                    setProductColors(data);
                    setProductName(res.data.nameProduct);
                    setProductPrice(res.data.price);
                    setProductFound(true);
                })
                .catch(err => {
                    if (err.response?.status === 404) {
                        setProductFound(false); // không tìm thấy sản phẩm
                    } else {
                        console.error("Lỗi khi gọi API", err);
                    }
                });

        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra khi thêm kích thước!',
                text: error.response?.data?.error || error.message
            });
        }
    };


    return (
        <div className={"add_product"}>
            <div className="content-wrapper">
                <div className="container-xxl flex-grow-1 container-p-y">
                    <div className="row g-6">
                        <div className="card">

                            {!productId && (
                                <h3 className="card-header"><b>Thêm sản phẩm</b></h3>
                            )}

                            {productId && (
                                <h3 className="card-header"><b>Sản phẩm có ID: {productId}</b></h3>
                            )}
                            <form onSubmit={handleAddProduct}>
                                {/*<form onSubmit={productId ? handleUpdateProduct : handleAddProduct}>*/}

                                    <div className="card-body">

                                        <div className="mb-4">
                                            <label
                                                htmlFor="exampleFormControlInput1"
                                                className="form-label"
                                            >
                                                Tên sản phẩm
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập tên sản phẩm"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                htmlFor="exampleFormControlInput1"
                                                className="form-label"
                                            >
                                                Số lượng
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                                placeholder="Nhập số lượng"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                htmlFor="exampleFormControlInput1"
                                                className="form-label"
                                            >
                                                Giá sản phẩm
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={price}
                                                onChange={handlePriceChange}
                                                placeholder="Giá sản phẩm"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">Chọn loại sản phẩm</label>
                                            <select className="form-select" aria-label="Default select example"
                                                    value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                                <option value="">Chọn loại sản phẩm</option>
                                                {categories.map(cat => (
                                                    <option key={cat.category_id} value={cat.category_id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">Chọn thương hiệu</label>
                                            <select className="form-select" aria-label="Default select example"
                                                    value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                                                <option value="">Chọn thương hiệu</option>
                                                {brands.map(brand => (
                                                    <option key={brand.brand_id} value={brand.brand_id}>
                                                        {brand.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="exampleFormControlTextarea1"
                                                className="form-label"
                                            >
                                                Mô tả sản phẩm
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows={3}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                        {!productId && (
                                            <button style={{marginTop: "20px"}} type="submit"
                                                    className="btn btn-primary">
                                                Thêm sản phẩm
                                            </button>
                                        )}

                                        {productId && (
                                            <button style={{marginTop: "20px"}} type="" className="btn btn-warning">
                                                Chỉnh sửa thông tin
                                            </button>
                                        )}


                                    </div>
                                </form>
                                <div className={"showProductColorSize"}>
                                    {productFound && productColors.length > 0 && (
                                        <div className="mb-4">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Hình ảnh</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Giá tiền</th>
                                                    <th>Số lượng</th>
                                                    <th>Màu sắc</th>
                                                    <th>Kích thước</th>
                                                    <th>Sửa</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {productColors.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <img src={item.image} alt="product" width="60"/>
                                                        </td>
                                                        <td>{productName}</td>
                                                        <td>{formatVND(productPrice)}</td>
                                                        <td>{item.stock}</td>
                                                        <td>
                                                            <div className={"color"}>{item.color}</div>
                                                        </td>
                                                        <td>Size {item.size}</td>
                                                        <td>
                                                            <div className="dropdown">
                                                                <button type="button"
                                                                        className="btn p-0 dropdown-toggle hide-arrow"
                                                                        data-bs-toggle="dropdown">
                                                                    <i className="icon-base bx bx-dots-vertical-rounded"></i>
                                                                </button>
                                                                <div className="dropdown-menu">
                                                                    <a className="dropdown-item"
                                                                       href="javascript:void(0);">
                                                                        <i className="icon-base bx bx-edit-alt me-1"></i> Edit
                                                                    </a>
                                                                    <a className="dropdown-item"
                                                                       href="javascript:void(0);">
                                                                        <i className="icon-base bx bx-trash me-1"></i> Delete
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="card-header"><b>Thêm màu sắc</b></h3>
                                    <div className="card-body">
                                        <p style={{fontSize: "18px"}}>Lưu ý: Nếu chọn cùng màu sẽ cập nhật hình ảnh của sản phẩm đó</p>
                                        <div className="mb-4">
                                            <label className="form-label">Chọn màu sắc</label>
                                            <select className="form-select" aria-label="Default select example"
                                                    value={selectedColorId}
                                                    onChange={(e) => setSelectedColorId(e.target.value)}>
                                                <option value="">Chọn màu sắc</option>
                                                {colors.map(color => (
                                                    <option key={color.id} value={color.id}>
                                                        {color.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="formFileLg" className="form-label">
                                                Chọn ảnh cho sản phẩm(tương ứng với màu sắc)
                                            </label>
                                            <input
                                                className="form-control form-control-lg"
                                                id="formFileLg"
                                                type="file"
                                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                            />
                                        </div>
                                        <button
                                            style={{marginTop: "20px"}}
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleAddColorProduct}
                                        >
                                            Thêm màu sắc
                                        </button>

                                    </div>
                                </div>
                            <div>
                            <h3 className="card-header"><b>Chọn màu sắc và kích thước</b></h3>
                                <div className="card-body">

                                    <p style={{fontSize: "18px"}}>Lưu ý: Khi chọn cùng màu và kích thước thì sẽ cập nhật thêm số lượng của sản phẩm đó</p>
                                    <div className="mb-4">
                                        <label className="form-label">Chọn màu sắc của sản phẩm</label>
                                        <select className="form-select" aria-label="Default select example"
                                                value={selectedColorId}
                                                onChange={(e) => setSelectedColorId(e.target.value)}>>
                                            <option value="">Chọn màu sắc của sản phẩm</option>
                                            {productColors.map(pColor => (
                                                <option key={pColor.id} value={pColor.id}>
                                                    {pColor.color}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <div className="mb-4">
                                        <label
                                            htmlFor="exampleFormControlSelect1"
                                            className="form-label"
                                        >
                                            Chọn kích thước
                                        </label>
                                        <select className="form-select"
                                                aria-label="Default select example"
                                                value={selectedSizeId}
                                                onChange={(e) => setSelectedSizeId(e.target.value)}>>
                                            <option value="">Chọn kích thước của sản phẩm</option>
                                            {sizes.map(pSize => (
                                                <option key={pSize.size_id} value={pSize.size_id}>
                                                    {pSize.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label
                                            htmlFor="exampleFormControlInput1"
                                            className="form-label"
                                        >
                                            Số lượng
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={inputStock}
                                            onChange={(e) => setInputStock(e.target.value)}
                                            placeholder="Nhập số lượng"
                                        />
                                    </div>


                                    <button type="button" className="btn btn-primary" onClick={handleAddSizeByColor}>
                                        Thêm sản phẩm
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
