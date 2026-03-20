// API Configuration for Ritzy Shop Frontend
// Ensures the deployed backend URL includes /api

const resolveApiBaseUrl = () => {
  // Try to read from environment variable first
  let configured = (process.env.REACT_APP_API_URL || '').trim();

  // Log for debugging in deployed environment
  if (typeof window !== 'undefined') {
    console.log('[API Config] REACT_APP_API_URL:', configured || 'NOT SET');
    console.log('[API Config] Environment:', process.env.NODE_ENV);
  }

  // Default values based on environment
  if (!configured) {
    if (process.env.NODE_ENV === 'production') {
      // Production fallback - Must be updated to your actual Render URL
      configured = 'https://my-shop-backend.onrender.com';
    } else {
      // Development fallback
      configured = 'http://localhost:5000';
    }
  }

  const cleanUrl = configured.replace(/\/$/, '');
  const apiUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  
  console.log('[API Config] Final API_BASE_URL:', apiUrl);
  
  return apiUrl;
};

const API_BASE_URL = resolveApiBaseUrl();

export default API_BASE_URL;