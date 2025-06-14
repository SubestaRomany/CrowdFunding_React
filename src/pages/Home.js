import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const HeroSection = styled.div`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  color: white;
  padding: 5rem 0;
  margin-bottom: 3rem;
  border-radius: 0 0 50% 50% / 20%;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const StyledButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  background-color: white;
  color: #4e54c8;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.2);
    background-color: white;
    color: #8f94fb;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
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

const StatSection = styled.div`
  background-color: #f8f9fa;
  padding: 5rem 0;
  margin: 3rem 0;
  text-align: center;
`;

const StatNumber = styled.h3`
  font-size: 3rem;
  font-weight: 700;
  color: #4e54c8;
  margin-bottom: 1rem;
`;

const StatText = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
`;

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFunding: 0,
    totalBackers: 0
  });

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await axios.get('/api/projects/?featured=true');
        setFeaturedProjects(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured projects:', error);
       
        setFeaturedProjects([
          {
            id: 1,
            title: 'Eco-Friendly Water Bottle',
            description: 'A sustainable water bottle that helps reduce plastic waste.',
            image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
            current_amount: 15000,
            target_amount: 20000,
          },
          {
            id: 2,
            title: 'Smart Home Garden',
            description: 'An automated garden system for growing herbs and vegetables indoors.',
            image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
            current_amount: 8000,
            target_amount: 30000,
          },
          {
            id: 3,
            title: 'Educational Coding Kit for Kids',
            description: 'A fun kit to teach programming basics to children aged 8-12.',
            image_url: 'https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5',
            current_amount: 25000,
            target_amount: 40000,
          }
        ]);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        
        setStats({
          totalProjects: 150,
          totalFunding: 2500000,
          totalBackers: 12000
        });
      }
    };

    fetchFeaturedProjects();
    fetchStats();
  }, []);

  return (
    <>
      <HeroSection>
        <Container>
          <HeroTitle>Fund Your Dreams, Support Others</HeroTitle>
          <HeroSubtitle>
            Join our community of creators and backers to bring innovative projects to life.
          </HeroSubtitle>
          <StyledButton as={Link} to="/projects">
            Explore Projects
          </StyledButton>
        </Container>
      </HeroSection>

      <Container>
        <SectionTitle>Featured Projects</SectionTitle>
        <Row>
          {featuredProjects.map(project => (
            <Col key={project.id} md={4} className="mb-4">
              <ProjectCard>
                <ProjectImage variant="top" src={project.image_url} />
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
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
        <div className="text-center mt-4 mb-5">
          <StyledButton as={Link} to="/projects">
            View All Projects
          </StyledButton>
        </div>
      </Container>

      <StatSection>
        <Container>
          <Row>
            <Col md={4}>
              <StatNumber>{stats.totalProjects}</StatNumber>
              <StatText>Projects Funded</StatText>
            </Col>
            <Col md={4}>
              <StatNumber>${(stats.totalFunding / 1000000).toFixed(1)}M+</StatNumber>
              <StatText>Total Funding</StatText>
            </Col>
            <Col md={4}>
              <StatNumber>{(stats.totalBackers / 1000).toFixed(1)}K+</StatNumber>
              <StatText>Total Backers</StatText>
            </Col>
          </Row>
        </Container>
      </StatSection>

      <Container className="mb-5">
        <Row>
          <Col md={6}>
            <SectionTitle className="text-start">How It Works</SectionTitle>
            <h4>For Project Creators</h4>
            <ul className="mb-4">
              <li>Create an account and submit your project</li>
              <li>Set your funding goal and campaign duration</li>
              <li>Share your project with your network</li>
              <li>Receive funds when your goal is reached</li>
            </ul>
            
            <h4>For Backers</h4>
            <ul>
              <li>Browse projects that inspire you</li>
              <li>Support projects with any amount</li>
              <li>Receive updates on projects you've backed</li>
              <li>Get rewards based on your contribution level</li>
            </ul>
          </Col>
          <Col md={6} className="d-flex align-items-center">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="How it works" 
              className="img-fluid rounded shadow-lg"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;