import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const StyledCard = styled(Card)`
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h4`
  font-weight: 700;
  margin-bottom: 0;
`;

const StyledTable = styled(Table)`
  margin-bottom: 0;
  
  th {
    font-weight: 600;
    color: #495057;
  }
  
  td {
    vertical-align: middle;
  }
`;

const ProjectLink = styled(Link)`
  color: #4e54c8;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AmountBadge = styled(Badge)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 50px;
`;

const StyledPagination = styled(Pagination)`
  margin-top: 1rem;
  justify-content: center;
  
  .page-item.active .page-link {
    background: linear-gradient(135deg, #4e54c8, #8f94fb);
    border-color: #4e54c8;
  }
  
  .page-link {
    color: #4e54c8;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const DonationHistory = ({ userId }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const response = await api.get('/donations/', {
          params: { user: userId, page: currentPage }
        });
        
        setDonations(response.data.results || response.data);
        
        // Handle pagination if API returns it
        if (response.data.count && response.data.page_size) {
          setTotalPages(Math.ceil(response.data.count / response.data.page_size));
        }
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load your donation history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonations();
  }, [userId, currentPage]);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Format date from API
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <StyledCard>
        <CardHeader>
          <CardTitle>Your Donations</CardTitle>
        </CardHeader>
        <Card.Body>
          <LoadingContainer>
            <Spinner animation="border" variant="primary" />
          </LoadingContainer>
        </Card.Body>
      </StyledCard>
    );
  }
  
  if (error) {
    return (
      <StyledCard>
        <CardHeader>
          <CardTitle>Your Donations</CardTitle>
        </CardHeader>
        <Card.Body>
          <div className="text-center py-4">
            <p className="text-danger">{error}</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => setCurrentPage(1)}
            >
              Try Again
            </button>
          </div>
        </Card.Body>
      </StyledCard>
    );
  }
  
  return (
    <StyledCard>
      <CardHeader>
        <CardTitle>Your Donations</CardTitle>
        <Badge bg="light" text="dark" pill>
          Total: {donations.length > 0 ? donations.length : 0}
        </Badge>
      </CardHeader>
      <Card.Body className="p-0">
        {donations && donations.length > 0 ? (
          <>
            <StyledTable hover responsive>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id}>
                    <td>
                      <ProjectLink to={`/projects/${donation.project}`}>
                        {donation.project_title || `Project #${donation.project}`}
                      </ProjectLink>
                    </td>
                    <td>{formatDate(donation.created_at)}</td>
                    <td>
                      <AmountBadge>{formatCurrency(donation.amount)}</AmountBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            
            {totalPages > 1 && (
              <div className="p-3">
                <StyledPagination>
                  <Pagination.First 
                    onClick={() => handlePageChange(1)} 
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  
                  {[...Array(totalPages).keys()].map(number => (
                    <Pagination.Item
                      key={number + 1}
                      active={number + 1 === currentPage}
                      onClick={() => handlePageChange(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  ))}
                  
                  <Pagination.Next 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last 
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </StyledPagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <p className="mb-0">You haven't made any donations yet.</p>
            <Link to="/projects" className="btn btn-primary mt-3">
              Explore Projects
            </Link>
          </div>
        )}
      </Card.Body>
    </StyledCard>
  );
};

export default DonationHistory;