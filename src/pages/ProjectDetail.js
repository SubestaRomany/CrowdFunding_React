import { Container, Row, Col, Card, Badge, ProgressBar, Tab, Tabs, Button, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DonationForm from '../components/DonationForm';
import api from '../services/api';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

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
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        // Get project details
        const response = await api.get(`/projects/${slug}/`);
        setProject(response.data);
        
        // Get project comments
        const commentsResponse = await api.get(`/comments/`, {
          params: { project: response.data.id }
        });
        setComments(commentsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [slug]);
  
  const handleDonationComplete = (amount) => {
    // Update project stats after successful donation
    setProject(prev => ({
      ...prev,
      current_amount: (parseFloat(prev.current_amount) + parseFloat(amount)).toFixed(2),
      progress_percentage: Math.min(
        ((parseFloat(prev.current_amount) + parseFloat(amount)) / parseFloat(prev.goal)) * 100, 
        100
      ).toFixed(2)
    }));
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!user) {
      navigate('/login', { state: { from: `/projects/${slug}` } });
      return;
    }
    
    try {
      // Post comment to API
      const response = await api.post('/comments/', {
        project: project.id,
        content: newComment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Add new comment to the list
      setComments([response.data, ...comments]);
      
      // Clear comment form
      setNewComment('');
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };
  
  // Calculate days left
  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Get featured image
  const getFeaturedImage = (project) => {
    if (project.images && project.images.length > 0) {
      const featuredImage = project.images.find(img => img.is_featured);
      return featuredImage ? featuredImage.image : project.images[0].image;
    }
    return 'https://via.placeholder.com/800x400?text=No+Image';
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
  
  const daysLeft = calculateDaysLeft(project.end_date);
  
  return (
    <ProjectContainer>
      <Row>
        <Col lg={8}>
          <ProjectImage src={getFeaturedImage(project)} alt={project.title} />
          <ProjectTitle>{project.title}</ProjectTitle>
          
          <ProjectCreator>
            <CreatorAvatar 
              src={project.owner.profile_picture || 'https://via.placeholder.com/50'} 
              alt={project.owner.username} 
            />
            <CreatorInfo>
              <CreatorName>By {project.owner.username}</CreatorName>
              <CreatorBio>{project.owner.bio || 'Project Creator'}</CreatorBio>
            </CreatorInfo>
          </ProjectCreator>
          
          <div className="mb-4">
            {project.category && (
              <CategoryBadge>{project.category.name}</CategoryBadge>
            )}
            {project.tags && project.tags.map((tag) => (
              <Badge 
                key={tag.id} 
                bg="light" 
                text="dark" 
                className="me-2"
                style={{ borderRadius: '50px', padding: '0.5rem 1rem' }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          
          <StyledTabs defaultActiveKey="about" className="mb-4">
            <Tab eventKey="about" title="About">
              <div dangerouslySetInnerHTML={{ __html: project.description }} />
            </Tab>
            
            <Tab eventKey="updates" title="Updates">
              {project.updates && project.updates.length > 0 ? (
                project.updates.map(update => (
                  <StyledCard key={update.id} className="mb-4">
                    <Card.Body>
                      <h5>{update.title}</h5>
                      <p className="text-muted">{new Date(update.created_at).toLocaleDateString()}</p>
                      <p>{update.content}</p>
                    </Card.Body>
                  </StyledCard>
                ))
              ) : (
                <p className="text-muted">No updates yet.</p>
              )}
            </Tab>
            
            <Tab eventKey="comments" title={`Comments (${comments.length})`}>
              <CommentForm onSubmit={handleCommentSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Add a comment</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder={user ? "Share your thoughts..." : "Please login to comment"}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!user}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <CommentButton type="submit" disabled={!user}>
                    {user ? "Post Comment" : "Login to Comment"}
                  </CommentButton>
                </div>
              </CommentForm>
              
              <hr className="my-4" />
              
              {comments.length > 0 ? (
                comments.map(comment => (
                  <StyledCard key={comment.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex mb-3">
                        <img 
                          src={comment.user.profile_picture || 'https://via.placeholder.com/40'} 
                          alt={comment.user.username} 
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%',
                            marginRight: '1rem'
                          }} 
                        />
                        <div>
                          <h6 className="mb-0">{comment.user.username}</h6>
                          <small className="text-muted">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                      <p className="mb-0">{comment.content}</p>
                    </Card.Body>
                  </StyledCard>
                ))
              ) : (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
              )}
            </Tab>
          </StyledTabs>
        </Col>
        
        <Col lg={4}>
          <StyledCard className="mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between mb-2">
                <h4 className="mb-0">${parseFloat(project.current_amount || 0).toLocaleString()}</h4>
                <span className="text-muted">of ${parseFloat(project.goal).toLocaleString()}</span>
              </div>
              
              <StyledProgressBar now={project.progress_percentage || 0} />
              
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <h5 className="mb-0">{project.backers_count || 0}</h5>
                  <small className="text-muted">Backers</small>
                </div>
                <div>
                  <h5 className="mb-0">{daysLeft}</h5>
                  <small className="text-muted">Days left</small>
                </div>
              </div>
              
              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Start Date</span>
                <span>{new Date(project.start_date).toLocaleDateString()}</span>
              </div>
              <div className="d-flex justify-content-between text-muted small">
                <span>End Date</span>
                <span>{new Date(project.end_date).toLocaleDateString()}</span>
              </div>
            </Card.Body>
          </StyledCard>
          
          <DonationForm 
            projectId={project.id}
            projectTitle={project.title}
            currentAmount={project.current_amount}
            goalAmount={project.goal}
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
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                >
                  <i className="fab fa-facebook-f"></i>
                </Button>
                <Button 
                  variant="outline-info" 
                  className="me-2"
                  style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0' }}
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this project: ${project.title}`, '_blank')}
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button 
                  variant="outline-danger" 
                  className="me-2"
                  style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0' }}
                  onClick={() => window.open(`https://pinterest.com/pin/create/button/?url=${window.location.href}&media=${getFeaturedImage(project)}&description=${project.title}`, '_blank')}
                >
                  <i className="fab fa-pinterest"></i>
                </Button>
                <Button 
                  variant="outline-secondary"
                  style={{ borderRadius: '50%', width: '40px', height: '40px', padding: '0' }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  <i className="fas fa-link"></i>
                </Button>
              </div>
            </Card.Body>
          </StyledCard>
          
          {/* Report Project Button */}
          {user && (
            <Button 
              variant="outline-danger" 
              className="w-100 mt-3"
              onClick={() => navigate(`/report/project/${project.id}`)}
            >
              Report Project
            </Button>
          )}
        </Col>
      </Row>
    </ProjectContainer>
  );
};

export default ProjectDetail;