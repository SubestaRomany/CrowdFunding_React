import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
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
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4e54c8, #8f94fb);
  width: ${props => props.width}%;
  border-radius: 5px;
`;

const CategoryButton = styled(Button)`
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  background-color: ${props => props.active ? '#4e54c8' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#4e54c8' : '#e9ecef'};
    color: ${props => props.active ? 'white' : '#333'};
    transform: translateY(-2px);
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState('');

  // Fetch categories and projects
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories first
        const categoriesResponse = await api.get('/categories/');
        const categoryNames = ['All', ...categoriesResponse.data.map(cat => cat.name)];
        setCategories(categoryNames);
        
        // Then fetch projects
        const projectsResponse = await api.get('/project/');
        setProjects(projectsResponse.data);
        setError('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Filter projects based on search term and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           (project.category && project.category.name === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Sort projects based on selected sort option
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === 'most_funded') {
      const aProgress = a.progress_percentage || 0;
      const bProgress = b.progress_percentage || 0;
      return bProgress - aProgress;
    } else if (sortBy === 'least_funded') {
      const aProgress = a.progress_percentage || 0;
      const bProgress = b.progress_percentage || 0;
      return aProgress - bProgress;
    }
    return 0;
  });

  // Get featured image for a project
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
          <PageTitle>Discover Projects</PageTitle>
          <p>Find and support creative projects that inspire you</p>
        </Container>
      </PageHeader>

      <Container>
        <FilterSection>
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select value={sortBy} onChange={handleSortChange}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most_funded">Most Funded</option>
                <option value="least_funded">Least Funded</option>
              </Form.Select>
            </Col>
          </Row>

          <div>
            {categories.map(category => (
              <CategoryButton
                key={category}
                active={selectedCategory === category}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </CategoryButton>
            ))}
          </div>
        </FilterSection>

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
            {sortedProjects.length === 0 ? (
              <div className="text-center my-5">
                <h3>No projects found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <Row>
                {sortedProjects.map(project => (
                  <Col key={project.id} md={4} className="mb-4">
                    <ProjectCard>
                      <ProjectImage variant="top" src={getFeaturedImage(project)} />
                      <Card.Body>
                        <Card.Title>{project.title}</Card.Title>
                        <Card.Text>
                          {project.description.length > 100 
                            ? `${project.description.substring(0, 100)}...` 
                            : project.description}
                        </Card.Text>
                        <div className="mb-2">
                          <span className="badge bg-light text-dark">
                            {project.category ? project.category.name : 'Uncategorized'}
                          </span>
                          {project.tags && project.tags.map(tag => (
                            <span key={tag.id} className="badge bg-info text-white ms-1">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                        <ProgressBar>
                          <Progress width={project.progress_percentage || 0} />
                        </ProgressBar>
                        <div className="d-flex justify-content-between">
                          <small>${project.current_amount || 0} raised</small>
                          <small>{project.progress_percentage || 0}%</small>
                        </div>
                        <Button 
                          as={Link} 
                          to={`/projects/${project.slug}`}
                          variant="primary" 
                          className="w-100 mt-3"
                        >
                          View Project
                        </Button>
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

export default Projects;