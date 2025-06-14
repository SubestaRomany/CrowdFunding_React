import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
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

const ProjectCard = styled(Card)`
  border: none;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  height: 100%;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectImage = styled(Card.Img)`
  height: 200px;
  object-fit: cover;
`;

const ProgressBar = styled.div`
  background-color: #e9ecef;
  border-radius: 10px;
  height: 10px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div`
  background: linear-gradient(90deg, #4e54c8, #8f94fb);
  height: 100%;
  width: ${props => props.width}%;
  transition: width 0.5s ease;
`;

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchMyProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get('/projects/my-projects/');
        setProjects(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching my projects:', error);
        setError('Failed to load your projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyProjects();
  }, []);
  
  const getFeaturedImage = (project) => {
    if (project.images && project.images.length > 0) {
      const featuredImage = project.images.find(img => img.is_featured);
      return featuredImage ? featuredImage.image : project.images[0].image;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };
  
  return (
    <>
      <PageHeader>
        <Container>
          <PageTitle>My Projects</PageTitle>
          <p>Manage your crowdfunding campaigns</p>
        </Container>
      </PageHeader>
      
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Your Projects</h2>
          <Button as={Link} to="/create-project" variant="primary">
            <i className="fas fa-plus me-2"></i> Create New Project
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <>
            {projects.length === 0 ? (
              <div className="text-center my-5">
                <h3>You haven't created any projects yet</h3>
                <p>Start your first crowdfunding campaign today!</p>
                <Button as={Link} to="/create-project" variant="primary" className="mt-3">
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <Row>
                {projects.map(project => (
                  <Col key={project.id} md={4} className="mb-4">
                    <ProjectCard>
                      <ProjectImage variant="top" src={getFeaturedImage(project)} />
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Card.Title>{project.title}</Card.Title>
                          <Badge bg={project.status === 'active' ? 'success' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <Card.Text>
                          {project.description.length > 100 
                            ? `${project.description.substring(0, 100)}...` 
                            : project.description}
                        </Card.Text>
                        <ProgressBar>
                          <Progress width={project.progress_percentage || 0} />
                        </ProgressBar>
                        <div className="d-flex justify-content-between">
                          <small>${project.current_amount || 0} raised</small>
                          <small>${project.goal} goal</small>
                        </div>
                        <div className="d-flex mt-3">
                          <Button 
                            as={Link} 
                            to={`/projects/${project.slug}`}
                            variant="outline-primary" 
                            className="me-2"
                          >
                            View
                          </Button>
                          <Button 
                            as={Link} 
                            to={`/edit-project/${project.slug}`}
                            variant="outline-secondary" 
                            className="me-2"
                          >
                            Edit
                          </Button>
                        </div>
                      </Card.Body>
                    </ProjectCard>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default MyProjects;