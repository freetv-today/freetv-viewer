import { ShowTitleButton } from './ShowTitleButton';
import { ShowTitleGroup } from './ShowTitleGroup';
import { isShowDisabled } from '../data/showStatus';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function sortKey(title = '') {
	return title.replace(/^The\s+/i, '');
}

export function ShowTitleList({ shows, onFavoritesChange, onShowInfo, preserveOrder = false, groupShows = true }) {
	const grouped = new Map();
	const items = [];
	const visibleShows = shows.filter((show) => !isShowDisabled(show));

	for (const show of visibleShows) {
		const groupName = typeof show.group === 'string' ? show.group.trim() : '';
		if (!groupShows || !groupName) {
			items.push({ type: 'show', show, sortName: sortKey(show.title) });
			continue;
		}

		const group = grouped.get(groupName) || [];
		group.push(show);
		grouped.set(groupName, group);
	}

	for (const [name, groupShows] of grouped) {
		if (groupShows.length > 1) {
			items.push({ type: 'group', name, shows: groupShows, sortName: sortKey(name) });
		} else {
			const [show] = groupShows;
			items.push({ type: 'show', show, sortName: sortKey(show.title) });
		}
	}

	if (!preserveOrder) items.sort((a, b) => collator.compare(a.sortName, b.sortName));

	return (
		<div className="show-title-list">
			{items.map((item) => item.type === 'group' ? (
				<ShowTitleGroup key={`group-${item.name}`} name={item.name} shows={item.shows} onFavoritesChange={onFavoritesChange} onShowInfo={onShowInfo} />
			) : (
				<ShowTitleButton key={item.show.identifier} show={item.show} onFavoritesChange={onFavoritesChange} onShowInfo={onShowInfo} />
			))}
		</div>
	);
}
