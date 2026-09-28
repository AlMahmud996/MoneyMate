import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-6 bg-base-200">
          {!isDashboard && <Navbar />}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}