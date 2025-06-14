import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Alert, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const PageHeader = styled.div`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-weight: 700;
  margin-bottom: 1rem;
`;

const StyledTable = styled(Table)`
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;
`;

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const response = await api.get('/donations/', {
          params: { page: currentPage }
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
  }, [currentPage]);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <>
      <PageHeader>
        <Container>
          <PageTitle>My Donations</PageTitle>
          <p>Track all your contributions to projects</p>
        </Container>
      </PageHeader>
      
      <Container className="mb-5">
        <h2 className="mb-4">Donation History</h2>
        
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {donations.length === 0 ? (
              <Alert variant="info">
                You haven't made any donations yet. <Link to="/projects">Discover projects</Link> to support!
              </Alert>
            ) : (
              <>
                <StyledTable hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(donation => (
                      <tr key={donation.id}>
                        <td>{formatDate(donation.created_at)}</td>
                        <td>
                          <Link to={`/projects/${donation.project.slug}`}>
                            {donation.project.title}
                          </Link>
                        </td>
                        <td>${parseFloat(donation.amount).toFixed(2)}</td>
                        <td>
                          <Badge bg="success">Completed</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
                
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
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
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Donations;