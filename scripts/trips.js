document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tripForm = document.getElementById('trip-form');
    const tripsListEl = document.getElementById('trips-list');

    // Initial Render
    renderTrips();

    // Event Listeners
    if (tripForm) {
        tripForm.addEventListener('submit', handleAddTrip);
    }

    // --- Functions ---

    function handleAddTrip(e) {
        e.preventDefault();

        const destination = document.getElementById('trip-destination').value.trim();
        const start = document.getElementById('trip-start').value;
        const end = document.getElementById('trip-end').value;

        // Optional fields (if you added them back to the form, otherwise handle defaults)
        // For the minimal widget, we might infer name from destination
        const name = "Trip to " + destination;
        const origin = "My Location"; // Default or add fieldback if needed

        if (!destination || !start || !end) return;

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
            tripsListEl.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="color: var(--text-muted); font-size: 1.1rem;">No trips booked yet.</p>
                    <p style="color: var(--text-muted);">Use the search widget above to plan your next adventure.</p>
                </div>`;
            return;
        }

        trips.forEach(trip => {
            const card = document.createElement('article');
            card.className = 'simple-trip-card';

            // Note: In a real app, we'd fetch an image of the destination. 
            // Here we use a placeholder or generic travel image.
            card.innerHTML = `
                <div class="trip-img-placeholder">
                    ✈️
                </div>
                <div class="simple-trip-body">
                    <div class="simple-trip-date">${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}</div>
                    <div class="simple-trip-title">${trip.destination}</div>
                    <div class="simple-trip-dest">From: ${trip.origin}</div>
                </div>
            `;

            // Click entire card to go to details
            card.addEventListener('click', () => {
                // Save selected ID (optional, but good for persistence)
                localStorage.setItem('tripplanner_selectedTripId', trip.id);
                // Navigate
                window.location.href = `trip-detail.html?id=${trip.id}`;
            });

            tripsListEl.appendChild(card);
        });
    }

    function loadTrips() {
        const data = localStorage.getItem('tripplanner_trips');
        return data ? JSON.parse(data) : [];
    }

    function saveTrips(trips) {
        localStorage.setItem('tripplanner_trips', JSON.stringify(trips));
    }

    function formatDate(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
});
