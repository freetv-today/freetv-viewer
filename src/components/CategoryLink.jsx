import { capitalizeFirstLetter } from "./CategoryLabel";

export function CategoryLink({ category }) {
  return (
    <a href={`/category/${category}`} class="btn btn-outline-secondary me-1">
      {capitalizeFirstLetter(category)}
    </a>
  );
}


