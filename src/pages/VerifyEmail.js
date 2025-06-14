import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const PageContainer = styled(Container)`
  padding: 5rem 0;
`;

const ResultCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  border: none;
  border-radius: 50px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.1);
  }
`;

const VerifyEmail = () => {
  const { uid, token } = useParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.post('/auth/verify-email/', { uid, token });
        setSuccess(true);
      } catch (err) {
        console.error('Email verification error:', err);
        if (err.response && err.response.data) {
          if (typeof err.response.data === 'object') {
            setError(Object.values(err.response.data).flat().join(' '));
          } else {
            setError(err.response.data);
          }
        } else {
          setError('Failed to verify email. The link may be invalid or expired.');
        }
      } finally {
        setVerifying(false);
      }
    };
    
    verifyEmail();
  }, [uid, token]);
  
  return (
    <PageContainer>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <ResultCard>
            <Card.Body className="p-5">
              <h2 className="mb-4">Email Verification</h2>
              
              {verifying ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Verifying your email...</p>
                </div>
              ) : success ? (
                <>
                  <Alert variant="success">
                    <i className="fas fa-check-circle fa-3x mb-3"></i>
                    <h4>Email Verified Successfully!</h4>
                    <p>Your email has been verified. You can now log in to your account.</p>
                  </Alert>
                  <StyledButton as={Link} to="/login">
                    Go to Login
                  </StyledButton>
                </>
              ) : (
                <>
                  <Alert variant="danger">
                    <i className="fas fa-times-circle fa-3x mb-3"></i>
                    <h4>Verification Failed</h4>
                    <p>{error || 'The verification link is invalid or has expired.'}</p>
                  </Alert>
                  <div className="mt-3">
                    <p>Please try again or contact support if the problem persists.</p>
                    <StyledButton as={Link} to="/login">
                      Back to Login
                    </StyledButton>
                  </div>
                </>
              )}
            </Card.Body>
          </ResultCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default VerifyEmail;