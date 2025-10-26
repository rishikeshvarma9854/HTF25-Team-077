import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import ErrorBoundary from './components/common/ErrorBoundary';

// During local development we may have a previously-registered service worker
// (from a production build) which can intercept navigation requests on real
// mobile devices and serve stale routes. Unregister any existing service
// workers and clear runtime caches when running in dev mode so the SPA
// navigation behaves consistently.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
	try {
		const shouldUnregister = import.meta.env.DEV || process.env.NODE_ENV !== 'production';
		if (shouldUnregister) {
			navigator.serviceWorker.getRegistrations().then((regs) => {
				regs.forEach((r) => {
					try {
						r.unregister();
						// best-effort: also try to remove any runtime caches
						if (typeof caches !== 'undefined') {
							caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
						}
					} catch (e) {
						// ignore
					}
				});
			}).catch(() => {});
		}
	} catch (e) {
		// ignore service worker errors in older browsers
	}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ErrorBoundary>
	</React.StrictMode>
);
