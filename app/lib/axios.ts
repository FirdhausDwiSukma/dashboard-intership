import axios from 'axios';

// Create a configured axios instance
// This clean separation allows easy changes to base URL or headers later
const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // Backend Go URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Response interceptor to handle global errors (optional but good practice)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // We can handle specific status codes here (e.g. 401 Unauthorized => logout)
        return Promise.reject(error);
    }
);

export default apiClient;
