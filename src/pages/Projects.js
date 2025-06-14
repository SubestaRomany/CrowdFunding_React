import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  const categories = ['All', 'Technology', 'Art', 'Food', 'Games', 'Music', 'Publishing'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects/');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        
        setProjects([
          {
            id: 1,
            title: 'Eco-Friendly Water Bottle',
            description: 'A sustainable water bottle that helps reduce plastic waste.',
            image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
            current_amount: 15000,
            target_amount: 20000,
            category: 'Technology',
            created_at: '2023-10-15T10:30:00Z',
          },
          {
            id: 2,
            title: 'Smart Home Garden',
            description: 'An automated garden system for growing herbs and vegetables indoors.',
            image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
            current_amount: 8000,
            target_amount: 30000,
            category: 'Food',
            created_at: '2023-10-20T14:45:00Z',
          },
          {
            id: 3,
            title: 'Educational Coding Kit for Kids',
            description: 'A fun kit to teach programming basics to children aged 8-12.',
            image_url: 'https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5',
            current_amount: 25000,
            target_amount: 40000,
            category: 'Technology',
            created_at: '2023-10-10T09:15:00Z',
          },
          {
            id: 4,
            title: 'Handcrafted Ceramic Art Collection',
            description: 'A collection of unique handmade ceramic art pieces for your home.',
            image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261',
            current_amount: 4500,
            target_amount: 10000,
            category: 'Art',
            created_at: '2023-10-25T16:20:00Z',
          },
          {
            id: 5,
            title: 'Indie Game Development',
            description: 'Support the development of an innovative indie puzzle game.',
            image_url: 'https://images.unsplash.com/photo-1556438064-2d7646166914',
            current_amount: 12000,
            target_amount: 50000,
            category: 'Games',
            created_at: '2023-10-05T11:30:00Z',
          },
          {
            id: 6,
            title: 'Sustainable Fashion Line',
            description: 'Eco-friendly clothing made from recycled materials.',
            image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2',
            current_amount: 18000,
            target_amount: 25000,
            category: 'Art',
            created_at: '2023-10-18T13:10:00Z',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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

  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

 
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === 'most_funded') {
      return b.current_amount - a.current_amount;
    } else if (sortBy === 'least_funded') {
      return a.current_amount - b.current_amount;
    }
    return 0;
  });

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
                      <ProjectImage variant="top" src={project.image_url} />
                      <Card.Body>
                        <Card.Title>{project.title}</Card.Title>
                        <Card.Text>{project.description}</Card.Text>
                        <div className="mb-2">
                          <span className="badge bg-light text-dark">{project.category}</span>
                        </div>
                        <ProgressBar>
                          <Progress width={(project.current_amount / project.target_amount) * 100} />
                        </ProgressBar>
                        <div className="d-flex justify-content-between">
                          <small>${project.current_amount.toLocaleString()} raised</small>
                          <small>{Math.round((project.current_amount / project.target_amount) * 100)}%</small>
                        </div>
                        <Button 
                          as={Link} 
                          to={`/projects/${project.id}`}
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