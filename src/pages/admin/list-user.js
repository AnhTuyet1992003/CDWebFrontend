import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListImportOrder.css';

const ListUser = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Handle select all
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(users.map((user) => user.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    // Handle select individual item
    const handleSelectItem = (userId) => {
        const updatedItems = selectedItems.includes(userId)
            ? selectedItems.filter((id) => id !== userId)
            : [...selectedItems, userId];
        setSelectedItems(updatedItems);
        setIsAllSelected(updatedItems.length === users.length);
    };

    // Fetch user list
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('token='))
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

                const response = await axios.get('https://localhost:8443/api/v1/users/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                console.log('Response status:', response.status);
                console.log('Response data:', response.data);

                const data = Array.isArray(response.data) ? response.data : [];
                if (data.length === 0) {
                    setError('Không có người dùng nào.');
                } else {
                    setUsers(data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
                let errorMessage = 'Lỗi khi lấy danh sách người dùng!';
                if (error.response) {
                    errorMessage = error.response.data?.message || `Lỗi ${error.response.status}: ${error.message}`;
                    if (error.response.status === 401) {
                        errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                        Swal.fire({
                            icon: 'warning',
                            title: errorMessage,
                            confirmButtonText: 'OK',
                        }).then(() => {
                            navigate('/login');
                        });
                        return;
                    }
                } else {
                    errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại.';
                }
                setError(errorMessage);
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi!',
                    text: errorMessage,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    // Handle search
    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toString().includes(searchTerm) ||
            user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle pagination
    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle entries per page change
    const handleEntriesChange = (e) => {
        setEntriesPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to page 1
    };

    // Handle export (placeholder)
    const handleExport = () => {
        Swal.fire({
            icon: 'info',
            title: 'Chức năng Export đang được phát triển!',
            confirmButtonText: 'OK',
        });
    };

    // Handle add new user
    const handleAddNew = () => {
        navigate('/add-user');
    };

    return (
        <div className="dt-container dt-bootstrap5 dt-empty-footer">
            {/* Header with title and buttons */}
            <div className="row card-header flex-column flex-md-row pb-0">
                <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
                    <h5 className="card-title mb-0 text-md-start text-center">Danh Sách Người Dùng</h5>
                </div>
                <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-0">
                    <div className="dt-buttons btn-group flex-wrap mb-0">
                        <div className="btn-group">
                            <button
                                className="btn buttons-collection btn-label-primary dropdown-toggle me-4"
                                onClick={handleExport}
                            >
                <span className="d-flex align-items-center gap-2">
                  <i className="bx bx-export me-sm-1"></i>
                  <span className="d-none d-sm-inline-block">Export</span>
                </span>
                            </button>
                        </div>
                        <button className="btn create-new btn-primary" onClick={handleAddNew}>
              <span className="d-flex align-items-center gap-2">
                <i className="bx bx-plus icon-sm"></i>
                <span className="d-none d-sm-inline-block">Thêm Người Dùng</span>
              </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter and search */}
            <div className="row m-3 my-0 justify-content-between">
                <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
                    <div className="dt-length">
                        <label htmlFor="dt-length-0">
                            Show
                            <select
                                className="form-select"
                                id="dt-length-0"
                                value={entriesPerPage}
                                onChange={handleEntriesChange}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            entries
                        </label>
                    </div>
                </div>
                <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-0">
                    <div className="dt-search mt-0 mt-md-6">
                        <label htmlFor="dt-search-0">Search:</label>
                        <input
                            type="search"
                            className="form-control ms-4"
                            id="dt-search-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm theo ID, username, fullname hoặc email"
                        />
                    </div>
                </div>
            </div>

            {/* Data table */}
            <div className="justify-content-between dt-layout-table">
                <div className="d-md-flex justify-content-between align-items-center col-12 dt-layout-full col-md">
                    {isLoading ? (
                        <div className="text-center py-3">Đang tải...</div>
                    ) : error ? (
                        <div className="alert alert-warning text-center" role="alert">
                            {error}
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="alert alert-info text-center" role="alert">
                            Không có người dùng nào.
                        </div>
                    ) : (
                        <table
                            className="datatables-basic table table-bordered table-responsive dataTable dtr-column"
                            style={{ width: '100%' }}
                        >
                            <thead>
                            <tr>
                                <th className="dt-select dt-orderable-none">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        aria-label="Select all rows"
                                    />
                                </th>
                                <th className="dt-orderable-asc dt-orderable-desc">ID</th>
                                <th className="dt-orderable-asc dt-orderable-desc">Username</th>
                                <th className="dt-orderable-asc dt-orderable-desc">Fullname</th>
                                <th className="dt-orderable-asc dt-orderable-desc">Email</th>
                                <th className="dt-orderable-asc dt-orderable-desc">Role</th>
                                <th className="dt-orderable-none">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="dt-select">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedItems.includes(user.id)}
                                            onChange={() => handleSelectItem(user.id)}
                                            aria-label="Select row"
                                        />
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-start align-items-center">
                                            <div className="d-flex flex-column">
                                                <Link
                                                    to={`/edit-user/${user.id}`}
                                                    className="emp_name text-truncate text-heading"
                                                    style={{ color: '#007bff', textDecoration: 'underline' }}
                                                >
                                                    {user.id}
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.username}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roles[0]?.name || 'N/A'},{user.roles[1]?.name} </td>
                                    <td className="d-flex align-items-center">
                                        <div className="d-inline-block">
                                            <button
                                                className="btn btn-icon dropdown-toggle hide-arrow"
                                                data-bs-toggle="dropdown"
                                            >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end m-0">
                                                <li>
                                                    <button className="dropdown-item">Details</button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item">Archive</button>
                                                </li>
                                                <div className="dropdown-divider"></div>
                                                {/*<li>*/}
                                                {/*    <button*/}
                                                {/*        className="dropdown-item text-danger delete-record"*/}
                                                {/*        onClick={() => handleRemoveItem(user.id)}*/}
                                                {/*    >*/}
                                                {/*        Delete*/}
                                                {/*    </button>*/}
                                                {/*</li>*/}
                                            </ul>
                                        </div>
                                        <button
                                            className="btn btn-icon item-edit"
                                            onClick={() => navigate(`/edit-user/${user.id}`)}
                                        >
                                            <i className="bx bx-edit icon-sm"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Pagination and info */}
            {!isLoading && !error && filteredUsers.length > 0 && (
                <div className="row mx-3 justify-content-between">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
                        <div className="dt-info">
                            Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
                            {Math.min(currentPage * entriesPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                        </div>
                    </div>
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-0">
                        <div className="dt-paging">
                            <nav aria-label="pagination">
                                <ul className="pagination">
                                    <li className={`dt-paging-button page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link previous"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            aria-label="Previous"
                                        >
                                            <i className="bx bx-chevron-left scaleX-n1-rtl icon-sm"></i>
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 2 && page <= currentPage + 2)
                                        ) {
                                            return (
                                                <li
                                                    key={page}
                                                    className={`dt-paging-button page-item ${currentPage === page ? 'active' : ''}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            );
                                        } else if (
                                            (page === currentPage - 3 && currentPage > 4) ||
                                            (page === currentPage + 3 && currentPage < totalPages - 3)
                                        ) {
                                            return (
                                                <li key={page} className="dt-paging-button page-item disabled">
                                                    <button className="page-link ellipsis">…</button>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                    <li className={`dt-paging-button page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link next"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            aria-label="Next"
                                        >
                                            <i className="bx bx-chevron-right scaleX-n1-rtl icon-sm"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListUser;