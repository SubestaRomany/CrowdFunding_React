import { Container, Row, Col, Card, Badge, ProgressBar, Tab, Tabs, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import DonationForm from '../components/DonationForm';
import axios from 'axios';
import { useState, useEffect } from 'react';


const ProjectContainer = styled(Container)`
  padding: 3rem 0;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 2rem;
`;

const ProjectTitle = styled.h1`
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ProjectCreator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const CreatorAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreatorName = styled.span`
  font-weight: 600;
`;

const CreatorBio = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

const CategoryBadge = styled(Badge)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  margin-right: 0.5rem;
`;

const StyledTabs = styled(Tabs)`
  margin-top: 3rem;
  
  .nav-link {
    color: #495057;
    font-weight: 600;
    
    &.active {
      color: #4e54c8;
      border-bottom: 3px solid #4e54c8;
    }
  }
`;

const StyledCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const StyledProgressBar = styled(ProgressBar)`
  height: 10px;
  border-radius: 5px;
  margin: 1.5rem 0;
  
  .progress-bar {
    background: linear-gradient(135deg, #4e54c8, #8f94fb);
  }
`;

const CommentForm = styled(Form)`
  margin-top: 2rem;
`;

const CommentButton = styled(Button)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  
 
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
       
        setTimeout(() => {
          setProject({
            id: id,
            title: "Eco-Friendly Water Bottle",
            description: "A reusable water bottle made from sustainable materials that helps reduce plastic waste.",
            long_description: `
              <p>Our mission is to reduce single-use plastic waste by creating the most sustainable, practical, and beautiful water bottle on the market.</p>
              <p>Made from 100% recycled materials, our bottle is designed to last a lifetime. Each bottle features:</p>
              <ul>
                <li>Double-wall insulation to keep drinks cold for 24 hours or hot for 12 hours</li>
                <li>Leak-proof cap with easy-carry handle</li>
                <li>Wide mouth for easy filling and cleaning</li>
                <li>Dishwasher safe design</li>
                <li>Available in 6 beautiful colors</li>
              </ul>
              <p>By choosing our bottle, you're not just staying hydrated - you're helping to save our oceans and reduce landfill waste.</p>
            `,
            creator: {
              id: 1,
              name: "Sarah Johnson",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              bio: "Environmental activist and product designer"
            },
            category: "Eco-Friendly",
            tags: ["Sustainable", "Eco", "Plastic-Free"],
            current_amount: 8750,
            goal_amount: 15000,
            backers_count: 325,
            days_left: 18,
            start_date: "2023-05-01",
            end_date: "2023-06-30",
            image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
            updates: [
              {
                id: 1,
                title: "Production Started!",
                content: "We're excited to announce that production has officially begun on the first batch of bottles!",
                date: "2023-05-15"
              },
              {
                id: 2,
                title: "New Color Options",
                content: "Based on your feedback, we've added two new color options: Sunset Orange and Ocean Blue.",
                date: "2023-05-10"
              }
            ],
            comments: [
              {
                id: 1,
                user: {
                  name: "Michael Chen",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                content: "This looks amazing! Can't wait to get mine.",
                date: "2023-05-12"
              },
              {
                id: 2,
                user: {
                  name: "Emma Wilson",
                  avatar: "https://randomuser.me/api/portraits/women/22.jpg"
                },
                content: "Will there be a smaller size available for kids?",
                date: "2023-05-11"
              }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details. Please try again.");
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  const handleDonationComplete = (amount) => {
   
    setProject(prev => ({
      ...prev,
      current_amount: prev.current_amount + amount,
      backers_count: prev.backers_count + 1
    }));
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    
    const newCommentObj = {
      id: Date.now(), 
      user: {
        name: "You", 
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg" // placeholder avatar
      },
      content: newComment,
      date: new Date().toISOString().split('T')[0]
    };
    
    setProject(prev => ({
      ...prev,
      comments: [newCommentObj, ...prev.comments]
    }));
    
    
    setNewComment('');
  };
  
  if (loading) {
    return (
      <ProjectContainer>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading project details...</p>
        </div>
      </ProjectContainer>
    );
  }
  
  if (error) {
    return (
      <ProjectContainer>
        <div className="text-center py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <Button as={Link} to="/projects" variant="primary" className="mt-3">
            Back to Projects
          </Button>
        </div>
      </ProjectContainer>
    );
  }
  
  if (!project) {
    return (
      <ProjectContainer>
        <div className="text-center py-5">
          <div className="alert alert-warning" role="alert">
            Project not found
          </div>
          <Button as={Link} to="/projects" variant="primary" className="mt-3">
            Back to Projects
          </Button>
        </div>
      </ProjectContainer>
    );
  }
  
  const progressPercentage = Math.min((project.current_amount / project.goal_amount) * 100, 100);
  
  return (
    <ProjectContainer>
      <Row>
        <Col lg={8}>
          <ProjectImage src={project.image_url} alt={project.title} />
          <ProjectTitle>{project.title}</ProjectTitle>
          
          <ProjectCreator>
            <CreatorAvatar src={project.creator.avatar} alt={project.creator.name} />
            <CreatorInfo>
              <CreatorName>By {project.creator.name}</CreatorName>
              <CreatorBio>{project.creator.bio}</CreatorBio>
            </CreatorInfo>
          </ProjectCreator>
          
          <div className="mb-4">
            <CategoryBadge>{project.category}</CategoryBadge>
            {project.tags.map((tag, index) => (
              <Badge 
                key={index} 
                bg="light" 
                text="dark" 
                className="me-2"
                style={{ borderRadius: '50px', padding: '0.5rem 1rem' }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <StyledTabs defaultActiveKey="about" className="mb-4">
            <Tab eventKey="about" title="About">
              <div dangerouslySetInnerHTML={{ __html: project.long_description }} />
            </Tab>
            
            <Tab eventKey="updates" title={`Updates (${project.updates.length})`}>
              {project.updates.map(update => (
                <StyledCard key={update.id} className="mb-4">
                  <Card.Body>
                    <h5>{update.title}</h5>
                    <p className="text-muted">{new Date(update.date).toLocaleDateString()}</p>
                    <p>{update.content}</p>
                  </Card.Body>
                </StyledCard>
              ))}
            </Tab>
            
            <Tab eventKey="comments" title={`Comments (${project.comments.length})`}>
              <CommentForm onSubmit={handleCommentSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Add a comment</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <CommentButton type="submit">
                    Post Comment
                  </CommentButton>
                </div>
              </CommentForm>
              
              <hr className="my-4" />
              
              {project.comments.map(comment => (
                <StyledCard key={comment.id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex mb-3">
                      <img 
                        src={comment.user.avatar} 
                        alt={comment.user.name} 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%',
                          marginRight: '1rem'
                        }} 
                      />
                      <div>
                        <h6 className="mb-0">{comment.user.name}</h6>
                        <small className="text-muted">
                          {new Date(comment.date).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <p className="mb-0">{comment.content}</p>
                  </Card.Body>
                </StyledCard>
              ))}
            </Tab>
          </StyledTabs>
        </Col>
        
        <Col lg={4}>
          <StyledCard className="mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between mb-2">
                <h4 className="mb-0">${project.current_amount.toLocaleString()}</h4>
                <span className="text-muted">of ${project.goal_amount.toLocaleString()}</span>
              </div>
              
              <StyledProgressBar now={progressPercentage} />
              
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <h5 className="mb-0">{project.backers_count}</h5>
                  <small className="text-muted">Backers</small>
                </div>
                <div>
                  <h5 className="mb-0">{project.days_left}</h5>
                  <small className="text-muted">Days left</small>
                </div>
              </div>
            </Card.Body>
          </StyledCard>
          
          <DonationForm 
            projectId={project.id}
            projectTitle={project.title}
            currentAmount={project.current_amount}
            goalAmount={project.goal_amount}
            onDonationComplete={handleDonationComplete}
          />
          
          <StyledCard>
            <Card.Body className="p-4">
              <h5 className="mb-3">Share this project</h5>
              <div className="d-flex">
                <Button 
                  variant="outline-primary" 
                  className="me-2"
                  style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0' }}
                >
                  <i className="fab fa-facebook-f"></i>
                </Button>
                <Button 
                  variant="outline-info" 
                  className="me-2"
                  style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0' }}
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button 
                  variant="outline-danger" 
                  className="me-2"
                  style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0' }}
                >
                  <i className="fab fa-pinterest"></i>
                </Button>
                <Button 
                  variant="outline-secondary"
                  style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0' }}
                >
                  <i className="fas fa-link"></i>
                </Button>
              </div>
            </Card.Body>
          </StyledCard>
        </Col>
      </Row>
    </ProjectContainer>
  );
};

export default ProjectDetail;