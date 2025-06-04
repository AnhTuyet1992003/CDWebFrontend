import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';

// API configuration
const API_BASE_URL = 'https://localhost:8443/api/v1';
const DAILY_REVENUE_ENDPOINT = '/orders/daily-revenue-between';
const YEARLY_REVENUE_ENDPOINT = '/orders/list-total-revenue-by-year';
const TOP_PRODUCTS_ENDPOINT = '/orders/top-10-best-selling-products';
const MONTHLY_REVENUE_ENDPOINT = '/orders/list-total-revenue-by-month-in-year';

// Disable SSL verification for localhost (development only)
if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Get JWT token from cookies
const getAuthToken = () => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
};

const TestAdmin = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState(new Date());
    const [revenueData, setRevenueData] = useState({});
    const [yearlyRevenue, setYearlyRevenue] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [growthYear, setGrowthYear] = useState(new Date().getFullYear());
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [yearlyLoading, setYearlyLoading] = useState(false);
    const [yearlyError, setYearlyError] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [topProductsLoading, setTopProductsLoading] = useState(false);
    const [topProductsError, setTopProductsError] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState({});
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    const [monthlyError, setMonthlyError] = useState(null);

    // Refs để lưu trữ các instance của ApexCharts
    const dailyChartRef = useRef(null);
    const yearlyChartRef = useRef(null);
    const growthChartRef = useRef(null);

    // Debounced year change handlers
    const debouncedSetYear = useCallback(debounce(value => setYear(Number(value)), 300), []);
    const debouncedSetGrowthYear = useCallback(debounce(value => setGrowthYear(Number(value)), 300), []);

    // Fetch daily revenue data
    const fetchRevenueData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            if (!token) throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${API_BASE_URL}${DAILY_REVENUE_ENDPOINT}`, {
                params: {
                    'start-date': startDate.toISOString().split('T')[0],
                    'end-date': endDate.toISOString().split('T')[0],
                },
                headers,
            });
            setRevenueData(response.data);
        } catch (error) {
            const message =
                error.response?.status === 401
                    ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                    : `Không thể tải dữ liệu doanh thu: ${error.message}`;
            setError(message);
            setRevenueData({});
        } finally {
            setLoading(false);
        }
    };

    // Fetch yearly revenue data
    const fetchYearlyRevenue = async () => {
        setYearlyLoading(true);
        setYearlyError(null);
        try {
            const token = getAuthToken();
            if (!token) throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${API_BASE_URL}${YEARLY_REVENUE_ENDPOINT}`, {
                params: { year },
                headers,
            });
            setYearlyRevenue(response.data);
        } catch (error) {
            const message =
                error.response?.status === 401
                    ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                    : `Không thể tải dữ liệu doanh thu hàng năm: ${error.message}`;
            setYearlyError(message);
            setYearlyRevenue(Array(12).fill(0));
        } finally {
            setYearlyLoading(false);
        }
    };

    // Fetch top 10 best-selling products
    const fetchTopProducts = async () => {
        setTopProductsLoading(true);
        setTopProductsError(null);
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/home');
                throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            }
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${API_BASE_URL}${TOP_PRODUCTS_ENDPOINT}`, { headers });
            setTopProducts(response.data);
        } catch (error) {
            const message =
                error.response?.status === 401
                    ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                    : `Không thể tải danh sách sản phẩm bán chạy: ${error.message}`;
            setTopProductsError(message);
            setTopProducts([]);
        } finally {
            setTopProductsLoading(false);
        }
    };

    // Fetch monthly revenue data
    const fetchMonthlyRevenue = async () => {
        setMonthlyLoading(true);
        setMonthlyError(null);
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/home');
                throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
            }
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${API_BASE_URL}${MONTHLY_REVENUE_ENDPOINT}`, {
                params: { year: growthYear },
                headers,
            });
            setMonthlyRevenue(response.data);
        } catch (error) {
            const message =
                error.response?.status === 401
                    ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                    : `Không thể tải dữ liệu doanh thu theo tháng: ${error.message}`;
            setMonthlyError(message);
            setMonthlyRevenue({});
        } finally {
            setMonthlyLoading(false);
        }
    };

    // Fetch data on mount or when dependencies change
    useEffect(() => {
        fetchRevenueData();
    }, [startDate, endDate]);

    useEffect(() => {
        fetchYearlyRevenue();
    }, [year]);

    useEffect(() => {
        fetchMonthlyRevenue();
    }, [growthYear]);

    useEffect(() => {
        fetchTopProducts();
    }, []);

    // Render daily revenue chart
    useEffect(() => {
        if (!window.ApexCharts) {
            setError('Thư viện ApexCharts chưa được tải.');
            return;
        }
        if (Object.keys(revenueData).length === 0) return;

        const chartElement = document.querySelector('#totalRevenueChart');
        if (!chartElement) {
            setError('Không tìm thấy container biểu đồ.');
            return;
        }

        // Xóa biểu đồ cũ nếu tồn tại
        if (dailyChartRef.current) {
            dailyChartRef.current.destroy();
            dailyChartRef.current = null;
        }

        const options = {
            series: [{ name: 'Doanh thu', data: Object.values(revenueData) }],
            chart: { type: 'line', height: 350 },
            xaxis: {
                categories: Object.keys(revenueData).map(dateStr => format(new Date(dateStr), 'dd/MM/yyyy')),
            },
            yaxis: { title: { text: 'Doanh thu ($)' } },
            stroke: { curve: 'smooth', width: 3 },
            colors: ['#00C851'],
            tooltip: { y: { formatter: val => `$${val.toFixed(2)}` } },
        };

        dailyChartRef.current = new window.ApexCharts(chartElement, options);
        dailyChartRef.current.render();

        return () => {
            if (dailyChartRef.current) {
                dailyChartRef.current.destroy();
                dailyChartRef.current = null;
            }
        };
    }, [revenueData]);

    // Render yearly revenue chart
    useEffect(() => {
        if (!window.ApexCharts) {
            setYearlyError('Thư viện ApexCharts chưa được tải.');
            return;
        }
        if (yearlyRevenue.length !== 12) return;

        const chartElement = document.querySelector('#incomeChart');
        if (!chartElement) {
            setYearlyError('Không tìm thấy container biểu đồ.');
            return;
        }

        // Xóa biểu đồ cũ nếu tồn tại
        if (yearlyChartRef.current) {
            yearlyChartRef.current.destroy();
            yearlyChartRef.current = null;
        }

        const options = {
            series: [{ name: 'Doanh thu', data: yearlyRevenue }],
            chart: { type: 'line', height: 350, zoom: { enabled: false } },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: {
                categories: [
                    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
                ],
            },
            yaxis: { title: { text: 'Doanh thu ($)' } },
            grid: { borderColor: '#f1f1f1' },
            colors: ['#00C851'],
            tooltip: { y: { formatter: val => `$${val.toFixed(2)}` } },
        };

        yearlyChartRef.current = new window.ApexCharts(chartElement, options);
        yearlyChartRef.current.render();

        return () => {
            if (yearlyChartRef.current) {
                yearlyChartRef.current.destroy();
                yearlyChartRef.current = null;
            }
        };
    }, [yearlyRevenue]);

    // Render growth chart
    useEffect(() => {
        if (!window.ApexCharts) {
            setMonthlyError('Thư viện ApexCharts chưa được tải.');
            return;
        }
        if (Object.keys(monthlyRevenue).length === 0) return;

        const currentMonth = new Date().getMonth() + 1;
        const months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
        ].slice(0, currentMonth);

        const revenueValues = Object.keys(monthlyRevenue)
            .filter(key => parseInt(key) <= currentMonth)
            .map(key => monthlyRevenue[key]);

        const chartElement = document.querySelector('#growthChart');
        if (!chartElement) {
            setMonthlyError('Không tìm thấy container biểu đồ.');
            return;
        }

        // Xóa biểu đồ cũ nếu tồn tại
        if (growthChartRef.current) {
            growthChartRef.current.destroy();
            growthChartRef.current = null;
        }

        const options = {
            series: revenueValues.length > 0 ? revenueValues : [0],
            chart: { type: 'pie', height: 450 },
            labels: months,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: { width: 250 },
                        legend: { position: 'bottom' },
                    },
                },
            ],
            colors: ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#673AB7'],
            tooltip: { y: { formatter: val => `${val.toFixed(2)} VND` } },
        };

        growthChartRef.current = new window.ApexCharts(chartElement, options);
        growthChartRef.current.render();

        return () => {
            if (growthChartRef.current) {
                growthChartRef.current.destroy();
                growthChartRef.current = null;
            }
        };
    }, [monthlyRevenue]);

    const calculateGrowth = () => {
        const values = Object.values(revenueData);
        if (values.length < 2) return '0.0';
        const first = values[0];
        const last = values[values.length - 1];
        return (((last - first) / first) * 100).toFixed(1);
    };

    const getTotalRevenue = () => {
        return Object.values(revenueData).reduce((sum, val) => sum + val, 0).toFixed(2);
    };

    // Generate year options
    const yearOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                {/* Congratulatory card */}
                <div className="col-xxl-8 mb-6 order-0">
                    <div className="card">
                        <div className="d-flex align-items-start row">
                            <div className="col-sm-7">
                                <div className="card-body">
                                    <h5 className="card-title text-primary mb-3">Chúc mừng John! 🎉</h5>
                                    <p className="mb-6">
                                        Bạn đã đạt doanh số cao hơn 72% hôm nay.<br />Xem huy hiệu mới trong hồ sơ của bạn.
                                    </p>
                                    <a href="#" className="btn btn-sm btn-outline-primary">Xem huy hiệu</a>
                                </div>
                            </div>
                            <div className="col-sm-5 text-center text-sm-left">
                                <div className="card-body pb-0 px-0 px-md-6">
                                    <img
                                        src="/img-admin/illustrations/man-with-laptop-light.png"
                                        height="175"
                                        alt="Huy hiệu người dùng"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Profit and Sales cards */}
                <div className="col-xxl-4 col-lg-12 col-md-4 order-1">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-6 mb-6">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between mb-4">
                                        <div className="avatar flex-shrink-0">
                                            <img
                                                src="/img-admin/icons/unicons/chart-success.png"
                                                alt="Biểu đồ thành công"
                                                className="rounded"
                                            />
                                        </div>
                                        <div className="dropdown">
                                            <button
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt3"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="bx bx-dots-vertical-rounded text-body-secondary"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                                <a className="dropdown-item" href="#">Xem thêm</a>
                                                <a className="dropdown-item" href="#">Xóa</a>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-1">Lợi nhuận</p>
                                    <h4 className="card-title mb-3">$12,628</h4>
                                    <small className="text-success fw-medium">
                                        <i className="bx bx-up-arrow-alt"></i> +72.80%
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-6 mb-6">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between mb-4">
                                        <div className="avatar flex-shrink-0">
                                            <img
                                                src="/img-admin/icons/unicons/wallet-info.png"
                                                alt="Thông tin ví"
                                                className="rounded"
                                            />
                                        </div>
                                        <div className="dropdown">
                                            <button
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt6"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="bx bx-dots-vertical-rounded text-body-secondary"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt6">
                                                <a className="dropdown-item" href="#">Xem thêm</a>
                                                <a className="dropdown-item" href="#">Xóa</a>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-1">Doanh số</p>
                                    <h4 className="card-title mb-3">$4,679</h4>
                                    <small className="text-success fw-medium">
                                        <i className="bx bx-up-arrow-alt"></i> +28.42%
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Total Revenue and Growth Chart */}
                <div className="col-12 col-xxl-8 order-2 order-md-3 order-xxl-2 mb-6 total-revenue">
                    <div className="card">
                        <div className="row row-bordered g-0">
                            <div className="col-lg-8">
                                <div className="card-header d-flex align-items-center justify-content-between">
                                    <div className="card-title mb-0">
                                        <h5 className="m-0 me-2">Tổng doanh thu</h5>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <div>
                                            <label className="form-label">Ngày bắt đầu</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={date => setStartDate(date)}
                                                className="form-control"
                                                dateFormat="yyyy-MM-dd"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Ngày kết thúc</label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={date => setEndDate(date)}
                                                className="form-control"
                                                dateFormat="yyyy-MM-dd"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div id="totalRevenueChart" className="px-3">
                                    {loading && (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Đang tải...</span>
                                            </div>
                                        </div>
                                    )}
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    {!loading && Object.keys(revenueData).length === 0 && !error && (
                                        <div className="text-center">Không có dữ liệu. Vui lòng chọn khoảng thời gian hoặc đăng nhập.</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card-body px-xl-9 py-12 d-flex align-items-center flex-column">
                                    <div className="text-center mb-6">
                                        <h5 className="m-0 me-2">Phân bổ doanh thu theo tháng</h5>
                                        <select
                                            value={growthYear}
                                            onChange={e => debouncedSetGrowthYear(e.target.value)}
                                            className="form-select mt-2"
                                        >
                                            {yearOptions.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div id="growthChart" className="w-100">
                                        {monthlyLoading && (
                                            <div className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Đang tải...</span>
                                                </div>
                                            </div>
                                        )}
                                        {monthlyError && <div className="alert alert-danger">{monthlyError}</div>}
                                        {!monthlyLoading && Object.keys(monthlyRevenue).length === 0 && !monthlyError && (
                                            <div className="text-center">Không có dữ liệu doanh thu theo tháng.</div>
                                        )}
                                    </div>
                                    <div className="text-center fw-medium my-6">{calculateGrowth()}% Tăng trưởng kỳ</div>
                                    <div className="d-flex gap-11 justify-content-between">
                                        <div className="d-flex">
                                            <div className="avatar me-2">
                                                <span className="avatar-initial rounded-2 bg-label-primary">
                                                    <i className="bx bx-dollar icon-lg text-primary"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small>{startDate.getFullYear()}</small>
                                                <h6 className="mb-0">${Object.values(revenueData)[0]?.toFixed(2) || '0.00'}k</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="avatar me-2">
                                                <span className="avatar-initial rounded-2 bg-label-info">
                                                    <i className="bx bx-wallet icon-lg text-info"></i>
                                                </span>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <small>{endDate.getFullYear()}</small>
                                                <h6 className="mb-0">${Object.values(revenueData)[Object.values(revenueData).length - 1]?.toFixed(2) || '0.00'}k</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Yearly Revenue and Other Cards */}
                <div className="col-12 col-md-8 col-lg-12 col-xxl-4 order-3 order-md-2 profile-report">
                    <div className="row">
                        <div className="col-6 mb-6 payments">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between mb-4">
                                        <div className="avatar flex-shrink-0">
                                            <img src="/img-admin/icons/unicons/paypal.png" alt="Paypal" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt4"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="bx bx-dots-vertical-rounded text-body-secondary"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                                                <a className="dropdown-item" href="#">Xem thêm</a>
                                                <a className="dropdown-item" href="#">Xóa</a>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-1">Thanh toán</p>
                                    <h4 className="card-title mb-3">$2,456</h4>
                                    <small className="text-danger fw-medium">
                                        <i className="bx bx-down-arrow-alt"></i> -14.82%
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-6 transactions">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between mb-4">
                                        <div className="avatar flex-shrink-0">
                                            <img src="/img-admin/icons/unicons/cc-primary.png" alt="Thẻ tín dụng" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt1"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="bx bx-dots-vertical-rounded text-body-secondary"></i>
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="cardOpt1">
                                                <a className="dropdown-item" href="#">Xem thêm</a>
                                                <a className="dropdown-item" href="#">Xóa</a>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-1">Giao dịch</p>
                                    <h4 className="card-title mb-3">$14,857</h4>
                                    <small className="text-success fw-medium">
                                        <i className="bx bx-up-arrow-alt"></i> +28.14%
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-6 profile-report">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center flex-sm-row flex-column gap-10 flex-wrap">
                                        <div className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                                            <div className="card-title mb-6">
                                                <h5 className="text-nowrap mb-1">Doanh thu hàng năm</h5>
                                                <span className="badge bg-label-warning">NĂM {year}</span>
                                            </div>
                                            <div className="mt-sm-auto">
                                                <label className="form-label me-2">Chọn năm:</label>
                                                <select
                                                    value={year}
                                                    onChange={e => debouncedSetYear(e.target.value)}
                                                    className="form-select"
                                                >
                                                    {yearOptions.map(y => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div id="incomeChart" className="w-100">
                                            {yearlyLoading && (
                                                <div className="text-center">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Đang tải...</span>
                                                    </div>
                                                </div>
                                            )}
                                            {yearlyError && <div className="alert alert-danger">{yearlyError}</div>}
                                            {!yearlyLoading && yearlyRevenue.length === 0 && !yearlyError && (
                                                <div className="text-center">Không có dữ liệu doanh thu.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Top Products and Transactions */}
            <div className="row">
                <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-6">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between">
                            <div className="card-title mb-0">
                                <h5 className="mb-1 me-2">Top 10 Sản Phẩm Bán Chạy</h5>
                                <p className="card-subtitle">Sản phẩm bán chạy nhất</p>
                            </div>
                            <div className="dropdown">
                                <button
                                    className="btn text-body-secondary p-0"
                                    type="button"
                                    id="orederStatistics"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="bx bx-dots-vertical-rounded icon-lg"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="orederStatistics">
                                    <a className="dropdown-item" href="#" onClick={fetchTopProducts}>Làm mới</a>
                                    <a className="dropdown-item" href="#">Chia sẻ</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-6">
                                <div className="d-flex flex-column align-items-center gap-1">
                                    <h3 className="mb-1">{topProducts.reduce((sum, p) => sum + p.totalQuantity, 0)}</h3>
                                    <small>Tổng số lượng bán</small>
                                </div>
                                <div id="orderStatisticsChart"></div>
                            </div>
                            {topProductsLoading && (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Đang tải...</span>
                                    </div>
                                </div>
                            )}
                            {topProductsError && <div className="alert alert-danger">{topProductsError}</div>}
                            {!topProductsLoading && !topProductsError && topProducts.length === 0 && (
                                <div className="text-center">Không có dữ liệu sản phẩm.</div>
                            )}
                            {!topProductsLoading && !topProductsError && topProducts.length > 0 && (
                                <ul className="p-0 m-0">
                                    {topProducts.map((product, index) => (
                                        <li key={product.productId} className="d-flex align-items-center mb-5">
                                            <div className="avatar flex-shrink-0 me-3">
                                                <span className={`avatar-initial rounded bg-label-${['primary', 'success', 'info', 'secondary', 'warning', 'danger', 'dark', 'primary', 'success', 'info'][index % 10]}`}>
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                <div className="me-2">
                                                    <h6 className="mb-0">{product.productName}</h6>
                                                    <small>ID: {product.productId}</small>
                                                </div>
                                                <div className="user-progress">
                                                    <h6 className="mb-0">{product.totalQuantity} sản phẩm</h6>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4 order-1 mb-6">
                    <div className="card h-100">
                        <div className="card-header nav-align-top">
                            <ul className="nav nav-pills flex-wrap row-gap-2" role="tablist">
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link active"
                                        role="tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#navs-tabs-line-card-income"
                                        aria-controls="navs-tabs-line-card-income"
                                        aria-selected="true"
                                    >
                                        Thu nhập
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button type="button" className="nav-link" role="tab">Chi phí</button>
                                </li>
                                <li className="nav-item">
                                    <button type="button" className="nav-link" role="tab">Lợi nhuận</button>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content p-0">
                                <div className="tab-pane fade show active" id="navs-tabs-line-card-income" role="tabpanel">
                                    <div className="d-flex mb-6">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src="/img-admin/icons/unicons/wallet.png" alt="Ví người dùng" />
                                        </div>
                                        <div>
                                            <p className="mb-0">Tổng số dư</p>
                                            <div className="d-flex align-items-center">
                                                <h6 className="mb-0 me-1">$459.10</h6>
                                                <small className="text-success fw-medium">
                                                    <i className="bx bx-chevron-up icon-lg"></i> 42.9%
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="incomeChart"></div>
                                    <div className="d-flex align-items-center justify-content-center mt-6 gap-3">
                                        <div className="flex-shrink-0">
                                            <div id="expensesOfWeek"></div>
                                        </div>
                                        <div>
                                            <h6 className="mb-0">Thu nhập tuần này</h6>
                                            <small>Ít hơn tuần trước $39k</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4 order-2 mb-6">
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <h5 className="card-title m-0 me-2">Giao dịch</h5>
                            <div className="dropdown">
                                <button
                                    className="btn text-body-secondary p-0"
                                    type="button"
                                    id="transactionID"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="bx bx-dots-vertical-rounded icon-lg"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                                    <a className="dropdown-item" href="#">28 ngày trước</a>
                                    <a className="dropdown-item" href="#">Tháng trước</a>
                                    <a className="dropdown-item" href="#">Năm trước</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pt-4">
                            <ul className="p-0 m-0">
                                <li className="d-flex align-items-center mb-6">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/img-admin/icons/unicons/paypal.png" alt="Paypal" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="d-block">Paypal</small>
                                            <h6 className="fw-normal mb-0">Gửi tiền</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-2">
                                            <h6 className="fw-normal mb-0">+82.6</h6>
                                            <span className="text-body-secondary">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex align-items-center mb-6">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/img-admin/icons/unicons/wallet.png" alt="Ví" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="d-block">Ví</small>
                                            <h6 className="fw-normal mb-0">Mac'D</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-2">
                                            <h6 className="fw-normal mb-0">+270.69</h6>
                                            <span className="text-body-secondary">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex align-items-center mb-6">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/img-admin/icons/unicons/chart.png" alt="Chuyển khoản" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="d-block">Chuyển khoản</small>
                                            <h6 className="fw-normal mb-0">Hoàn tiền</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-2">
                                            <h6 className="fw-normal mb-0">+637.91</h6>
                                            <span className="text-body-secondary">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex align-items-center mb-6">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/img-admin/icons/unicons/cc-primary.png" alt="Thẻ tín dụng" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="d-block">Thẻ tín dụng</small>
                                            <h6 className="fw-normal mb-0">Đặt món ăn</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-2">
                                            <h6 className="fw-normal mb-0">-838.71</h6>
                                            <span className="text-body-secondary">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex align-items-center mb-6">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/img-admin/icons/unicons/wallet.png" alt="Ví" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="d-block">Ví</small>
                                            <h6 className="fw-normal mb-0">Starbucks</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-2">
                                            <h6 className="fw-normal mb-0">+203.33</h6>
                                            <span className="text-body-secondary">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex align-items-center">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="/img-admin/icons/unicons/cc-warning.png" alt="Mastercard" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="d-block">Mastercard</small>
                                            <h6 className="fw-normal mb-0">Đặt món ăn</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-2">
                                            <h6 className="fw-normal mb-0">-92.45</h6>
                                            <span className="text-body-secondary">USD</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestAdmin;