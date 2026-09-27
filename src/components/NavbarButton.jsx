import { useLocation } from 'preact-iso';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';

export function NavbarButton({ url, label, title, icon, showNavLabel = false, onClick }) {

	const [hasValidIcon, setHasValidIcon] = useState(null);
	const iconRef = useRef(null);
	const displayLabel = showNavLabel || !icon;
	const { path } = useLocation();
	const isActive = path === url;

	useLayoutEffect(() => {
		if (!iconRef.current || !icon) {
			setHasValidIcon(false);
			return;
		}

		// Bootstrap Icons assigns a CSS ::before content value to each valid icon.
		const content = getComputedStyle(iconRef.current, '::before').content;
		setHasValidIcon(content !== 'none' && content !== 'normal' && content !== '""');
	}, [icon]);

	return (
		<a
			href={url}
			onClick={onClick}
			class={`btn btn-outline-secondary${isActive ? ' active' : ''} fw-bold me-2 navbar-button d-inline-flex align-items-center justify-content-center gap-1`}
			aria-label={label}
			aria-current={isActive ? 'page' : undefined}
			title={title || label}
		>
			{icon && <i ref={iconRef} class={`bi ${icon} d-none`} aria-hidden="true" />}
			{icon && <i class={`bi ${hasValidIcon === false ? 'bi-circle-fill' : icon}`} aria-hidden="true" />}
			{displayLabel && <span className="noselect navbar-button__label">{label}</span>}
		</a>
	);
}
