import { useAppContext } from '../state/AppProvider';

export function Shows() {
    const { site, currentPlaylist, catalog, isInitializing, isCatalogLoading, initializationError, catalogError } = useAppContext();
    const error = initializationError || catalogError;
    const isLoading = isInitializing || isCatalogLoading;
    const shows = catalog?.shows;

    return (
        <section className="container-fluid p-4">
            <h2 className="mb-4 text-secondary">{currentPlaylist?.dbtitle || `${site?.appName || 'FreeTV'} Shows`}</h2>

            {error && (
                <p className="alert alert-danger" role="alert">
                    {error}
                </p>
            )}

            {isLoading && !error && (
                <p role="status">Loading shows…</p>
            )}

            {!isLoading && !error && shows && (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle text-start">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Category</th>
                                <th scope="col">Years</th>
                                <th scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shows.map((show) => (
                                <tr key={show.identifier}>
                                    <th scope="row">{show.title}</th>
                                    <td className="text-capitalize">{show.category}</td>
                                    <td>
                                        {show.start}
                                        {show.end && show.end !== show.start
                                            ? `–${show.end}`
                                            : ''}
                                    </td>
                                    <td>{show.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
