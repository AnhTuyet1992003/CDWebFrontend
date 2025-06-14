import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
import {Link, useNavigate} from "react-router-dom";
>>>>>>> main
import Chatbox from './Chatbox';
import axios from "axios";  // đúng đường dẫn file Chatbox bạn tạo
import AddToCart from "./AddToCart";
import { useTranslation } from 'react-i18next';
import './AddToCart.css'

const Home = () => {
    const { t } = useTranslation('translation');
    const [products, setProducts] = useState([]);
    const [showAddToCart, setShowAddToCart] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [sortBy, setSortBy] = useState(''); // 'price', 'nameProduct', 'categoryCode'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'

    useEffect(() => {
        fetchProducts(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const fetchProducts = async (page, size) => {
        try {
            const res = await axios.get(`https://localhost:8443/api/v1/products/list_page?page=${page}&size=${size}&isActive=true`);
            setProducts(res.data.products);
            setCurrentPage(res.data.currentPage);
            setPageSize(res.data.pageSize);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(Number(newSize));
        setCurrentPage(0); // reset về trang đầu tiên
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const handleOpenAddToCart = (producId) => {
        setSelectedProductId(producId);
        setShowAddToCart(true);
    };

    const handleCloseAddToCart = () => {
        setShowAddToCart(false);
    };

<<<<<<< HEAD
    const handleSortChange = (e) => {
        const value = e.target.value;
        if (value) {
            const [newSortBy, newSortOrder] = value.split(':');
            setSortBy(newSortBy || '');
            setSortOrder(newSortOrder || 'asc');
        } else {
            setSortBy('');
            setSortOrder('asc');
        }
    };

    // Hàm sắp xếp sản phẩm
    const sortProducts = (products, sortBy, sortOrder) => {
        if (!sortBy) return [...products]; // Trả về bản sao nếu không sắp xếp
        return [...products].sort((a, b) => {
            let valueA = a[sortBy] || '';
            let valueB = b[sortBy] || '';
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            return sortOrder === 'asc' ? (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) : (valueA > valueB ? -1 : valueA < valueB ? 1 : 0);
        });
    };

    // Hàm lấy URL hình ảnh
    const getProductImage = (product) => {
        return product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0
            ? product.imageUrls[0]
            : (product.image || '/img/default-product.jpg');
    };

    // Danh sách sản phẩm đã được sắp xếp
    const sortedProducts = sortProducts(products, sortBy, sortOrder);
=======
    const handleProductDetail = (id) => {
        navigate('/product/product-detail', {
            state: { productId: id }
        });
    };

>>>>>>> main

    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <Link to="/home" style={{cursor: 'pointer'}}><i className="fa fa-home"></i>{t('products.home')}</Link>
                                <span>{t('products.title')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="shop spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3">
                            <div className="shop__sidebar">
                                <div className="sidebar__categories">
                                    <div className="section-title">
                                        <h4>{t('products.menu')}</h4>
                                    </div>
                                    <div className="categories__accordion">
                                        <div className="accordion" id="accordionExample">
                                            <div className="card">
                                                <div className="card-heading active">
                                                    <a data-toggle="collapse" data-target="#collapseOne">Women</a>
                                                </div>
                                                <div id="collapseOne" className="collapse show"
                                                     data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li><a href="#">Coats</a></li>
                                                            <li><a href="#">Jackets</a></li>
                                                            <li><a href="#">Dresses</a></li>
                                                            <li><a href="#">Shirts</a></li>
                                                            <li><a href="#">T-shirts</a></li>
                                                            <li><a href="#">Jeans</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-heading">
                                                    <a data-toggle="collapse" data-target="#collapseTwo">Men</a>
                                                </div>
                                                <div id="collapseTwo" className="collapse"
                                                     data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li><a href="#">Coats</a></li>
                                                            <li><a href="#">Jackets</a></li>
                                                            <li><a href="#">Dresses</a></li>
                                                            <li><a href="#">Shirts</a></li>
                                                            <li><a href="#">T-shirts</a></li>
                                                            <li><a href="#">Jeans</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-heading">
                                                    <a data-toggle="collapse" data-target="#collapseThree">Kids</a>
                                                </div>
                                                <div id="collapseThree" className="collapse"
                                                     data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li><a href="#">Coats</a></li>
                                                            <li><a href="#">Jackets</a></li>
                                                            <li><a href="#">Dresses</a></li>
                                                            <li><a href="#">Shirts</a></li>
                                                            <li><a href="#">T-shirts</a></li>
                                                            <li><a href="#">Jeans</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-heading">
                                                    <a data-toggle="collapse"
                                                       data-target="#collapseFour">Accessories</a>
                                                </div>
                                                <div id="collapseFour" className="collapse"
                                                     data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li><a href="#">Coats</a></li>
                                                            <li><a href="#">Jackets</a></li>
                                                            <li><a href="#">Dresses</a></li>
                                                            <li><a href="#">Shirts</a></li>
                                                            <li><a href="#">T-shirts</a></li>
                                                            <li><a href="#">Jeans</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-heading">
                                                    <a data-toggle="collapse" data-target="#collapseFive">Cosmetic</a>
                                                </div>
                                                <div id="collapseFive" className="collapse"
                                                     data-parent="#accordionExample">
                                                    <div className="card-body">
                                                        <ul>
                                                            <li><a href="#">Coats</a></li>
                                                            <li><a href="#">Jackets</a></li>
                                                            <li><a href="#">Dresses</a></li>
                                                            <li><a href="#">Shirts</a></li>
                                                            <li><a href="#">T-shirts</a></li>
                                                            <li><a href="#">Jeans</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sidebar__filter">
                                    <div className="section-title">
                                        <h4>Shop by price</h4>
                                    </div>
                                    <div className="filter-range-wrap">
                                        <div
                                            className="price-range ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content"
                                            data-min="33" data-max="99"></div>
                                        <div className="range-slider">
                                            <div className="price-input">
                                                <p>Price:</p>
                                                <input type="text" id="minamount"/>
                                                <input type="text" id="maxamount"/>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="#">Filter</a>
                                </div>
                                <div className="sidebar__sizes">
                                    <div className="section-title">
                                        <h4>Shop by size</h4>
                                    </div>
                                    <div className="size__list">
                                        <label htmlFor="xxs">
                                            xxs
                                            <input type="checkbox" id="xxs"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="xs">
                                            xs
                                            <input type="checkbox" id="xs"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="xss">
                                            xs-s
                                            <input type="checkbox" id="xss"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="s">
                                            s
                                            <input type="checkbox" id="s"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="m">
                                            m
                                            <input type="checkbox" id="m"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="ml">
                                            m-l
                                            <input type="checkbox" id="ml"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="l">
                                            l
                                            <input type="checkbox" id="l"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="xl">
                                            xl
                                            <input type="checkbox" id="xl"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="sidebar__color">
                                    <div className="section-title">
                                        <h4>Shop by size</h4>
                                    </div>
                                    <div className="size__list color__list">
                                        <label htmlFor="black">
                                            Blacks
                                            <input type="checkbox" id="black"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="whites">
                                            Whites
                                            <input type="checkbox" id="whites"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="reds">
                                            Reds
                                            <input type="checkbox" id="reds"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="greys">
                                            Greys
                                            <input type="checkbox" id="greys"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="blues">
                                            Blues
                                            <input type="checkbox" id="blues"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="beige">
                                            Beige Tones
                                            <input type="checkbox" id="beige"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="greens">
                                            Greens
                                            <input type="checkbox" id="greens"/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <label htmlFor="yellows">
                                            Yellows
                                            <input type="checkbox" id="yellows"/>
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-9">
                            <div className="col-lg-12"
                                 style={{marginBottom: "30px", position: "relative", height: "40px"}}>
                                {/* Select nằm sát trái */}
                                <div style={{position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)"}}>
                                    <label style={{marginRight: "8px", fontWeight: "500"}}></label>
                                    <select
                                        defaultValue="9"
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "5px",
                                            border: "1px solid #ccc",
                                            fontSize: "14px",
                                            backgroundColor: "#fff",
                                            cursor: "pointer"
                                        }}
                                        onChange={(e) => handlePageSizeChange(e.target.value)}
                                    >
                                        <option value="3">3 / {t('products.page')}</option>
                                        <option value="6">6 / {t('products.page')}</option>
                                        <option defaultChecked={true} value="9">9 / {t('products.page')}</option>
                                        <option value="12">12 / {t('products.page')}</option>
                                    </select>
                                </div>

                                {/* Phân trang nằm chính giữa */}
                                <div style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)"
                                }}>
                                    <div className="pagination__option">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <a key={index} href="#" onClick={(e) => {
                                                e.preventDefault();
                                                handlePageClick(index);
                                            }}
                                               className={currentPage === index ? "active" : ""}
                                            >
                                                {index + 1}
                                            </a>
                                        ))}
                                        {currentPage < totalPages - 1 && (
                                            <a href="#" onClick={(e) => {
                                                e.preventDefault();
                                                handlePageClick(currentPage + 1);
                                            }}>
                                                <i className="fa fa-angle-right"></i>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div style={{position: "absolute", right: 0, top: "25%"}}>
                                    <label
                                        style={{marginRight: "8px", fontWeight: "500"}}>{t('products.sort_by')}:</label>
                                    <select
                                        value={`${sortBy}:${sortOrder}`}
                                        onChange={handleSortChange}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "5px",
                                            border: "1px solid #ccc",
                                            fontSize: "14px",
                                            backgroundColor: "#fff",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <option value="">{t('products.default_sort')}</option>
                                        <option value="price:asc">{t('products.price_low_to_high')}</option>
                                        <option value="price:desc">{t('products.price_high_to_low')}</option>
                                        <option value="nameProduct:desc">{t('products.name_a_to_z')}</option>
                                        <option value="nameProduct:asc">{t('products.name_z_to_a')}</option>
                                        <option value="categoryCode:asc">{t('products.category_a_to_z')}</option>
                                        <option value="categoryCode:desc">{t('products.category_z_to_a')}</option>
                                    </select>
                                </div>
                                <div style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)"
                                }}>
                                    <div className="pagination__option">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageClick(index);
                                                }}
                                                className={currentPage === index ? "active" : ""}
                                            >
                                                {index + 1}
                                            </a>
                                        ))}
                                        {currentPage < totalPages - 1 && (
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageClick(currentPage + 1);
                                                }}
                                            >
                                                <i className="fa fa-angle-right"></i>
                                            </a>
                                        )}
                                        {currentPage > 0 && (
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageClick(currentPage - 1);
                                                }}
                                            >
                                                <i className="fa fa-angle-left"></i>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                {/** nhãn new **/}
                                {/*<div className="col-lg-4 col-md-6">*/}
                                {/*    <div className="product__item">*/}
                                {/*        <div className="product__item__pic set-bg"*/}
                                {/*             style={{backgroundImage: "url('/img/shop/shop-1.jpg')"}}>*/}
                                {/*            <div className="label new">New</div>*/}
                                {/*            <ul className="product__hover">*/}
                                {/*                <li><a href="/img/shop/shop-1.jpg" className="image-popup"><span*/}
                                {/*                    className="arrow_expand"></span></a></li>*/}
                                {/*                <li><a href="#"><span className="icon_heart_alt"></span></a></li>*/}
                                {/*                <li><a href="#"><span className="icon_bag_alt"></span></a></li>*/}
                                {/*            </ul>*/}
                                {/*        </div>*/}
                                {/*        <div className="product__item__text">*/}
                                {/*            <h6><a href="#">Furry hooded parka</a></h6>*/}
                                {/*            <div className="rating">*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*            </div>*/}
                                {/*            <div className="product__price">$ 59.0</div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {sortedProducts.map((product) => (
                                    <div className="col-lg-4 col-md-6" key={product.id}>
                                        <div className="product__item">
                                            <div className="product__item__pic set-bg"
                                                 style={{backgroundImage: `url('${product.image}')`}} >
                                                <ul className="product__hover">
                                                    <li onClick={() => handleProductDetail(product.id)}><a>
                                                        <i className="fa fa-info-circle"></i></a>
                                                    </li>
                                                    <li><a href="#"><span className="icon_heart_alt"></span></a></li>
                                                    <li><a href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        handleOpenAddToCart(product.id);
                                                    }}>
                                                        <span className="icon_bag_alt"></span></a></li>
                                                </ul>
                                            </div>
                                            <div className="product__item__text">
                                                <h6 class={"name_product"}>
                                                    <div id={"nameProduct"} onClick={() => handleProductDetail(product.id)}>{product.nameProduct}</div>
                                                    {/*<Link to={`/product/${product.id}`}>{product.nameProduct}</Link>*/}
                                                </h6>
                                                <div className="rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                                <div className="product__price">{product.price.toLocaleString()}₫</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {showAddToCart && (
                                    <AddToCart productId={selectedProductId} onClose={handleCloseAddToCart}/>
                                )}

                                {/** nhãn sale **/}
                                {/*<div className="col-lg-4 col-md-6">*/}
                                {/*    <div className="product__item sale">*/}
                                {/*        <div className="product__item__pic set-bg"*/}
                                {/*             style={{backgroundImage: "url('/img/shop/shop-5.jpg')"}}>*/}
                                {/*            <div className="label">Sale</div>*/}
                                {/*            <ul className="product__hover">*/}
                                {/*                <li><a href="/img/shop/shop-5.jpg" className="image-popup"><span*/}
                                {/*                    className="arrow_expand"></span></a></li>*/}
                                {/*                <li><a href="#"><span className="icon_heart_alt"></span></a></li>*/}
                                {/*                <li><a href="#"><span className="icon_bag_alt"></span></a></li>*/}
                                {/*            </ul>*/}
                                {/*        </div>*/}
                                {/*        <div className="product__item__text">*/}
                                {/*            <h6><a href="#">Ankle-cuff sandals</a></h6>*/}
                                {/*            <div className="rating">*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*            </div>*/}
                                {/*            <div className="product__price">$ 49.0 <span>$ 59.0</span></div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/** nhãn stock hết hàng **/}
                                {/*<div className="col-lg-4 col-md-6">*/}
                                {/*    <div className="product__item">*/}
                                {/*        <div className="product__item__pic set-bg"*/}
                                {/*             style={{backgroundImage: "url('/img/shop/shop-8.jpg')"}}>*/}
                                {/*            <div className="label stockout stockblue">Out Of Stock</div>*/}
                                {/*            <ul className="product__hover">*/}
                                {/*                <li><a href="/img/shop/shop-8.jpg" className="image-popup"><span*/}
                                {/*                    className="arrow_expand"></span></a></li>*/}
                                {/*                <li><a href="#"><span className="icon_heart_alt"></span></a></li>*/}
                                {/*                <li><a href="#"><span className="icon_bag_alt"></span></a></li>*/}
                                {/*            </ul>*/}
                                {/*        </div>*/}
                                {/*        <div className="product__item__text">*/}
                                {/*            <h6><a href="#">Cotton T-Shirt</a></h6>*/}
                                {/*            <div className="rating">*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*                <i className="fa fa-star"></i>*/}
                                {/*            </div>*/}
                                {/*            <div className="product__price">$ 59.0</div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="col-lg-12 text-center">*/}
                                {/*    <div className="pagination__option">*/}
                                {/*        {[...Array(totalPages)].map((_, index) => (*/}
                                {/*            <a key={index} href="#" onClick={(e) => {*/}
                                {/*                e.preventDefault();*/}
                                {/*                handlePageClick(index);*/}
                                {/*            }}*/}
                                {/*               className={currentPage === index ? "active" : ""}*/}
                                {/*            >*/}
                                {/*                {index + 1}*/}
                                {/*            </a>*/}
                                {/*        ))}*/}
                                {/*        {currentPage < totalPages - 1 && (*/}
                                {/*            <a href="#" onClick={(e) => {*/}
                                {/*                e.preventDefault();*/}
                                {/*                handlePageClick(currentPage + 1);*/}
                                {/*            }}>*/}
                                {/*                <i className="fa fa-angle-right"></i>*/}
                                {/*            </a>*/}
                                {/*        )}*/}
                                {/*    </div>*/}

                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
                {/*<Chatbox />*/}
            </section>
        </>
    );
}

export default Home;