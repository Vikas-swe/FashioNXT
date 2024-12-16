// import { useState } from 'react';

import { useState } from "react";

const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => setLoggedIn(true);
  const logout = () => setLoggedIn(false);

  return {
    loggedIn,
    login,
    logout
  };
};

export default useAuth;
