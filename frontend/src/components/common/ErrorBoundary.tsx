import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: unknown, errorInfo: unknown) {
		// you can report to an error service here
		console.error('ErrorBoundary caught an error', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="container-responsive py-20 text-center">
					<h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
					<p className="text-gray-600">Please reload the page.</p>
				</div>
			);
		}
		return this.props.children;
	}
}
