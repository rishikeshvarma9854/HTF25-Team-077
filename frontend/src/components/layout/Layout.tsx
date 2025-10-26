import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function Layout() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className={`flex-1 container-responsive ${
          isChatPage 
            ? 'py-8 pb-24 md:pb-8 flex flex-col min-h-0' 
            : 'py-8 pb-24 md:pb-8'
        }`}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}