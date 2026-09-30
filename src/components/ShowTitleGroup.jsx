import { useState } from 'preact/hooks';
import { ShowTitleButton } from './ShowTitleButton';
import { isShowDisabled } from '../data/showStatus';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function ShowTitleGroup({ name, shows, onFavoritesChange, onShowInfo }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const sortedShows = shows
		.filter((show) => !isShowDisabled(show))
		.sort((a, b) => collator.compare(a.title, b.title));

	if (sortedShows.length === 0) return null;

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
						<ShowTitleButton key={show.identifier} show={show} onFavoritesChange={onFavoritesChange} onShowInfo={onShowInfo} />
					))}
				</div>
			)}
		</div>
	);
}
