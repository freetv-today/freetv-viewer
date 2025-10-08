import { useConfig } from '@/context/ConfigContext';
import { useQueueVideo } from '@hooks/useQueueVideo';
import { useFavoritesList } from '@hooks/useFavoritesList';
import { triggerToast } from '@/signals/toastSignal';

/**
 * ButtonShowTitleNav - Split button component for show titles with dropdown actions
 * @param {Object} props
 * @param {string} props.title - Show title
 * @param {string} props.category - Show category
 * @param {string} props.identifier - Unique show identifier
 * @param {string} props.desc - Show description
 * @param {string} props.start - Start time/date
 * @param {string} props.end - End time/date
 * @param {string} props.imdb - IMDB ID
 * @param {function(string, Object): void} [props.onShowModal] - Callback to show modal (type, data)
 * @returns {import('preact').JSX.Element}
 */

export function ButtonShowTitleNav({ title, category, identifier, desc, start, end, imdb, onShowModal }) {
  
  const { modules } = useConfig();
  const { queueVideo } = useQueueVideo();
  const { favorites, addToFavorites, removeFromFavorites } = useFavoritesList();

  const isFavorite = Array.isArray(favorites?.title) && favorites.title.includes(title);

  // Main function to queue video and save to recent
  const handleMainClick = () => {
    queueVideo({ imdb, category, identifier, title });
  };

  // Handler to show description modal
  const handleShowInfo = () => {
    if (onShowModal) {
      onShowModal('description', { title, category, identifier, desc, start, end, imdb });
    }
  };

  // Handler to show report problem modal
  const handleReportProblem = () => {
    if (onShowModal) {
      const playlist = typeof window !== 'undefined' ? 
        JSON.parse(localStorage.getItem('playlist')) : '';
      onShowModal('report', { title, category, identifier, desc, start, end, imdb, playlist });
    }
  };

  return (
    <>
      <div className="btn-group mb-1" style={{ width: '98%' }}>
        <button
          className="btn btn-sm btn-outline-dark"
          style={{ width: 'calc(100% - 3rem)' }}
          title={`Watch ${title}`}
          aria-label={`Watch: ${title}`}
          onClick={handleMainClick}
        >
          {title}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-dark dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ width: '3rem' }}
        >
          <span className="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul className="dropdown-menu p-2">
          <li>
            <a
              className="dropdown-item moreoptions"
              href="#"
              title={`About ${title}`}
              onClick={e => { e.preventDefault(); handleShowInfo(); }}
            >
              About this show
            </a>
          </li>
          {/* ---- These buttons are controlled by config setting 'modules' ----  */}
          {modules && (
            <div className="moduleBtns" style={{ display: 'block' }}>
              <li>
                {isFavorite ? (
                  <a
                    className="dropdown-item moreoptions"
                    href="#"
                    title={`Remove ${title} from favorites`}
                    onClick={e => {
                      e.preventDefault();
                      removeFromFavorites(title);
                      triggerToast('Show was removed from Favorites', 'dark');
                    }}
                  >
                    Remove from favorites
                  </a>
                ) : (
                  <a
                    className="dropdown-item moreoptions"
                    href="#"
                    title={`Add ${title} to favorites`}
                    onClick={e => {
                      e.preventDefault();
                      addToFavorites(title);
                      triggerToast('Show was added to Favorites', 'dark');
                    }}
                  >
                    Add to favorites
                  </a>
                )}
              </li>
              <li>
                <a
                  className="dropdown-item moreoptions text-danger"
                  href="#"
                  title={`Report a problem with ${title}`}
                  onClick={e => { e.preventDefault(); handleReportProblem(); }}
                >
                  Report a problem
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item moreoptions"
                  href={`https://archive.org/download/${identifier}`}
                  title={`Download files for ${title}`}
                  target="_blank"
                >
                  Download files
                  <img src="/assets/external-link.svg" width="15" className="ms-2 pb-1" title="Opens in a new tab or window" alt="External Link" />
                </a>
              </li>
            </div>
          )}
        </ul>
      </div>
    </>
  );
}