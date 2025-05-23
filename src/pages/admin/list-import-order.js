// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import 'bootstrap/dist/css/bootstrap.min.css';
// //import 'boxicons/dist/boxicons.css';
// import './ListImportOrder.css'; // Tệp CSS tùy chỉnh
//
// const ListImportOrder = () => {
//   const [importOrders, setImportOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [isAllSelected, setIsAllSelected] = useState(false);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();
//
//   // Xử lý chọn tất cả
//   const handleSelectAll = () => {
//     if (isAllSelected) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(importOrders.map((order) => order.id));
//     }
//     setIsAllSelected(!isAllSelected);
//   };
//
//   // Xử lý chọn từng mục
//   const handleSelectItem = (orderId) => {
//     const updatedItems = selectedItems.includes(orderId)
//       ? selectedItems.filter((id) => id !== orderId)
//       : [...selectedItems, orderId];
//     setSelectedItems(updatedItems);
//     setIsAllSelected(updatedItems.length === importOrders.length);
//   };
//
//   // Lấy danh sách đơn nhập hàng
//   useEffect(() => {
//     const fetchImportOrders = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const token = document.cookie
//           .split('; ')
//           .find((row) => row.startsWith('token='))
//           ?.split('=')[1];
//         if (!token) {
//           Swal.fire({
//             icon: 'warning',
//             title: '⚠️ Bạn chưa đăng nhập.',
//             confirmButtonText: 'OK',
//           }).then(() => {
//             navigate('/login');
//           });
//           return;
//         }
//
//         const response = await axios.get('https://localhost:8443/api/v1/importOrder/list', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         });
//
//         console.log('Response status:', response.status);
//         console.log('Response data:', response.data);
//
//         const data = Array.isArray(response.data) ? response.data : [];
//         if (data.length === 0) {
//           setError('Không có đơn nhập hàng nào.');
//         } else {
//           setImportOrders(data);
//         }
//       } catch (error) {
//         console.error('Lỗi khi lấy danh sách đơn nhập:', error);
//         let errorMessage = 'Lỗi khi lấy danh sách đơn nhập!';
//         if (error.response) {
//           errorMessage = error.response.data?.message || `Lỗi ${error.response.status}: ${error.message}`;
//           if (error.response.status === 401) {
//             errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
//             Swal.fire({
//               icon: 'warning',
//               title: errorMessage,
//               confirmButtonText: 'OK',
//             }).then(() => {
//               navigate('/login');
//             });
//             return;
//           }
//         } else {
//           errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại.';
//         }
//         setError(errorMessage);
//         Swal.fire({
//           icon: 'error',
//           title: '❌ Lỗi!',
//           text: errorMessage,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//
//     fetchImportOrders();
//   }, [navigate]);
//
//   // Xóa một đơn nhập hàng
//   const handleRemoveItem = (orderId) => {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Bạn có chắc chắn muốn xóa đơn nhập này không?',
//       showCancelButton: true,
//       confirmButtonText: 'Xóa',
//       cancelButtonText: 'Hủy',
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const token = document.cookie
//             .split('; ')
//             .find((row) => row.startsWith('token='))
//             ?.split('=')[1];
//           if (!token) {
//             Swal.fire({
//               icon: 'warning',
//               title: '⚠️ Bạn chưa đăng nhập.',
//               confirmButtonText: 'OK',
//             }).then(() => {
//               navigate('/login');
//             });
//             return;
//           }
//
//           await axios.post(
//             `https://localhost:8443/api/v1/importOrder/delete`,
// { id: orderId },
// {
//     headers: { Authorization: `Bearer ${token}` },
//     withCredentials: true,
// }
// );
//
// setImportOrders(importOrders.filter((order) => order.id !== orderId));
// setSelectedItems(selectedItems.filter((id) => id !== orderId));
// setIsAllSelected(false);
//
// Swal.fire({
//     icon: 'success',
//     title: '✅ Đã xóa đơn nhập hàng!',
//     confirmButtonText: 'OK',
// });
// } catch (error) {
//     console.error('Lỗi khi xóa đơn nhập:', error);
//     Swal.fire({
//         icon: 'error',
//         title: '❌ Lỗi khi xóa!',
//         text: error.response?.data?.message || error.message,
//     });
// }
// }
// });
// };
//
// // Xóa các đơn nhập hàng đã chọn
// const handleRemoveSelectedItems = () => {
//     if (selectedItems.length === 0) {
//         Swal.fire({
//             icon: 'info',
//             title: 'Bạn chưa chọn đơn nhập nào để xóa.',
//             confirmButtonText: 'OK',
//         });
//         return;
//     }
//
//     Swal.fire({
//         icon: 'warning',
//         title: 'Bạn có chắc chắn muốn xóa các đơn nhập đã chọn?',
//         showCancelButton: true,
//         confirmButtonText: 'Xóa',
//         cancelButtonText: 'Hủy',
//     }).then(async (result) => {
//         if (result.isConfirmed) {
//             try {
//                 const token = document.cookie
//                     .split('; ')
//                     .find((row) => row.startsWith('token='))
//                     ?.split('=')[1];
//                 if (!token) {
//                     Swal.fire({
//                         icon: 'warning',
//                         title: '⚠️ Bạn chưa đăng nhập.',
//                         confirmButtonText: 'OK',
//                     }).then(() => {
//                         navigate('/login');
//                     });
//                     return;
//                 }
//
//                 const query = selectedItems.map((id) => `orderId=${id}`).join('&');
//                 const url = `https://localhost:8443/api/v1/importOrder/remove-items?${query}`;
//
//                 await axios.delete(url, {
//                     headers: { Authorization: `Bearer ${token}` },
//                     withCredentials: true,
//                 });
//
//                 setImportOrders(importOrders.filter((order) => !selectedItems.includes(order.id)));
//                 setSelectedItems([]);
//                 setIsAllSelected(false);
//
//                 Swal.fire({
//                     icon: 'success',
//                     title: '✅ Đã xóa các đơn nhập hàng!',
//                     confirmButtonText: 'OK',
//                 });
//             } catch (error) {
//                 console.error('Lỗi khi xóa các đơn nhập:', error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: '❌ Lỗi khi xóa!',
//                     text: error.response?.data?.message || error.message,
//                 });
//             }
//         }
//     });
// };
//
// // Chuyển hướng đến trang chỉnh sửa
// const handleEditOrder = (orderId) => {
//     navigate(`/edit-import-order/${orderId}`);
// };
//
// // Chuyển hướng đến trang thêm mới
// const handleAddNew = () => {
//     navigate('/import-order');
// };
//
// // Xử lý tìm kiếm
// const filteredOrders = importOrders.filter((order) =>
//     order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.id.toString().includes(searchTerm)
// );
//
// // Xử lý phân trang
// const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
// const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * entriesPerPage,
//     currentPage * entriesPerPage
// );
//
// const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//         setCurrentPage(page);
//     }
// };
//
// // Xử lý thay đổi số lượng hiển thị
// const handleEntriesChange = (e) => {
//     setEntriesPerPage(parseInt(e.target.value));
//     setCurrentPage(1); // Reset về trang 1
// };
//
// // Hàm giả lập Export (có thể tùy chỉnh)
// const handleExport = () => {
//     Swal.fire({
//         icon: 'info',
//         title: 'Chức năng Export đang được phát triển!',
//         confirmButtonText: 'OK',
//     });
// };
//
// return (
//     <div className="dt-container dt-bootstrap5 dt-empty-footer">
//         {/* Header với tiêu đề và nút */}
//         <div className="row card-header flex-column flex-md-row pb-0">
//             <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
//                 <h5 className="card-title mb-0 text-md-start text-center">Danh Sách Đơn Nhập Hàng</h5>
//             </div>
//             <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-0">
//                 <div className="dt-buttons btn-group flex-wrap mb-0">
//                     <div className="btn-group">
//                         <button
//                             className="btn buttons-collection btn-label-primary dropdown-toggle me-4"
//                             onClick={handleExport}
//                         >
//                 <span className="d-flex align-items-center gap-2">
//                   <i className="bx bx-export me-sm-1"></i>
//                   <span className="d-none d-sm-inline-block">Export</span>
//                 </span>
//                         </button>
//                     </div>
//                     <button className="btn create-new btn-primary" onClick={handleAddNew}>
//               <span className="d-flex align-items-center gap-2">
//                 <i className="bx bx-plus icon-sm"></i>
//                 <span className="d-none d-sm-inline-block">Thêm Đơn Nhập</span>
//               </span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//
//         {/* Bộ lọc và tìm kiếm */}
//         <div className="row m-3 my-0 justify-content-between">
//             <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
//                 <div className="dt-length">
//                     <label htmlFor="dt-length-0">
//                         Show
//                         <select
//                             className="form-select"
//                             id="dt-length-0"
//                             value={entriesPerPage}
//                             onChange={handleEntriesChange}
//                         >
//                             <option value="10">10</option>
//                             <option value="25">25</option>
//                             <option value="50">50</option>
//                             <option value="100">100</option>
//                         </select>
//                         entries
//                     </label>
//                 </div>
//             </div>
//             <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-0">
//                 <div className="dt-search mt-0 mt-md-6">
//                     <label htmlFor="dt-search-0">Search:</label>
//                     <input
//                         type="search"
//                         className="form-control ms-4"
//                         id="dt-search-0"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder="Tìm theo ID hoặc người nhập"
//                     />
//                 </div>
//             </div>
//         </div>
//
//         {/* Bảng dữ liệu */}
//         <div className="justify-content-between dt-layout-table">
//             <div className="d-md-flex justify-content-between align-items-center col-12 dt-layout-full col-md">
//                 {isLoading ? (
//                     <div className="text-center py-3">Đang tải...</div>
//                 ) : error ? (
//                     <div className="alert alert-warning text-center" role="alert">
//                         {error}
//                     </div>
//                 ) : filteredOrders.length === 0 ? (
//                     <div className="alert alert-info text-center" role="alert">
//                         Không có đơn nhập hàng nào.
//                     </div>
//                 ) : (
//                     <table
//                         className="datatables-basic table table-bordered table-responsive dataTable dtr-column"
//                         style={{ width: '100%' }}
//                     >
//                         <thead>
//                         <tr>
//                             <th className="dt-select dt-orderable-none">
//                                 <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     checked={isAllSelected}
//                                     onChange={handleSelectAll}
//                                     aria-label="Select all rows"
//                                 />
//                             </th>
//                             <th className="dt-orderable-asc dt-orderable-desc">ID</th>
//                             <th className="dt-orderable-asc dt-orderable-desc">Ngày Nhập</th>
//                             <th className="dt-orderable-asc dt-orderable-desc">Người Nhập</th>
//                             <th className="dt-orderable-asc dt-orderable-desc dt-type-numeric">Tổng Tiền</th>
//                             <th className="dt-orderable-none">Actions</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {paginatedOrders.map((order) => (
//                             <tr key={order.id}>
//                                 <td className="dt-select">
//                                     <input
//                                         className="form-check-input"
//                                         type="checkbox"
//                                         checked={selectedItems.includes(order.id)}
//                                         onChange={() => handleSelectItem(order.id)}
//                                         aria-label="Select row"
//                                     />
//                                 </td>
//                                 <td>
//                                     <div className="d-flex justify-content-start align-items-center">
//                                         <div className="d-flex flex-column">
//                                             <Link
//                                                 to={`/edit-import-order/${order.id}`}
//                                                 className="emp_name text-truncate text-heading"
//                                                 style={{ color: '#007bff', textDecoration: 'underline' }}
//                                             >
//                                                 {order.id}
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td>{new Date(order.createdDate).toLocaleDateString()}</td>
//                                 <td>{order.username}</td>
//                                 <td className="dt-type-numeric">{order.importPrice} VND</td>
//                                 <td className="d-flex align-items-center">
//                                     <div className="d-inline-block">
//                                         <a
//                                             href="javascript:;"
//                                             className="btn btn-icon dropdown-toggle hide-arrow"
//                                             data-bs-toggle="dropdown"
//                                         >
//                                             <i className="bx bx-dots-vertical-rounded"></i>
//                                         </a>
//                                         <ul className="dropdown-menu dropdown-menu-end m-0">
//                                             <li>
//                                                 <a href="javascript:;" className="dropdown-item">
//                                                     Details
//                                                 </a>
//                                             </li>
//                                             <li>
//                                                 <a href="javascript:;" className="dropdown-item">
//                                                     Archive
//                                                 </a>
//                                             </li>
//                                             <div className="dropdown-divider"></div>
//                                             <li>
//                                                 <a
//                                                     href="javascript:;"
//                                                     className="dropdown-item text-danger delete-record"
//                                                     onClick={() => handleRemoveItem(order.id)}
//                                                 >
//                                                     Delete
//                                                 </a>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                     <a
//                                         href="javascript:;"
//                                         className="btn btn-icon item-edit"
//                                         onClick={() => handleEditOrder(order.id)}
//                                     >
//                                         <i className="bx bx-edit icon-sm"></i>
//                                     </a>
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//
//         {/* Phân trang và thông tin */}
//         {!isLoading && !error && filteredOrders.length > 0 && (
//             <div className="row mx-3 justify-content-between">
//                 <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
//                     <div className="dt-info">
//                         Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
//                         {Math.min(currentPage * entriesPerPage, filteredOrders.length)} of {filteredOrders.length} entries
//                     </div>
//                 </div>
//                 <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto mt-0">
//                     <div className="dt-paging">
//                         <nav aria-label="pagination">
//                             <ul className="pagination">
//                                 <li className={`dt-paging-button page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                                     <button
//                                         className="page-link previous"
//                                         onClick={() => handlePageChange(currentPage - 1)}
//                                         aria-label="Previous"
//                                     >
//                                         <i className="bx bx-chevron-left scaleX-n1-rtl icon-sm"></i>
//                                     </button>
//                                 </li>
//                                 {[...Array(totalPages)].map((_, index) => {
//                                     const page = index + 1;
//                                     if (
//                                         page === 1 ||
//                                         page === totalPages ||
//                                         (page >= currentPage - 2 && page <= currentPage + 2)
//                                     ) {
//                                         return (
//                                             <li
//                                                 key={page}
//                                                 className={`dt-paging-button page-item ${currentPage === page ? 'active' : ''}`}
//                                             >
//                                                 <button
//                                                     className="page-link"
//                                                     onClick={() => handlePageChange(page)}
//                                                 >
//                                                     {page}
//                                                 </button>
//                                             </li>
//                                         );
//                                     } else if (
//                                         (page === currentPage - 3 && currentPage > 4) ||
//                                         (page === currentPage + 3 && currentPage < totalPages - 3)
//                                     ) {
//                                         return (
//                                             <li key={page} className="dt-paging-button page-item disabled">
//                                                 <button className="page-link ellipsis">…</button>
//                                             </li>
//                                         );
//                                     }
//                                     return null;
//                                 })}
//                                 <li className={`dt-paging-button page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                                     <button
//                                         className="page-link next"
//                                         onClick={() => handlePageChange(currentPage + 1)}
//                                         aria-label="Next"
//                                     >
//                                         <i className="bx bx-chevron-right scaleX-n1-rtl icon-sm"></i>
//                                     </button>
//                                 </li>
//                             </ul>
//                         </nav>
//                     </div>
//                 </div>
//             </div>
//         )}
//     </div>
// );
// };
//
// export default ListImportOrder;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListImportOrder.css';

