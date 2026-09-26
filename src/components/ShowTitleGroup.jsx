import { useState } from 'preact/hooks';
import { ShowTitleButton } from './ShowTitleButton';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function ShowTitleGroup({ name, shows, onFavoritesChange }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const sortedShows = [...shows].sort((a, b) => collator.compare(a.title, b.title));

	return (
		<div className={`show-title-group${isExpanded ? ' is-expanded' : ''}`}>
			<button
				type="button"
				className="btn btn-sm btn-outline-dark show-title-group__toggle"
				aria-expanded={isExpanded}
				onClick={() => setIsExpanded((expanded) => !expanded)}
			>
				<span>{name}</span>
				<span className="show-title-group__chevron" aria-hidden="true" />
			</button>
			{isExpanded && (
				<div className="show-title-group__items" role="group" aria-label={`${name} seasons`}>
					{sortedShows.map((show) => (
						<ShowTitleButton key={show.identifier} show={show} onFavoritesChange={onFavoritesChange} />
					))}
				</div>
			)}
		</div>
	);
}
