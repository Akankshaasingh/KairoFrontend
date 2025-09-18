import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Export API configuration
export const API_CONFIG = {
    baseURL: API_BASE_URL,
    endpoints: {
        auth: {
                login: '/api/auth/signin',
                register: '/api/auth/signup',
                logout: '/api/auth/logout',
                validate: '/api/auth/validate'
            },
        notes: {
            base: '/api/notes',
            create: '/api/notes',
            update: (id) => `/api/notes/${id}`,
            delete: (id) => `/api/notes/${id}`,
            getAll: '/api/notes',
            getById: (id) => `/api/notes/${id}`
        },
        reminders: {
            base: '/api/reminders',
            create: '/api/reminders',
            update: (id) => `/api/reminders/${id}`,
            delete: (id) => `/api/reminders/${id}`,
            getAll: '/api/reminders',
            getById: (id) => `/api/reminders/${id}`
        }
    }
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
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
        if (error.response?.status === 401) {
            // Clear stored auth but don't force a redirect here; let UI decide
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default api;

// Helper: derive a user-friendly error message
export const getErrorMessage = (error) => {
    if (!error) return 'Unknown error';
    if (error.response?.data?.message) return error.response.data.message;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
};