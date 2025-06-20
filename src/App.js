import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import MyProjects from './pages/MyProjects';
import Donations from './pages/Donations';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import LoadingScreen from './components/LoadingScreen';
import api from './services/api';

// Protected route component that checks authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!currentUser) {
    // Redirect to login with return URL
    return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
  }
  
  return children;
};

// Route that redirects authenticated users away from auth pages
const AuthRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (currentUser) {
    // Get the redirect URL from query params or default to home
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || '/';
    return <Navigate to={redirectUrl} replace />;
  }
  
  return children;
};

function AppContent() {
  const { setCurrentUser } = useAuth();
  const [initializing, setInitializing] = useState(true);
  
  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setInitializing(false);
          return;
        }
        const response = await api.get('/auth/profile/');
        if (response.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        // Clear any stored tokens if authentication fails
        //localStorage.removeItem('token');
        console.error('Authentication check failed:', error);
      } finally {
        setInitializing(false);
      }
    };
    
    checkAuthStatus();
  }, [setCurrentUser]);
  
  if (initializing) {
    return <LoadingScreen />;
  }
  
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            
            {/* Protected routes */}
            <Route path="/create-project" element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            } />
            <Route path="/edit-project/:slug" element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/my-projects" element={
              <ProtectedRoute>
                <MyProjects />
              </ProtectedRoute>
            } />
            <Route path="/donations" element={
              <ProtectedRoute>
                <Donations />
              </ProtectedRoute>
            } />
            
            {/* Auth routes */}
            <Route path="/login" element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } />
            <Route path="/register" element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            } />
            <Route path="/forgot-password" element={
              <AuthRoute>
                <ForgotPassword />
              </AuthRoute>
            } />
            <Route path="/reset-password/:uid/:token" element={
              <AuthRoute>
                <ResetPassword />
              </AuthRoute>
            } />
            <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;