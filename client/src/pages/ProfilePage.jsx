import React, { useState } from 'react';
import { useContext } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from './AccountNav';

const ProfilePage = () => {
    const [redirect, setRedirect] = useState(null);
    let { subpage } = useParams();
    const { user, ready, setUser } = useContext(UserContext);

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout(){
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }
    
    if (redirect) {
        return <Navigate to={redirect} />
    }

  return (
    <div>
        <AccountNav />
        {subpage === 'profile' && (
            <div className='text-center max-w-lg mx-auto'>
                Logged in as {user?.name} {user?.email}
                <br />
                <button className='primary max-w-sm mt-2' onClick={logout}>Logout</button>
            </div>
        )}
        {subpage === 'places' && (
            <PlacesPage />
        )}
        {subpage === 'bookings' && (
            <div className='text-center max-w-lg mx-auto'>
                My Bookings
            </div>
        )}
    </div>
  )
}

export default ProfilePage;