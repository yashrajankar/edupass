// config.js - Configuration file for API endpoints
const config = {
  development: {
    apiUrl: 'http://localhost:3000'
  },
  production: {
    // Update this with your actual Render backend URL after deployment
    apiUrl: 'https://edupass-backend.onrender.com'
  }
};

// Determine environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

// Export configuration based on environment
const getConfig = () => {
  return isDevelopment ? config.development : config.production;
};

// Create a helper function to get the full API URL
const getApiUrl = (endpoint) => {
  const config = getConfig();
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${config.apiUrl}/${cleanEndpoint}`;
};

// Export functions
window.getApiUrl = getApiUrl;