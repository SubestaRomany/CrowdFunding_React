import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const LoginContainer = styled(Container)`
  padding: 4rem 0;
`;

const LoginCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CardSubtitle = styled.p`
  opacity: 0.8;
  margin-bottom: 0;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  border: none;
  border-radius: 50px;
  padding: 0.75rem 0;
  font-weight: 600;
  width: 100%;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Make API call to Django login endpoint
      const response = await api.post('/login/', {
        email: formData.email,
        password: formData.password
      });
      
      // Extract user data and token from response
      const { user, msg } = response.data;
      
      // Store token in localStorage (assuming your AuthContext handles this)
      await login({
        user: user,
        token: user.token || localStorage.getItem('token') // Use token if available
      });
      
      console.log(msg); // Log success message
      
      // Navigate to the page user was trying to access, or home
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error responses from Django
      if (error.response) {
        if (error.response.status === 401) {
          setError('Invalid email or password');
        } else if (error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else if (error.response.data && error.response.data.non_field_errors) {
          setError(error.response.data.non_field_errors[0]);
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <LoginCard>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardSubtitle>Sign in to your account</CardSubtitle>
            </CardHeader>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                  />
                </Form.Group>

                <StyledButton type="submit" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </StyledButton>
              </Form>
              
              <div className="text-center mt-4">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary">
                    Create one
                  </Link>
                </p>
                <p>
                  <Link to="/forgot-password" className="text-muted">
                    Forgot your password?
                  </Link>
                </p>
              </div>
            </Card.Body>
          </LoginCard>
        </Col>
      </Row>
    </LoginContainer>
  );
};

export default Login;