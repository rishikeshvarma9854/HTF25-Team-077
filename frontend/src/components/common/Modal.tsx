import React from 'react';

type Props = {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/30" onClick={onClose} />
			<div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
				{title && <h3 className="mb-3 text-lg font-semibold">{title}</h3>}
				{children}
			</div>
		</div>
	);
}
