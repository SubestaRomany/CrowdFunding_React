import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import DonationHistory from '../components/DonationHistory';
import ProjectCard from '../components/ProjectCard';

const ProfileContainer = styled(Container)`
  padding: 3rem 0;
`;

const ProfileCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProfileHeader = styled(Card.Header)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  color: white;
  padding: 1.5rem;
  border: none;
`;

const ProfileTitle = styled.h4`
  font-weight: 700;
  margin-bottom: 0;
`;

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 2rem;
  border: 5px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledButton = styled(Button)`
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

const StyledNav = styled(Nav)`
  margin-bottom: 2rem;
  
  .nav-link {
    color: #495057;
    font-weight: 600;
    padding: 1rem 1.5rem;
    
    &.active {
      color: #4e54c8;
      border-bottom: 3px solid #4e54c8;
    }
  }
`;

const UserProfile = () => {
  const [profile, setProfile] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    mobile_phone: '',
    birthdate: '',
    facebook_profile: '',
    country: '',
    profile_picture: null
  });
  
  const [donations, setDonations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newPassword, setNewPassword] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API
        // const profileResponse = await axios.get('/api/auth/profile/');
        // const donationsResponse = await axios.get('/api/user/donations/');
        // const projectsResponse = await axios.get('/api/user/projects/');
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setProfile({
            email: 'user@example.com',
            username: 'johndoe',
            first_name: 'John',
            last_name: 'Doe',
            mobile_phone: '01012345678',
            birthdate: '1990-01-01',
            facebook_profile: 'https://facebook.com/johndoe',
            country: 'Egypt',
            profile_picture: 'https://randomuser.me/api/portraits/men/44.jpg'
          });
          
          setDonations([
            {
              id: 1,
              project: {
                id: 101,
                title: 'Eco-Friendly Water Bottle'
              },
              amount: 50.00,
              date: '2023-06-15',
              status: 'completed'
            },
            {
              id: 2,
              project: {
                id: 102,
                title: 'Sustainable Clothing Line'
              },
              amount: 75.00,
              date: '2023-06-10',
              status: 'completed'
            },
            {
              id: 3,
              project: {
                id: 103,
                title: 'Community Garden Project'
              },
              amount: 100.00,
              date: '2023-06-05',
              status: 'completed'
            }
          ]);
          
          setProjects([
            {
              id: 201,
              title: 'Smart Home Energy Saver',
              description: 'A device that helps reduce energy consumption in homes.',
              current_amount: 5000,
              goal_amount: 10000,
              days_left: 15,
              image_url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        profile_picture: file
      }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, you would update the profile via API
      // const formData = new FormData();
      // Object.keys(profile).forEach(key => {
      //   formData.append(key, profile[key]);
      // });
      // await axios.put('/api/auth/profile/', formData);
      
      // For demo purposes, we'll just simulate a successful update
      setTimeout(() => {
        setSuccess("Profile updated successfully!");
        setLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }, 1000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
      setLoading(false);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword.new_password !== newPassword.confirm_password) {
      setError("New passwords do not match.");
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would update the password via API
      // await axios.post('/api/auth/change-password/', newPassword);
      
      // For demo purposes, we'll just simulate a successful update
      setTimeout(() => {
        setSuccess("Password changed successfully!");
        setNewPassword({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }, 1000);
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password. Please check your current password and try again.");
      setLoading(false);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (confirmed) {
      setLoading(true);
      
      try {
        
        setTimeout(() => {
         
          navigate('/');
        }, 1000);
      } catch (err) {
        console.error("Error deleting account:", err);
        setError("Failed to delete account. Please try again.");
        setLoading(false);
      }
    }
  };
  
  if (loading && !profile.email) {
    return (
      <ProfileContainer>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile...</p>
        </div>
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <Tab.Container defaultActiveKey="profile">
        <Row>
          <Col lg={3}>
            <ProfileCard className="text-center">
              <Card.Body>
                <ProfileImage>
                  <Avatar 
                    src={imagePreview || profile.profile_picture || 'https://via.placeholder.com/150'} 
                    alt={profile.username} 
                  />
                </ProfileImage>
                <h4>{profile.first_name} {profile.last_name}</h4>
                <p className="text-muted">@{profile.username}</p>
                <p>{profile.email}</p>
              </Card.Body>
            </ProfileCard>
            
            <ProfileCard>
              <Card.Body>
                <StyledNav className="flex-column">
                  <Nav.Link eventKey="profile">Profile Settings</Nav.Link>
                  <Nav.Link eventKey="password">Change Password</Nav.Link>
                  <Nav.Link eventKey="donations">My Donations</Nav.Link>
                  <Nav.Link eventKey="projects">My Projects</Nav.Link>
                </StyledNav>
                
                <div className="d-grid gap-2 mt-4">
                  <StyledButton 
                    variant="danger" 
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    Delete Account
                  </StyledButton>
                </div>
              </Card.Body>
            </ProfileCard>
          </Col>
          
          <Col lg={9}>
            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                {success}
              </Alert>
            )}
            
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <ProfileCard>
                  <ProfileHeader>
                    <ProfileTitle>Profile Settings</ProfileTitle>
                  </ProfileHeader>
                  <Card.Body>
                    <Form onSubmit={handleProfileSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="first_name"
                              value={profile.first_name}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="last_name"
                              value={profile.last_name}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="username"
                              value={profile.username}
                              onChange={handleProfileChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                              type="email" 
                              value={profile.email}
                              disabled
                            />
                            <Form.Text className="text-muted">
                              Email cannot be changed.
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Mobile Phone</Form.Label>
                            <Form.Control 
                              type="tel" 
                              name="mobile_phone"
                              value={profile.mobile_phone}
                              onChange={handleProfileChange}
                              placeholder="01XXXXXXXXX"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Birthdate</Form.Label>
                            <Form.Control 
                              type="date" 
                              name="birthdate"
                              value={profile.birthdate}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="country"
                              value={profile.country}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Facebook Profile</Form.Label>
                            <Form.Control 
                              type="url" 
                              name="facebook_profile"
                              value={profile.facebook_profile}
                              onChange={handleProfileChange}
                              placeholder="https://facebook.com/username"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-4">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control 
                          type="file" 
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                        />
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <StyledButton 
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </StyledButton>
                      </div>
                    </Form>
                  </Card.Body>
                </ProfileCard>
              </Tab.Pane>
              
              <Tab.Pane eventKey="password">
                <ProfileCard>
                  <ProfileHeader>
                    <ProfileTitle>Change Password</ProfileTitle>
                  </ProfileHeader>
                  <Card.Body>
                    <Form onSubmit={handlePasswordSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="current_password"
                          value={newPassword.current_password}
                          onChange={handlePasswordChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="new_password"
                          value={newPassword.new_password}
                          onChange={handlePasswordChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-4">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="confirm_password"
                          value={newPassword.confirm_password}
                          onChange={handlePasswordChange}
                          required
                        />
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <StyledButton 
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Changing...' : 'Change Password'}
                        </StyledButton>
                      </div>
                    </Form>
                  </Card.Body>
                </ProfileCard>
              </Tab.Pane>
              
              <Tab.Pane eventKey="donations">
                <DonationHistory donations={donations} />
              </Tab.Pane>
              
              <Tab.Pane eventKey="projects">
                <ProfileCard>
                  <ProfileHeader className="d-flex justify-content-between align-items-center">
                    <ProfileTitle>My Projects</ProfileTitle>
                    <StyledButton 
                      size="sm"
                      onClick={() => navigate('/projects/create')}
                    >
                      Create New Project
                    </StyledButton>
                  </ProfileHeader>
                  <Card.Body>
                    {projects.length > 0 ? (
                      <Row>
                        {projects.map(project => (
                          <Col md={6} key={project.id} className="mb-4">
                            <ProjectCard project={project} />
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center py-5">
                        <p className="mb-3">You haven't created any projects yet.</p>
                        <StyledButton onClick={() => navigate('/projects/create')}>
                          Create Your First Project
                        </StyledButton>
                      </div>
                    )}
                  </Card.Body>
                </ProfileCard>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </ProfileContainer>
  );
};

export default UserProfile;