// Vercel API route for proxying authentication requests
// This file will proxy requests to your actual backend

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Extract the path from the request
    const { auth } = req.query;
    const path = Array.isArray(auth) ? auth.join('/') : auth;
    
    // Your actual backend URL - replace with your deployed backend
    const BACKEND_URL = process.env.BACKEND_URL || 'https://edupass-backend.onrender.com';
    
    // Construct the full URL
    const url = `${BACKEND_URL}/api/auth/${path}`;
    
    console.log(`Proxying ${req.method} request to: ${url}`);
    
    // Forward the request to your backend
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // Get the response data
    const data = await response.json();
    
    // Set the status code and send the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
};