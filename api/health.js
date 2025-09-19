// Vercel API route for health checks
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Your actual backend URL - replace with your deployed backend
    const BACKEND_URL = process.env.BACKEND_URL || 'https://edupass-backend.onrender.com';
    
    // Check backend health
    const backendResponse = await fetch(`${BACKEND_URL}/api/health`);
    const backendData = await backendResponse.json();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      frontend: {
        status: 'operational',
        environment: process.env.VERCEL_ENV || 'development',
        region: process.env.VERCEL_REGION || 'local'
      },
      backend: {
        status: backendData.status,
        message: backendData.message,
        timestamp: backendData.timestamp
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({ 
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};