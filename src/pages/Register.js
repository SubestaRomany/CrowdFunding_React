import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const RegisterContainer = styled(Container)`
  padding: 4rem 0;
`;

const RegisterCard = styled(Card)`
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

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', first_name: '', last_name: '',
    email: '', password: '', confirm_password: '',
    mobile_phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    if (!formData.mobile_phone) newErrors.mobile_phone = 'Mobile phone is required';
    else if (!/^01[0125][0-9]{8}$/.test(formData.mobile_phone)) newErrors.mobile_phone = 'Phone number must be Egyptian and in the format: 01XXXXXXXXX';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/register/', formData);
      setSuccess(true);
      setErrors({ general: 'Registration successful! Please check your email to verify your account.' });
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      const apiErrors = {};
      if (error.response?.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value;
        });
      } else {
        apiErrors.general = 'Registration failed. Please try again.';
      }
      setErrors(apiErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <RegisterCard>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardSubtitle>Join our crowdfunding community</CardSubtitle>
            </CardHeader>
            <Card.Body className="p-4">
              {success && <Alert variant="success">Registration successful! Please check your email to verify your account.</Alert>}
              {errors.general && <Alert variant={success ? 'info' : 'danger'}>{errors.general}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" isInvalid={!!errors.username} />
                  <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First name" isInvalid={!!errors.first_name} />
                      <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last name" isInvalid={!!errors.last_name} />
                      <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" isInvalid={!!errors.email} />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Phone</Form.Label>
                  <Form.Control type="text" name="mobile_phone" value={formData.mobile_phone} onChange={handleChange} placeholder="Egyptian mobile number (01XXXXXXXXX)" isInvalid={!!errors.mobile_phone} />
                  <Form.Control.Feedback type="invalid">{errors.mobile_phone}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" isInvalid={!!errors.password} />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Confirm your password" isInvalid={!!errors.confirm_password} />
                  <Form.Control.Feedback type="invalid">{errors.confirm_password}</Form.Control.Feedback>
                </Form.Group>
                <StyledButton type="submit" disabled={loading || success}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </StyledButton>
              </Form>
              <div className="text-center mt-4">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary">Sign in</Link>
                </p>
              </div>
            </Card.Body>
          </RegisterCard>
        </Col>
      </Row>
    </RegisterContainer>
  );
};

export default Register;
