import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Card, Alert, InputGroup, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useFormStatus } from 'react-dom';

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

// Submit button component with loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <StyledButton type="submit" disabled={pending}>
      {pending ? (
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
      ) : (
        'Donate Now'
      )}
    </StyledButton>
  );
}

const DonationForm = ({ projectId, projectTitle, onDonationComplete }) => {
  const { currentUser } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [projectData, setProjectData] = useState({
    currentAmount: 0,
    goalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  
  const predefinedAmounts = [5, 10, 25, 50, 100];
  
  // Fetch project funding data
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Get project details
        const projectResponse = await api.get(`/projects/${projectId}/`);
        
        // Get total donations for this project
        const donationsResponse = await api.get(`/donations/total/${projectId}/`);
        
        setProjectData({
          currentAmount: parseFloat(donationsResponse.data.total_donated) || 0,
          goalAmount: parseFloat(projectResponse.data.goal) || 0
        });
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Could not load project funding information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);
  
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
    
    try {
      // Make API call to create donation
      const response = await api.post('/donations/', {
        project: projectId,
        amount: parseFloat(amount)
      });
      
      setSuccess(true);
      
      // Update project data after successful donation
      setProjectData(prev => ({
        ...prev,
        currentAmount: prev.currentAmount + parseFloat(amount)
      }));
      
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
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };
  
  if (loading) {
    return (
      <DonationCard>
        <CardHeader>
          <CardTitle>Support this project</CardTitle>
        </CardHeader>
        <Card.Body className="p-4 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading project funding information...</p>
        </Card.Body>
      </DonationCard>
    );
  }
  
  return (
    <DonationCard>
      <CardHeader>
        <CardTitle>Support this project</CardTitle>
      </CardHeader>
      <Card.Body className="p-4">
        {success ? (
          <Alert variant="success">
            <Alert.Heading>Thank you for your donation!</Alert.Heading>
            <p>Your contribution of {formatCurrency(amount)} to "{projectTitle}" has been received.</p>
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
                    active={!customAmount && parseFloat(amount) === value}
                    onClick={() => handleAmountSelect(value)}
                  >
                    {formatCurrency(value)}
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
                <span>{formatCurrency(projectData.currentAmount)}</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${Math.min((projectData.currentAmount / projectData.goalAmount) * 100, 100)}%`,
                    background: 'linear-gradient(135deg, #4e54c8, #8f94fb)'
                  }}
                  aria-valuenow={Math.min((projectData.currentAmount / projectData.goalAmount) * 100, 100)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Goal:</span>
                <span>{formatCurrency(projectData.goalAmount)}</span>
              </div>
            </div>
            
            <SubmitButton />
            
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