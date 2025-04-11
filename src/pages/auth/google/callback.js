import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AuthCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const code = query.get('code');
        const provider = location.pathname.includes('google') ? 'google' : 'facebook';

        if (code) {
            fetch(`http://localhost:8080/auth/${provider}/callback?code=${code}`, {
                method: 'GET',
                credentials: 'include', // Để backend có thể gửi cookie nếu dùng HttpOnly
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error('Login failed');
                    const data = await res.json();

                    // ✅ Nếu backend trả về token → lưu vào cookie
                    if (data.token) {
                        Cookies.set('token', data.token, { expires: 1 }); // 1 ngày
                    }
                    // ✅ Điều hướng về trang chủ
                    navigate('/home');
                })
                .catch((err) => {
                    console.error('OAuth2 callback error:', err);
                    navigate('/login');
                });
        } else {
            console.error('Missing code in OAuth2 callback');
            navigate('/login');
        }

    }, [location, navigate]);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Đang xử lý đăng nhập...</h2>
        </div>
    );
}
