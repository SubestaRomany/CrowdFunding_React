import React from 'react';
import { Spinner, Container } from 'react-bootstrap';
import styled from 'styled-components';

const LoadingContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #4e54c8;
`;

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <LoadingContainer>
      <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingScreen;