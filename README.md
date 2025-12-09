# TripPlanner+ 🌍✈️

A comprehensive web application for planning and managing your travel adventures. Create trips, manage daily activities, check real-time weather, and get AI-powered travel suggestions.

## Features

- **Trip Management**: Create and organize multiple trips with destinations, dates, and detailed itineraries
- **Activity Planning**: Add day-by-day activities with times and descriptions
- **Live Weather**: Check real-time weather conditions for any destination
- **AI Suggestions**: Get personalized travel recommendations powered by Google Gemini AI
- **Contact Form**: Reach out to the team via integrated email functionality

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **APIs**:
  - OpenWeatherMap API for weather data
  - Google Gemini API for AI suggestions
  - EmailJS for contact form functionality
- **Storage**: LocalStorage for client-side data persistence

## Setup Instructions

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd tripplanner
```

### 2. Configure API Keys

The project uses a configuration file to store API keys. Follow these steps:

#### a. Create the `config.js` file

Copy the example configuration file:

```bash
cp scripts/config.example.js scripts/config.js
```

#### b. Obtain API Keys

You'll need to get API keys from the following services:

**OpenWeatherMap API** (for weather data):
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API keys" section
4. Copy your API key

**Google Gemini API** (for AI suggestions):
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

**EmailJS** (for contact form):
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Create an email service (e.g., Gmail, Outlook)
4. Create two email templates:
   - One for team notifications
   - One for client confirmations
5. Get your:
   - Service ID
   - Template IDs (team and client)
   - Public Key (from Account settings)

#### c. Update the `config.js` file

Open `scripts/config.js` and replace the placeholder values with your actual API keys:

```javascript
const CONFIG = {
    OPENWEATHER_API_KEY: 'your_actual_openweather_key',
    GEMINI_API_KEY: 'your_actual_gemini_key',
    EMAILJS_SERVICE_ID: 'your_actual_service_id',
    EMAILJS_TEMPLATE_TEAM_ID: 'your_actual_team_template_id',
    EMAILJS_TEMPLATE_CLIENT_ID: 'your_actual_client_template_id',
    EMAILJS_PUBLIC_KEY: 'your_actual_public_key',
    EMAILJS_API_URL: 'https://api.emailjs.com/api/v1.0/email/send'
};
```

### 3. Run the Application

Since this is a static web application, you can run it using any local web server:

#### Option 1: Using Python (recommended)

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to: `http://localhost:8000`

#### Option 2: Using Node.js (http-server)

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Run the server
http-server -p 8000
```

Then open your browser and navigate to: `http://localhost:8000`

#### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 4. Using the Application

1. **Home Page**: Overview of features and quick access to all sections
2. **Trips Page**: Create new trips and manage existing ones
   - Add trip details (name, origin, destination, dates)
   - Add activities to each trip
   - Delete trips or activities as needed
3. **Weather Page**: Check current weather conditions
   - Search by city name
   - Or select from your saved trips
4. **AI Suggestions**: Get personalized travel recommendations
   - Ask for itinerary ideas
   - Get local food recommendations
   - Request packing tips
5. **About Us**: Learn about the team and send messages via contact form

## Project Structure

```
tripplanner/
├── index.html              # Home page
├── trips.html              # Trip management page
├── weather.html            # Weather checking page
├── ai-suggestions.html     # AI assistant page
├── about.html              # About us and contact page
├── styles.css              # Global styles
├── .env                    # Legacy environment file (optional)
├── .env.example            # Environment variables template (legacy)
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── scripts/
│   ├── config.js           # API keys configuration (not committed)
│   ├── config.example.js   # Configuration template
│   ├── main.js             # Shared utilities
│   ├── trips.js            # Trip management logic
│   ├── weather.js          # Weather functionality
│   ├── ai.js               # AI suggestions logic
│   └── about.js            # Contact form logic
└── assets/                 # Images and other assets
```

## Security Considerations

⚠️ **Important Security Notes**:

1. **Never commit the `scripts/config.js` file**: It's already in `.gitignore`, but make sure it stays there
2. **Client-side limitations**: This is a client-side application, so API keys will be visible in the browser. For production:
   - Use a backend proxy to hide sensitive keys
   - Implement API key restrictions (domain restrictions, rate limiting)
   - Consider using environment-specific keys
3. **API Key Restrictions**: 
   - Restrict your OpenWeatherMap key to your domain
   - Restrict your Gemini API key to your domain
   - Set up proper EmailJS security settings

## Troubleshooting

### API Keys Not Working

1. Verify the `scripts/config.js` file exists
2. Check that all variables are set correctly in the CONFIG object
3. Make sure the file is valid JavaScript (no syntax errors)
4. Restart your web server after updating `config.js`
5. Check browser console for specific error messages
6. Ensure `config.js` is loaded before `main.js` in your HTML files

### Weather Not Loading

- Verify your OpenWeatherMap API key is active (new keys may take a few minutes)
- Check that you haven't exceeded the free tier limits
- Ensure the city name is spelled correctly

### AI Suggestions Not Working

- Verify your Gemini API key has access to the Gemini models
- Check the browser console for specific error messages
- The free tier has rate limits - wait a few minutes if you've made many requests

### Contact Form Not Sending

- Verify all EmailJS credentials are correct
- Check that your email templates are properly configured
- Ensure your EmailJS service is connected and active

## Development Team

- **Blanca Barrufet** - Developer
- **Carlos Castro** - Developer
- **Jaime Quispe** - Developer

## License

© 2025 TripPlanner+. All rights reserved.

## Contributing

This is a university project. If you'd like to suggest improvements, please reach out through the contact form on the About Us page.

## Acknowledgments

- OpenWeatherMap for weather data
- Google Gemini for AI capabilities
- EmailJS for email functionality
