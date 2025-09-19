// config.js - Configuration file for API endpoints
const config = {
  development: {
    apiUrl: 'http://localhost:3000'
  },
  production: {
    // Update this with your actual backend URL after deployment
    // For Vercel frontend, you'll need to set up a backend service
    apiUrl: 'https://edupass-backend.onrender.com'  // Replace with your actual backend URL
  }
};

// Determine environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '' ||
                     window.location.hostname.includes('vercel.app');

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

// Health check function
const checkApiHealth = async () => {
  try {
    const healthUrl = getApiUrl('/api/health');
    console.log('Checking API health at:', healthUrl);
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Health Check Success:', data);
      return { success: true, data };
    } else {
      console.error('API Health Check Failed:', response.status, response.statusText);
      return { success: false, status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    console.error('API Health Check Error:', error);
    return { success: false, error: error.message };
  }
};

// Export functions
window.getApiUrl = getApiUrl;
window.checkApiHealth = checkApiHealth;

// Log current configuration for debugging
console.log('Current Environment:', isDevelopment ? 'Development' : 'Production');
console.log('API Base URL:', getConfig().apiUrl);