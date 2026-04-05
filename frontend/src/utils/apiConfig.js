import axios from "axios";

// Use environment variable if provided, otherwise fallback to localhost:3000 for testing.
export const API_BASE = import.meta.env.VITE_API_BASE || "https://lms-website-49is.onrender.com";

// Set default base URL for all axios requests.
axios.defaults.baseURL = API_BASE;

// Automatically attach token if available (makes Authorization header consistent across requests)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default axios;
