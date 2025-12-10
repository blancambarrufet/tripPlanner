const STORAGE_KEYS = {
    TRIPS: 'tripplanner_trips',
    SELECTED_TRIP: 'tripplanner_selectedTripId'
};

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const detailName = document.getElementById('detail-name');
    const detailRoute = document.getElementById('detail-route');
    const detailDates = document.getElementById('detail-dates');
    const activitiesListEl = document.getElementById('activities-list');
    const activityForm = document.getElementById('activity-form');

    // --- Initialization ---
    // Get Trip ID from URL query param OR localStorage fallback
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id') || localStorage.getItem(STORAGE_KEYS.SELECTED_TRIP);

    if (!tripId) {
        alert('No trip specified. Redirecting to trips list.');
        window.location.href = 'trips.html';
        return;
    }

    loadTripDetails(tripId);

    // --- Event Listeners ---
    activityForm.addEventListener('submit', (e) => handleAddActivity(e, tripId));

    // --- Functions ---
    function loadTripDetails(id) {
        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const trip = trips.find(t => t.id === id);

        if (!trip) {
            alert('Trip not found.');
            window.location.href = 'trips.html';
            return;
        }

        // Render Header
        detailName.textContent = trip.name;
        detailRoute.textContent = `${trip.origin} ➝ ${trip.destination}`;
        detailDates.textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;

        // Render Activities
        renderActivities(trip);
    }

    function renderActivities(trip) {
        activitiesListEl.innerHTML = '';

        if (!trip.activities || trip.activities.length === 0) {
            activitiesListEl.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 3rem; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
                    <p>No activities planned yet.</p>
                    <p style="font-size: 0.9rem;">Use the form on the right to add your first activity!</p>
                </div>
            `;
            return;
        }

        // Sort by Day/Time roughly (simple string sort for now)
        trip.activities.sort((a, b) => (a.day || '').localeCompare(b.day || ''));

        trip.activities.forEach(act => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-time">${act.day}<br><span style="font-size:0.8em; font-weight:normal;">${act.time || ''}</span></div>
                <div class="activity-content">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0;">${act.title}</h4>
                        <button class="btn-danger btn-sm delete-act-btn" data-id="${act.id}" style="padding: 0.25rem 0.5rem; border-radius: 4px; border:none; color: white; cursor: pointer;">×</button>
                    </div>
                    ${act.description ? `<p style="color: var(--text-muted); font-size: 0.95rem;">${act.description}</p>` : ''}
                </div>
            `;
            activitiesListEl.appendChild(item);
        });

        // Add Delete Listeners
        document.querySelectorAll('.delete-act-btn').forEach(btn => {
            btn.addEventListener('click', () => handleDeleteActivity(trip.id, btn.dataset.id));
        });
    }

    function handleAddActivity(e, tripId) {
        e.preventDefault();

        const day = document.getElementById('act-day').value.trim();
        const time = document.getElementById('act-time').value;
        const title = document.getElementById('act-title').value.trim();
        const desc = document.getElementById('act-desc').value.trim();

        if (!day || !title) return;

        const newActivity = {
            id: Date.now().toString(),
            day,
            time,
            title,
            description: desc
        };

        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const tripIndex = trips.findIndex(t => t.id === tripId);

        if (tripIndex > -1) {
            trips[tripIndex].activities = trips[tripIndex].activities || [];
            trips[tripIndex].activities.push(newActivity);
            localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));

            activityForm.reset();
            loadTripDetails(tripId); // Re-render
        }
    }

    function handleDeleteActivity(tripId, actId) {
        if (!confirm('Delete this activity?')) return;

        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const tripIndex = trips.findIndex(t => t.id === tripId);

        if (tripIndex > -1) {
            trips[tripIndex].activities = trips[tripIndex].activities.filter(a => a.id !== actId);
            localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
            loadTripDetails(tripId);
        }
    }

    // Helper
    function formatDate(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
});
