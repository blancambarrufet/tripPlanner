
document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const detailName = document.getElementById('detail-name');
    const detailRoute = document.getElementById('detail-route');
    const detailDates = document.getElementById('detail-dates');
    const activitiesListEl = document.getElementById('activities-list');
    const activityForm = document.getElementById('activity-form');
    const successMessage = document.getElementById('activity-success');
    const activityFormTitle = document.getElementById('activity-form-title');
    const cancelActivityEditBtn = document.getElementById('cancel-activity-edit-btn');
    const editTripBtn = document.getElementById('edit-trip-btn');
    const deleteTripBtn = document.getElementById('delete-trip-btn');
    const editTripForm = document.getElementById('edit-trip-form');
    const tripEditForm = document.getElementById('trip-edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // Store current trip data
    let currentTrip = null;

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
    if (activityForm) {
        activityForm.addEventListener('submit', (e) => handleAddActivity(e, tripId));
    }

    if (cancelActivityEditBtn) {
        cancelActivityEditBtn.addEventListener('click', () => {
            resetActivityForm();
        });
    }
    
    // Edit trip functionality
    if (editTripBtn) {
        editTripBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentTrip) {
                document.getElementById('edit-name').value = currentTrip.name;
                document.getElementById('edit-origin').value = currentTrip.origin;
                document.getElementById('edit-destination').value = currentTrip.destination;
                document.getElementById('edit-start').value = currentTrip.startDate;
                document.getElementById('edit-end').value = currentTrip.endDate;
                editTripForm.style.display = 'block';
                editTripBtn.style.display = 'none';
            } else {
                alert('Trip data not loaded yet. Please refresh the page.');
            }
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', (e) => {
            e.preventDefault();
            editTripForm.style.display = 'none';
            editTripBtn.style.display = 'block';
        });
    }

    if (tripEditForm) {
        tripEditForm.addEventListener('submit', (e) => {
            handleEditTrip(e, tripId);
        });
    }

    if (deleteTripBtn) {
        deleteTripBtn.addEventListener('click', () => {
            handleDeleteTrip(tripId);
        });
    }

    // --- Functions ---
    function loadTripDetails(id) {
        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const trip = trips.find(t => t.id === id);

        if (!trip) {
            alert('Trip not found.');
            window.location.href = 'trips.html';
            return;
        }

        // Store current trip
        currentTrip = trip;

        // Render Header
        detailName.textContent = trip.name;
        detailRoute.textContent = `${trip.origin} ➝ ${trip.destination}`;
        detailDates.textContent = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;

        // Render Activities
        renderActivities(trip);
    }

    function handleEditTrip(e, tripId) {
        e.preventDefault();

        const nameInput = document.getElementById('edit-name');
        const originInput = document.getElementById('edit-origin');
        const destinationInput = document.getElementById('edit-destination');
        const startDateInput = document.getElementById('edit-start');
        const endDateInput = document.getElementById('edit-end');

        if (!nameInput || !originInput || !destinationInput || !startDateInput || !endDateInput) {
            alert('Edit form fields not found. Please refresh the page.');
            return;
        }

        const name = nameInput.value.trim();
        const origin = originInput.value.trim();
        const destination = destinationInput.value.trim();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (!name || !origin || !destination || !startDate || !endDate) {
            alert('Please fill in all fields.');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            alert('End date must be after start date.');
            return;
        }

        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const tripIndex = trips.findIndex(t => t.id === tripId);

        if (tripIndex === -1) {
            alert('Trip not found. Please refresh the page.');
            return;
        }

        trips[tripIndex].name = name;
        trips[tripIndex].origin = origin;
        trips[tripIndex].destination = destination;
        trips[tripIndex].startDate = startDate;
        trips[tripIndex].endDate = endDate;

        try {
            localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
            
            editTripForm.style.display = 'none';
            editTripBtn.style.display = 'block';
            loadTripDetails(tripId);
        } catch (error) {
            alert('Error saving trip changes. Please try again.');
        }
    }

    function handleDeleteTrip(tripId) {
        if (!confirm('Are you sure you want to delete this trip? This will permanently delete the trip and all its activities. This action cannot be undone.')) {
            return;
        }

        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const filteredTrips = trips.filter(t => t.id !== tripId);
        
        try {
            localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(filteredTrips));
            alert('Trip deleted successfully.');
            window.location.href = 'trips.html';
        } catch (error) {
            alert('Error deleting trip. Please try again.');
        }
    }

    function renderActivities(trip) {
        activitiesListEl.innerHTML = '';

        if (!trip.activities || trip.activities.length === 0) {
            activitiesListEl.innerHTML = `
                <div style="text-align: center; color: #6b7280; padding: 3rem; background: white; border-radius: 1rem; border: 1px dashed #e2e8f0;">
                    <p>No activities planned yet.</p>
                    <p style="font-size: 0.9rem;">Use the form on the right to add your first activity!</p>
                </div>
            `;
            return;
        }
        trip.activities.forEach((act, index) => {
            if (act.order === undefined) {
                act.order = index;
            }
        });
        trip.activities.sort((a, b) => (a.order || 0) - (b.order || 0));

        trip.activities.forEach((act, index) => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.draggable = true;
            item.dataset.activityId = act.id;
            item.dataset.order = index;
            
            // Drag and drop event handlers
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
            
            item.innerHTML = `
                <div class="activity-drag-handle" style="cursor: move; color: #9ca3af; font-size: 1.2rem; padding-right: 0.5rem; align-self: flex-start; padding-top: 0.5rem; user-select: none;">⋮⋮</div>
                <div class="activity-time">${act.day}<br><span style="font-size:0.8em; font-weight:normal;">${act.time || ''}</span></div>
                <div class="activity-content" style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0;">${act.title}</h4>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-secondary edit-act-btn" data-id="${act.id}" style="padding: 0.25rem 0.75rem; border-radius: 4px; border:none; cursor: pointer; font-size: 0.85rem;">Edit</button>
                            <button class="btn-delete btn-sm delete-act-btn" data-id="${act.id}" style="padding: 0.25rem 0.75rem; border-radius: 4px; border:none; color: white; cursor: pointer; font-size: 0.85rem;">Delete</button>
                        </div>
                    </div>
                    ${act.description ? `<p style="color: #6b7280; font-size: 0.95rem;">${act.description}</p>` : ''}
                </div>
            `;
            activitiesListEl.appendChild(item);
        });

        // Add Delete Listeners
        document.querySelectorAll('.delete-act-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDeleteActivity(trip.id, btn.dataset.id);
            });
            btn.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
        });

        document.querySelectorAll('.edit-act-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const activityId = btn.dataset.id;
                handleEditActivity(trip.id, activityId);
            });
            btn.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
        });
    }

    let draggedElement = null;
    let draggedIndex = null;

    function handleDragStart(e) {
        draggedElement = this;
        draggedIndex = parseInt(this.dataset.order);
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        
        const target = e.currentTarget;
        if (target !== draggedElement && target.classList.contains('activity-item')) {
            const targetIndex = parseInt(target.dataset.order);
            const allItems = Array.from(activitiesListEl.children).filter(el => el.classList.contains('activity-item'));
            
            if (draggedIndex < targetIndex) {
                activitiesListEl.insertBefore(draggedElement, target.nextSibling);
            } else {
                activitiesListEl.insertBefore(draggedElement, target);
            }
            
            // Update indices
            allItems.forEach((item, index) => {
                item.dataset.order = index;
            });
            draggedIndex = Array.from(activitiesListEl.children).indexOf(draggedElement);
        }
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        
        // Save new order to localStorage
        const allItems = Array.from(activitiesListEl.children).filter(el => el.classList.contains('activity-item'));
        const newOrder = allItems.map((item, index) => ({
            activityId: item.dataset.activityId,
            order: index
        }));

        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const tripIndex = trips.findIndex(t => t.id === currentTrip.id);

        if (tripIndex > -1) {
            newOrder.forEach(({ activityId, order }) => {
                const activity = trips[tripIndex].activities.find(a => a.id === activityId);
                if (activity) {
                    activity.order = order;
                }
            });
            localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
            loadTripDetails(currentTrip.id);
        }
        
        draggedElement = null;
        draggedIndex = null;
    }

    function resetActivityForm() {
        document.getElementById('act-id').value = '';
        document.getElementById('act-day').value = '';
        document.getElementById('act-time').value = '';
        document.getElementById('act-title').value = '';
        document.getElementById('act-desc').value = '';
        if (activityFormTitle) {
            activityFormTitle.textContent = 'Add New Activity';
        }
        if (cancelActivityEditBtn) {
            cancelActivityEditBtn.style.display = 'none';
        }
    }

    function handleEditActivity(tripId, activityId) {
        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const tripIndex = trips.findIndex(t => t.id === tripId);

        if (tripIndex > -1) {
            const activity = trips[tripIndex].activities.find(a => a.id === activityId);
            if (activity) {
                document.getElementById('act-id').value = activity.id;
                document.getElementById('act-day').value = activity.day || '';
                document.getElementById('act-time').value = activity.time || '';
                document.getElementById('act-title').value = activity.title || '';
                document.getElementById('act-desc').value = activity.description || '';
                
                if (activityFormTitle) {
                    activityFormTitle.textContent = 'Edit Activity';
                }
                if (cancelActivityEditBtn) {
                    cancelActivityEditBtn.style.display = 'block';
                }
                
                document.querySelector('.sticky-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    function handleAddActivity(e, tripId) {
        e.preventDefault();

        const activityId = document.getElementById('act-id').value;
        const day = document.getElementById('act-day').value.trim();
        const time = document.getElementById('act-time').value;
        const title = document.getElementById('act-title').value.trim();
        const desc = document.getElementById('act-desc').value.trim();

        if (!day || !title) {
            alert('Please fill in the Day and Activity fields.');
            return;
        }

        const trips = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIPS) || '[]');
        const tripIndex = trips.findIndex(t => t.id === tripId);

        if (tripIndex > -1) {
            // Ensure activities array exists
            if (!trips[tripIndex].activities) {
                trips[tripIndex].activities = [];
            }
            
            if (activityId) {
                // Editing existing activity
                const activityIndex = trips[tripIndex].activities.findIndex(a => a.id === activityId);
                if (activityIndex > -1) {
                    trips[tripIndex].activities[activityIndex].day = day;
                    trips[tripIndex].activities[activityIndex].time = time;
                    trips[tripIndex].activities[activityIndex].title = title;
                    trips[tripIndex].activities[activityIndex].description = desc;
                }
            } else {
                // Adding new activity
                const newActivity = {
                    id: Date.now().toString(),
                    day,
                    time,
                    title,
                    description: desc
                };
                trips[tripIndex].activities.push(newActivity);
            }
            
            // Save to localStorage
            try {
                localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
                
                // Show success message
                if (successMessage) {
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 3000);
                }
                
                // Reset form and reload
                resetActivityForm();
                
                // Force reload the trip details
                setTimeout(() => {
                    loadTripDetails(tripId);
                }, 100);
            } catch (error) {
                alert('Error saving activity. Please try again.');
            }
        } else {
            alert('Error: Trip not found. Please try again.');
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
