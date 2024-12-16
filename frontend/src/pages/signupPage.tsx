import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    // Logic for signup (e.g., API call)
    navigate("/login"); // Redirect to login page after signup
  };

  return (
    <div>
      <h2>Signup Page</h2>
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
