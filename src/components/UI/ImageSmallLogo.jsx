import { Link } from '@components/Navigation/Link';

const freetvLogo = '/assets/freetv-small.png';

/**
 * ImageSmallLogo - Small Free TV logo component for navbar
 * @returns {import('preact').JSX.Element}
 */
export function ImageSmallLogo() {
  return (
    <Link href="/" title="Free TV" className="navbar-brand d-flex align-items-center">
	    <img src={freetvLogo} className="d-inline-block me-2 pb-1" height="40" title="Free TV" alt="Free TV logo" />
	    <span className="bruno-ace">Free TV</span>
	  </Link>
  );
}
