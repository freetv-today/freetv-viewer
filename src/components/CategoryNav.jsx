import { CategoryLink } from './CategoryLink';
import { useAppContext } from '../state/AppProvider';

export function CategoryNav() {
    const { categories, isInitializing, isCatalogLoading, initializationError, catalogError } = useAppContext();
    const error = initializationError || catalogError;
    const isLoading = isInitializing || isCatalogLoading;

    return (
        <nav className="navbar border-bottom border-body" aria-label="Categories">
            <div className="container-fluid justify-content-center flex-wrap gap-1">
                {error && (
                    <span className="text-danger" role="alert">
                        {error}
                    </span>
                )}

                {isLoading && !error && (
                    <span role="status" className="visually-hidden">
                        Loading categories…
                    </span>
                )}

                {!error && categories.map((category) => (
                    <CategoryLink
                        key={category}
                        category={category}
                    />
                ))}
            </div>
        </nav>
    );
}
