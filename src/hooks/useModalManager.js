import { useState } from 'preact/hooks';

/**
 * useModalManager - Custom hook for managing global modals
 * 
 * @returns {Object} Modal manager state and actions
 * @property {string|null} activeModal - Type of currently active modal
 * @property {Object|null} modalData - Data for the active modal  
 * @property {Function} showModal - Show a modal with data
 * @property {Function} hideModal - Hide the current modal
 */

export function useModalManager() {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  /**
   * Show a modal with the specified type and data
   * @param {string} type - Type of modal ('description', 'report')
   * @param {Object} data - Data to pass to the modal
   */
  const showModal = (type, data) => {
    setActiveModal(type);
    setModalData(data);
  };

  /**
   * Hide the currently active modal
   */
  const hideModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return { 
    activeModal, 
    modalData, 
    showModal, 
    hideModal 
  };
}