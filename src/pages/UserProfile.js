import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Image } from 'react-bootstrap';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ProfileContainer = styled(Container)`
  padding: 4rem 0;
`;

const ProfileCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ProfileImage = styled(Image)`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  border: none;
  border-radius: 50px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.1);
  }
`;

const DangerButton = styled(Button)`
  border-radius: 50px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.1);
  }
`;

const UserProfile = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
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
  
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setProfileData(response.data);
        if (response.data.profile_picture) {
          setPreviewUrl(response.data.profile_picture);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({
          text: 'Failed to load profile data. Please try again.',
          type: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Add all profile fields to FormData
      Object.keys(profileData).forEach(key => {
        if (key !== 'profile_picture' || (key === 'profile_picture' && profileData[key] !== null)) {
          formData.append(key, profileData[key]);
        }
      });
      
      // Add new profile picture if selected
      if (newProfilePicture) {
        formData.append('profile_picture', newProfilePicture);
      }

      // Send update request to API
      const response = await api.put('/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local user data
      updateUser(response.data);
      
      setMessage({
        text: 'Profile updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      if (error.response && error.response.data) {
        // Extract error messages from API response
        const errors = error.response.data;
        errorMessage = Object.keys(errors)
          .map(key => `${key}: ${errors[key]}`)
          .join(', ');
      }
      
      setMessage({
        text: errorMessage,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      await api.delete('/profile/delete/', {
        data: { password: deletePassword },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Log out the user after successful deletion
      logout();
      
      // Show success message (though user will be redirected)
      setMessage({
        text: 'Account deleted successfully.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      
      let errorMessage = 'Failed to delete account. Please try again.';
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      setMessage({
        text: errorMessage,
        type: 'danger'
      });
    } finally {
      setLoading(false);
      setDeleteModalShow(false);
      setDeletePassword('');
    }
  };

  if (!user) {
    return (
      <ProfileContainer>
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <ProfileCard>
            <CardHeader>
              <ProfileImage 
                src={previewUrl || 'https://via.placeholder.com/150'} 
                roundedCircle 
                alt="Profile" 
              />
              <CardTitle>{profileData.first_name} {profileData.last_name}</CardTitle>
              <p>{profileData.email}</p>
            </CardHeader>
            
            <Card.Body className="p-4">
              {message.text && (
                <Alert variant={message.type}>
                  {message.text}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={profileData.first_name || ''}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={profileData.last_name || ''}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={profileData.username || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profileData.email || ''}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile_phone"
                    value={profileData.mobile_phone || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Birthdate</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthdate"
                    value={profileData.birthdate || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Facebook Profile</Form.Label>
                  <Form.Control
                    type="url"
                    name="facebook_profile"
                    value={profileData.facebook_profile || ''}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourusername"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={profileData.country || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <StyledButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </StyledButton>
                  
                  <DangerButton 
                    variant="danger" 
                    onClick={() => setDeleteModalShow(true)}
                  >
                    Delete Account
                  </DangerButton>
                </div>
              </Form>
            </Card.Body>
          </ProfileCard>
        </Col>
      </Row>
      
      {/* Delete Account Modal */}
      {deleteModalShow && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Account</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setDeleteModalShow(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <Form.Group>
                  <Form.Label>Enter your password to confirm</Form.Label>
                  <Form.Control
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                  />
                </Form.Group>
              </div>
              <div className="modal-footer">
                <Button 
                  variant="secondary" 
                  onClick={() => setDeleteModalShow(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteAccount}
                  disabled={!deletePassword || loading}
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal backdrop */}
      {deleteModalShow && <div className="modal-backdrop show"></div>}
    </ProfileContainer>
  );
};

export default UserProfile;