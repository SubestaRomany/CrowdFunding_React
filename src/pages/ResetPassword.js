import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const FormContainer = styled(Container)`
  padding: 4rem 0;
`;

const FormCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    new_password1: '',
    new_password2: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.new_password1 !== formData.new_password2) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await api.post('/auth/password-reset/confirm/', {
        uid,
        token,
        new_password1: formData.new_password1,
        new_password2: formData.new_password2
      });
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
          setError(Object.values(err.response.data).flat().join(' '));
        } else {
          setError(err.response.data);
        }
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <FormCard>
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center mb-4">Reset Your Password</h2>
              
              {success ? (
                <Alert variant="success">
                  <p>Password reset successful!</p>
                  <p>You will be redirected to the login page shortly.</p>
                </Alert>
              ) : (
                <>
                  <p className="text-center text-muted mb-4">
                    Please enter your new password below.
                  </p>
                  
                  {error && <Alert variant="danger">{error}</Alert>}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="new_password1"
                        value={formData.new_password1}
                        onChange={handleChange}
                        required
                        minLength="8"
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 8 characters long.
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="new_password2"
                        value={formData.new_password2}
                        onChange={handleChange}
                        required
                        minLength="8"
                      />
                    </Form.Group>
                    
                    <StyledButton 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </StyledButton>
                    
                    <div className="text-center mt-3">
                      <Link to="/login" className="text-decoration-none">
                        Back to Login
                      </Link>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </FormCard>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ResetPassword;