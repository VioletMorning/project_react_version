  /* delete */


  /* delete */


import { useEffect } from 'react';
import {
  BrowserRouter, Routes, Route, Link, Outlet, Navigate, useLocation
} from 'react-router-dom';
import { ShopProvider, useShop } from './shopcontext.jsx';
import RequireLogin from './components/requirelogin.jsx';
import Home from './pages/home.jsx';
import Cart from './pages/cart.jsx';
import Checkout from './pages/checkout.jsx';
import Payment from './pages/payment.jsx';
import Receipt from './pages/receipt.jsx';
import Orders from './pages/orders.jsx';
import OrderDetail from './pages/orderdetail.jsx';
import ReturnRequest from './pages/return_request.jsx';
import Login from './pages/login.jsx';


  /* delete */
   function Layout() {
     const { cartCount, profile, logout } = useShop();
     const { pathname } = useLocation();
     const navigate = useNavigate();

     useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

     return (
       <>
         <header>
           <h1><Link to="/">Grocery Store</Link></h1>
           <nav>
             <Link to="/">Shop</Link>
             <Link to="/cart">
               Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}
             </Link>
             <Link to="/orders">Order History</Link>
             {profile ? (
               <a href="#" onClick={e => { e.preventDefault(); logout().then(() => navigate('/')); }}>
                 Log out ({profile.firstName})
               </a>
             ) : (
               <Link to="/login">Log in</Link>
             )}
           </nav>
         </header>
         <Outlet />
       </>
     );
   }
  /* delete */



  /*function Layout() {
  const { cartCount } = useShop();
  const { pathname } = useLocation();*/

    //delete
     <Route path="login" element={<Login />} />

     //delete
/*useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <header>
        <h1><Link to="/">Grocery Store</Link></h1>
        <nav>
          <Link to="/">Shop</Link>
          <Link to="/cart">
            Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          <Link to="/orders">Order History</Link>
        </nav>
      </header>
      <Outlet />
    </>
    );
  } */

export default function App() {
  return (
    <BrowserRouter basename="/shop">
      <ShopProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<RequireLogin><Checkout /></RequireLogin>} />
            <Route path="payment" element={<RequireLogin><Payment /></RequireLogin>} />
            <Route path="receipt/:orderId" element={<RequireLogin><Receipt /></RequireLogin>} />
            <Route path="orders" element={<RequireLogin><Orders /></RequireLogin>} />
            <Route path="orders/:orderId" element={<RequireLogin><OrderDetail /></RequireLogin>} />
            <Route path="orders/:orderId/return/:itemId" element={<RequireLogin><ReturnRequest /></RequireLogin>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}