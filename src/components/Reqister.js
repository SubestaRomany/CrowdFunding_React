import React, { useState } from 'react';
import { register } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // First, make a GET request to get the CSRF token
      await fetch('http://127.0.0.1:8000/api/auth/csrf/', { 
        credentials: 'include' 
      });
      
      // Then submit the registration
      const response = await register(formData);
      setSuccess(true);
      setLoading(false);
      // Optionally redirect or show success message
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        // Handle specific error messages from the backend
        if (typeof error.response.data === 'object') {
          const errorMessages = Object.values(error.response.data).flat();
          setError(errorMessages.join(' '));
        } else {
          setError(error.response.data);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      {success ? (
        <div className="success-message">
          Registration successful! Please check your email to verify your account.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;