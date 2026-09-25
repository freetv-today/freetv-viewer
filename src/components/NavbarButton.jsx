import { useLayoutEffect, useRef, useState } from 'preact/hooks';

export function NavbarButton({ url, label, title, icon, showNavLabel = false }) {
	const [hasValidIcon, setHasValidIcon] = useState(null);
	const iconRef = useRef(null);
	const displayLabel = showNavLabel || !icon;

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
			class="btn btn-outline-secondary fw-bold me-2 navbar-button d-inline-flex align-items-center justify-content-center gap-1"
			aria-label={label}
			title={title || label}
		>
			{icon && <i ref={iconRef} class={`bi ${icon} d-none`} aria-hidden="true" />}
			{icon && <i class={`bi ${hasValidIcon === false ? 'bi-circle-fill' : icon}`} aria-hidden="true" />}
			{displayLabel && <span>{label}</span>}
		</a>
	);
}
