// import React, { useEffect, useState } from 'react';
// import axios, {post} from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import Chatbox from './Chatbox';
//
// import Cookies from 'js-cookie';
// import Swal from 'sweetalert2';
//
// import './user-profile-edit.css'
// // Bootstrap CSS
// import 'bootstrap/dist/css/bootstrap.min.css';
//
// // jQuery (nếu cần dùng)
// import $ from 'jquery';
//
// // Bootstrap JS (bundle includes popper.js)
// import 'bootstrap/dist/js/bootstrap.bundle.min';
//
//
// const UserProfileEdit = () => {
//     const [user, setUser] = useState({
//         fullname: '',
//         //username: '',
//         phone: '',
//         address: '',
//         birthday: '',
//         avatar: ''
//     });
//     const [user2, setUser2] = useState({
//         password: '',
//         newPassword: '',
//         reNewPassword: ''
//     });
//
//     const [avatarFile, setAvatarFile] = useState(null);
//     const [avatarPreview, setAvatarPreview] = useState(null);
//     // Khi chọn file ảnh
//     const handleAvatarChange = (e) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) {
//             console.log("No file selected"); // 👉 sẽ không log dòng này nếu chọn đúng
//             setMessage("Vui lòng chọn một ảnh hợp lệ.");
//
//             // Hiển thị Swal yêu cầu chọn ảnh hợp lệ
//             Swal.fire({
//                 icon: 'warning',
//                 title: '⚠️ Vui lòng chọn một ảnh hợp lệ.',
//                 confirmButtonText: 'OK',
//             });
//             return;
//         }
//
//         const file = files[0];
//         console.log("File selected:", file); // ✅ kiểm tra đúng file chưa
//
//         // Kiểm tra định dạng file (ảnh)
//         const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//         if (!validImageTypes.includes(file.type)) {
//             Swal.fire({
//                 icon: 'error',
//                 title: '❌ Chỉ hỗ trợ ảnh JPEG, PNG hoặc JPG!',
//                 confirmButtonText: 'OK',
//             });
//             setMessage("Chỉ hỗ trợ ảnh JPEG, PNG hoặc JPG.");
//             return;
//         }
//
//         // Nếu chọn đúng ảnh, lưu file
//         setAvatarFile(file);
//         setMessage(""); // Xóa thông báo lỗi nếu chọn ảnh hợp lệ
//
//         // Tạo đường dẫn ảnh để hiển thị ngay
//         const previewUrl = URL.createObjectURL(file);
//         setAvatarPreview(previewUrl);
//
//         // Hiển thị thông báo chọn ảnh thành công
//         Swal.fire({
//             icon: 'success',
//             title: '✅ Ảnh đã được chọn thành công!',
//             timer: 1500,
//             showConfirmButton: false,
//         });
//     };
//
//
//     //gửi file lên api
//     const handleUploadAvatar = async () => {
//         if (!avatarFile){
//             Swal.fire({
//                 icon: 'warning',
//                 title: '⚠️ Vui lòng chọn một ảnh để tải lên.',
//                 confirmButtonText: 'OK',
//             });
//             return;
//         }
//
//         // Xác nhận người dùng có muốn tải ảnh không
//         const confirmUpload = await Swal.fire({
//             icon: 'question',
//             title: 'Bạn có chắc chắn muốn cập nhật ảnh đại diện?',
//             showCancelButton: true,
//             confirmButtonText: 'Tải lên',
//             cancelButtonText: 'Hủy',
//         });
//
//         // Nếu người dùng xác nhận thì thực hiện tải ảnh
//         if (confirmUpload.isConfirmed) {
//             const token = document.cookie
//                 .split('; ')
//                 .find(row => row.startsWith('token='))?.split('=')[1];
//
//             const formData = new FormData();
//             formData.append('file', avatarFile);
//             console.log("Token từ cookie login google_avatar:", token);
//
//             try {
//                 const response = await axios.post('https://localhost:8443/api/v1/users/upload-avatar', formData, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//
//                 // Hiển thị thông báo thành công
//                 Swal.fire({
//                     icon: 'success',
//                     title: '✅ Tải ảnh lên thành công!',
//                     text: 'Ảnh đại diện đã được cập nhật.',
//                     timer: 2000,
//                     showConfirmButton: false,
//                 });
//
//                 console.log('Avatar Url:', response.data.data.url);
//             } catch (error) {
//                 console.error(error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: '❌ Lỗi khi tải ảnh',
//                     text: 'Có lỗi xảy ra trong quá trình tải ảnh. Vui lòng thử lại.',
//                 });
//             }
//         } else {
//             // Nếu người dùng hủy bỏ, hiển thị thông báo
//             Swal.fire({
//                 icon: 'info',
//                 title: 'Hủy tải ảnh',
//                 text: 'Bạn đã hủy việc tải ảnh lên.',
//             });
//         }
//     };
//
//
//     const [userId, setUserId] = useState(null);
//     const [message, setMessage] = useState('');
//
//     // Load user info from token
//     useEffect(() => {
//         // const token = document.cookie
//         //     .split('; ')
//         //     .find(row => row.startsWith('token='))
//         //     ?.split('=')[1];
//         const token = localStorage.getItem('accessToken');
//             // Cookies.get('token');
//
//         console.log("token profile: "+token)
//
//
//         if (!token) {
//             setMessage('Bạn chưa đăng nhập');
//             return;
//         }
//
//         const decoded = jwtDecode(token);
//         const username = decoded.sub;
//
//         axios.post(`https://localhost:8443/api/v1/users/details`, {}, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             withCredentials: true,
//         })
//             .then(res => {
//                 const userData = res.data;
//                 const formattedBirthday = userData.birthday; // ghép thêm giờ phút giây
//                 setUser({
//                     fullname: userData.fullname || '',
//                     //username: userData.username || '',
//                     phone: userData.phone || '',
//                     address: userData.address || '',
//                     birthday: formattedBirthday || '',
//                     avatar: userData.avatar || 'https://res.cloudinary.com/dorz7ucva/image/upload/v1745202292/image_2820bc603a47efcf17a0806b81ca92bff7ea2905.png'
//                 });
//                 setUserId(userData.id);
//                 console.log(userData.avatar); // Đúng
//             })
//             .catch(err => {
//                 console.error(err);
//                 setMessage('Lỗi khi tải thông tin người dùng');
//             });
//
//         //chat tu dong
//         console.log('✅ Chatbox script loaded');
//         const script = document.createElement('script');
//          script.src = 'https://app.tudongchat.com/js/chatbox.js';
//         //script.src = 'C:\\Users\\ADMIN\\eclipse-workspace\\CDWebFrontend\\src\\assets\\user\\js\\chatbox.js'
//         script.async = true;
//
//         script.onload = () => {
//             console.log('✅ Chatbox script loaded');
//             if (window.TuDongChat) {
//                 const tudong_chatbox = new window.TuDongChat('GEKBdJuf_t2KzMXWnR9hH');
//                 tudong_chatbox.initial();
//                 console.log('✅ Chatbox initialized');
//             } else {
//                 console.error('❌ TuDongChat not available');
//             }
//         };
//
//         script.onerror = () => {
//             console.error('❌ Failed to load chatbox.js');
//         };
//
//         document.body.appendChild(script);
//
//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []);
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUser(prev => ({ ...prev, [name]: value }));
//     };
//
//
//
//     const handleUpdate = async (e) => {
//         e.preventDefault();
//
//         // const token = document.cookie
//         //     .split('; ')
//         //     .find(row => row.startsWith('token='))
//         //     ?.split('=')[1];
//         const token = localStorage.getItem('accessToken');
//
//
//         try {
//             const res = await axios.put(
//                 `https://localhost:8443/api/v1/users/details/${userId}`,
//                 user,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                     withCredentials: true,
//                 }
//             );
//             setMessage('Cập nhật thông tin thành công!');
//         } catch (error) {
//             console.error(error);
//
//             // Kiểm tra lỗi từ response
//             if (error.response && error.response.data) {
//                 // Nếu có lỗi từ backend, lấy thông điệp từ response và hiển thị
//                 setMessage(error.response.data);  // Hiển thị thông điệp lỗi từ backend
//             } else {
//                 // Nếu không có lỗi response, hiển thị thông báo chung
//                 setMessage('Lỗi khi cập nhật thông tin');
//             }
//         }
//     };
//     const [errors, setErrors] = useState({});
//
//     const validateForm = () => {
//         const newErrors = {};
//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
//
//         if (!user2.password) {
//             newErrors.password = 'Vui lòng nhập mật khẩu.';
//         } else if (!passwordRegex.test(user2.password)) {
//             newErrors.password = 'Mật khẩu ít nhất 7 ký tự, bao gồm chữ và số.';
//         }
//
//         if (!user2.newPassword) {
//             newErrors.newPassword = 'Vui lòng nhập mật khẩu.';
//         } else if (!passwordRegex.test(user2.passnewPasswordword)) {
//             newErrors.newPassword = 'Mật khẩu ít nhất 7 ký tự, bao gồm chữ và số.';
//         }
//
//         if (!user2.reNewPassword) {
//             newErrors.retypePassword = 'Vui lòng nhập lại mật khẩu.';
//         } else if (user2.newPassword !== user2.reNewPassword) {
//             newErrors.retypePassword = 'Mật khẩu không khớp.';
//         }
//         return newErrors;
//     };
//     const handleUpdatePassword = async (e) => {
//         e.preventDefault();
//         const validationErrors = validateForm();
//         setErrors(validationErrors);
//
//         // const token = document.cookie
//         //     .split('; ')
//         //     .find(row => row.startsWith('token='))
//         //     ?.split('=')[1];
//         const token = localStorage.getItem('accessToken');
//
//
//         try {
//             const res = await axios.put(
//                 `https://localhost:8443/api/v1/users/changePassword/${userId}`,
//                 user2,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                     withCredentials: true,
//                 }
//             );
//             setMessage('Cập nhật thông tin thành công!');
//         } catch (error) {
//             console.error(error);
//
//             // Kiểm tra lỗi từ response
//             if (error.response && error.response.data) {
//                 // Nếu có lỗi từ backend, lấy thông điệp từ response và hiển thị
//                 setMessage(error.response.data);  // Hiển thị thông điệp lỗi từ backend
//             } else {
//                 // Nếu không có lỗi response, hiển thị thông báo chung
//                 setMessage('Lỗi khi cập nhật thông tin');
//             }
//         }
//     };
//
//     return (
//         <>
//             <div className="information">
//                 <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
//                     <h2 className="text-xl font-bold mb-4">Cập nhật thông tin người dùng</h2>
//                     {message && <div className="mb-4 text-red-500">{message}</div>}
//                     <form onSubmit={handleUpdate} className="space-y-4">
//                         <input type="text" name="fullname" value={user.fullname} onChange={handleChange}
//                                placeholder="Họ tên"
//                                className="w-full p-2 border rounded"/>
//                         {/*<input type="text" name="username" value={user.username} onChange={handleChange}*/}
//                         {/*       placeholder="Tên đăng nhập" className="w-full p-2 border rounded"/>*/}
//                         <input type="text" name="phone" value={user.phone} onChange={handleChange}
//                                placeholder="Số điện thoại"
//                                className="w-full p-2 border rounded"/>
//                         <input type="text" name="address" value={user.address} onChange={handleChange}
//                                placeholder="Địa chỉ"
//                                className="w-full p-2 border rounded"/>
//                         <input type="date" name="birthday" value={user.birthday} onChange={handleChange}
//                                className="w-full p-2 border rounded"/>
//                         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Lưu
//                             thay
//                             đổi
//                         </button>
//                     </form>
//                 </div>
//             </div>
//
//
//             <div className="containerEdit light-style flex-grow-1 container-p-y">
//
//                 <h4 className="font-weight-bold py-3 mb-4">
//                     Chỉnh sửa thông tin cá nhân
//                 </h4>
//
//                 <div className="card overflow-hidden">
//                     <div className="row no-gutters row-bordered row-border-light">
//                         <div className="col-md-3 pt-0">
//                             <div className="list-group list-group-flush account2-settings-links">
//                                 <a className="list-group-item list-group-item-action active" data-toggle="list"
//                                    href="#account2-general">Thông tin cá nhân</a>
//                                 <a className="list-group-item list-group-item-action" data-toggle="list"
//                                    href="#account2-change-password">Đổi mật khẩu</a>
//                                 <a className="list-group-item list-group-item-action" data-toggle="list"
//                                    href="#account2-info">Thông tin chung</a>
//                                 <a className="list-group-item list-group-item-action" data-toggle="list"
//                                    href="#account2-social-links">Social links</a>
//                                 <a className="list-group-item list-group-item-action" data-toggle="list"
//                                    href="#account2-connections">Connections</a>
//                                 <a className="list-group-item list-group-item-action" data-toggle="list"
//                                    href="#account2-notifications">Notifications</a>
//                             </div>
//                         </div>
//                         <div className="col-md-9">
//                             <div className="tab-content">
//                                 <div className="tab-pane fade active show" id="account2-general">
//
//                                     <div className="card2-body media align-items-center">
//                                         <img
//                                             src={avatarPreview || user.avatar} // Nếu có ảnh preview thì hiển thị, không thì hiển thị ảnh mặc định
//                                             alt="Avatar"
//                                             className="d-block ui-w-80"
//                                         />
//                                         <div className="media-body ml-4">
//                                             <label className="btn btn-outline-primary upload-photo-label">
//                                                 Tải hình mới lên
//                                                 <input
//                                                     type="file"
//                                                     accept="image/*"
//                                                     className="account2-settings-fileinput"
//                                                     onChange={handleAvatarChange}
//                                                     // style={{display: "none"}}
//                                                 />
//                                             </label> &nbsp;
//                                             <button type="button"
//                                                     className="btn btn-default md-btn-flat"
//                                                     onClick={handleUploadAvatar}>Tải ảnh
//                                             </button>
//
//                                             <div className="text-light small mt-1">Cho phép JPG, GIF hoặc PNG. Kích
//                                                 thước tối đa là
//                                                 800K
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <br></br>
//                                     <hr className="border-light m-0"/>
//
//                                     <div className="card-body">
//                                     <div className="form-group">
//                                             <label className="form-label">Username</label>
//                                             <input type="text" className="form-control mb-1"/>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Tên</label>
//                                             <input type="text" className="form-control" value="Nelle Maxwell"/>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Email</label>
//                                             <input type="text" className="form-control mb-1" value="nmaxwell@mail.com"/>
//                                             <div className="alert alert-warning mt-3">
//                                                 Your email is not confirmed. Please check your inbox.<br/>
//                                                 <a href="javascript:void(0)">Resend confirmation</a>
//                                             </div>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Số điện thoại</label>
//                                             <input type="tel" className="form-control" pattern="[0-9]+"/>
//                                         </div>
//                                     </div>
//
//                                 </div>
//                                 <div className="tab-pane fade" id="account2-change-password">
//                                     <form onSubmit={handleUpdatePassword} className="space-y-4">
//                                         <div className="card2-body pb-2">
//
//                                             {errors.password && (
//                                                 <div className="error-container">
//                                                     <small className="error">{errors.password}</small>
//                                                 </div>
//                                             )}
//                                             <div className="form-group">
//                                                 <label className="form-label">Current password</label>
//                                                 <input type="password" name="password" value={user2.password}
//                                                        onChange={handleChange}
//                                                        required={true} className="form-control"/>
//                                             </div>
//                                             {errors.newPassword && (
//                                                 <div className="error-container">
//                                                     <small className="error">{errors.newPassword}</small>
//                                                 </div>
//                                             )}
//
//                                             <div className="form-group">
//                                                 <label className="form-label">New password</label>
//                                                 <input type="password" name="newPassword" value={user2.newPassword}
//                                                        onChange={handleChange}
//                                                        required={true} className="form-control"/>
//                                             </div>
//                                             {errors.reNewPassword && (
//                                                 <div className="error-container">
//                                                     <small className="error">{errors.reNewPassword}</small>
//                                                 </div>
//                                             )}
//
//                                             <div className="form-group">
//                                                 <label className="form-label">Repeat new password</label>
//                                                 <input type="password" name="reNewPassword" value={user2.reNewPassword}
//                                                        onChange={handleChange} required={true}
//                                                        className="form-control"/>
//                                             </div>
//                                             {errors.password && (
//                                                 <div className="error-container">
//                                                     <small className="error">{errors.password}</small>
//                                                 </div>
//                                             )}
//
//                                             <div className="text-right mt-3">
//                                                 <button type="submit" className="btn btn-primary">Save changes</button>
//                                                 &nbsp;
//                                                 <button type="button" className="btn btn-default">Cancel</button>
//                                             </div>
//
//                                         </div>
//                                     </form>
//                                 </div>
//                                 <div className="tab-pane fade" id="account2-info">
//                                     <div className="card2-body pb-2">
//
//                                         <div className="form-group">
//                                             <label className="form-label">Bio</label>
//                                             <textarea className="form-control" rows="5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nunc arcu, dignissim sit amet sollicitudin iaculis, vehicula id urna. Sed luctus urna nunc. Donec fermentum, magna sit amet rutrum pretium, turpis dolor molestie diam, ut lacinia diam risus eleifend sapien. Curabitur ac nibh nulla. Maecenas nec augue placerat, viverra tellus non, pulvinar risus.</textarea>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Birthday</label>
//                                             <input type="text" className="form-control" value="May 3, 1995"/>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Country</label>
//                                             <select className="custom-select">
//                                                 <option>USA</option>
//                                                 <option selected="">Canada</option>
//                                                 <option>UK</option>
//                                                 <option>Germany</option>
//                                                 <option>France</option>
//                                             </select>
//                                         </div>
//
//
//                                     </div>
//                                     <hr className="border-light m-0"/>
//                                     <div className="card2-body pb-2">
//
//                                         <h6 className="mb-4">Contacts</h6>
//                                         <div className="form-group">
//                                             <label className="form-label">Phone</label>
//                                             <input type="text" className="form-control" value="+0 (123) 456 7891"/>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Website</label>
//                                             <input type="text" className="form-control" value=""/>
//                                         </div>
//
//                                     </div>
//
//                                 </div>
//                                 <div className="tab-pane fade" id="account2-social-links">
//                                     <div className="card2-body pb-2">
//
//                                         <div className="form-group">
//                                             <label className="form-label">Twitter</label>
//                                             <input type="text" className="form-control"
//                                                    value="https://twitter.com/user"/>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Facebook</label>
//                                             <input type="text" className="form-control"
//                                                    value="https://www.facebook.com/user"/>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Google+</label>
//                                             <input type="text" className="form-control" value=""/>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">LinkedIn</label>
//                                             <input type="text" className="form-control" value=""/>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="form-label">Instagram</label>
//                                             <input type="text" className="form-control"
//                                                    value="https://www.instagram.com/user"/>
//                                         </div>
//
//                                     </div>
//                                 </div>
//                                 <div className="tab-pane fade" id="account2-connections">
//                                     <div className="card2-body">
//                                         <button type="button" className="btn btn-twitter">Connect
//                                             to <strong>Twitter</strong></button>
//                                     </div>
//                                     <hr className="border-light m-0"/>
//                                     <div className="card2-body">
//                                         <h5 className="mb-2">
//                                             <a href="javascript:void(0)" className="float-right text-muted text-tiny"><i
//                                                 className="ion ion-md-close"></i> Remove</a>
//                                             <i className="ion ion-logo-google text-google"></i>
//                                             You are connected to Google:
//                                         </h5>
//                                         <a href="/cdn-cgi/l/email-protection" className="__cf_email__"
//                                            data-cfemail="6c02010d141b0900002c010d0500420f0301">[email&#160;protected]</a>
//                                     </div>
//                                     <hr className="border-light m-0"/>
//                                     <div className="card2-body">
//                                         <button type="button" className="btn btn-facebook">Connect
//                                             to <strong>Facebook</strong></button>
//                                     </div>
//                                     <hr className="border-light m-0"/>
//                                     <div className="card2-body">
//                                         <button type="button" className="btn btn-instagram">Connect
//                                             to <strong>Instagram</strong></button>
//                                     </div>
//                                 </div>
//                                 <div className="tab-pane fade" id="account2-notifications">
//                                     <div className="card2-body pb-2">
//
//                                         <h6 className="mb-4">Activity</h6>
//
//                                         <div className="form-group">
//                                             <label className="switcher">
//                                                 <input type="checkbox" className="switcher-input" checked=""/>
//                                                 <span className="switcher-indicator">
//                       <span className="switcher-yes"></span>
//                       <span className="switcher-no"></span>
//                     </span>
//                                                 <span className="switcher-label">Email me when someone comments on my article</span>
//                                             </label>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="switcher">
//                                                 <input type="checkbox" className="switcher-input" checked=""/>
//                                                 <span className="switcher-indicator">
//                       <span className="switcher-yes"></span>
//                       <span className="switcher-no"></span>
//                     </span>
//                                                 <span className="switcher-label">Email me when someone answers on my forum thread</span>
//                                             </label>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="switcher">
//                                                 <input type="checkbox" className="switcher-input"/>
//                                                 <span className="switcher-indicator">
//                       <span className="switcher-yes"></span>
//                       <span className="switcher-no"></span>
//                     </span>
//                                                 <span className="switcher-label">Email me when someone follows me</span>
//                                             </label>
//                                         </div>
//                                     </div>
//                                     <hr className="border-light m-0"/>
//                                     <div className="card2-body pb-2">
//
//                                         <h6 className="mb-4">Application</h6>
//
//                                         <div className="form-group">
//                                             <label className="switcher">
//                                                 <input type="checkbox" className="switcher-input" checked=""/>
//                                                 <span className="switcher-indicator">
//                       <span className="switcher-yes"></span>
//                       <span className="switcher-no"></span>
//                     </span>
//                                                 <span className="switcher-label">News and announcements</span>
//                                             </label>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="switcher">
//                                                 <input type="checkbox" className="switcher-input"/>
//                                                 <span className="switcher-indicator">
//                       <span className="switcher-yes"></span>
//                       <span className="switcher-no"></span>
//                     </span>
//                                                 <span className="switcher-label">Weekly product updates</span>
//                                             </label>
//                                         </div>
//                                         <div className="form-group">
//                                             <label className="switcher">
//                                                 <input type="checkbox" className="switcher-input" checked=""/>
//                                                 <span className="switcher-indicator">
//                       <span className="switcher-yes"></span>
//                       <span className="switcher-no"></span>
//                     </span>
//                                                 <span className="switcher-label">Weekly blog digest</span>
//                                             </label>
//                                         </div>
//
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="text-right mt-3">
//                     <button type="button" className="btn btn-primary">Save changes</button>
//                     &nbsp;
//                     <button type="button" className="btn btn-default">Cancel</button>
//                 </div>
//
//             </div>
//
//
//             {/*<div><Chatbox/></div>*/}
//
//         </>
//     );
// };
//
// export default UserProfileEdit;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './user-profile-edit.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const UserProfileEdit = () => {
    const [user, setUser] = useState({
        username: '',
        fullname: '',
        email: '',
        phone: '',
        address: '',
        birthday: '',
        avatar: '',
    });
    const [user2, setUser2] = useState({
        password: '',
        newPassword: '',
        reNewPassword: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    // Load user info from token
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setMessage('Bạn chưa đăng nhập');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Bạn chưa đăng nhập. Vui lòng đăng nhập lại.',
                confirmButtonText: 'OK',
            });
            return;
        }

        const decoded = jwtDecode(token);
        axios
            .post(
                'https://localhost:8443/api/v1/users/details',
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            )
            .then((res) => {
                const userData = res.data;
                const formattedBirthday = userData.birthday ? userData.birthday.split('T')[0] : '';
                setUser({
                    username: userData.username || '',
                    fullname: userData.fullname || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    birthday: formattedBirthday,
                    avatar:
                        userData.avatar ||
                        'https://res.cloudinary.com/dorz7ucva/image/upload/v1745202292/image_2820bc603a47efcf17a0806b81ca92bff7ea2905.png',
                });
                setUserId(userData.id);
            })
            .catch((err) => {
                console.error(err);
                setMessage('Lỗi khi tải thông tin người dùng');
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Không thể tải thông tin người dùng. Vui lòng thử lại.',
                    confirmButtonText: 'OK',
                });
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setUser2((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleAvatarChange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '⚠️ Vui lòng chọn một ảnh hợp lệ.',
                confirmButtonText: 'OK',
            });
            return;
        }

        const file = files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validImageTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: '❌ Chỉ hỗ trợ ảnh JPEG, PNG hoặc JPG!',
                confirmButtonText: 'OK',
            });
            return;
        }

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        Swal.fire({
            icon: 'success',
            title: '✅ Ảnh đã được chọn thành công!',
            timer: 1500,
            showConfirmButton: false,
        });
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) {
            Swal.fire({
                icon: 'warning',
                title: '⚠️ Vui lòng chọn một ảnh để tải lên.',
                confirmButtonText: 'OK',
            });
            return;
        }

        const confirmUpload = await Swal.fire({
            icon: 'question',
            title: 'Bạn có chắc chắn muốn cập nhật ảnh đại diện?',
            showCancelButton: true,
            confirmButtonText: 'Tải lên',
            cancelButtonText: 'Hủy',
        });

        if (confirmUpload.isConfirmed) {
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('file', avatarFile);

            try {
                const response = await axios.post('https://localhost:8443/api/v1/users/upload-avatar', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser((prev) => ({ ...prev, avatar: response.data.data.url }));
                Swal.fire({
                    icon: 'success',
                    title: '✅ Tải ảnh lên thành công!',
                    text: 'Ảnh đại diện đã được cập nhật.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi khi tải ảnh',
                    text: 'Có lỗi xảy ra trong quá trình tải ảnh. Vui lòng thử lại.',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!user.fullname) {
            newErrors.fullname = 'Họ và tên không được để trống';
        } else if (user.fullname.length < 2 || user.fullname.length > 100) {
            newErrors.fullname = 'Họ và tên phải từ 2 đến 100 ký tự';
        }

        if (!user.username) {
            newErrors.username = 'Tên đăng nhập không được để trống';
        } else if (user.username.length < 3 || user.username.length > 50) {
            newErrors.username = 'Tên đăng nhập phải từ 3 đến 50 ký tự';
        }

        if (!user.email) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (user.phone && user.phone.length > 10) {
            newErrors.phone = 'Số điện thoại không được vượt quá 10 ký tự';
        }

        if (user.address && user.address.length > 255) {
            newErrors.address = 'Địa chỉ không được vượt quá 255 ký tự';
        }

        if (user.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(user.birthday)) {
            newErrors.birthday = 'Ngày sinh phải có định dạng yyyy-MM-dd';
        }

        return newErrors;
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset lỗi trước khi gửi yêu cầu

        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.put(
                `https://localhost:8443/api/v1/users/details/${userId}`,
                user,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            Swal.fire({
                icon: 'success',
                title: '✅ Cập nhật thông tin thành công!',
                timer: 1500,
                showConfirmButton: false,
            });
            setMessage('');
        } catch (error) {
            console.log('Full error object:', error);
            console.log('Error response data:', error.response ? error.response.data : 'No response data');
            if (error.response && error.response.data) {
                if (error.response.status === 400) {
                    if (typeof error.response.data === 'object' && !error.response.data.status) {
                        // Lỗi validation chi tiết từ BE (dạng { "fieldname": "message" })
                        setErrors(error.response.data);
                        const errorMessages = Object.values(error.response.data).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: '❌ Dữ liệu không hợp lệ',
                            text: errorMessages || 'Vui lòng kiểm tra lại các trường thông tin.',
                            confirmButtonText: 'OK',
                        });
                    } else {
                        // Lỗi tổng quát từ BE (dạng string hoặc object với status)
                        let errorMessage;
                        if (typeof error.response.data === 'string') {
                            errorMessage = error.response.data;
                        } else if (error.response.data.message) {
                            errorMessage = error.response.data.message;
                        } else if (error.response.data.error) {
                            errorMessage = error.response.data.error + ' tại ' + error.response.data.path;
                        } else {
                            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
                        }
                        setMessage(errorMessage);
                        Swal.fire({
                            icon: 'error',
                            title: '❌ Lỗi khi cập nhật thông tin',
                            text: errorMessage,
                            confirmButtonText: 'OK',
                        });
                    }
                } else if (error.response.status === 403) {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Lỗi quyền truy cập',
                        text: 'Bạn không có quyền cập nhật thông tin này.',
                        confirmButtonText: 'OK',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Lỗi khi cập nhật thông tin',
                        text: error.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
                        confirmButtonText: 'OK',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '❌ Lỗi kết nối',
                    text: 'Không thể kết nối đến server. Vui lòng kiểm tra lại.',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    // const handleUpdatePassword = async (e) => {
    //     e.preventDefault();
    //     const validationErrors = validatePasswordForm();
    //     setErrors(validationErrors);
    //
    //     if (Object.keys(validationErrors).length === 0) {
    //         const token = localStorage.getItem('accessToken');
    //         try {
    //             const res = await axios.put(
    //                 `https://localhost:8443/api/v1/users/changePassword/${userId}`,
    //                 user2,
    //                 {
    //                     headers: { Authorization: `Bearer ${token}` },
    //                     withCredentials: true,
    //                 }
    //             );
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: '✅ Đổi mật khẩu thành công!',
    //                 timer: 1500,
    //                 showConfirmButton: false,
    //             });
    //             setMessage('');
    //             setUser2({ password: '', newPassword: '', reNewPassword: '' });
    //         } catch (error) {
    //             console.error(error);
    //             if (error.response && error.response.data) {
    //                 setErrors(error.response.data);
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: '❌ Lỗi khi đổi mật khẩu',
    //                     text: 'Dữ liệu không hợp lệ hoặc mật khẩu hiện tại không đúng.',
    //                     confirmButtonText: 'OK',
    //                 });
    //             } else {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: '❌ Lỗi khi đổi mật khẩu',
    //                     text: 'Có lỗi xảy ra. Vui lòng thử lại.',
    //                     confirmButtonText: 'OK',
    //                 });
    //             }
    //         }
    //     }
    // };

    const validatePasswordForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

        // if (!user2.password) {
        //     newErrors.password = 'Vui lòng nhập mật khẩu hiện tại';
        // }
        //
        // if (!user2.newPassword) {
        //     newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        // } else if (!passwordRegex.test(user2.newPassword)) {
        //     newErrors.newPassword = 'Mật khẩu mới phải ít nhất 7 ký tự, bao gồm chữ và số';
        // }
        //
        // if (!user2.reNewPassword) {
        //     newErrors.reNewPassword = 'Vui lòng nhập lại mật khẩu mới';
        // } else if (user2.newPassword !== user2.reNewPassword) {
        //     newErrors.reNewPassword = 'Mật khẩu không khớp';
        // }

        return newErrors;
    };
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const validationErrors = validatePasswordForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.put(
                    `https://localhost:8443/api/v1/users/changePassword/${userId}`,
                    {
                        password: user2.password,
                        newPassword: user2.newPassword,
                        retypePassword: user2.reNewPassword,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                Swal.fire({
                    icon: 'success',
                    title: '✅ Đổi mật khẩu thành công!',
                    timer: 1500,
                    showConfirmButton: false,
                });
                setMessage('');
                setUser2({ password: '', newPassword: '', reNewPassword: '' });
            } catch (error) {
                console.log('Full error object:', error);
                console.log('Error response data:', error.response ? error.response.data : 'No response data');
                if (error.response) {
                    const errorData = error.response.data || {};
                    if (error.response.status === 400) {
                        setErrors(errorData);
                        const errorMessages = Object.values(errorData).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: '⚠️ Lỗi khi đổi mật khẩu',
                            text: errorMessages || 'Dữ liệu không hợp lệ. Vui lòng thử lại.',
                            confirmButtonText: 'OK',
                        });
                    } else if (error.response.status === 403) {
                        const errorMessage = errorData || 'Bạn không có quyền cập nhật mật khẩu.';
                        Swal.fire({
                            icon: 'error',
                            title: '❌ Lỗi quyền truy cập',
                            text: errorMessage,
                            confirmButtonText: 'OK',
                        });
                    } else if (error.response.status === 401) {
                        const errorMessage = errorData || 'Yêu cầu không được xác thực. Vui lòng đăng nhập lại.';
                        Swal.fire({
                            icon: 'error',
                            title: '❌ Lỗi xác thực',
                            text: errorMessage,
                            confirmButtonText: 'OK',
                        });
                    } else {
                        const errorMessage = errorData || 'Có lỗi xảy ra. Vui lòng thử lại.';
                        Swal.fire({
                            icon: 'error',
                            title: '❌ Lỗi khi đổi mật khẩu',
                            text: errorMessage,
                            confirmButtonText: 'OK',
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Lỗi kết nối',
                        text: 'Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối.',
                        confirmButtonText: 'OK',
                    });
                }
            }
        }
    };

    return (
        <div className="containerEdit light-style flex-grow-1 container-p-y">
            <h4 className="font-weight-bold py-3 mb-4">Chỉnh sửa thông tin cá nhân</h4>
            {message && <div className="mb-4 text-red-500">{message}</div>}
            <div className="card overflow-hidden">
                <div className="row no-gutters row-bordered row-border-light">
                    <div className="col-md-3 pt-0">
                        <div className="list-group list-group-flush account2-settings-links">
                            <a className="list-group-item list-group-item-action active" data-toggle="list" href="#account2-general">
                                Thông tin cá nhân
                            </a>
                            <a className="list-group-item list-group-item-action" data-toggle="list" href="#account2-change-password">
                                Đổi mật khẩu
                            </a>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="tab-content">
                            <div className="tab-pane fade active show" id="account2-general">
                                <div className="card2-body media align-items-center">
                                    <img src={avatarPreview || user.avatar} alt="Avatar" className="d-block ui-w-80" />
                                    <div className="media-body ml-4">
                                        <label className="btn btn-outline-primary upload-photo-label">
                                            Tải hình mới lên
                                            <input type="file" accept="image/*" className="account2-settings-fileinput" onChange={handleAvatarChange} />
                                        </label>{' '}
                                        <button type="button" className="btn btn-default md-btn-flat" onClick={handleUploadAvatar}>
                                            Tải ảnh
                                        </button>
                                        <div className="text-light small mt-1">Cho phép JPG, GIF hoặc PNG. Kích thước tối đa là 800K</div>
                                    </div>
                                </div>
                                <hr className="border-light m-0" />
                                <div className="card-body">
                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div className="form-group">
                                            <label className="form-label">Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={user.username}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Nhập tên đăng nhập"
                                            />
                                            {errors.username && <small className="error">{errors.username}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Họ và tên</label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                value={user.fullname}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Nhập họ và tên"
                                            />
                                            {errors.fullname && <small className="error">{errors.fullname}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={user.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Nhập email"
                                            />
                                            {errors.email && <small className="error">{errors.email}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={user.phone}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Nhập số điện thoại"
                                            />
                                            {errors.phone && <small className="error">{errors.phone}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Địa chỉ</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={user.address}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Nhập địa chỉ"
                                            />
                                            {errors.address && <small className="error">{errors.address}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Ngày sinh (yyyy-MM-dd)</label>
                                            <input
                                                type="date"
                                                name="birthday"
                                                value={user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''}
                                                onChange={handleChange}
                                                className="form-control"
                                            />

                                            {errors.birthday && <small className="error">{errors.birthday}</small>}
                                        </div>
                                        <div className="text-right mt-3">
                                            <button type="submit" className="btn btn-primary">
                                            Lưu thay đổi
                                            </button>{' '}
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                onClick={() => {
                                                    setMessage('');
                                                    setErrors({});
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="account2-change-password">
                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                    <div className="card2-body pb-2">
                                        <div className="form-group">
                                            <label className="form-label">Mật khẩu hiện tại</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={user2.password}
                                                onChange={handlePasswordChange}
                                                className="form-control"
                                                placeholder="Nhập mật khẩu hiện tại"
                                            />
                                            {errors.password && <small className="error">{errors.password}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Mật khẩu mới</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={user2.newPassword}
                                                onChange={handlePasswordChange}
                                                className="form-control"
                                                placeholder="Nhập mật khẩu mới"
                                            />
                                            {errors.newPassword && <small className="error">{errors.newPassword}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Nhập lại mật khẩu mới</label>
                                            <input
                                                type="password"
                                                name="reNewPassword"
                                                value={user2.reNewPassword}
                                                onChange={handlePasswordChange}
                                                className="form-control"
                                                placeholder="Nhập lại mật khẩu mới"
                                            />
                                            {errors.reNewPassword && <small className="error">{errors.reNewPassword}</small>}
                                        </div>
                                        <div className="text-right mt-3">
                                            <button type="submit" className="btn btn-primary">
                                                Lưu thay đổi
                                            </button>{' '}
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                onClick={() => setUser2({ password: '', newPassword: '', reNewPassword: '' })}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileEdit;