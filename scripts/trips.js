document.addEventListener('DOMContentLoaded', () => {
    const tripForm = document.getElementById('trip-form');
    const tripsListEl = document.getElementById('trips-list');

    renderTrips();

    if (tripForm) {
        tripForm.addEventListener('submit', handleAddTrip);
    }

    // --- Functions ---

    function handleAddTrip(e) {
        e.preventDefault();

        const name = document.getElementById('trip-name').value.trim();
        const origin = document.getElementById('trip-origin').value.trim();
        const destination = document.getElementById('trip-destination').value.trim();
        const start = document.getElementById('trip-start').value;
        const end = document.getElementById('trip-end').value;

        if (!name || !origin || !destination || !start || !end) {
            alert('Please fill in all fields.');
            return;
        }

        if (new Date(end) < new Date(start)) {
            alert('End date must be after start date.');
            return;
        }

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
                    <p style="color: #6b7280; font-size: 1.1rem;">No trips booked yet.</p>
                    <p style="color: #6b7280;">Use the search widget above to plan your next adventure.</p>
                </div>`;
            return;
        }

        trips.forEach(trip => {
            const card = document.createElement('article');
            card.className = 'simple-trip-card';

            card.innerHTML = `
                <div class="trip-img-placeholder">
                    <img src="https://images.vexels.com/media/users/3/128183/isolated/preview/9dfb13e1f746440c37db6f92b56af3c1-los-angeles-city-skyline.png" alt="skyline icon" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="simple-trip-body" style="position: relative;">
                    <button class="btn-delete delete-trip-btn" data-id="${trip.id}" style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; z-index: 10;" title="Delete trip">Delete</button>
                    <div class="simple-trip-date">${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}</div>
                    <div class="simple-trip-title">${trip.name || trip.destination}</div>
                    <div class="simple-trip-dest">${trip.origin} → ${trip.destination}</div>
                </div>
            `;

            // Handle card click (view trip)
            const cardBody = card.querySelector('.simple-trip-body');
            cardBody.addEventListener('click', (e) => {
                // Don't navigate if clicking delete button
                if (!e.target.classList.contains('delete-trip-btn')) {
                    localStorage.setItem('tripplanner_selectedTripId', trip.id);
                    window.location.href = `trip-detail.html?id=${trip.id}`;
                }
            });

            // Handle delete button click
            const deleteBtn = card.querySelector('.delete-trip-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDeleteTrip(trip.id);
            });

            tripsListEl.appendChild(card);
        });
    }

    function handleDeleteTrip(tripId) {
        if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
            return;
        }

        const trips = loadTrips();
        const filteredTrips = trips.filter(t => t.id !== tripId);
        saveTrips(filteredTrips);
        renderTrips();
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
