import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';
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

const ImagePreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
`;

const CreateProject = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal: '',
    end_date: '',
    tags: []
  });
  
  const [projectImage, setProjectImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          api.get('/categories/'),
          api.get('/tags/')
        ]);
        
        setCategories(categoriesResponse.data);
        setTags(tagsResponse.data);
      } catch (error) {
        console.error('Error fetching categories and tags:', error);
      } finally {
        setFetchingData(false);
      }
    };
    
    fetchCategoriesAndTags();
  }, []);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: '/create-project' } } });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTagChange = (e) => {
    const tagId = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedTags([...selectedTags, tagId]);
    } else {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    }
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
    
    if (!formData.goal) {
      newErrors.goal = 'Funding goal is required';
    } else if (isNaN(formData.goal) || parseFloat(formData.goal) <= 0) {
      newErrors.goal = 'Funding goal must be a positive number';
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
    
    if (!projectImage) {
      newErrors.image = 'Project image is required';
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
      // First create the project
      const projectData = new FormData();
      projectData.append('title', formData.title);
      projectData.append('description', formData.description);
      projectData.append('category', formData.category);
      projectData.append('goal', formData.goal);
      projectData.append('end_date', formData.end_date);
      
      // Add tags if selected
      selectedTags.forEach(tagId => {
        projectData.append('tags', tagId);
      });
      
      const response = await api.post('/projects/', projectData);
      
      // Then upload the image
      if (projectImage && response.data.slug) {
        const imageData = new FormData();
        imageData.append('image', projectImage);
        imageData.append('is_featured', true);
        
        await api.post(`/projects/${response.data.slug}/upload_image/`, imageData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/projects/${response.data.slug}`);
      }, 2000);
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

  if (fetchingData) {
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
                    Project created successfully! Redirecting to your project page...
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
                          name="goal"
                          value={formData.goal}
                          onChange={handleChange}
                          placeholder="Enter amount"
                          isInvalid={!!errors.goal}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.goal}
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
                    <Form.Label>Project Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      isInvalid={!!errors.image}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.image}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Upload a high-quality image that represents your project
                    </Form.Text>
                    {imagePreview && (
                      <ImagePreview src={imagePreview} alt="Project preview" />
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tags (Optional)</Form.Label>
                    <div className="d-flex flex-wrap gap-3">
                      {tags.map(tag => (
                        <Form.Check
                          key={tag.id}
                          type="checkbox"
                          id={`tag-${tag.id}`}
                          label={tag.name}
                          value={tag.id}
                          onChange={handleTagChange}
                          checked={selectedTags.includes(tag.id)}
                        />
                      ))}
                    </div>
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
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Creating...
                        </>
                      ) : 'Create Project'}
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