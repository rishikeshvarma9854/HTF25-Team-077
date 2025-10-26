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
import { ProfileProvider, useProfile } from '@/context/ProfileContext';

// 🧠 Protected route wrapper
function ProtectedRoute({ children }: { children: JSX.Element }) {
	const { authUser, isAuthLoading } = useProfile();

	// Avoid flicker during initial auth check
	if (isAuthLoading) return <>{children}</>;

	const isAuthed = !!authUser;

	// Redirect unauthenticated users to Home
	return isAuthed ? children : <Navigate to="/" replace />;
}

export default function App() {
	return (
		<WardrobeProvider>
			<OutfitProvider>
				<ProfileProvider>
					<ChatProvider>
						<Routes>
							{/* Layout wraps all main pages */}
							<Route element={<Layout />}>
								{/* Public route */}
								<Route index element={<Home />} />

								{/* Protected routes */}
								<Route
									path="wardrobe"
									element={
										<ProtectedRoute>
											<Wardrobe />
										</ProtectedRoute>
									}
								/>
								<Route
									path="outfits"
									element={
										<ProtectedRoute>
											<Outfits />
										</ProtectedRoute>
									}
								/>
								<Route
									path="chat"
									element={
										<ProtectedRoute>
											<Chat />
										</ProtectedRoute>
									}
								/>

								{/* Profile page is public (handles sign-in, etc.) */}
								<Route path="profile" element={<Profile />} />

								{/* Fallback for invalid routes */}
								<Route path="*" element={<NotFound />} />
							</Route>
						</Routes>
					</ChatProvider>
				</ProfileProvider>
			</OutfitProvider>
		</WardrobeProvider>
	);
}
