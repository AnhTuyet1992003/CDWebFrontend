import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserHome from './pages/user/index';
import Cart from './pages/user/cart';
import Checkout from './pages/user/checkout';
import Home from './pages/user/home';
import Blog from './pages/user/blog';
import Login from './pages/auth/login';
import BlogDetail from './pages/user/blog-detail';
import Contact from './pages/user/contact';
import ProductDetail from './pages/user/product-detail';
import LayoutUser from './component/layout/UserLayout';
import LayoutAdmin from './component/layout/AdminLayout';
import Register from './pages/auth/register';
import AddProduct from './pages/admin/add-product';
import UserList from './pages/admin/list-user';
import ProductList from './pages/admin/list-product';
import Admin from './pages/admin/index';
import Chatbox from "./pages/user/Chatbox";

import AdminIndex from './pages/admin/index';
import AdminListUser from './pages/admin/list-user';
import UserProfileEdit from "./pages/user/user-profile-edit";
import UserPasswordEdit from "./pages/user/user-password-edit";

import Header from './component/user/header';

import AuthCallback from './pages/auth/google/callback';
import OAuth2RedirectHandler from "./pages/auth/google/OAuth2RedirectHandler"
import AddToCart from "./pages/user/OrderDetail"
import OrderDetail from "./pages/user/OrderDetail"
import { ToastContainer } from 'react-toastify';
import VNPayReturn from './pages/user/vnpay-return';
import OrderUser from './pages/user/order-user'


import Btntest from "./pages/admin/testButoon";

import ForgotPassword from "./pages/user/forgot-password";
import ValidateOtp from "./pages/user/validate-otp";
import NewPassword from "./pages/user/new-password"
import ImportOrder from "./pages/admin/import-order";
import ListImportOrder from "./pages/admin/list-import-order";
import EditImportOrder from "./pages/admin/edit-import-order";
import ListProductNeedImport from "./pages/admin/list-product-need-import";
import Coupon from './pages/user/coupon'
import ChooseCoupon from './pages/user/choose-coupon'
function App() {
  return (
      <Router>
        <Routes>
          {/* Điều hướng mặc định */}
            <Route path="/" element={<Navigate to="/home" />} />

          {/* User Routes */}
            <Route path="/home" element={<LayoutUser><UserHome /></LayoutUser>} />
            <Route path="/cart" element={<LayoutUser><Cart /></LayoutUser>} />
            <Route path="/checkout" element={<LayoutUser><Checkout /></LayoutUser>} />
            <Route path="/shop" element={<LayoutUser><Home /></LayoutUser>} />
            <Route path="/product-detail" element={<LayoutUser><ProductDetail /></LayoutUser>} />
            <Route path="/blog" element={<LayoutUser><Blog /></LayoutUser>} />
            <Route path="/blog-detail" element={<LayoutUser><BlogDetail /></LayoutUser>} />
            <Route path="/contact" element={<LayoutUser><Contact /></LayoutUser>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/validate-otp" element={<ValidateOtp />} />
            <Route path="/new-password" element={<NewPassword />} />

            <Route path="/order/confirmation" element={<LayoutUser><OrderDetail /></LayoutUser>} />
            <Route path="/order" element={<LayoutUser><OrderUser /></LayoutUser>} />

            <Route path="/coupon" element={<LayoutUser><Coupon /></LayoutUser>} />
            <Route path="/choose-coupon" element={<LayoutUser><ChooseCoupon /></LayoutUser>} />

            <Route path="/product/product-detail" element={<LayoutUser><ProductDetail /></LayoutUser>} />

            <Route path="/chatbox" element={<Chatbox />} />

            <Route path="/header" element={<Header/>}/>

            <Route path="/btntest" element={<Btntest />}/>

            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route path="/auth/google/callback" element={<AuthCallback />} />
            <Route path="/auth/facebook/callback" element={<AuthCallback />} />
            <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />
            <Route path="/vnpay-return" element={<VNPayReturn />} />


            <Route path="/admin" element={<LayoutAdmin><Admin /></LayoutAdmin>} />
            <Route path="/admin-list-user" element={<LayoutAdmin><UserList /></LayoutAdmin>} />
            <Route path="/admin-list-product" element={<LayoutAdmin><ProductList /></LayoutAdmin>} />
            <Route path="/admin-add-product" element={<LayoutAdmin><AddProduct /></LayoutAdmin>} />
            <Route path="/user-password-edit" element={<LayoutUser><UserPasswordEdit/></LayoutUser>}/>
            <Route path="/user-profile-edit" element={<LayoutUser><UserProfileEdit/></LayoutUser>}/>
            <Route path="/admin-index" element={<LayoutAdmin><AdminIndex /></LayoutAdmin>} />
            <Route path="/admin-index" element={<LayoutAdmin><AdminIndex /></LayoutAdmin>} />
            <Route path="/import-order" element={<LayoutAdmin><ImportOrder /></LayoutAdmin>} />
            <Route path="/list-import-order" element={<LayoutAdmin><ListImportOrder /></LayoutAdmin>} />
            <Route path="/edit-import-order/:id" element={<LayoutAdmin><EditImportOrder /></LayoutAdmin>} />
            <Route path="/list-product-need-import" element={<LayoutAdmin><ListProductNeedImport /></LayoutAdmin>} />

            {/*<Route path="/admin-list-user" element={<AdminListUser/>} />*/}
          {/*/!* Admin Routes *!/*/}
          {/*<Route path="/admin" element={<AdminHome />} />*/}
          {/*<Route path="/admin/dashboard" element={<AdminDashboard />} />*/}
        </Routes>

          <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="light"
          />
          <Chatbox />
      </Router>
  );
}

export default App;
