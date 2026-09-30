export function isShowDisabled(show) {
	return String(show?.status ?? '').trim().toLowerCase() === 'disabled';
}
