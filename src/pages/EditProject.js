import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

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

const EditProject = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal: '',
    end_date: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project data
        const projectResponse = await api.get(`/projects/${slug}/`);
        const project = projectResponse.data;
        
        // Format date for form input (YYYY-MM-DD)
        const endDate = project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '';
        
        setFormData({
          title: project.title || '',
          description: project.description || '',
          category: project.category ? project.category.id : '',
          goal: project.goal || '',
          end_date: endDate
        });
        
        // Fetch categories
        const categoriesResponse = await api.get('/categories/');
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setErrors({ general: 'Failed to load project data. Please try again.' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    
    try {
      await api.put(`/projects/${slug}/`, formData);
      setSuccess(true);
      
      // Redirect after successful update
      setTimeout(() => {
        navigate(`/projects/${slug}`);
      }, 2000);
    } catch (error) {
      console.error('Error updating project:', error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to update project. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  
  return (
    <>
      <PageHeader>
        <Container>
          <PageTitle>Edit Project</PageTitle>
          <p>Update your project details</p>
        </Container>
      </PageHeader>
      
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <FormCard>
              <Card.Body className="p-4">
                {success && (
                  <Alert variant="success">
                    Project updated successfully! Redirecting...
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
                      isInvalid={!!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
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
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
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
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Funding Goal ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      min="1"
                      step="0.01"
                      isInvalid={!!errors.goal}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.goal}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
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
                  
                  <div className="d-flex justify-content-end mt-4">
                    <Button 
                      variant="outline-secondary" 
                      className="me-2"
                      onClick={() => navigate(`/projects/${slug}`)}
                    >
                      Cancel
                    </Button>
                    <StyledButton type="submit" disabled={submitting || success}>
                      {submitting ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Updating...
                        </>
                      ) : 'Update Project'}
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

export default EditProject;