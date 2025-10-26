import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Wardrobe from '@/pages/Wardrobe';
import Outfits from '@/pages/Outfits';
import Chat from '@/pages/Chat';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import { WardrobeProvider } from '@/context/WardrobeContext';
import { OutfitProvider } from '@/context/OutfitContext';
import { ChatProvider } from '@/context/ChatContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { useProfile } from '@/context/ProfileContext';

function ProtectedRoute({ children }: { children: JSX.Element }) {
	// Use profile context to check auth state
	const { authUser, isAuthLoading } = useProfile();

	// While auth is initializing, render children (avoid flicker)
	if (isAuthLoading) return <>{children}</>;

	const isAuthed = !!authUser;
	// Redirect unauthenticated users to Home (avoid redirect loops when protecting /profile)
	return isAuthed ? children : <Navigate to="/" replace />;
}

export default function App() {
	return (
		<WardrobeProvider>
			<OutfitProvider>
				<ProfileProvider>
					<ChatProvider>
						<Routes>
							<Route element={<Layout />}> 
								<Route index element={<Home />} />
								<Route path="wardrobe" element={<ProtectedRoute><Wardrobe /></ProtectedRoute>} />
								<Route path="outfits" element={<ProtectedRoute><Outfits /></ProtectedRoute>} />
								<Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
								{/* Profile page is public (shows sign-in CTA). Protected routes should redirect to Home when unauthenticated. */}
								<Route path="profile" element={<Profile />} />
								<Route path="*" element={<NotFound />} />
							</Route>
						</Routes>
					</ChatProvider>
				</ProfileProvider>
			</OutfitProvider>
		</WardrobeProvider>
	);
}
