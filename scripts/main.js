/**
 * TripPlanner+ Shared Configuration & Helpers
 */

// Configuration object - will be populated from environment variables
const CONFIG = {
    OPENWEATHER_API_KEY: '',
    GEMINI_API_KEY: '',
    EMAILJS_SERVICE_ID: '',
    EMAILJS_TEMPLATE_TEAM_ID: '',
    EMAILJS_TEMPLATE_CLIENT_ID: '',
    EMAILJS_PUBLIC_KEY: '',
    EMAILJS_API_URL: 'https://api.emailjs.com/api/v1.0/email/send'
};

// Load environment variables
async function initializeConfig() {
    if (typeof loadEnv === 'function') {
        const env = await loadEnv();

        // Populate CONFIG from environment variables
        CONFIG.OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY || '';
        CONFIG.GEMINI_API_KEY = env.GEMINI_API_KEY || '';
        CONFIG.EMAILJS_SERVICE_ID = env.EMAILJS_SERVICE_ID || '';
        CONFIG.EMAILJS_TEMPLATE_TEAM_ID = env.EMAILJS_TEMPLATE_TEAM_ID || '';
        CONFIG.EMAILJS_TEMPLATE_CLIENT_ID = env.EMAILJS_TEMPLATE_CLIENT_ID || '';
        CONFIG.EMAILJS_PUBLIC_KEY = env.EMAILJS_PUBLIC_KEY || '';
        CONFIG.EMAILJS_API_URL = env.EMAILJS_API_URL || 'https://api.emailjs.com/api/v1.0/email/send';

        console.log('Configuration loaded from environment variables');
    } else {
        console.warn('env-loader.js not loaded. Make sure to include it before main.js');
    }
}

// Initialize configuration when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConfig);
} else {
    initializeConfig();
}


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
