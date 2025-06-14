import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await api.post('/auth/password-reset/', { email });
      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
          setError(Object.values(err.response.data).flat().join(' '));
        } else {
          setError(err.response.data);
        }
      } else {
        setError('Failed to send password reset email. Please try again.');
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
              <h2 className="text-center mb-4">Reset Password</h2>
              
              {success ? (
                <Alert variant="success">
                  <p>Password reset email sent!</p>
                  <p>Please check your email for instructions to reset your password.</p>
                  <div className="text-center mt-3">
                    <Link to="/login" className="btn btn-outline-primary">
                      Back to Login
                    </Link>
                  </div>
                </Alert>
              ) : (
                <>
                  <p className="text-center text-muted mb-4">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  {error && <Alert variant="danger">{error}</Alert>}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    <StyledButton 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;