import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './user-profile-edit.css'
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// jQuery (nếu cần dùng)
import $ from 'jquery';

// Bootstrap JS (bundle includes popper.js)
import 'bootstrap/dist/js/bootstrap.bundle.min';

const UserProfileEdit = () => {
    const [user, setUser] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        birthday: '',
    });

    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');

    // Load user info from token
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            setMessage('Bạn chưa đăng nhập');
            return;
        }

        const decoded = jwtDecode(token);
        const username = decoded.sub;

        axios.post(`https://localhost:8443/api/v1/users/details`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                const userData = res.data;
                const formattedBirthday = userData.birthday + "T00:00:00"; // ghép thêm giờ phút giây
                setUser({
                    fullname: userData.fullname || '',
                    username: userData.username || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    birthday: userData.formattedBirthday || '',
                });
                setUserId(userData.id);
            })
            .catch(err => {
                console.error(err);
                setMessage('Lỗi khi tải thông tin người dùng');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        try {
            const res = await axios.put(
                `http://localhost:8080/api/v1/users/details/${userId}`,
                user,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);
            setMessage('Lỗi khi cập nhật thông tin');
        }
    };

    return (
        <>
            {/*<div className="information">*/}
            {/*    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">*/}
            {/*        <h2 className="text-xl font-bold mb-4">Cập nhật thông tin người dùng</h2>*/}
            {/*        {message && <div className="mb-4 text-red-500">{message}</div>}*/}
            {/*        <form onSubmit={handleUpdate} className="space-y-4">*/}
            {/*            <input type="text" name="fullname" value={user.fullname} onChange={handleChange}*/}
            {/*                   placeholder="Họ tên"*/}
            {/*                   className="w-full p-2 border rounded"/>*/}
            {/*            <input type="text" name="username" value={user.username} onChange={handleChange}*/}
            {/*                   placeholder="Tên đăng nhập" className="w-full p-2 border rounded"/>*/}
            {/*            <input type="text" name="phone" value={user.phone} onChange={handleChange}*/}
            {/*                   placeholder="Số điện thoại"*/}
            {/*                   className="w-full p-2 border rounded"/>*/}
            {/*            <input type="text" name="address" value={user.address} onChange={handleChange}*/}
            {/*                   placeholder="Địa chỉ"*/}
            {/*                   className="w-full p-2 border rounded"/>*/}
            {/*            <input type="date" name="birthday" value={user.birthday} onChange={handleChange}*/}
            {/*                   className="w-full p-2 border rounded"/>*/}
            {/*            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Lưu*/}
            {/*                thay*/}
            {/*                đổi*/}
            {/*            </button>*/}
            {/*        </form>*/}
            {/*    </div>*/}
            {/*</div>*/}


            <div className="containerEdit light-style flex-grow-1 container-p-y">

                <h4 className="font-weight-bold py-3 mb-4">
                    Chỉnh sửa thông tin cá nhân
                </h4>

                <div className="card overflow-hidden">
                    <div className="row no-gutters row-bordered row-border-light">
                        <div className="col-md-3 pt-0">
                            <div className="list-group list-group-flush account2-settings-links">
                                <a className="list-group-item list-group-item-action active" data-toggle="list"
                                   href="#account2-general">Thông tin cá nhân</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account2-change-password">Đổi mật khẩu</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account2-info">Thông tin chung</a>
                                <a className="list-group-item list-group-item-action" data-toggle="list"
                                   href="#account2-social-links">Social links</a>
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
                                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt=""
                                             className="d-block ui-w-80"/>
                                        <div className="media-body ml-4">
                                            <label className="btn btn-outline-primary upload-photo-label">
                                                Upload new photo
                                                <input type="file" className="account2-settings-fileinput"/>
                                            </label> &nbsp;
                                            <button type="button" className="btn btn-default md-btn-flat">Reset</button>

                                            <div className="text-light small mt-1">Allowed JPG, GIF or PNG. Max size of
                                                800K
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="border-light m-0"/>

                                    <div className="card-body">
                                        <div className="form-group">
                                            <label className="form-label">Username</label>
                                            <input type="text" className="form-control mb-1"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Name</label>
                                            <input type="text" className="form-control" value="Nelle Maxwell"/>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">E-mail</label>
                                            <input type="text" className="form-control mb-1" value="nmaxwell@mail.com"/>
                                            <div className="alert alert-warning mt-3">
                                                Your email is not confirmed. Please check your inbox.<br/>
                                                <a href="javascript:void(0)">Resend confirmation</a>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Company</label>
                                            <input type="text" className="form-control" value="Company Ltd."/>
                                        </div>
                                    </div>

                                </div>
                                <div className="tab-pane fade" id="account2-change-password">
                                    <div className="card2-body pb-2">

                                        <div className="form-group">
                                            <label className="form-label">Current password</label>
                                            <input type="password" className="form-control"/>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">New password</label>
                                            <input type="password" className="form-control"/>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Repeat new password</label>
                                            <input type="password" className="form-control"/>
                                        </div>

                                    </div>
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

        </>
    );
};

export default UserProfileEdit;
