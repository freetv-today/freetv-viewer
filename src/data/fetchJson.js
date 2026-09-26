export async function fetchPublicJson(path) {
	const response = await fetch(`${import.meta.env.BASE_URL}${path}`);
	if (!response.ok) {
		throw new Error(`Failed to load ${path} (${response.status}).`);
	}
	return response.json();
}
