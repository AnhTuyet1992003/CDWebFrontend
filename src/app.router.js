// // App.tsx hoặc AppRouter.tsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/user/home';
// import Login from './pages/auth/login';
// import AuthCallback from './pages/auth/google/callback';
// import Register from './pages/auth/register';
// import OAuth2RedirectHandler from "./pages/auth/google/OAuth2RedirectHandler"
//
// import ProductDetail from './pages/user/product-detail';
// //import UserProfile from './components/UserProfile';
// //import RequireAuth from './guards/RequireAuth'; // Giống AuthGuardFn trong Angular
//
// export default function AppRouter() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<Home />} />
//     <Route path="/login" element={<Login />} />
//     <Route path="/auth/google/callback" element={<AuthCallback />} />
//     <Route path="/auth/facebook/callback" element={<AuthCallback />} />
//     <Route path="/register" element={<Register />} />
//                 <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />
//
//                 /* <Route path="/products/:id" element={<ProductDetail />} />
// {/*    <Route path="/user-profile" element={*/}
// {/*        <RequireAuth>*/}
// {/*        <UserProfile />*/}
// {/*        </RequireAuth>*/}
// {/*}*/}
// {/*    />*/}
//     </Routes>
//     </Router>
// );
// }