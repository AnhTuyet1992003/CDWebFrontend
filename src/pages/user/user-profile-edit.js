import React, { useEffect, useState } from 'react';
import axios, {post} from 'axios';
import { jwtDecode } from 'jwt-decode';
import Chatbox from './Chatbox';

import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

import './user-profile-edit.css'
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// jQuery (nếu cần dùng)
import $ from 'jquery';

// Bootstrap JS (bundle includes popper.js)
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";


const UserProfileEdit = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullname: '',
        //username: '',
        phone: '',
        address: '',
        birthday: '',
        avatar: ''
    });
    const [user2, setUser2] = useState({
        password: '',
        newPassword: '',
        reNewPassword: ''
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    // Khi chọn file ảnh
    const handleAvatarChange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            console.log("No file selected");
            setMessage(t('profile.message_choose_avatar_valid'));

            // Hiển thị Swal yêu cầu chọn ảnh hợp lệ
            Swal.fire({
                icon: 'warning',
                title: t('profile.warning_choose_avatar'),
                confirmButtonText: 'OK',
            });
            return;
        }

        const file = files[0];
        console.log("File selected:", file);

        // Kiểm tra định dạng file (ảnh)
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validImageTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: t('profile.error_choose_avatar'),
                confirmButtonText: 'OK',
            });
            setMessage(t('profile.message_choose_avatar'));
            return;
        }

        // Nếu chọn đúng ảnh, lưu file
        setAvatarFile(file);
        setMessage(""); // Xóa thông báo lỗi nếu chọn ảnh hợp lệ

        // Tạo đường dẫn ảnh để hiển thị ngay
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);

        // Hiển thị thông báo chọn ảnh thành công
        Swal.fire({
            icon: 'success',
            title: t('profile.success_choose_avatar'),
            timer: 1500,
            showConfirmButton: false,
        });
    };


    //gửi file lên api
    const handleUploadAvatar = async () => {
        if (!avatarFile){
            Swal.fire({
                icon: 'warning',
                title: t('profile.warning_choose_avatar_up'),
                confirmButtonText: 'OK',
            });
            return;
        }

        // Xác nhận người dùng có muốn tải ảnh không
        const confirmUpload = await Swal.fire({
            icon: 'question',
            title: t('profile.question_choose_avatar_title'),
            showCancelButton: true,
            confirmButtonText: t('profile.btn_choose_avatar_up'),
            cancelButtonText: t('profile.btn_cancel'),
        });

        // Nếu người dùng xác nhận thì thực hiện tải ảnh
        if (confirmUpload.isConfirmed) {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))?.split('=')[1];

            const formData = new FormData();
            formData.append('file', avatarFile);
            console.log("Token từ cookie login google_avatar:", token);

            try {
                const response = await axios.post('https://localhost:8443/api/v1/users/upload-avatar', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Hiển thị thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: t('profile.success_up_avatar_title'),
                    text: t('profile.success_up_avatar_text'),
                    timer: 2000,
                    showConfirmButton: false,
                });

                console.log('Avatar Url:', response.data.data.url);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title:t('profile.error_up_avatar_title'),
                    text: t('profile.error_up_avatar_text'),
                });
            }
        } else {
            // Nếu người dùng hủy bỏ, hiển thị thông báo
            Swal.fire({
                icon: 'info',
                title:t('profile.info_up_avatar_title'),
                text: t('profile.info_up_avatar_text'),
            });
        }
    };


    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    // Load user info from token
    useEffect(() => {
        // const token = document.cookie
        //     .split('; ')
        //     .find(row => row.startsWith('token='))
        //     ?.split('=')[1];
        const token = localStorage.getItem('accessToken');
            // Cookies.get('token');

        console.log("token profile: "+token)


        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: t('login.error_login'),
                confirmButtonText: 'OK',
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        const decoded = jwtDecode(token);
        const username = decoded.sub;

        axios.post(`https://localhost:8443/api/v1/users/details`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        })
            .then(res => {
                const userData = res.data;
                const formattedBirthday = userData.birthday; // ghép thêm giờ phút giây
                setUser({
                    fullname: userData.fullname || '',
                    //username: userData.username || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    birthday: formattedBirthday || '',
                    avatar: userData.avatar || 'https://res.cloudinary.com/dorz7ucva/image/upload/v1745202292/image_2820bc603a47efcf17a0806b81ca92bff7ea2905.png'
                });
                setUserId(userData.id);
                console.log(userData.avatar); // Đúng
            })
            .catch(err => {
                console.error(err);
                setMessage(t('profile.error_information_user'));
            });

        //chat tu dong
        console.log('✅ Chatbox script loaded');
        const script = document.createElement('script');
         script.src = 'https://app.tudongchat.com/js/chatbox.js';
        //script.src = 'C:\\Users\\ADMIN\\eclipse-workspace\\CDWebFrontend\\src\\assets\\user\\js\\chatbox.js'
        script.async = true;

        script.onload = () => {
            console.log('✅ Chatbox script loaded');
            if (window.TuDongChat) {
                const tudong_chatbox = new window.TuDongChat('GEKBdJuf_t2KzMXWnR9hH');
                tudong_chatbox.initial();
                console.log('✅ Chatbox initialized');
            } else {
                console.error('❌ TuDongChat not available');
            }
        };

        script.onerror = () => {
            console.error('❌ Failed to load chatbox.js');
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };



    const handleUpdate = async (e) => {
        e.preventDefault();

        // const token = document.cookie
        //     .split('; ')
        //     .find(row => row.startsWith('token='))
        //     ?.split('=')[1];
        const token = localStorage.getItem('accessToken');


        try {
            const res = await axios.put(
                `https://localhost:8443/api/v1/users/details/${userId}`,
                user,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            setMessage('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);

            // Kiểm tra lỗi từ response
            if (error.response && error.response.data) {
                // Nếu có lỗi từ backend, lấy thông điệp từ response và hiển thị
                setMessage(error.response.data);  // Hiển thị thông điệp lỗi từ backend
            } else {
                // Nếu không có lỗi response, hiển thị thông báo chung
                setMessage('Lỗi khi cập nhật thông tin');
            }
        }
    };
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

        if (!user2.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu.';
        } else if (!passwordRegex.test(user2.password)) {
            newErrors.password = 'Mật khẩu ít nhất 7 ký tự, bao gồm chữ và số.';
        }

        if (!user2.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu.';
        } else if (!passwordRegex.test(user2.passnewPasswordword)) {
            newErrors.newPassword = 'Mật khẩu ít nhất 7 ký tự, bao gồm chữ và số.';
        }

        if (!user2.reNewPassword) {
            newErrors.retypePassword = 'Vui lòng nhập lại mật khẩu.';
        } else if (user2.newPassword !== user2.reNewPassword) {
            newErrors.retypePassword = 'Mật khẩu không khớp.';
        }
        return newErrors;
    };
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        // const token = document.cookie
        //     .split('; ')
        //     .find(row => row.startsWith('token='))
        //     ?.split('=')[1];
        const token = localStorage.getItem('accessToken');


        try {
            const res = await axios.put(
                `https://localhost:8443/api/v1/users/changePassword/${userId}`,
                user2,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            setMessage('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);

            // Kiểm tra lỗi từ response
            if (error.response && error.response.data) {
                // Nếu có lỗi từ backend, lấy thông điệp từ response và hiển thị
                setMessage(error.response.data);  // Hiển thị thông điệp lỗi từ backend
            } else {
                // Nếu không có lỗi response, hiển thị thông báo chung
                setMessage('Lỗi khi cập nhật thông tin');
            }
        }
    };

    return (
        <>
            <div className="information">
                <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4">Cập nhật thông tin người dùng</h2>
                    {message && <div className="mb-4 text-red-500">{message}</div>}
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <input type="text" name="fullname" value={user.fullname} onChange={handleChange}
                               placeholder="Họ tên"
                               className="w-full p-2 border rounded"/>
                        {/*<input type="text" name="username" value={user.username} onChange={handleChange}*/}
                        {/*       placeholder="Tên đăng nhập" className="w-full p-2 border rounded"/>*/}
                        <input type="text" name="phone" value={user.phone} onChange={handleChange}
                               placeholder="Số điện thoại"
                               className="w-full p-2 border rounded"/>
                        <input type="text" name="address" value={user.address} onChange={handleChange}
                               placeholder="Địa chỉ"
                               className="w-full p-2 border rounded"/>
                        <input type="date" name="birthday" value={user.birthday} onChange={handleChange}
                               className="w-full p-2 border rounded"/>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Lưu
                            thay
                            đổi
                        </button>
                    </form>
                </div>
            </div>


            <div className="containerEdit light-style flex-grow-1 container-p-y">

                <h4 className="font-weight-bold py-3 mb-4">
                    {t('profile.title')}
                </h4>

                <div className="card overflow-hidden">
                    <div className="row no-gutters row-bordered row-border-light">
                        <div className="col-md-3 pt-0">
                            <div className="list-group list-group-flush account2-settings-links">
                                <a className="list-group-item list-group-item-action active" data-toggle="list"
                                   href="#account2-general">{t('profile.information')}</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account2-change-password">{t('profile.change_pass')}</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account2-info">{t('profile.info_general')}</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account2-social-links">{t('profile.social_link')}</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account2-connections">Connections</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account2-notifications">Notifications</a>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="tab-content">
                                <div className="tab-pane fade active show" id="account2-general">

                                    <div className="card2-body media align-items-center">
                                        <img
                                            src={avatarPreview || user.avatar} // Nếu có ảnh preview thì hiển thị, không thì hiển thị ảnh mặc định
                                            alt="Avatar"
                                            className="d-block ui-w-80"
                                        />
                                        <div className="media-body ml-4">
                                            <label className="btn btn-outline-primary upload-photo-label">
                                                {t('profile.up_avatar')}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="account2-settings-fileinput"
                                                    onChange={handleAvatarChange}
                                                    // style={{display: "none"}}
                                                />
                                            </label> &nbsp;
                                            <button type="button"
                                                    className="btn btn-default md-btn-flat"
                                                    onClick={handleUploadAvatar}>{t('profile.up')}
                                            </button>

                                            <div className="text-light small mt-1">{t('profile.condition')}
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <hr className="border-light m-0"/>

                                    <div className="card-body">
                                    <div className="form-group">
                                            <label className="form-label">Username</label>
                                            <input type="text" className="form-control mb-1"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Tên</label>
                                            <input type="text" className="form-control" value="Nelle Maxwell"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input type="text" className="form-control mb-1" value="nmaxwell@mail.com"/>
                                            <div className="alert alert-warning mt-3">
                                                Your email is not confirmed. Please check your inbox.<br/>
                                                <a href="javascript:void(0)">Resend confirmation</a>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Số điện thoại</label>
                                            <input type="tel" className="form-control" pattern="[0-9]+"/>
                                        </div>
                                    </div>

                                </div>
                                <div className="tab-pane fade" id="account2-change-password">
                                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                                        <div className="card2-body pb-2">

                                            {errors.password && (
                                                <div className="error-container">
                                                    <small className="error">{errors.password}</small>
                                                </div>
                                            )}
                                            <div className="form-group">
                                                <label className="form-label">Current password</label>
                                                <input type="password" name="password" value={user2.password}
                                                       onChange={handleChange}
                                                       required={true} className="form-control"/>
                                            </div>
                                            {errors.newPassword && (
                                                <div className="error-container">
                                                    <small className="error">{errors.newPassword}</small>
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label className="form-label">New password</label>
                                                <input type="password" name="newPassword" value={user2.newPassword}
                                                       onChange={handleChange}
                                                       required={true} className="form-control"/>
                                            </div>
                                            {errors.reNewPassword && (
                                                <div className="error-container">
                                                    <small className="error">{errors.reNewPassword}</small>
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label className="form-label">Repeat new password</label>
                                                <input type="password" name="reNewPassword" value={user2.reNewPassword}
                                                       onChange={handleChange} required={true}
                                                       className="form-control"/>
                                            </div>
                                            {errors.password && (
                                                <div className="error-container">
                                                    <small className="error">{errors.password}</small>
                                                </div>
                                            )}

                                            <div className="text-right mt-3">
                                                <button type="submit" className="btn btn-primary">Save changes</button>
                                                &nbsp;
                                                <button type="button" className="btn btn-default">Cancel</button>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                                <div className="tab-pane fade" id="account2-info">
                                    <div className="card2-body pb-2">

                                        <div className="form-group">
                                            <label className="form-label">Bio</label>
                                            <textarea className="form-control" rows="5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nunc arcu, dignissim sit amet sollicitudin iaculis, vehicula id urna. Sed luctus urna nunc. Donec fermentum, magna sit amet rutrum pretium, turpis dolor molestie diam, ut lacinia diam risus eleifend sapien. Curabitur ac nibh nulla. Maecenas nec augue placerat, viverra tellus non, pulvinar risus.</textarea>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Birthday</label>
                                            <input type="text" className="form-control" value="May 3, 1995"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Country</label>
                                            <select className="custom-select">
                                                <option>USA</option>
                                                <option selected="">Canada</option>
                                                <option>UK</option>
                                                <option>Germany</option>
                                                <option>France</option>
                                            </select>
                                        </div>


                                    </div>
                                    <hr className="border-light m-0"/>
                                    <div className="card2-body pb-2">

                                        <h6 className="mb-4">Contacts</h6>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input type="text" className="form-control" value="+0 (123) 456 7891"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Website</label>
                                            <input type="text" className="form-control" value=""/>
                                        </div>

                                    </div>

                                </div>
                                <div className="tab-pane fade" id="account2-social-links">
                                    <div className="card2-body pb-2">

                                        <div className="form-group">
                                            <label className="form-label">Twitter</label>
                                            <input type="text" className="form-control"
                                                   value="https://twitter.com/user"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Facebook</label>
                                            <input type="text" className="form-control"
                                                   value="https://www.facebook.com/user"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Google+</label>
                                            <input type="text" className="form-control" value=""/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">LinkedIn</label>
                                            <input type="text" className="form-control" value=""/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Instagram</label>
                                            <input type="text" className="form-control"
                                                   value="https://www.instagram.com/user"/>
                                        </div>

                                    </div>
                                </div>
                                <div className="tab-pane fade" id="account2-connections">
                                    <div className="card2-body">
                                        <button type="button" className="btn btn-twitter">Connect
                                            to <strong>Twitter</strong></button>
                                    </div>
                                    <hr className="border-light m-0"/>
                                    <div className="card2-body">
                                        <h5 className="mb-2">
                                            <a href="javascript:void(0)" className="float-right text-muted text-tiny"><i
                                                className="ion ion-md-close"></i> Remove</a>
                                            <i className="ion ion-logo-google text-google"></i>
                                            You are connected to Google:
                                        </h5>
                                        <a href="/cdn-cgi/l/email-protection" className="__cf_email__"
                                           data-cfemail="6c02010d141b0900002c010d0500420f0301">[email&#160;protected]</a>
                                    </div>
                                    <hr className="border-light m-0"/>
                                    <div className="card2-body">
                                        <button type="button" className="btn btn-facebook">Connect
                                            to <strong>Facebook</strong></button>
                                    </div>
                                    <hr className="border-light m-0"/>
                                    <div className="card2-body">
                                        <button type="button" className="btn btn-instagram">Connect
                                            to <strong>Instagram</strong></button>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="account2-notifications">
                                    <div className="card2-body pb-2">

                                        <h6 className="mb-4">Activity</h6>

                                        <div className="form-group">
                                            <label className="switcher">
                                                <input type="checkbox" className="switcher-input" checked=""/>
                                                <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                                                <span className="switcher-label">Email me when someone comments on my article</span>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="switcher">
                                                <input type="checkbox" className="switcher-input" checked=""/>
                                                <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                                                <span className="switcher-label">Email me when someone answers on my forum thread</span>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="switcher">
                                                <input type="checkbox" className="switcher-input"/>
                                                <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                                                <span className="switcher-label">Email me when someone follows me</span>
                                            </label>
                                        </div>
                                    </div>
                                    <hr className="border-light m-0"/>
                                    <div className="card2-body pb-2">

                                        <h6 className="mb-4">Application</h6>

                                        <div className="form-group">
                                            <label className="switcher">
                                                <input type="checkbox" className="switcher-input" checked=""/>
                                                <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                                                <span className="switcher-label">News and announcements</span>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="switcher">
                                                <input type="checkbox" className="switcher-input"/>
                                                <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                                                <span className="switcher-label">Weekly product updates</span>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="switcher">
                                                <input type="checkbox" className="switcher-input" checked=""/>
                                                <span className="switcher-indicator">
                      <span className="switcher-yes"></span>
                      <span className="switcher-no"></span>
                    </span>
                                                <span className="switcher-label">Weekly blog digest</span>
                                            </label>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-right mt-3">
                    <button type="button" className="btn btn-primary">Save changes</button>
                    &nbsp;
                    <button type="button" className="btn btn-default">Cancel</button>
                </div>

            </div>


            {/*<div><Chatbox/></div>*/}

        </>
    );
};

export default UserProfileEdit;
