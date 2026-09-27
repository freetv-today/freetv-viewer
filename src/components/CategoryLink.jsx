import { capitalizeFirstLetter } from "./CategoryLabel";
import { appPath } from '../data/paths';

export function CategoryLink({ category, isActive = false }) {
  return (
    <a
      href={appPath(`/category/${encodeURIComponent(category)}`)}
      class={`btn btn-outline-secondary me-1${isActive ? ' active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {capitalizeFirstLetter(category)}
    </a>
  );
}
