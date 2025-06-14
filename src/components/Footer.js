import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: #f8f9fa;
  padding: 3rem 0;
  margin-top: 3rem;
`;

const FooterTitle = styled.h5`
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const FooterLink = styled(Link)`
  color: #6c757d;
  text-decoration: none;
  display: block;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4e54c8;
  }
`;

const SocialIcon = styled.a`
  color: #6c757d;
  font-size: 1.5rem;
  margin-right: 1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4e54c8;
  }
`;

const Copyright = styled.p`
  color: #6c757d;
  margin-top: 2rem;
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <FooterTitle>CrowdFunder</FooterTitle>
            <p className="text-muted">
              A platform that connects creative projects with people who want to support them.
              Discover innovative ideas and help bring them to life.
            </p>
            <div className="mt-3">
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </SocialIcon>
            </div>
          </Col>
          
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <FooterTitle>Explore</FooterTitle>
            <FooterLink to="/projects">All Projects</FooterLink>
            <FooterLink to="/projects?category=Technology">Technology</FooterLink>
            <FooterLink to="/projects?category=Art">Art</FooterLink>
            <FooterLink to="/projects?category=Food">Food</FooterLink>
            <FooterLink to="/projects?category=Games">Games</FooterLink>
          </Col>
          
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <FooterTitle>About</FooterTitle>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/how-it-works">How It Works</FooterLink>
            <FooterLink to="/trust-safety">Trust & Safety</FooterLink>
            <FooterLink to="/support">Support</FooterLink>
            <FooterLink to="/terms">Terms of Use</FooterLink>
          </Col>
          
          <Col md={4}>
            <FooterTitle>Newsletter</FooterTitle>
            <p className="text-muted">
              Subscribe to our newsletter to get updates on new projects and features.
            </p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email" 
                aria-label="Your email" 
              />
              <button 
                className="btn btn-primary" 
                type="button"
                style={{ 
                  background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
                  border: 'none'
                }}
              >
                Subscribe
              </button>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Copyright>
          © {new Date().getFullYear()} CrowdFunder. All rights reserved.
        </Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;