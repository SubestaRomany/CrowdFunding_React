import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

const DonationHistory = ({ donations }) => {
  return (
    <StyledCard>
      <CardHeader>
        <CardTitle>Your Donations</CardTitle>
      </CardHeader>
      <Card.Body className="p-0">
        {donations && donations.length > 0 ? (
          <StyledTable hover responsive>
            <thead>
              <tr>
                <th>Project</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(donation => (
                <tr key={donation.id}>
                  <td>
                    <ProjectLink to={`/projects/${donation.project.id}`}>
                      {donation.project.title}
                    </ProjectLink>
                  </td>
                  <td>{new Date(donation.date).toLocaleDateString()}</td>
                  <td>
                    <AmountBadge>${donation.amount.toFixed(2)}</AmountBadge>
                  </td>
                  <td>
                    <Badge 
                      bg={donation.status === 'completed' ? 'success' : 
                          donation.status === 'pending' ? 'warning' : 'danger'}
                      style={{ borderRadius: '50px', padding: '0.5rem 1rem' }}
                    >
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
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