import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, NavDropdown, Badge, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const StyledNavbar = styled(Navbar)`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  padding: 1rem 0;
`;

const NavbarBrand = styled(Navbar.Brand)`
  font-weight: 700;
  font-size: 1.5rem;
  color: white !important;
`;

const NavLink = styled(Nav.Link)`
  color: rgba(255, 255, 255, 0.85) !important;
  margin: 0 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: white !important;
    transform: translateY(-2px);
  }
`;

const StyledButton = styled(Button)`
  background-color: white;
  color: #4e54c8;
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  margin-left: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const UserDropdown = styled(NavDropdown)`
  .dropdown-toggle {
    color: rgba(255, 255, 255, 0.85) !important;
    font-weight: 500;
    
    &:hover {
      color: white !important;
    }
  }
  
  .dropdown-menu {
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: none;
    padding: 0.5rem;
  }
  
  .dropdown-item {
    border-radius: 10px;
    padding: 0.5rem 1rem;
    
    &:hover {
      background-color: #f8f9fa;
    }
  }
`;

const ProfilePic = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
  border: 2px solid white;
`;

const NotificationBadge = styled(Badge)`
  position: relative;
  top: -8px;
  right: 5px;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  background-color: #ff4757;
  color: white;
  font-size: 0.7rem;
`;

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const response = await api.get('/auth/profile/');
          setUserProfile(response.data);
          
          // Fetch notifications if needed
          const notificationsResponse = await api.get('/notifications/');
          setNotifications(notificationsResponse.data.filter(n => !n.is_read));
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);
  
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const getDisplayName = () => {
    if (loading) return <Spinner animation="border" size="sm" />;
    if (userProfile) {
      return userProfile.first_name 
        ? `${userProfile.first_name} ${userProfile.last_name || ''}`
        : userProfile.username;
    }
    return currentUser?.username || 'User';
  };
  
  const getProfileImage = () => {
    if (userProfile && userProfile.profile_image) {
      return userProfile.profile_image;
    }
    return 'https://via.placeholder.com/30?text=U';
  };
  
  return (
    <StyledNavbar expand="lg" variant="dark">
      <Container>
        <NavbarBrand as={Link} to="/">CrowdFunder</NavbarBrand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink as={Link} to="/">Home</NavLink>
            <NavLink as={Link} to="/projects">Discover</NavLink>
            {currentUser && (
              <NavLink as={Link} to="/create-project">Start a Project</NavLink>
            )}
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                <NavLink as={Link} to="/notifications">
                  <i className="fas fa-bell"></i>
                  {notifications.length > 0 && (
                    <NotificationBadge>{notifications.length}</NotificationBadge>
                  )}
                </NavLink>
                <UserDropdown 
                  title={
                    <span>
                      <ProfilePic src={getProfileImage()} alt="Profile" />
                      {getDisplayName()}
                    </span>
                  } 
                  id="user-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-projects">My Projects</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/donations">My Donations</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </UserDropdown>
              </>
            ) : (
              <>
                <NavLink as={Link} to="/login">Login</NavLink>
                <StyledButton as={Link} to="/register">Sign Up</StyledButton>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;