import api, { API_CONFIG, getErrorMessage } from './apiconfig';

export class AuthService {
    constructor() {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        AuthService.instance = this;
    }

    async login(email, password) {
        try {
            // Accept either (email, password) or a single credentials object
            const payload = (typeof email === 'object' && email !== null)
                ? email
                : { email, password };
            const response = await api.post(API_CONFIG.endpoints.auth.login, payload);
            // support both token in data.token or accessToken
            const token = response.data?.token || response.data?.accessToken;
            const user = response.data?.user || response.data;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }

    // alias used by App.jsx
    async signup(userData) {
        return this.register(userData);
    }

    // validate token (returns true/false)
    async validateToken() {
        try {
            const res = await api.get(API_CONFIG.endpoints.auth.validate);
            return !!res.data?.valid;
        } catch (err) {
            return false;
        }
    }

    async register(userData) {
        try {
            const response = await api.post(API_CONFIG.endpoints.auth.register, userData);
            const token = response.data?.token || response.data?.accessToken;
            const user = response.data?.user || response.data;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }

    async logout() {
        try {
            await api.post(API_CONFIG.endpoints.auth.logout);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            throw this.handleError(error);
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    handleError(error) {
        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }
        return new Error('An unexpected error occurred');
    }
}

export const authService = new AuthService();