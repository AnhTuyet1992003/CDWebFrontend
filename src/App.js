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
import LayoutUser from './component/layout/UserLayout.js';
import LayoutAdmin from './component/layout/AdminLayout';
import Register from './pages/auth/register';
import AdminIndex from './pages/admin/admin-index';
import AdminListUser from './pages/admin/list-user';
import UserList from './pages/admin/test';

import AuthCallback from './pages/auth/google/callback';
import OAuth2RedirectHandler from "./pages/auth/google/OAuth2RedirectHandler"
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


            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route path="/auth/google/callback" element={<AuthCallback />} />
            <Route path="/auth/facebook/callback" element={<AuthCallback />} />
            <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />

            <Route path="/admin-index" element={<LayoutAdmin><AdminIndex /></LayoutAdmin>} />
            <Route path="/admin-list-user" element={<LayoutAdmin><UserList /></LayoutAdmin>} />
          {/*/!* Admin Routes *!/*/}
          {/*<Route path="/admin" element={<AdminHome />} />*/}
          {/*<Route path="/admin/dashboard" element={<AdminDashboard />} />*/}
        </Routes>
      </Router>
  );
}

export default App;
