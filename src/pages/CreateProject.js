import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PageHeader = styled.div`
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-weight: 700;
  margin-bottom: 1rem;
`;

const FormCard = styled(Card)`
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 3rem;
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

const CreateProject = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    target_amount: '',
    end_date: '',
    image_url: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const categories = ['Technology', 'Art', 'Food', 'Games', 'Music', 'Publishing'];

  
  if (!currentUser) {
    navigate('/login', { state: { from: { pathname: '/create-project' } } });
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.target_amount) {
      newErrors.target_amount = 'Target amount is required';
    } else if (isNaN(formData.target_amount) || parseFloat(formData.target_amount) <= 0) {
      newErrors.target_amount = 'Target amount must be a positive number';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else {
      const today = new Date();
      const endDate = new Date(formData.end_date);
      if (endDate <= today) {
        newErrors.end_date = 'End date must be in the future';
      }
    }
    
    if (!formData.image_url.trim()) {
      newErrors.image_url = 'Image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          navigate('/projects');
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to create project. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader>
        <Container>
          <PageTitle>Create a Project</PageTitle>
          <p>Share your idea with the world and get funded</p>
        </Container>
      </PageHeader>

      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <FormCard>
              <Card.Body className="p-4">
                {success && (
                  <Alert variant="success">
                    Project created successfully! Redirecting...
                  </Alert>
                )}
                
                {errors.general && (
                  <Alert variant="danger">{errors.general}</Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter a compelling title"
                      isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      isInvalid={!!errors.category}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your project in detail"
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Funding Goal ($)</Form.Label>
                        <Form.Control
                          type="number"
                          name="target_amount"
                          value={formData.target_amount}
                          onChange={handleChange}
                          placeholder="Enter amount"
                          isInvalid={!!errors.target_amount}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.target_amount}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          isInvalid={!!errors.end_date}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.end_date}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Project Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      isInvalid={!!errors.image_url}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.image_url}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Provide a URL to an image that represents your project
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex justify-content-end mt-4">
                    <Button 
                      variant="outline-secondary" 
                      className="me-2"
                      onClick={() => navigate('/projects')}
                    >
                      Cancel
                    </Button>
                    <StyledButton type="submit" disabled={loading || success}>
                      {loading ? 'Creating...' : 'Create Project'}
                    </StyledButton>
                  </div>
                </Form>
              </Card.Body>
            </FormCard>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateProject;