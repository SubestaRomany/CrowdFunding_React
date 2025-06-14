import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          
          
          
          setCurrentUser({
            id: 1,
            username: 'demouser',
            email: 'demo@example.com',
            name: 'Demo User'
          });
        } catch (error) {
          console.error('Error fetching user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
   
    
 
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      
        if (credentials.username === 'demouser' && credentials.password === 'password') {
          const mockToken = 'mock-jwt-token-12345';
          const mockUser = {
            id: 1,
            username: 'demouser',
            email: 'demo@example.com',
            name: 'Demo User'
          };
          
          
          localStorage.setItem('token', mockToken);
          
          
          setToken(mockToken);
          setCurrentUser(mockUser);
          
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
          
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    
    localStorage.removeItem('token');
    
    
    delete axios.defaults.headers.common['Authorization'];
    
    
    setToken(null);
    setCurrentUser(null);
  };

  const register = async (userData) => {
   
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};