const ListImportOrder = () => {
  const [importOrders, setImportOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Xử lý chọn tất cả
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(importOrders.map((order) => order.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  // Xử lý chọn từng mục
  const handleSelectItem = (orderId) => {
    const updatedItems = selectedItems.includes(orderId)
      ? selectedItems.filter((id) => id !== orderId)
      : [...selectedItems, orderId];
    setSelectedItems(updatedItems);
    setIsAllSelected(updatedItems.length === importOrders.length);
  };

  // Lấy danh sách đơn nhập hàng
  useEffect(() => {
    const fetchImportOrders = async () => {
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

        const response = await axios.get('https://localhost:8443/api/v1/importOrder/list', {
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
          setError('Không có đơn nhập hàng nào.');
        } else {
          setImportOrders(data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn nhập:', error);
        let errorMessage = 'Lỗi khi lấy danh sách đơn nhập!';
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

    fetchImportOrders();
  }, [navigate]);

  // Xóa một đơn nhập hàng
  const handleRemoveItem = (orderId) => {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn có chắc chắn muốn xóa đơn nhập này không?',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
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

          await axios.post(
            `https://localhost:8443/api/v1/importOrder/delete`,
{ id: orderId },
{
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
}
);

setImportOrders(importOrders.filter((order) => order.id !== orderId));
setSelectedItems(selectedItems.filter((id) => id !== orderId));
setIsAllSelected(false);

Swal.fire({
    icon: 'success',
    title: '✅ Đã xóa đơn nhập hàng!',
    confirmButtonText: 'OK',
});
} catch (error) {
    console.error('Lỗi khi xóa đơn nhập:', error);
    Swal.fire({
        icon: 'error',
        title: '❌ Lỗi khi xóa!',
        text: error.response?.data?.message || error.message,
    });
}
}
});
};

// Xóa các đơn nhập hàng đã chọn
const handleRemoveSelectedItems = () => {
    if (selectedItems.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Bạn chưa chọn đơn nhập nào để xóa.',
            confirmButtonText: 'OK',
        });
        return;
    }

    Swal.fire({
        icon: 'warning',
        title: 'Bạn có chắc chắn muốn xóa các đơn nhập đã chọn?',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
    }).then(async (result) => {
        if (result.isConfirmed) {
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

                const query = selectedItems.map((id) => `orderId=${id}`).join('&');
                const url = `https://localhost:8443/api/v1/importOrder/remove-items?${query}`;

                await axios.delete(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });

                setImportOrders(importOrders.filter((order) => !selectedItems.includes(order.id)));
                setSelectedItems([]);
                setIsAllSelected(false);

                Swal.fire({
                    icon: 'success',
                    title: '✅ Đã xóa các đơn nhập hàng!',
                    confirmButtonText: 'OK',
                });
            } catch (error) {
                console.error('Lỗi khi xóa các đơn nhập:', error);
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi khi xóa!',
                    text: error.response?.data?.message || error.message,
                });
            }
        }
    });
};

