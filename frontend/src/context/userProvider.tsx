import React, { useState } from 'react';
import UserContext, { UserMeta } from './userContext';
import { fetchUserData } from '@/apiService';

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    favourites: [],
  });

  const setData = (data) => {
    setUserData({...userData,...data});
  };

  return (
    <UserContext.Provider value={{ userData, setData }}>
      {children}
    </UserContext.Provider>
  );
};

const UserMetaProvider = ({ children }) => {
  const [userMeta, setUserMeta] = useState(null);

  async function refetch(userId) {
    const userMetaData = await fetchUserData(userId)
    if(userMetaData){
      console.log(userMetaData)
      setUserMeta(userMetaData)
    }
  }


  return (
    <UserMeta.Provider value={{ userMeta, setUserMeta, refetch }}>
      {children}
    </UserMeta.Provider>
  );
};

export {UserMetaProvider};

export default UserProvider;