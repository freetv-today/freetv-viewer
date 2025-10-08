import freetvLogo from '/assets/freetv.png';
import { useCategories } from '@/hooks/useCategories';
import { getRandomCategory } from '@/utils';

export function ImageLargeLogo() {
  
  // get the list of categories and select a random one
  const categories = useCategories();
  const randomCategory = getRandomCategory(categories);
  
  return (
    <div className="text-center mt-4">
		<h1 className="display-4 bruno-ace noselect">Free TV</h1>
		<p className="pb-4">
			<a
              href={randomCategory ? `/category/${randomCategory}` : '#'}
              className="small fw-bold link-dark link-offset-3 link-underline link-underline-opacity-50"
              title="Click to visit a random category"
              onClick={e => {
                if (!randomCategory) e.preventDefault();
              }}
            >
				<img src={freetvLogo} width="175" alt="Free TV logo" />
			</a>
		</p>
	</div>
  );
}