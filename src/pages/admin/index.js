import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";




const TestAdmin = () => {
    const [year, setYear] = useState(new Date().getFullYear() - 1);
    useEffect(() => {
    // Giả sử dashboards-analytics.js đã import bên ngoài hoặc gắn vào index.html
    if (window.ApexCharts) {
        const options = {
            series: [{
                name: 'Revenue',
                data: [11, 15, 20, 25, 30, 40]
            }],
            chart: {
                type: 'line',
                height: 350
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            }
        };

        const chart = new window.ApexCharts(
            document.querySelector("#totalRevenueChart"),
            options
        );

        chart.render();

        // Clean up khi component bị hủy
        return () => chart.destroy();
    }
}, []);

    useEffect(() => {
        if (window.ApexCharts) {
            const options = {
                series: [44, 55, 13, 43, 22], // Dữ liệu mẫu cho biểu đồ hình tròn
                chart: {
                    type: "pie", // Thay đổi thành pie chart
                    height: 350,
                },
                labels: ["Jan", "Feb", "Mar", "Apr", "May"], // Nhãn cho các phần của biểu đồ
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                            },
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                ],
            };

            // Khởi tạo biểu đồ ApexCharts
            const chart = new window.ApexCharts(
                document.querySelector("#growthChart"),
                options
            );

            chart.render();

            // Clean up khi component bị hủy
            return () => {
                chart.destroy();
            };
        }
    }, []);

    useEffect(() => {
        if (window.ApexCharts) {
            const options = {
                series: [
                    {
                        name: "Income",
                        data: [23, 44, 35, 51, 49, 62, 69, 91], // Dữ liệu mẫu cho biểu đồ
                    },
                ],
                chart: {
                    type: "line", // Kiểu biểu đồ là line (sóng lượn)
                    height: 350,
                    zoom: {
                        enabled: false, // Tắt zoom
                    },
                },
                stroke: {
                    curve: "smooth", // Để vẽ sóng lượn mượt mà
                    width: 3, // Độ dày của đường biểu đồ
                },
                xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"], // Các tháng trong năm
                },
                yaxis: {
                    title: {
                        text: "Amount ($)",
                    },
                },
                grid: {
                    borderColor: "#f1f1f1", // Màu sắc lưới
                },
                colors: ["#00C851"], // Màu đường biểu đồ (green)
                tooltip: {
                    y: {
                        formatter: (val) => `$${val}`, // Hiển thị giá trị với dấu $ khi hover
                    },
                },
            };

            // Khởi tạo biểu đồ ApexCharts
            const chart = new window.ApexCharts(
                document.querySelector("#incomeChart"),
                options
            );

            chart.render();

            // Clean up khi component bị hủy
            return () => {
                chart.destroy();
            };
        }
    }, []);

    return (

        <>
                        <div className="container-xxl flex-grow-1 container-p-y">
                            <div className="row">
                                <div className="col-xxl-8 mb-6 order-0">
                                    <div className="card">
                                        <div className="d-flex align-items-start row">
                                            <div className="col-sm-7">
                                                <div className="card-body">
                                                    <h5 className="card-title text-primary mb-3">Congratulations John!
                                                        🎉</h5>
                                                    <p className="mb-6">
                                                        You have done 72% more sales today.<br/>Check your new badge in
                                                        your profile.
                                                    </p>

                                                    <a href="javascript:;" className="btn btn-sm btn-outline-primary">View
                                                        Badges</a>
                                                </div>
                                            </div>
                                            <div className="col-sm-5 text-center text-sm-left">
                                                <div className="card-body pb-0 px-0 px-md-6">
                                                    <img
                                                        src="/img-admin/illustrations/man-with-laptop-light.png"
                                                        height="175"
                                                        alt="View Badge User"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-lg-12 col-md-4 order-1">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-12 col-6 mb-6">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div
                                                        className="card-title d-flex align-items-start justify-content-between mb-4">
                                                        <div className="avatar flex-shrink-0">
                                                            <img
                                                                src="/img-admin/icons/unicons/chart-success.png"
                                                                alt="chart success"
                                                                className="rounded"/>
                                                        </div>
                                                        <div className="dropdown">
                                                            <button
                                                                className="btn p-0"
                                                                type="button"
                                                                id="cardOpt3"
                                                                data-bs-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false">
                                                                <i className="icon-base bx bx-dots-vertical-rounded text-body-secondary"></i>
                                                            </button>
                                                            <div className="dropdown-menu dropdown-menu-end"
                                                                 aria-labelledby="cardOpt3">
                                                                <a className="dropdown-item" href="#">View
                                                                    More</a>
                                                                <a className="dropdown-item"
                                                                   href="#">Delete</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-1">Profit</p>
                                                    <h4 className="card-title mb-3">$12,628</h4>
                                                    <small className="text-success fw-medium"
                                                    ><i className="icon-base bx bx-up-arrow-alt"></i> +72.80%</small
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12 col-6 mb-6">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div
                                                        className="card-title d-flex align-items-start justify-content-between mb-4">
                                                        <div className="avatar flex-shrink-0">
                                                            <img
                                                                src="/img-admin/icons/unicons/wallet-info.png"
                                                                alt="wallet info"
                                                                className="rounded"/>
                                                        </div>
                                                        <div className="dropdown">
                                                            <button
                                                                className="btn p-0"
                                                                type="button"
                                                                id="cardOpt6"
                                                                data-bs-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false">
                                                                <i className="icon-base bx bx-dots-vertical-rounded text-body-secondary"></i>
                                                            </button>
                                                            <div className="dropdown-menu dropdown-menu-end"
                                                                 aria-labelledby="cardOpt6">
                                                                <a className="dropdown-item" href="#">View
                                                                    More</a>
                                                                <a className="dropdown-item"
                                                                   href="#">Delete</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-1">Sales</p>
                                                    <h4 className="card-title mb-3">$4,679</h4>
                                                    <small className="text-success fw-medium"
                                                    ><i className="icon-base bx bx-up-arrow-alt"></i> +28.42%</small
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-xxl-8 order-2 order-md-3 order-xxl-2 mb-6 total-revenue">
                                    <div className="card">
                                        <div className="row row-bordered g-0">
                                            <div className="col-lg-8">
                                                <div
                                                    className="card-header d-flex align-items-center justify-content-between">
                                                    <div className="card-title mb-0">
                                                        <h5 className="m-0 me-2">Total Revenue</h5>
                                                    </div>
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn p-0"
                                                            type="button"
                                                            id="totalRevenue"
                                                            data-bs-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false">
                                                            <i className="icon-base bx bx-dots-vertical-rounded icon-lg text-body-secondary"></i>
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-end"
                                                             aria-labelledby="totalRevenue">
                                                            <a className="dropdown-item" href="#">Select
                                                                All</a>
                                                            <a className="dropdown-item"
                                                               href="#">Refresh</a>
                                                            <a className="dropdown-item"
                                                               href="#">Share</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="totalRevenueChart" className="px-3"></div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div
                                                    className="card-body px-xl-9 py-12 d-flex align-items-center flex-column">
                                                    <div className="text-center mb-6">
                                                        <div className="btn-group">
                                                            <button type="button" className="btn btn-outline-primary">
                                                                <script>
                                                                    document.write(new Date().getFullYear() - 1);
                                                                </script>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false">
                                                                <span className="visually-hidden">Toggle Dropdown</span>
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li><a className="dropdown-item"
                                                                       href="#">2021</a></li>
                                                                <li><a className="dropdown-item"
                                                                       href="#">2020</a></li>
                                                                <li><a className="dropdown-item"
                                                                       href="#">2019</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div id="growthChart"></div>
                                                    <div className="text-center fw-medium my-6">62% Company Growth</div>

                                                    <div className="d-flex gap-11 justify-content-between">
                                                        <div className="d-flex">
                                                            <div className="avatar me-2">
                                <span className="avatar-initial rounded-2 bg-label-primary"
                                ><i className="icon-base bx bx-dollar icon-lg text-primary"></i
                                ></span>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <small>
                                                                    <script>
                                                                        document.write(new Date().getFullYear() - 1);
                                                                    </script>
                                                                </small>
                                                                <h6 className="mb-0">$32.5k</h6>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex">
                                                            <div className="avatar me-2">
                                <span className="avatar-initial rounded-2 bg-label-info"
                                ><i className="icon-base bx bx-wallet icon-lg text-info"></i
                                ></span>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <small>
                                                                    <script>
                                                                        document.write(new Date().getFullYear() - 2);
                                                                    </script>
                                                                </small>
                                                                <h6 className="mb-0">$41.2k</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-8 col-lg-12 col-xxl-4 order-3 order-md-2 profile-report">
                                    <div className="row">
                                        <div className="col-6 mb-6 payments">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div
                                                        className="card-title d-flex align-items-start justify-content-between mb-4">
                                                        <div className="avatar flex-shrink-0">
                                                            <img src="/img-admin/icons/unicons/paypal.png"
                                                                 alt="paypal" className="rounded"/>
                                                        </div>
                                                        <div className="dropdown">
                                                            <button
                                                                className="btn p-0"
                                                                type="button"
                                                                id="cardOpt4"
                                                                data-bs-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false">
                                                                <i className="icon-base bx bx-dots-vertical-rounded text-body-secondary"></i>
                                                            </button>
                                                            <div className="dropdown-menu dropdown-menu-end"
                                                                 aria-labelledby="cardOpt4">
                                                                <a className="dropdown-item" href="#">View
                                                                    More</a>
                                                                <a className="dropdown-item"
                                                                   href="#">Delete</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-1">Payments</p>
                                                    <h4 className="card-title mb-3">$2,456</h4>
                                                    <small className="text-danger fw-medium"
                                                    ><i className="icon-base bx bx-down-arrow-alt"></i> -14.82%</small
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 mb-6 transactions">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div
                                                        className="card-title d-flex align-items-start justify-content-between mb-4">
                                                        <div className="avatar flex-shrink-0">
                                                            <img src="/img-admin/icons/unicons/cc-primary.png"
                                                                 alt="Credit Card" className="rounded"/>
                                                        </div>
                                                        <div className="dropdown">
                                                            <button
                                                                className="btn p-0"
                                                                type="button"
                                                                id="cardOpt1"
                                                                data-bs-toggle="dropdown"
                                                                aria-haspopup="true"
                                                                aria-expanded="false">
                                                                <i className="icon-base bx bx-dots-vertical-rounded text-body-secondary"></i>
                                                            </button>
                                                            <div className="dropdown-menu" aria-labelledby="cardOpt1">
                                                                <a className="dropdown-item" href="#">View
                                                                    More</a>
                                                                <a className="dropdown-item"
                                                                   href="#">Delete</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-1">Transactions</p>
                                                    <h4 className="card-title mb-3">$14,857</h4>
                                                    <small className="text-success fw-medium"
                                                    ><i className="icon-base bx bx-up-arrow-alt"></i> +28.14%</small
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-6 profile-report">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div
                                                        className="d-flex justify-content-between align-items-center flex-sm-row flex-column gap-10 flex-wrap">
                                                        <div
                                                            className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                                                            <div className="card-title mb-6">
                                                                <h5 className="text-nowrap mb-1">Profile Report</h5>
                                                                <span
                                                                    className="badge bg-label-warning">YEAR 2022</span>
                                                            </div>
                                                            <div className="mt-sm-auto">
                                <span className="text-success text-nowrap fw-medium"
                                ><i className="icon-base bx bx-up-arrow-alt"></i> 68.2%</span
                                >
                                                                <h4 className="mb-0">$84,686k</h4>
                                                            </div>
                                                        </div>
                                                        <div id="profileReportChart"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-6">
                                    <div className="card h-100">
                                        <div className="card-header d-flex justify-content-between">
                                            <div className="card-title mb-0">
                                                <h5 className="mb-1 me-2">Order Statistics</h5>
                                                <p className="card-subtitle">42.82k Total Sales</p>
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    className="btn text-body-secondary p-0"
                                                    type="button"
                                                    id="orederStatistics"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false">
                                                    <i className="icon-base bx bx-dots-vertical-rounded icon-lg"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end"
                                                     aria-labelledby="orederStatistics">
                                                    <a className="dropdown-item" href="#">Select
                                                        All</a>
                                                    <a className="dropdown-item" href="#">Refresh</a>
                                                    <a className="dropdown-item" href="#">Share</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-6">
                                                <div className="d-flex flex-column align-items-center gap-1">
                                                    <h3 className="mb-1">8,258</h3>
                                                    <small>Total Orders</small>
                                                </div>
                                                <div id="orderStatisticsChart"></div>
                                            </div>
                                            <ul className="p-0 m-0">
                                                <li className="d-flex align-items-center mb-5">
                                                    <div className="avatar flex-shrink-0 me-3">
                            <span className="avatar-initial rounded bg-label-primary"
                            ><i className="icon-base bx bx-mobile-alt"></i
                            ></span>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <h6 className="mb-0">Electronic</h6>
                                                            <small>Mobile, Earbuds, TV</small>
                                                        </div>
                                                        <div className="user-progress">
                                                            <h6 className="mb-0">82.5k</h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="d-flex align-items-center mb-5">
                                                    <div className="avatar flex-shrink-0 me-3">
                            <span className="avatar-initial rounded bg-label-success"
                            ><i className="icon-base bx bx-closet"></i
                            ></span>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <h6 className="mb-0">Fashion</h6>
                                                            <small>T-shirt, Jeans, Shoes</small>
                                                        </div>
                                                        <div className="user-progress">
                                                            <h6 className="mb-0">23.8k</h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="d-flex align-items-center mb-5">
                                                    <div className="avatar flex-shrink-0 me-3">
                            <span className="avatar-initial rounded bg-label-info"
                            ><i className="icon-base bx bx-home-alt"></i
                            ></span>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <h6 className="mb-0">Decor</h6>
                                                            <small>Fine Art, Dining</small>
                                                        </div>
                                                        <div className="user-progress">
                                                            <h6 className="mb-0">849k</h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="d-flex align-items-center">
                                                    <div className="avatar flex-shrink-0 me-3">
                            <span className="avatar-initial rounded bg-label-secondary"
                            ><i className="icon-base bx bx-football"></i
                            ></span>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <h6 className="mb-0">Sports</h6>
                                                            <small>Football, Cricket Kit</small>
                                                        </div>
                                                        <div className="user-progress">
                                                            <h6 className="mb-0">99</h6>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
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
                                                        aria-selected="true">
                                                        Income
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button type="button" className="nav-link" role="tab">Expenses
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button type="button" className="nav-link" role="tab">Profit
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <div className="tab-content p-0">
                                                <div className="tab-pane fade show active"
                                                     id="navs-tabs-line-card-income" role="tabpanel">
                                                    <div className="d-flex mb-6">
                                                        <div className="avatar flex-shrink-0 me-3">
                                                            <img src="/img-admin/icons/unicons/wallet.png"
                                                                 alt="User"/>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0">Total Balance</p>
                                                            <div className="d-flex align-items-center">
                                                                <h6 className="mb-0 me-1">$459.10</h6>
                                                                <small className="text-success fw-medium">
                                                                    <i className="icon-base bx bx-chevron-up icon-lg"></i>
                                                                    42.9%
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="incomeChart"></div>
                                                    <div
                                                        className="d-flex align-items-center justify-content-center mt-6 gap-3">
                                                        <div className="flex-shrink-0">
                                                            <div id="expensesOfWeek"></div>
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0">Income this week</h6>
                                                            <small>$39k less than last week</small>
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
                                            <h5 className="card-title m-0 me-2">Transactions</h5>
                                            <div className="dropdown">
                                                <button
                                                    className="btn text-body-secondary p-0"
                                                    type="button"
                                                    id="transactionID"
                                                    data-bs-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false">
                                                    <i className="icon-base bx bx-dots-vertical-rounded icon-lg"></i>
                                                </button>
                                                <div className="dropdown-menu dropdown-menu-end"
                                                     aria-labelledby="transactionID">
                                                    <a className="dropdown-item" href="#">Last 28
                                                        Days</a>
                                                    <a className="dropdown-item" href="#">Last
                                                        Month</a>
                                                    <a className="dropdown-item" href="#">Last
                                                        Year</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body pt-4">
                                            <ul className="p-0 m-0">
                                                <li className="d-flex align-items-center mb-6">
                                                    <div className="avatar flex-shrink-0 me-3">
                                                        <img src="/img-admin/icons/unicons/paypal.png" alt="User"
                                                             className="rounded"/>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <small className="d-block">Paypal</small>
                                                            <h6 className="fw-normal mb-0">Send money</h6>
                                                        </div>
                                                        <div className="user-progress d-flex align-items-center gap-2">
                                                            <h6 className="fw-normal mb-0">+82.6</h6>
                                                            <span className="text-body-secondary">USD</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="d-flex align-items-center mb-6">
                                                    <div className="avatar flex-shrink-0 me-3">
                                                        <img src="/img-admin/icons/unicons/wallet.png" alt="User"
                                                             className="rounded"/>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <small className="d-block">Wallet</small>
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
                                                        <img src="/img-admin/icons/unicons/chart.png" alt="User"
                                                             className="rounded"/>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <small className="d-block">Transfer</small>
                                                            <h6 className="fw-normal mb-0">Refund</h6>
                                                        </div>
                                                        <div className="user-progress d-flex align-items-center gap-2">
                                                            <h6 className="fw-normal mb-0">+637.91</h6>
                                                            <span className="text-body-secondary">USD</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="d-flex align-items-center mb-6">
                                                    <div className="avatar flex-shrink-0 me-3">
                                                        <img src="/img-admin/icons/unicons/cc-primary.png" alt="User"
                                                             className="rounded"/>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <small className="d-block">Credit Card</small>
                                                            <h6 className="fw-normal mb-0">Ordered Food</h6>
                                                        </div>
                                                        <div className="user-progress d-flex align-items-center gap-2">
                                                            <h6 className="fw-normal mb-0">-838.71</h6>
                                                            <span className="text-body-secondary">USD</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="d-flex align-items-center mb-6">
                                                    <div className="avatar flex-shrink-0 me-3">
                                                        <img src="/img-admin/icons/unicons/wallet.png" alt="User"
                                                             className="rounded"/>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <small className="d-block">Wallet</small>
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
                                                        <img src="/img-admin/icons/unicons/cc-warning.png" alt="User"
                                                             className="rounded"/>
                                                    </div>
                                                    <div
                                                        className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                                        <div className="me-2">
                                                            <small className="d-block">Mastercard</small>
                                                            <h6 className="fw-normal mb-0">Ordered Food</h6>
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

                        <div className="content-backdrop fade"></div>
        </>
    );
};

export default TestAdmin;