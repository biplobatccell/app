// Environment configuration helper
const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  BACKEND_URL: import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8001',
  IS_PRODUCTION: import.meta.env.PROD
};

export default ENV;
