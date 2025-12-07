document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentTripId = null;

    // Elements
    const tripForm = document.getElementById('trip-form');
    const tripsListEl = document.getElementById('trips-list');
    const detailsSection = document.getElementById('trip-details-section');
    const closeDetailsBtn = document.getElementById('close-details');
    const activityForm = document.getElementById('activity-form');
    const activitiesListEl = document.getElementById('activities-list');

    // Initial Render
    renderTrips();

    // Event Listeners
    tripForm.addEventListener('submit', handleAddTrip);
    closeDetailsBtn.addEventListener('click', closeDetails);
    activityForm.addEventListener('submit', handleAddActivity);

    // --- Trip Functions ---

    function handleAddTrip(e) {
        e.preventDefault();

        const name = document.getElementById('trip-name').value.trim();
        const origin = document.getElementById('trip-origin').value.trim();
        const destination = document.getElementById('trip-destination').value.trim();
        const start = document.getElementById('trip-start').value;
        const end = document.getElementById('trip-end').value;

        if (!name || !origin || !destination || !start || !end) return;

        const newTrip = {
            id: Date.now().toString(),
            name,
            origin,
            destination,
            startDate: start,
            endDate: end,
            activities: []
        };

        const trips = loadTrips();
        trips.push(newTrip);
        saveTrips(trips);

        tripForm.reset();
        renderTrips();
    }

    function renderTrips() {
        const trips = loadTrips();
        tripsListEl.innerHTML = '';

        if (trips.length === 0) {
            tripsListEl.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6b7280;">No trips yet. Create one above!</p>';
            return;
        }

        trips.forEach(trip => {
            const card = document.createElement('article');
            card.className = 'card trip-card';
            card.innerHTML = `
                <h3>${trip.name}</h3>
                <p><strong>To:</strong> ${trip.destination}</p>
                <p><strong>From:</strong> ${trip.origin}</p>
                <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
                    ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}
                </p>
                <div class="trip-actions">
                    <button class="btn btn-view" data-id="${trip.id}">Manage</button>
                    <button class="btn btn-secondary btn-weather" data-id="${trip.id}">Weather</button>
                    <button class="btn btn-danger btn-delete" data-id="${trip.id}">Delete</button>
                </div>
            `;
            tripsListEl.appendChild(card);
        });

        // Add event listeners to dynamic buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => handleDeleteTrip(btn.dataset.id));
        });
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => openTripDetails(btn.dataset.id));
        });
        document.querySelectorAll('.btn-weather').forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.setItem(STORAGE_KEYS.SELECTED_TRIP, btn.dataset.id);
                window.location.href = 'weather.html';
            });
        });
    }

    function handleDeleteTrip(id) {
        if (!confirm('Are you sure you want to delete this trip?')) return;

        let trips = loadTrips();
        trips = trips.filter(t => t.id !== id);
        saveTrips(trips);

        if (currentTripId === id) {
            closeDetails();
        }

        renderTrips();
    }

    // --- Detail / Activity Functions ---

    function openTripDetails(id) {
        const trips = loadTrips();
        const trip = trips.find(t => t.id === id);
        if (!trip) return;

        currentTripId = id;

        // Populate header
        document.getElementById('detail-name').textContent = trip.name;
        document.getElementById('detail-route').textContent = `${trip.origin} ➝ ${trip.destination}`;
        document.getElementById('detail-dates').textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;

        // Show section
        detailsSection.style.display = 'block';
        detailsSection.scrollIntoView({ behavior: 'smooth' });

        renderActivities(trip);
    }

    function closeDetails() {
        currentTripId = null;
        detailsSection.style.display = 'none';
        activityForm.reset();
    }

    function handleAddActivity(e) {
        e.preventDefault();
        if (!currentTripId) return;

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

        const trips = loadTrips();
        const tripIndex = trips.findIndex(t => t.id === currentTripId);

        if (tripIndex > -1) {
            trips[tripIndex].activities.push(newActivity);
            saveTrips(trips);
            renderActivities(trips[tripIndex]);
            activityForm.reset();
        }
    }

    function renderActivities(trip) {
        activitiesListEl.innerHTML = '';

        if (!trip.activities || trip.activities.length === 0) {
            activitiesListEl.innerHTML = '<p style="color: #6b7280; font-style: italic;">No activities added yet.</p>';
            return;
        }

        // Sort by Time (optional, simple string sort)
        // trip.activities.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

        trip.activities.forEach(act => {
            const item = document.createElement('div');
            item.className = 'card';
            item.style.marginBottom = '1rem';
            item.style.padding = '1rem';
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h4 style="margin-bottom: 0.25rem;">${act.title}</h4>
                        <div style="font-size: 0.875rem; color: var(--primary-color); font-weight: 600; margin-bottom: 0.5rem;">
                            ${act.day} ${act.time ? ' • ' + act.time : ''}
                        </div>
                        <p>${act.description}</p>
                    </div>
                    <button class="btn btn-danger btn-sm delete-act" data-id="${act.id}" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">Delete</button>
                </div>
            `;
            activitiesListEl.appendChild(item);
        });

        document.querySelectorAll('.delete-act').forEach(btn => {
            btn.addEventListener('click', () => handleDeleteActivity(btn.dataset.id));
        });
    }

    function handleDeleteActivity(actId) {
        if (!currentTripId) return;

        const trips = loadTrips();
        const tripIndex = trips.findIndex(t => t.id === currentTripId);

        if (tripIndex > -1) {
            trips[tripIndex].activities = trips[tripIndex].activities.filter(a => a.id !== actId);
            saveTrips(trips);
            renderActivities(trips[tripIndex]); // Re-render from the updated trip object
        }
    }
});
