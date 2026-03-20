// API Configuration for Ritzy Shop Frontend
// Ensures the deployed backend URL includes /api

const resolveApiBaseUrl = () => {
  const configured = (process.env.REACT_APP_API_URL || '').trim();

  if (!configured) {
    return 'https://ritzy24.com/api';
  }

  const cleanUrl = configured.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

export default API_BASE_URL;