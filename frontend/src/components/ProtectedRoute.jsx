import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simple cookie check first
    const hasToken = document.cookie.includes('token=');
    
    if (!hasToken) {
      setIsAuthenticated(false);
      setIsChecking(false);
      return;
    }

    // If cookie exists, verify it's valid with a lightweight endpoint
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => {
      setIsAuthenticated(res.ok);
    })
    .catch(() => {
      setIsAuthenticated(false);
    })
    .finally(() => {
      setIsChecking(false);
    });
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;