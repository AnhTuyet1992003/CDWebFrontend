// src/pages/OAuth2RedirectHandler.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuth2Redirect = async () => {
            // Lấy token từ URL (nếu backend redirect về với token trong query)
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (token) {
                // Lưu token vào cookie hoặc localStorage
                Cookies.set('token', token, { expires: 7 });
                localStorage.setItem('accessToken', token);

                // 👉 Decode token để lấy username
                const decoded = jwtDecode(token);
                const fullEmail = decoded.sub;
                const username = fullEmail.split('@')[0]; // Lấy phần trước @

                localStorage.setItem('username', username);
                window.dispatchEvent(new Event("storage")); // Gửi sự kiện để header cập nhật

                alert("Đăng nhập Google thành công!");
                navigate('/home');
                return;
            }
            // else {
            //     // Nếu backend không trả token trực tiếp, có thể phải gọi /me để kiểm tra
            //     try {
            //         const res = await axios.get("http://localhost:8080/api/v1/users/", {
            //             withCredentials: true,
            //         });
            //         if (res.status === 200) {
            //             navigate("/home");
            //         }
            //     } catch (err) {
            //         console.error("Không xác thực được người dùng:", err);
            //         alert("Đăng nhập Google thất bại. Vui lòng thử lại.");
            //         navigate("/login");
            //     }
            // }
        };
        handleOAuth2Redirect();
    }, [navigate]);

    return <p>Đang xác thực, vui lòng chờ...</p>;
};

export default OAuth2RedirectHandler;
