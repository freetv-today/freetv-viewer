// ------------------------------
// Javascript Utilities
// ------------------------------

/**
 * Uppercase first letter of a string
 * @param {string} string - String to modify
 * @returns {string} String with first letter capitalized
 * @example capitalizeFirstLetter('foobar') // returns 'Foobar'
 */
export function capitalizeFirstLetter(string) {
  if (!string || typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Determines whether date in local storage matches config date
 * Used by AppLoader.jsx to check if data needs updating
 * @param {Object} storedData - Data from localStorage with lastupdated field
 * @param {Object} newData - New data with lastupdated field
 * @returns {boolean} True if data should be updated
 */
export function shouldUpdateData(storedData, newData) {
  const storedDate = storedData?.lastupdated ? new Date(storedData.lastupdated) : null;
  const newDate = newData?.lastupdated ? new Date(newData.lastupdated) : null;
  return !storedData || !storedDate || (newDate && newDate > storedDate);
}

/**
 * Shows SpinnerLoadingAppData for minimum duration
 * Used by AppLoader.jsx to ensure user sees spinner for adequate time
 * @param {number} startTime - Timestamp when loading started
 * @param {number} [minTime=1200] - Minimum time in milliseconds
 * @returns {Promise<void>} Promise that resolves after minimum time
 */
export async function enforceMinLoadingTime(startTime, minTime = 1200) {
  const elapsedTime = Date.now() - startTime;
  const remainingTime = minTime - elapsedTime;
  if (remainingTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, remainingTime));
  }
}

/**
 * Show alert and focus text input field
 * Used by SearchQueryComponent.jsx for user feedback
 * @param {string} message - Alert message to display
 * @param {string} [inputId] - ID of form text input to focus after alert
 */
export function showAlert(message, inputId) {
  alert(message);
  if (inputId) {
    setTimeout(() => {
      const el = document.getElementById(inputId);
      if (el) el.focus();
    }, 0);
  }
}

/**
 * Remove extra parameters from the URL
 * Used on Help page to clean URL from /help#version to /help
 * @example resetUrl() // changes URL from /help#version to /help
 */
export function resetUrl() {
  const baseUrl = window.location.origin + window.location.pathname;
  history.replaceState({}, document.title, baseUrl);
}

/**
 * Format JSON timestamp to user-friendly date/time
 * @param {string|number|Date} date - Date to format
 * @param {Object} [options={}] - Intl.DateTimeFormat options to override defaults
 * @returns {string} Formatted date like '8/31/25, 09:03 AM' or '-' if invalid
 * @example formatDateTime('2025-08-31T13:03:05.608Z') // returns '8/31/25, 09:03 AM'
 */
export function formatDateTime(date, options = {}) {
  if (!date) return '-';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '00/00/00, 00:00';
  // Default options can be overridden
  const defaultOptions = { year: '2-digit', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return d.toLocaleString(undefined, { ...defaultOptions, ...options });
}

/**
 * Returns a random category from an array
 * @param {Array<string>} categories - Array of category strings
 * @returns {string|null} Random category or null if array is empty
 */
export function getRandomCategory(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return null;
  const idx = Math.floor(Math.random() * categories.length);
  return categories[idx];
}

/**
 * Handle keypress events for global shortcuts
 * @param {KeyboardEvent} event - The keyboard event
 */
export function handleKeyPress(event) {
  // Ignore if focus is in an input, textarea, or contenteditable element
  const tag = document.activeElement && document.activeElement.tagName;
  const isInput = tag === 'INPUT' || tag === 'TEXTAREA' ||
    (typeof HTMLElement !== 'undefined' && document.activeElement && document.activeElement instanceof HTMLElement && document.activeElement.isContentEditable);
  if (isInput) return;
  // Otherwise, check to see if SHIFT + A is pressed
  if (event.shiftKey && event.key === 'A') {
    event.preventDefault();
    // And direct user to Admin Dashboard
    window.location.href = '/admin';
  }
}

/**
 * Get app info from local storage
 * @returns {Object} App info object with defaults if not found
 */
export function getAppInfo() {
  try {
    const data = localStorage.getItem('appInfo');
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Error parsing appInfo from localStorage:', err);
  }
  // Return defaults if not found or parsing fails
  return {
    name: 'Unknown',
    version: 'Unknown'
  };
}
