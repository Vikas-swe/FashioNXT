import React from 'react';
import { Navigate } from 'react-router-dom'; // For redirection
import useAuth from './auth';

const ProtectedRoute = ({ children }) => {
  const {loggedIn} = useAuth();
  // If not logged in, redirect to login
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  // If logged in, render the children (protected page)
  return children;
};

export default ProtectedRoute;
