import { DescriptionModal } from '@components/Modals/DescriptionModal';
import { ReportProblemModal } from '@components/Modals/ReportProblemModal';

/**
 * GlobalModalManager - Centralized modal management component
 * 
 * @param {Object} props
 * @param {string|null} props.activeModal - Type of currently active modal
 * @param {Object|null} props.modalData - Data for the active modal
 * @param {Function} props.onClose - Function to call when modal is closed
 * @returns {import('preact').JSX.Element|null}
 */

export function GlobalModalManager({ activeModal, modalData, onClose }) {
  if (!activeModal || !modalData) {
    return null;
  }

  switch (activeModal) {
    case 'description':
      return (
        <DescriptionModal 
          show={true} 
          onClose={onClose} 
          {...modalData} 
        />
      );
    
    case 'report':
      return (
        <ReportProblemModal 
          show={true} 
          onClose={onClose} 
          {...modalData} 
        />
      );
    
    default:
      return null;
  }
}