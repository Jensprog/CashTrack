/**
 * @file Authentication Context Provider.
 *
 * This context provides authentication state and functions across the application.
 */
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, removeCookie } from '@/utils/cookieUtils';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';

// Create context
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if the user is logged in at initial render
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/auth/status');
        setUser(response.data.data.user);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUser(null);
        } else {
          console.error('Auth check error:', error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, [pathname]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });

      // Save CSRF-token
      if (response.data.data.csrfToken) {
        setCookie('csrfToken', response.data.data.csrfToken);
      }

      setUser(response.data.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Ett fel inträffade. Försök igen senare.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Registration function
  const register = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', { email, password });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Ett fel inträffade. Försök igen senare.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      removeCookie('csrfToken');
      router.push('/');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Ett fel inträffade vid utloggning.' };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
