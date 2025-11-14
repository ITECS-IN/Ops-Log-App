import axios from "axios";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000", // Set your backend URL here or in .env
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response) {
      // Show error message and error type from backend if available
      const message = error.response.data?.message || error.response.statusText || "An error occurred";
      const errorName = error.response.data?.error || error.name || "Error";
      const toastMsg = Array.isArray(message)
        ? `${errorName}:\n${message.join('\n')}`
        : `${errorName}: ${message}`;
      toast.error(toastMsg);
      // Optionally handle specific status codes
      if (error.response.status === 401) {
        // Optionally redirect to login
      }
    } else if (error.request) {
      toast.error("No response from server. Please check your connection.");
    } else {
      toast.error(`${error.name || "Error"}: ${error.message || "An error occurred"}`);
    }
    return Promise.reject(error);
  }
);

export default api;
