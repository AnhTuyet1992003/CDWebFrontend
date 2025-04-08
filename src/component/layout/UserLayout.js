import React, { useEffect } from 'react';
import Header from '../user/header';
import Footer from '../user/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'jquery-ui-dist/jquery-ui.min.css';
import 'owl.carousel/dist/assets/owl.carousel.min.css';
import 'slicknav/dist/slicknav.min.css';
// import '../../assets/user/css/magnific-popup.css';
import '../../assets/user/css/elegant-icons.css';
// import '../../assets/user/css/style.css'
// import('../../assets/user/css/bootstrap.min.css');
const UserLayout = ({ children }) => {
    useEffect(() => {
        import('../../assets/user/css/style.css');
        import('../../assets/user/css/magnific-popup.css');
        return () => {
            document.querySelectorAll('link[href*="user"]').forEach(el => el.remove());
        };
    }, []);
    return (
        <body>
        <Header/>
        <div className="user-content">{children}</div>
        <Footer/>
        </body>
    );
};

export default UserLayout;
