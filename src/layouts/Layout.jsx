// src/layouts/Layout.jsx
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  // Hide footer if current route starts with /chat
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
};

export default Layout;
