import { NavLink, useNavigate } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 py-2 text-xs ${isActive ? 'text-brand-900' : 'text-brand-500'}`;

const icons = {
  home: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  wardrobe: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  outfits: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  chat: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  profile: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

export default function BottomNav() {
  const navigate = useNavigate();
  return (
    <nav role="navigation" aria-label="Primary" className="fixed bottom-0 inset-x-0 z-50 border-t border-brand-200 bg-white/95 backdrop-blur md:hidden touch-none">
      <div className="grid grid-cols-5">
        <NavLink to="/" aria-label="Home" className={linkClass} onClick={(e) => { e.preventDefault(); console.log('BottomNav tap -> /'); navigate('/'); }}>
          {icons.home}
          <span>Home</span>
        </NavLink>
        <NavLink to="/wardrobe" aria-label="Wardrobe" className={linkClass} onClick={(e) => { e.preventDefault(); console.log('BottomNav tap -> /wardrobe'); navigate('/wardrobe'); }}>
          {icons.wardrobe}
          <span>Wardrobe</span>
        </NavLink>
        <NavLink to="/outfits" aria-label="Outfits" className={linkClass} onClick={(e) => { e.preventDefault(); console.log('BottomNav tap -> /outfits'); navigate('/outfits'); }}>
          {icons.outfits}
          <span>Outfits</span>
        </NavLink>
        <NavLink to="/chat" aria-label="Stylist chat" className={linkClass} onClick={(e) => { e.preventDefault(); console.log('BottomNav tap -> /chat'); navigate('/chat'); }}>
          {icons.chat}
          <span>Stylist</span>
        </NavLink>
        <NavLink to="/profile" aria-label="Profile" className={linkClass} onClick={(e) => { e.preventDefault(); console.log('BottomNav tap -> /profile'); navigate('/profile'); }}>
          {icons.profile}
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}