/* eslint-disable no-unused-vars */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class AuthService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async signup(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  async validateToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await axios.post(`${API_BASE_URL}/api/auth/validate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();