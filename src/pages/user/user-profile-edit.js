import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import i18next from 'i18next';
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
            setMessage(i18next.t('profile.error_not_logged_in'));
            Swal.fire({
                icon: 'error',
                title: i18next.t('profile.error_not_logged_in'),
                text: i18next.t('profile.error_not_logged_in'),
                confirmButtonText: 'OK',
            });
            return;
        }

        const decoded = jwtDecode(token);
        axios
            .post('https://localhost:8443/api/v1/users/details', {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
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
                setMessage(i18next.t('profile.error_load_user'));
                Swal.fire({
                    icon: 'error',
                    title: i18next.t('profile.error_load_user'),
                    text: i18next.t('profile.error_load_user'),
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
                title: i18next.t('profile.error_choose_avatar'),
                confirmButtonText: 'OK',
            });
            return;
        }

        const file = files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validImageTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: i18next.t('profile.error_choose_avatar'),
                confirmButtonText: 'OK',
            });
            return;
        }

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        Swal.fire({
            icon: 'success',
            title: i18next.t('profile.message_choose_avatar_valid'),
            timer: 1500,
            showConfirmButton: false,
        });
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) {
            Swal.fire({
                icon: 'warning',
                title: i18next.t('profile.error_choose_avatar'),
                confirmButtonText: 'OK',
            });
            return;
        }

        const confirmUpload = await Swal.fire({
            icon: 'question',
            title: i18next.t('profile.confirm_upload_avatar'),
            showCancelButton: true,
            confirmButtonText: i18next.t('profile.upload'),
            cancelButtonText: i18next.t('profile.cancel'),
        });

        if (confirmUpload.isConfirmed) {
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('file', avatarFile);

            try {
                const response = await axios.post('https://localhost:8443/api/v1/users/upload-avatar', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser((prev) => ({ ...prev, avatar: response.data.data.url }));
                Swal.fire({
                    icon: 'success',
                    title: i18next.t('profile.success_upload_avatar'),
                    text: i18next.t('profile.avatar_updated'),
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: i18next.t('profile.error_upload_avatar'),
                    text: i18next.t('profile.error_upload_avatar_text'),
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!user.username) {
            newErrors.username = 'validation.username_notBlank';
        } else if (user.username.length < 3 || user.username.length > 50) {
            newErrors.username = 'validation.username_size';
        }

        if (!user.fullname) {
            newErrors.fullname = 'validation.fullname_notBlank';
        } else if (user.fullname.length < 2 || user.fullname.length > 100) {
            newErrors.fullname = 'validation.fullname_size';
        }

        if (!user.email) {
            newErrors.email = 'validation.email_notBlank';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = 'validation.email_invalid';
        } else if (user.email.length > 100) {
            newErrors.email = 'validation.email_size';
        }

        if (user.phone && user.phone.length > 10) {
            newErrors.phone = 'validation.phone_size';
        }

        if (user.address && user.address.length > 255) {
            newErrors.address = 'validation.address_size';
        }

        if (user.birthday) {
            const date = new Date(user.birthday);
            if (isNaN(date.getTime())) {
                newErrors.birthday = 'validation.birthday_invalid';
            }
        }

        return newErrors;
    };

    const validatePasswordForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

        if (!user2.password) {
            newErrors.password = 'validation.password_notBlank';
        }

        if (!user2.newPassword) {
            newErrors.newPassword = 'validation.newPassword_notBlank';
        } else if (!passwordRegex.test(user2.newPassword)) {
            newErrors.newPassword = 'validation.newPassword_invalid';
        }

        if (!user2.reNewPassword) {
            newErrors.reNewPassword = 'validation.reNewPassword_notBlank';
        } else if (user2.newPassword !== user2.reNewPassword) {
            newErrors.reNewPassword = 'validation.reNewPassword_mismatch';
        }

        return newErrors;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            const errorMessages = Object.values(validationErrors)
                .map((key) => i18next.t(key))
                .join('\n');
            Swal.fire({
                icon: 'error',
                title: i18next.t('profile.error_invalid_data'),
                text: errorMessages,
                confirmButtonText: 'OK',
            });
            return;
        }

        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.put(`https://localhost:8443/api/v1/users/details/${userId}`, user, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            Swal.fire({
                icon: 'success',
                title: i18next.t('profile.success_update'),
                timer: 1500,
                showConfirmButton: false,
            });
            setMessage('');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                if (error.response.status === 400) {
                    const errorData = error.response.data;
                    if (typeof errorData === 'object') {
                        const translatedErrors = {};
                        Object.keys(errorData).forEach((field) => {
                            translatedErrors[field] = i18next.t(errorData[field]);
                        });
                        setErrors(translatedErrors);
                        const errorMessages = Object.values(translatedErrors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: i18next.t('profile.error_invalid_data'),
                            text: errorMessages,
                            confirmButtonText: 'OK',
                        });
                    } else {
                        setMessage(i18next.t(errorData));
                        Swal.fire({
                            icon: 'error',
                            title: i18next.t('profile.error_update'),
                            text: i18next.t(errorData),
                            confirmButtonText: 'OK',
                        });
                    }
                } else if (error.response.status === 403) {
                    setMessage(i18next.t('user.error_forbidden_update'));
                    Swal.fire({
                        icon: 'error',
                        title: i18next.t('profile.error_forbidden'),
                        text: i18next.t('user.error_forbidden_update'),
                        confirmButtonText: 'OK',
                    });
                } else {
                    setMessage(i18next.t('system.error_internal'));
                    Swal.fire({
                        icon: 'error',
                        title: i18next.t('profile.error_update'),
                        text: i18next.t('system.error_internal'),
                        confirmButtonText: 'OK',
                    });
                }
            } else {
                setMessage(i18next.t('profile.error_server'));
                Swal.fire({
                    icon: 'error',
                    title: i18next.t('profile.error_update'),
                    text: i18next.t('profile.error_server'),
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const validationErrors = validatePasswordForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            const errorMessages = Object.values(validationErrors)
                .map((key) => i18next.t(key))
                .join('\n');
            Swal.fire({
                icon: 'error',
                title: i18next.t('profile.error_invalid_data'),
                text: errorMessages,
                confirmButtonText: 'OK',
            });
            return;
        }

        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.put(`https://localhost:8443/api/v1/users/changePassword/${userId}`, user2, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            Swal.fire({
                icon: 'success',
                title: i18next.t('profile.success_password_update'),
                timer: 1500,
                showConfirmButton: false,
            });
            setMessage('');
            setUser2({ password: '', newPassword: '', reNewPassword: '' });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                if (error.response.status === 400) {
                    const errorData = error.response.data;
                    if (typeof errorData === 'object') {
                        const translatedErrors = {};
                        Object.keys(errorData).forEach((field) => {
                            translatedErrors[field] = i18next.t(errorData[field]);
                        });
                        setErrors(translatedErrors);
                        const errorMessages = Object.values(translatedErrors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: i18next.t('profile.error_password_update'),
                            text: errorMessages,
                            confirmButtonText: 'OK',
                        });
                    } else {
                        setMessage(i18next.t(errorData));
                        Swal.fire({
                            icon: 'error',
                            title: i18next.t('profile.error_password_update'),
                            text: i18next.t(errorData),
                            confirmButtonText: 'OK',
                        });
                    }
                } else if (error.response.status === 403) {
                    setMessage(i18next.t('user.error_forbidden_update'));
                    Swal.fire({
                        icon: 'error',
                        title: i18next.t('profile.error_forbidden'),
                        text: i18next.t('user.error_forbidden_update'),
                        confirmButtonText: 'OK',
                    });
                } else {
                    setMessage(i18next.t('system.error_internal'));
                    Swal.fire({
                        icon: 'error',
                        title: i18next.t('profile.error_password_update'),
                        text: i18next.t('system.error_internal'),
                        confirmButtonText: 'OK',
                    });
                }
            } else {
                setMessage(i18next.t('profile.error_server'));
                Swal.fire({
                    icon: 'error',
                    title: i18next.t('profile.error_password_update'),
                    text: i18next.t('profile.error_server'),
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    return (
        <div className="containerEdit light-style flex-grow-1 container-p-y">
            <h4 className="font-weight-bold py-3 mb-4">{i18next.t('profile.edit_profile')}</h4>
            {message && <div className="mb-4 text-red-500">{i18next.t(message)}</div>}
            <div className="card overflow-hidden">
                <div className="row no-gutters row-bordered row-border-light">
                    <div className="col-md-3 pt-0">
                        <div className="list-group list-group-flush account2-settings-links">
                            <a className="list-group-item list-group-item-action active" data-toggle="list" href="#account2-general">
                                {i18next.t('profile.personal_info')}
                            </a>
                            <a className="list-group-item list-group-item-action" data-toggle="list" href="#account2-change-password">
                                {i18next.t('profile.change_password')}
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
                                            {i18next.t('profile.upload_new_photo')}
                                            <input type="file" accept="image/*" className="account2-settings-fileinput" onChange={handleAvatarChange} />
                                        </label>{' '}
                                        <button type="button" className="btn btn-default md-btn-flat" onClick={handleUploadAvatar}>
                                            {i18next.t('profile.upload')}
                                        </button>
                                        <div className="text-light small mt-1">{i18next.t('profile.avatar_requirements')}</div>
                                    </div>
                                </div>
                                <hr className="border-light m-0" />
                                <div className="card-body">
                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.username')}</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={user.username}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder={i18next.t('profile.enter_username')}
                                            />
                                            {errors.username && <small className="error">{i18next.t(errors.username)}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.fullname')}</label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                value={user.fullname}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder={i18next.t('profile.enter_fullname')}
                                            />
                                            {errors.fullname && <small className="error">{i18next.t(errors.fullname)}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.email')}</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={user.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder={i18next.t('profile.enter_email')}
                                            />
                                            {errors.email && <small className="error">{i18next.t(errors.email)}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.phone')}</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={user.phone}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder={i18next.t('profile.enter_phone')}
                                            />
                                            {errors.phone && <small className="error">{i18next.t(errors.phone)}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.address')}</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={user.address}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder={i18next.t('profile.enter_address')}
                                            />
                                            {errors.address && <small className="error">{i18next.t(errors.address)}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.birthday')}</label>
                                            <input
                                                type="date"
                                                name="birthday"
                                                value={user.birthday}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="yyyy-MM-dd"
                                            />
                                            {errors.birthday && <small className="error">{i18next.t(errors.birthday)}</small>}
                                        </div>
                                        <div className="text-right mt-3">
                                            <button type="submit" className="btn btn-primary">{i18next.t('profile.save_changes')}</button>{' '}
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                onClick={() => {
                                                    setMessage('');
                                                    setErrors({});
                                                }}
                                            >
                                                {i18next.t('profile.cancel')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="account2-change-password">
                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                    <div className="card2-body pb-2">
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.current_password')}</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={user2.password}
                                                onChange={handlePasswordChange}
                                                className="form-control"
                                                placeholder={i18next.t('profile.enter_current_password')}
                                            />
                                            {errors.password && <small className="error">{i18next.t(errors.password)}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.new_password')}</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={user2.newPassword}
                                                onChange={handlePasswordChange}
                                                className="form-control"
                                                placeholder={i18next.t('profile.enter_new_password')}
                                            />
                                            {errors.newPassword && <small className="error">{i18next.t(errors.newPassword)}</small>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">{i18next.t('profile.repeat_new_password')}</label>
                                            <input
                                                type="password"
                                                name="reNewPassword"
                                                value={user2.reNewPassword}
                                                onChange={handlePasswordChange}
                                                className="form-control"
                                                placeholder={i18next.t('profile.repeat_new_password')}
                                            />
                                            {errors.reNewPassword && <small className="error">{i18next.t(errors.reNewPassword)}</small>}
                                        </div>
                                        <div className="text-right mt-3">
                                            <button type="submit" className="btn btn-primary">{i18next.t('profile.save_changes')}</button>{' '}
                                            <button
                                                type="button"
                                                className="btn btn-default"
                                                onClick={() => setUser2({ password: '', newPassword: '', reNewPassword: '' })}
                                            >
                                                {i18next.t('profile.cancel')}
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