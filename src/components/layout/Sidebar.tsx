import { NavLink } from 'react-router-dom';

const linkBase = 'block rounded-lg px-4 py-3 text-sm font-medium transition-colors';
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `${linkBase} ${isActive ? 'text-white bg-brand-900' : 'text-brand-700 hover:bg-brand-100'}`;

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 min-h-screen border-r border-brand-200 bg-white">
      <div className="p-6">
        <nav className="space-y-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/wardrobe" className={linkClass}>Wardrobe</NavLink>
          <NavLink to="/outfits" className={linkClass}>Outfits</NavLink>
          <NavLink to="/chat" className={linkClass}>AI Stylist</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
        </nav>
      </div>
    </aside>
  );
}