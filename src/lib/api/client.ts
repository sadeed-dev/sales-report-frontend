import axios, { AxiosInstance } from 'axios';

// API Configuration (use import.meta.env for Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3008/api/v1';

console.log('🔧 API_BASE_URL initialized:', API_BASE_URL);

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - log all requests
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API Response Success:', {
      status: response.status,
      url: response.config.url,
      dataLength: Array.isArray(response.data?.data?.summary) ? response.data.data.summary.length : 'N/A',
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('❌ API Error (Response):', {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response
      console.error('❌ API Error (No Response):', {
        url: error.config?.url,
        message: 'No response from server',
      });
    } else {
      console.error('❌ API Error (Other):', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
