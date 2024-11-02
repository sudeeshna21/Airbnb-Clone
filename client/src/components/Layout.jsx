import React from 'react'
import Header from './Header';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
      <div className='flex flex-col min-h-screen'>
          <Header />
          <div className='p-4'>
              <Outlet />
          </div>
      </div>
  );
}


export default Layout;