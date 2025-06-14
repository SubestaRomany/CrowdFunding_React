import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  border: none;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectImage = styled(Card.Img)`
  height: 180px;
  object-fit: cover;
`;

const Progress = styled.div`
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin: 10px 0;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  width: ${props => props.width}%;
`;

const ProjectCard = ({ project }) => {
  return (
    <StyledCard>
      <ProjectImage 
        variant="top" 
        src={project.image_url} 
        alt={project.title}
      />
      <Card.Body>
        <Card.Title>{project.title}</Card.Title>
        <Card.Text>{project.description}</Card.Text>
        
        <Progress>
          <ProgressBar width={(project.current_amount / project.goal_amount) * 100} />
        </Progress>
        
        <div className="d-flex justify-content-between mb-3">
          <small>${project.current_amount?.toLocaleString()} raised</small>
          <small>{Math.round((project.current_amount / project.goal_amount) * 100)}%</small>
        </div>
        
        <Button 
          as={Link} 
          to={`/projects/${project.id}`}
          variant="primary" 
          className="w-100"
        >
          View Project
        </Button>
      </Card.Body>
    </StyledCard>
  );
};

export default ProjectCard;