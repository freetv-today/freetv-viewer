export async function fetchPublicJson(path) {
	const url = path.startsWith('/') ? path : `${import.meta.env.BASE_URL}${path}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load ${path} (${response.status}).`);
	}
	return response.json();
}
