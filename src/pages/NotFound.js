import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled(Container)`
  text-align: center;
  padding: 5rem 0;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const ErrorDescription = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto 2rem;
`;

const HomeButton = styled(Button)`
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

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <ErrorCode>404</ErrorCode>
          <ErrorTitle>Page Not Found</ErrorTitle>
          <ErrorDescription>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </ErrorDescription>
          <HomeButton as={Link} to="/">
            Back to Home
          </HomeButton>
        </Col>
      </Row>
    </NotFoundContainer>
  );
};

export default NotFound;