// Chuyển hướng đến trang thêm mới
const handleAddNew = () => {
    navigate('/import-order');
};

// Xử lý tìm kiếm
const filteredOrders = importOrders.filter((order) =>
    order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
);

// Xử lý phân trang
const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);
const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
);

const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
};

// Xử lý thay đổi số lượng hiển thị
const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset về trang 1
};

// Hàm giả lập Export
const handleExport = () => {
    Swal.fire({
        icon: 'info',
        title: 'Chức năng Export đang được phát triển!',
        confirmButtonText: 'OK',
    });
};

return (
    <div className="dt-container dt-bootstrap5 dt-empty-footer">
        {/* Header với tiêu đề và nút */}
        <div className="row card-header flex-column flex-md-row pb-0">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
                <h5 className="card-title mb-0 text-md-start text-center">Danh Sách Đơn Nhập Hàng</h5>
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
                <span className="d-none d-sm-inline-block">Thêm Đơn Nhập</span>
              </span>
                    </button>
                </div>
            </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
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
                        placeholder="Tìm theo ID hoặc người nhập"
                    />
                </div>
            </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="justify-content-between dt-layout-table">
            <div className="d-md-flex justify-content-between align-items-center col-12 dt-layout-full col-md">
                {isLoading ? (
                    <div className="text-center py-3">Đang tải...</div>
                ) : error ? (
                    <div className="alert alert-warning text-center" role="alert">
                        {error}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="alert alert-info text-center" role="alert">
                        Không có đơn nhập hàng nào.
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
                            <th className="dt-orderable-asc dt-orderable-desc">Ngày Nhập</th>
                            <th className="dt-orderable-asc dt-orderable-desc">Người Nhập</th>
                            <th className="dt-orderable-asc dt-orderable-desc dt-type-numeric">Tổng Tiền</th>
                            <th className="dt-orderable-none">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="dt-select">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedItems.includes(order.id)}
                                        onChange={() => handleSelectItem(order.id)}
                                        aria-label="Select row"
                                    />
                                </td>
                                <td>
                                    <div className="d-flex justify-content-start align-items-center">
                                        <div className="d-flex flex-column">
                                            <Link
                                                to={`/edit-import-order/${order.id}`}
                                                className="emp_name text-truncate text-heading"
                                                style={{ color: '#007bff', textDecoration: 'underline' }}
                                            >
                                                {order.id}
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td>{new Date(order.createdDate).toLocaleDateString()}</td>
                                <td>{order.username}</td>
                                <td className="dt-type-numeric">{order.importPrice} VND</td>
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
                                            <li>
                                                <button
                                                    className="dropdown-item text-danger delete-record"
                                                    onClick={() => handleRemoveItem(order.id)}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <button
                                        className="btn btn-icon item-edit"
                                        onClick={() => navigate(`/edit-import-order/${order.id}`)}
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

        {/* Phân trang và thông tin */}
        {!isLoading && !error && filteredOrders.length > 0 && (
            <div className="row mx-3 justify-content-between">
                <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0">
                    <div className="dt-info">
                        Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
                        {Math.min(currentPage * entriesPerPage, filteredOrders.length)} of {filteredOrders.length} entries
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

export default ListImportOrder;
