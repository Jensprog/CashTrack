/**
 * Axios configuration with security enhancements
 *
 * This file sets up a customized axios instance that automatically
 * includes CSRF tokens in request headers for protected API calls.
 */

import { getCookie } from '@/utils/cookieUtils';
import axios from 'axios';

const baseURL = '/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adds a request interceptor to include CSRF token in headers for non-GET requests
api.interceptors.request.use(
  (config) => {
    if (config.method !== 'get') {
      const csrfToken = getCookie('csrfToken');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Adds a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = `${basePath}/login`;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
