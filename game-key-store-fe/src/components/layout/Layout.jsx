import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import CartFlyout from '../cart/CartFlyout'; // DÒNG BỊ THIẾU LÀ ĐÂY

const Layout = () => {
  return (
    <div className="bg-gray-900 text-gray-200 font-sans">
      {/* Component để hiển thị thông báo toast */}
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Component giỏ hàng đã được import và sử dụng */}
      <CartFlyout />
      
      <Header />
      <main className="min-h-screen pt-20"> {/* pt-20 để nội dung không bị header che mất */}
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;