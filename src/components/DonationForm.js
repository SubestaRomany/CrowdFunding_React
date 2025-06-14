import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import api from '../services/api';

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

const AmountButton = styled(Button)`
  background: ${props => props.active ? 'linear-gradient(135deg, #4e54c8, #8f94fb)' : 'white'};
  color: ${props => props.active ? 'white' : '#4e54c8'};
  border: 1px solid #4e54c8;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #4e54c8, #8f94fb)' : '#f0f2ff'};
    color: ${props => props.active ? 'white' : '#4e54c8'};
    border-color: #4e54c8;
  }
`;

const DonationForm = ({ projectId, projectData, onDonationComplete, currentUser }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const predefinedAmounts = ['10', '25', '50', '100'];
  
  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount(false);
    setError('');
  };
  
  const handleCustomAmountChange = (e) => {
    setAmount(e.target.value);
    setError('');
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
    
    setError('');
    setIsSubmitting(true);
    
    try {
      // Make API call to create donation
      const response = await api.post('/donations/', {
        project: projectId,
        amount: parseFloat(amount)
      });
      
      setSuccess(true);
      
      // Notify parent component about the donation
      if (onDonationComplete) {
        onDonationComplete(parseFloat(amount), response.data);
      }
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
      }, 3000);
    } catch (error) {
      console.error('Donation error:', error);
      if (error.response && error.response.data) {
        // Handle validation errors from Django
        if (typeof error.response.data === 'object') {
          const errorMessages = Object.values(error.response.data)
            .flat()
            .join(' ');
          setError(errorMessages || 'Failed to process donation');
        } else {
          setError(error.response.data || 'Failed to process donation');
        }
      } else {
        setError('Failed to process donation. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Thank you for your donation!</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Select Amount</Form.Label>
        <div className="d-flex flex-wrap mb-2">
          {predefinedAmounts.map(amt => (
            <AmountButton
              key={amt}
              type="button"
              active={amount === amt && !customAmount}
              onClick={() => handleAmountSelect(amt)}
            >
              ${amt}
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
        
        {customAmount && (
          <Form.Control
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleCustomAmountChange}
            min="1"
            step="0.01"
            className="mb-3"
          />
        )}
      </Form.Group>
      
      <StyledButton type="submit" disabled={isSubmitting || success}>
        {isSubmitting ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Processing...
          </>
        ) : success ? (
          'Thank You!'
        ) : (
          'Donate Now'
        )}
      </StyledButton>
    </Form>
  );
};

export default DonationForm;