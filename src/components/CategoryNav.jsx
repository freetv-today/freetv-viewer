import { CategoryLink } from './CategoryLink';
import { useAppContext } from '../state/AppProvider';
import { useLocation } from 'preact-iso';

export function CategoryNav() {
    const { categories, isInitializing, isCatalogLoading, initializationError, catalogError } = useAppContext();
    const { path } = useLocation();
    const error = initializationError || catalogError;
    const isLoading = isInitializing || isCatalogLoading;
    const categoryMatch = path.match(new RegExp(`^${import.meta.env.BASE_URL.replace(/\/$/, '')}/category/([^/]+)/?$`, 'i'));
    let activeCategory = '';
    if (categoryMatch) {
        try {
            activeCategory = decodeURIComponent(categoryMatch[1]).toLowerCase();
        } catch {
            // Treat malformed URL encoding as no selected category.
        }
    }

    return (
        <nav className="navbar category-nav border-bottom border-body" aria-label="Categories">
            <div className="container-fluid category-nav__items">
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
                        isActive={category.toLowerCase() === activeCategory}
                    />
                ))}
            </div>
        </nav>
    );
}
