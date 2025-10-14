import { useState, useEffect, useRef } from 'preact/hooks';

/**
 * Custom hook for managing video resume/progress functionality
 * Stores all resume data in a single 'resumeData' object in localStorage
 * Format: { "identifier1": 123.45, "identifier2": 67.89 }
 */


/**
 * Retrieves all resume data from localStorage.
 * @returns {Object} Resume times keyed by identifier, e.g. { "identifier1": 123.45 }
 */
const getResumeData = () => {
  try {
    const stored = localStorage.getItem('resumeData');
    return stored ? JSON.parse(stored) : {};
  } catch (err) {
    console.warn('Error reading resumeData from localStorage:', err);
    return {};
  }
};


/**
 * Sets the resume time for a specific identifier in localStorage.
 * @param {string} identifier - Unique video identifier
 * @param {number} time - Resume time in seconds
 */
const setResumeTime = (identifier, time) => {
  try {
    const resumeData = getResumeData();
    resumeData[identifier] = time;
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  } catch (err) {
    console.warn('Error saving resumeData to localStorage:', err);
  }
};


/**
 * Gets the resume time for a specific identifier.
 * @param {string} identifier - Unique video identifier
 * @returns {number} Resume time in seconds (default: 0)
 */
const getResumeTime = (identifier) => {
  const resumeData = getResumeData();
  return resumeData[identifier] || 0;
};


/**
 * Clears the resume time for a specific identifier from localStorage.
 * @param {string} identifier - Unique video identifier
 */
const clearResumeTime = (identifier) => {
  try {
    const resumeData = getResumeData();
    delete resumeData[identifier];
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  } catch (err) {
    console.warn('Error clearing resumeData from localStorage:', err);
  }
};

/**
 * useVideoResume - Custom hook for managing video resume/progress functionality.
 * Stores all resume data in a single 'resumeData' object in localStorage.
 * Format: { "identifier1": 123.45, "identifier2": 67.89 }
 *
 * @param {Object} player - VideoJS player instance
 * @param {string} identifier - Archive.org identifier for the video
 * @param {number} [saveInterval=30000] - Interval in ms to auto-save progress
 * @param {number} [resumeThreshold=0.1] - Minimum % of video watched to show resume prompt
 * @returns {Object} Hook state and actions:
 *   @property {boolean} showResume - Whether to show the resume prompt
 *   @property {number} savedTime - Saved resume time (seconds)
 *   @property {function} handleResume - Call to handle user's resume choice
 *   @property {function} clearResumeTime - Remove resume time for this identifier
 *   @property {function} saveProgress - Manually save current progress
 *
 * @example
 * const { showResume, savedTime, handleResume } = useVideoResume(player, identifier);
 */
export const useVideoResume = (player, identifier, saveInterval = 30000, resumeThreshold = 0.1) => {
  const [showResume, setShowResume] = useState(false);
  const [savedTime, setSavedTime] = useState(0);
  const saveIntervalRef = useRef(null);

  // Function to save current progress
  const saveProgress = () => {
    if (!player) return;
    const current = player.currentTime();
    const duration = player.duration();
    if (current > 0 && current < duration) {
      setResumeTime(identifier, current);
    }
  };

  // Handle resume decision from user
  const handleResume = (resume) => {
    setShowResume(false);
    if (resume && player && savedTime > 0) {
      player.currentTime(savedTime);
    }
    // Always clear after handling (whether resuming or starting over)
    clearResumeTime(identifier);
  };


  // Check for saved time when player loads
  useEffect(() => {
    if (!player || !identifier) return;

    const loadListener = () => {
      const saved = getResumeTime(identifier);
      const duration = player.duration();
      // Show resume if saved time exists and is above threshold
      if (saved > 0 && saved < duration && (saved / duration > resumeThreshold)) {
        setSavedTime(saved);
        setShowResume(true);
      }
    };

    player.on('loadedmetadata', loadListener);

    return () => {
      player.off('loadedmetadata', loadListener);
    };
  }, [player, identifier, resumeThreshold]);

  // Setup auto-save interval and event listeners
  useEffect(() => {
    if (!player || !identifier) return;

    // Save progress periodically
    saveIntervalRef.current = window.setInterval(saveProgress, saveInterval);

    // Save on pause
    player.on('pause', saveProgress);

    // Clear resume data when video ends
    const endedListener = () => {
      clearResumeTime(identifier);
    };
    player.on('ended', endedListener);

    return () => {
      if (saveIntervalRef.current) {
        window.clearInterval(saveIntervalRef.current);
      }
      player.off('pause', saveProgress);
      player.off('ended', endedListener);
    };
  }, [player, identifier, saveInterval]);

  return {
    showResume,
    savedTime,
    handleResume,
    clearResumeTime: () => clearResumeTime(identifier),
    saveProgress
  };
};

// Export helper functions for direct use if needed
export {
  getResumeData,
  setResumeTime,
  getResumeTime,
  clearResumeTime
};
