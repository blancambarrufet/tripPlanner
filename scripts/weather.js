document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const tripSelect = document.getElementById('trip-select');
    const resultSection = document.getElementById('weather-result');
    const errorMsg = document.getElementById('error-msg');

    const trips = loadTrips();
    trips.forEach(trip => {
        const option = document.createElement('option');
        option.value = trip.destination; 
        option.textContent = `${trip.name} (${trip.destination})`;
        tripSelect.appendChild(option);
    });

    const selectedTripId = localStorage.getItem(STORAGE_KEYS.SELECTED_TRIP);
    if (selectedTripId) {
        const preSelectedTrip = trips.find(t => t.id === selectedTripId);
        if (preSelectedTrip) {
            tripSelect.value = preSelectedTrip.destination;
            fetchWeather(preSelectedTrip.destination);
        }
        localStorage.removeItem(STORAGE_KEYS.SELECTED_TRIP);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim() || tripSelect.value;

        if (!city) {
            showError('Please enter a city or select a trip.');
            return;
        }

        fetchWeather(city);
    });

    function fetchWeather(city) {
        errorMsg.style.display = 'none';
        resultSection.style.display = 'none';

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${CONFIG.OPENWEATHER_API_KEY}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status === 404 ? 'City not found' : 'Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                updateUI(data);
            })
            .catch(err => {
                showError(err.message);
            });
    }

    function updateUI(data) {
        document.getElementById('w-city').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('w-date').textContent = new Date().toLocaleString();
        document.getElementById('w-temp').textContent = Math.round(data.main.temp);
        document.getElementById('w-desc').textContent = data.weather[0].description;
        document.getElementById('w-humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('w-wind').textContent = `${data.wind.speed} m/s`;

        const iconCode = data.weather[0].icon;
        document.getElementById('w-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        resultSection.style.display = 'block';
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }
});
