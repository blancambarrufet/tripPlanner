/**
 * TripPlanner+ Shared Configuration & Helpers
 * 
 * Note: CONFIG is loaded from scripts/config.js
 * Make sure config.js exists (copy from config.example.js and add your API keys)
 */
// LocalStorage Keys
const STORAGE_KEYS = {
    TRIPS: 'tripplanner_trips',
    SELECTED_TRIP: 'tripplanner_selectedTripId'
};

/**
 * Load all trips from localStorage
 * @returns {Array} Array of trip objects
 */
function loadTrips() {
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return data ? JSON.parse(data) : [];
}

/**
 * Save trips array to localStorage
 * @param {Array} trips - Array of trip objects
 */
function saveTrips(trips) {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
}

/**
 * formatted dates for display
 * @param {string} dateString - YYYY-MM-DD
 * @returns {string} Formatted date (e.g. "Jun 1, 2025")
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Highlight active nav link based on current URL
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
});
