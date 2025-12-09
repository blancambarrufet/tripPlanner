/**
 * Environment Variable Loader for Client-Side Applications
 * 
 * This script loads environment variables from a .env file.
 * Note: For client-side apps, this is a simple solution but API keys
 * will still be visible in the browser. For production apps, consider
 * using a backend proxy to hide sensitive keys.
 */

async function loadEnv() {
    try {
        const response = await fetch('.env');
        if (!response.ok) {
            console.warn('No .env file found. Using default configuration or environment variables.');
            return {};
        }

        const text = await response.text();
        const env = {};

        // Parse .env file
        text.split('\n').forEach(line => {
            line = line.trim();
            // Skip empty lines and comments
            if (!line || line.startsWith('#')) return;

            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                env[key.trim()] = valueParts.join('=').trim();
            }
        });

        return env;
    } catch (error) {
        console.error('Error loading .env file:', error);
        return {};
    }
}

// Export for use in other scripts
window.loadEnv = loadEnv;
