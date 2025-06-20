import api from './api';

// Authentication endpoints
export const login = (email, password) =>
  api.post('auth/login/', { email, password });

export const register = (userData) =>
  api.post('auth/register/', userData);

export const getUserProfile = () =>
  api.get('auth/profile/');

export const updateUserProfile = (userData) =>
  api.put('auth/profile/', userData);

export const deleteAccount = () =>
  api.delete('auth/profile/delete/');

export const forgotPassword = (email) =>
  api.post('auth/forgot-password/', { email });

export const resetPassword = (uid, token, newPassword) =>
  api.post(`auth/reset-password/${uid}/${token}/`, { password: newPassword });

export const verifyEmail = (uid, token) =>
  api.get(`auth/activate/${uid}/${token}/`);