import { useEffect } from 'react';

export default function NotFound() {
	useEffect(() => {
		const t = setTimeout(() => {
			window.location.replace('/');
		}, 1500);
		return () => clearTimeout(t);
	}, []);

	return (
		<div className="py-20 text-center">
			<h1 className="text-2xl font-semibold">404 - Page not found</h1>
			<p className="text-gray-600">Redirecting to home...</p>
		</div>
	);
}
