import { supabase } from '@/supabase';
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Import Outlet for nested routes
import { Button } from './ui/button';
import { LogOut, SunIcon } from 'lucide-react';
import { BottomNav } from './bottomnav/bottomNav';
const bottomBarRoutes = ['/','/try-on','/products','/user-profile','/cart']
const Layout = () => {
  const location = useLocation()
  return (
    <div className='bg-white min-h-screen min-w-screen lg:max-w-2xl lg:mx-auto'>
      {/* Navbar (or common header) */}
      {/* <nav className='px-4 py-2 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Matrix</h1>
      <Button
      onClick={logOut}
      className="flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600 transition duration-300 py-2 px-4 rounded-full"
    >
      <LogOut className="text-xl" /> 
    </Button>
      </nav>
      <hr/> */}
      {/* <div className="h-8" ></div> */}
      
      {/* The Outlet will render the nested route content */}
      <div className="content">
        <Outlet /> {/* This is where child components (Login, Signup) will be rendered */}
      </div>
      {
        bottomBarRoutes.includes(location.pathname) ? <BottomNav/> : null
      }
      
    </div>
  );
};

export default Layout;
