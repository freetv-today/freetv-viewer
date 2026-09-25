let catalogPromise;

const dataSource = '/freetv.json';

export function getCatalog() {
    if (!catalogPromise) {
        catalogPromise = fetch(dataSource)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load catalog');
                }
                return response.json();
            });
    }

    return catalogPromise;
}