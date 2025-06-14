import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create auth context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios interceptors
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
          // If not trying to login/register, log the user out
          const isAuthEndpoint = 
            error.config.url.includes('/login/') || 
            error.config.url.includes('/register/');
            
          if (!isAuthEndpoint) {
            await logout();
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/profile/');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If profile fetch fails, clear token
        if (error.response && error.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use Knox token authentication endpoint
      const response = await api.post('/auth/login/', credentials);
      
      // Extract token from response
      const authToken = response.data.token;
      
      // Save token to localStorage
      localStorage.setItem('token', authToken);
      
      // Update state
      setToken(authToken);
      
      // Return user data
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Handle different error responses from Django
        if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0];
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'object') {
          // Extract first error message from any field
          const firstErrorField = Object.keys(error.response.data)[0];
          if (firstErrorField && error.response.data[firstErrorField]) {
            errorMessage = `${firstErrorField}: ${error.response.data[firstErrorField]}`;
          }
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // Call logout endpoint if token exists
      if (token) {
        await api.post('/auth/logout/', {}, {
          headers: { Authorization: `Token ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user data regardless of API call success
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call Django registration endpoint
      const response = await api.post('/auth/register/', userData);
      
      return {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        data: response.data
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response && error.response.data) {
        // Format Django validation errors
        if (typeof error.response.data === 'object') {
          const errors = Object.entries(error.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
            .join('; ');
          
          errorMessage = errors || errorMessage;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password/', { email });
      return {
        success: true,
        message: 'Password reset instructions have been sent to your email.'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.detail || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (uid, token, newPassword) => {
    try {
      await api.post(`/auth/reset-password/${uid}/${token}/`, {
        password: newPassword,
        confirm_password: newPassword
      });
      
      return {
        success: true,
        message: 'Password has been reset successfully. You can now log in with your new password.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = 'Failed to reset password. The link may be invalid or expired.';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.detail || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };

  const verifyEmail = async (uid, token) => {
    try {
      await api.get(`/auth/activate/${uid}/${token}/`);
      return {
        success: true,
        message: 'Email verified successfully! You can now log in.'
      };
    } catch (error) {
      console.error('Email verification error:', error);
      let errorMessage = 'Failed to verify email. The link may be invalid or expired.';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.msg || error.response.data.detail || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile/', userData);
      setCurrentUser(response.data);
      return {
        success: true,
        message: 'Profile updated successfully!',
        user: response.data
      };
    } catch (error) {
      console.error('Update profile error:', error);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'object') {
          const errors = Object.entries(error.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
            .join('; ');
          
          errorMessage = errors || errorMessage;
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  // Export the API instance for use in other components
  const value = {
    currentUser,
    setCurrentUser,
    token,
    loading,
    error,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile,
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};