import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const DonationCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled(Card.Header)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  color: white;
  padding: 1.5rem;
  border: none;
`;

const CardTitle = styled.h4`
  font-weight: 700;
  margin-bottom: 0;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  border: none;
  border-radius: 50px;
  padding: 0.75rem 0;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.1);
  }
`;

const AmountButton = styled(Button)`
  background-color: ${props => props.active ? '#4e54c8' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#4e54c8'};
  border: 1px solid #4e54c8;
  border-radius: 50px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#4e54c8' : '#e9ecef'};
    color: ${props => props.active ? 'white' : '#4e54c8'};
    border-color: #4e54c8;
  }
`;

const DonationForm = ({ projectId, projectTitle, currentAmount, goalAmount, onDonationComplete }) => {
  const { currentUser, token } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const predefinedAmounts = [5, 10, 25, 50, 100];
  
  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount(false);
  };
  
  const handleCustomAmountChange = (e) => {
    setAmount(e.target.value);
  };
  
  const validateForm = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid donation amount');
      return false;
    }
    
    if (parseFloat(amount) < 1) {
      setError('Minimum donation amount is $1');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please log in to make a donation');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In a real app, you would make an API call
      // const response = await axios.post('/api/donations/', {
      //   project: projectId,
      //   amount: parseFloat(amount)
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // For demo purposes, we'll simulate a successful donation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Notify parent component about the donation
      if (onDonationComplete) {
        onDonationComplete(parseFloat(amount));
      }
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
      }, 3000);
    } catch (error) {
      console.error('Donation error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to process donation');
      } else {
        setError('Failed to process donation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DonationCard>
      <CardHeader>
        <CardTitle>Support this project</CardTitle>
      </CardHeader>
      <Card.Body className="p-4">
        {success ? (
          <Alert variant="success">
            <Alert.Heading>Thank you for your donation!</Alert.Heading>
            <p>Your contribution of ${parseFloat(amount).toFixed(2)} to "{projectTitle}" has been received.</p>
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <div className="mb-4">
              <p className="mb-3">Choose an amount:</p>
              <div>
                {predefinedAmounts.map(value => (
                  <AmountButton
                    key={value}
                    type="button"
                    active={!customAmount && amount === value}
                    onClick={() => handleAmountSelect(value)}
                  >
                    ${value}
                  </AmountButton>
                ))}
                <AmountButton
                  type="button"
                  active={customAmount}
                  onClick={() => {
                    setCustomAmount(true);
                    setAmount('');
                  }}
                >
                  Custom
                </AmountButton>
              </div>
            </div>
            
            {customAmount && (
              <Form.Group className="mb-4">
                <Form.Label>Enter amount:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    autoFocus
                  />
                </InputGroup>
              </Form.Group>
            )}
            
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Current funding:</span>
                <span>${currentAmount.toFixed(2)}</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${Math.min((currentAmount / goalAmount) * 100, 100)}%`,
                    background: 'linear-gradient(135deg, #4e54c8, #8f94fb)'
                  }}
                  aria-valuenow={Math.min((currentAmount / goalAmount) * 100, 100)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Goal:</span>
                <span>${goalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <StyledButton 
              type="submit" 
              disabled={loading || !amount || !currentUser}
            >
              {loading ? 'Processing...' : 'Donate Now'}
            </StyledButton>
            
            {!currentUser && (
              <Alert variant="warning" className="mt-3 mb-0">
                Please log in to make a donation.
              </Alert>
            )}
          </Form>
        )}
      </Card.Body>
    </DonationCard>
  );
};

export default DonationForm;