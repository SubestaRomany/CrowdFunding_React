import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

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

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
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
            <NavLink as={Link} to="/create-project">Start a Project</NavLink>
          </Nav>
          <Nav>
            {currentUser ? (
              <UserDropdown 
                title={currentUser.name || currentUser.username} 
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-projects">My Projects</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </UserDropdown>
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