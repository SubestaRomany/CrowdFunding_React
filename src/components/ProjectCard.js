import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
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

const CategoryBadge = styled(Badge)`
  background-color: #f0f0f0;
  color: #666;
  font-weight: 500;
  margin-bottom: 10px;
  padding: 5px 10px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const TagBadge = styled(Badge)`
  background-color: rgba(78, 84, 200, 0.1);
  color: #4e54c8;
  font-weight: 400;
`;

const ProjectCard = ({ project }) => {
  // Get featured image from project
  const getFeaturedImage = () => {
    if (project.images && project.images.length > 0) {
      const featuredImage = project.images.find(img => img.is_featured);
      return featuredImage ? featuredImage.image : project.images[0].image;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  // Calculate progress percentage safely
  const calculateProgress = () => {
    const goal = parseFloat(project.goal) || 0;
    const current = parseFloat(project.current_amount) || 0;
    
    if (goal <= 0) return 0;
    const percentage = (current / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Format currency
  const formatCurrency = (amount) => {
    const value = parseFloat(amount) || 0;
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  return (
    <StyledCard>
      <ProjectImage 
        variant="top" 
        src={getFeaturedImage()} 
        alt={project.title}
      />
      <Card.Body>
        {project.category && (
          <CategoryBadge bg="light" text="dark">
            {project.category.name}
          </CategoryBadge>
        )}
        
        <Card.Title>{project.title}</Card.Title>
        <Card.Text>{truncateDescription(project.description)}</Card.Text>
        
        {project.tags && project.tags.length > 0 && (
          <TagsContainer>
            {project.tags.slice(0, 3).map(tag => (
              <TagBadge key={tag.id}>{tag.name}</TagBadge>
            ))}
            {project.tags.length > 3 && (
              <TagBadge>+{project.tags.length - 3} more</TagBadge>
            )}
          </TagsContainer>
        )}
        
        <Progress>
          <ProgressBar width={calculateProgress()} />
        </Progress>
        
        <div className="d-flex justify-content-between mb-3">
          <small>{formatCurrency(project.current_amount)} raised</small>
          <small>{Math.round(calculateProgress())}%</small>
        </div>
        
        <Button 
          as={Link} 
          to={`/projects/${project.slug}`}
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