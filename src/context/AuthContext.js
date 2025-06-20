import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

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

  // 1. Interceptors
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          const isAuthEndpoint = error?.config?.url?.includes('/login/') || error?.config?.url?.includes('/register/');
          if (!isAuthEndpoint) setTimeout(() => logout(), 0);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // 2. Get Profile on token
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('auth/profile/');
        setCurrentUser(response.data);
      } catch (error) {
        if (error?.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // 3. Login
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      if (credentials.user && credentials.token) {
        setCurrentUser(credentials.user);
        setToken(credentials.token);
        localStorage.setItem('token', credentials.token);
        return credentials.user;
      }

      const response = await api.post('auth/login/', {
        email: credentials.email,
        password: credentials.password,
      });

      const { token, user } = response.data;
      const authToken = token || (user && user.token);
      if (!authToken) throw new Error('No token received from server');

      localStorage.setItem('token', authToken);
      setToken(authToken);
      setCurrentUser(user);
      return user;
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error?.response?.data) {
        const data = error.response.data;
        if (data.non_field_errors) {
          errorMessage = data.non_field_errors[0];
        } else if (data.detail) {
          errorMessage = data.detail;
        } else {
          const firstField = Object.keys(data)[0];
          const message = Array.isArray(data[firstField]) ? data[firstField][0] : data[firstField];
          errorMessage = `${firstField}: ${message}`;
        }
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Logout
  const logout = async () => {
  try {
    if (token) {
      await api.post('auth/logout/', {}, {
        headers: { Authorization: `Token ${token}` },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setLoading(false);
  }
};


  // 5. Register
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('auth/register/', userData);
      return {
        success: true,
        message: 'Registration successful! Please check your email.',
        data: response.data,
      };
    } catch (error) {
      let errorMessage = 'Registration failed.';
      if (error?.response?.data && typeof error.response.data === 'object') {
        const errors = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
          .join('; ');
        errorMessage = errors || errorMessage;
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 6. Forgot Password
  const forgotPassword = async (email) => {
    try {
      await api.post('auth/forgot-password/', { email });
      return {
        success: true,
        message: 'Password reset instructions sent to your email.',
      };
    } catch (error) {
      const msg = error?.response?.data?.detail || 'Failed to send reset email.';
      throw new Error(msg);
    }
  };

  // 7. Reset Password ✅✅ تعديل هنا
  const resetPassword = async (uid, token, newPassword) => {
    try {
      await api.post(`auth/reset-password/${uid}/${token}/`, {
        new_password: newPassword,
      });

      return {
        success: true,
        message: 'Password reset successful!',
      };
    } catch (error) {
      const msg = error?.response?.data?.detail || 'Failed to reset password.';
      throw new Error(msg);
    }
  };

  // 8. Verify Email
  const verifyEmail = async (uid, token) => {
    try {
      await api.get(`auth/activate/${uid}/${token}/`);
      return {
        success: true,
        message: 'Email verified successfully!',
      };
    } catch (error) {
      const errData = error?.response?.data;
      const msg = errData?.msg || errData?.detail || 'Failed to verify email.';
      throw new Error(msg);
    }
  };

  // 9. Update Profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('auth/profile/', userData);
      setCurrentUser(response.data);
      return {
        success: true,
        message: 'Profile updated!',
        user: response.data,
      };
    } catch (error) {
      let errorMessage = 'Failed to update profile.';
      if (error?.response?.data && typeof error.response.data === 'object') {
        const errors = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`)
          .join('; ');
        errorMessage = errors || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  // 10. Provide to context
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
    api,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
